// Shared helpers for the prayer and sign-up forms. Settings come from /js/config.js.
(function () {
  var CFG = window.PRAYER_CARD_CONFIG || {};
  var ENDPOINT = CFG.appsScriptEndpoint || '';
  var SITE_KEY = CFG.turnstileSiteKey || '';
  var ready = !!ENDPOINT && ENDPOINT.indexOf('DEPLOYMENT-ID') === -1;
  var tsOn = !!SITE_KEY && SITE_KEY.indexOf('TBD') === -1;
  var apiRequested = false;
  var pending = [];

  // One anonymous id per browser, used only to stop double-taps from logging twice.
  function clientId() {
    try {
      var id = localStorage.getItem('mom_cid');
      if (!id) {
        id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
        localStorage.setItem('mom_cid', id);
      }
      return id;
    } catch (e) { return ''; }
  }

  function loadTurnstile() {
    if (apiRequested) return;
    apiRequested = true;
    window.momTurnstileReady = function () { pending.splice(0).forEach(function (fn) { fn(); }); };
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=momTurnstileReady';
    s.async = true;
    document.head.appendChild(s);
  }

  // Cloudflare Turnstile: invisible unless Cloudflare needs a quick check.
  function botCheck(el) {
    var st = { token: null, id: null };
    if (!tsOn || !el) return { getToken: function () { return Promise.resolve(''); }, reset: function () {} };
    function render() {
      st.id = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        callback: function (t) { st.token = t; },
        'expired-callback': function () { st.token = null; },
        'error-callback': function () { st.token = null; }
      });
    }
    if (window.turnstile) render(); else { pending.push(render); loadTurnstile(); }
    return {
      getToken: function (ms) {
        return new Promise(function (resolve) {
          var start = Date.now();
          (function check() {
            if (st.token) return resolve(st.token);
            if (Date.now() - start > ms) return resolve('');
            setTimeout(check, 200);
          })();
        });
      },
      reset: function () {
        if (window.turnstile && st.id !== null) window.turnstile.reset(st.id);
        st.token = null;
      }
    };
  }

  async function post(payload) {
    var body = Object.assign({ site: 'millsonmission.com', clientId: clientId() }, payload);
    var res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });
    var data = await res.json();
    if (!data.ok) throw new Error(data.error || 'failed');
    return data;
  }

  async function getRequests() {
    var res = await fetch(ENDPOINT + '?action=requests');
    var data = await res.json();
    if (!data.ok) throw new Error('load_failed');
    return data.items || [];
  }

  window.MOM = { ready: ready, turnstileOn: tsOn, botCheck: botCheck, post: post, getRequests: getRequests };
})();
