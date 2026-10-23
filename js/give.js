// Give reminder: every link to AG Giving opens this short note first.
// The account number lives here only. Change it here and every page updates.
(function () {
  var ACCOUNT = '296210';
  var GIVING_URL = 'https://giving.ag.org/donate';
  window.MOM_ACCOUNT = ACCOUNT;

  var supportsDialog = typeof HTMLDialogElement === 'function' && 'showModal' in document.createElement('dialog');
  if (!supportsDialog) return; // Older browsers just follow the link normally.

  var dlg = document.createElement('dialog');
  dlg.className = 'give-dialog';
  dlg.setAttribute('aria-labelledby', 'giveDlgTitle');
  dlg.innerHTML =
    '<div class="give-dialog-body">' +
      '<p class="give-dialog-title" id="giveDlgTitle">A word before you ride on</p>' +
      '<p>Thank you for giving. AG Giving’s form has two quirks worth knowing:</p>' +
      '<ol class="give-dialog-steps">' +
        '<li><strong>To give monthly, choose “Monthly.”</strong> The form starts on a one-time gift, and the Monthly option sits further down among the other choices. AG calls monthly support a <em>Faith Promise</em>.</li>' +
        '<li><strong>If the form shows an error, check Monthly again before you submit.</strong> Fixing an error can quietly switch it back to one-time.</li>' +
      '</ol>' +
      '<div class="give-dialog-account">' +
        '<span>Give to <strong>Sean Mills</strong>, account <strong class="give-acct"></strong></span>' +
        '<button type="button" class="btn btn-secondary give-copy">Copy number</button>' +
      '</div>' +
      '<p class="give-dialog-status" role="status"></p>' +
      '<div class="give-dialog-actions">' +
        '<a class="btn btn-primary give-continue" target="_blank" rel="noopener">Continue to AG Giving</a>' +
        '<button type="button" class="btn btn-secondary give-cancel">Not now</button>' +
      '</div>' +
      '<p class="give-dialog-fine">AG Giving is the Assemblies of God’s official, secure giving site. It opens in a new tab.</p>' +
      '<p class="give-dialog-fine">Questions about a gift? Contact AG Contributor Services at <a href="mailto:contributions@ag.org">contributions@ag.org</a> or <a href="tel:+14178623420">1-417-862-3420</a>, and ask for Contributor Services for the Europe Region.</p>' +
    '</div>';

  function attach() {
    document.body.appendChild(dlg);
    dlg.querySelector('.give-acct').textContent = ACCOUNT;
    var cont = dlg.querySelector('.give-continue');
    var status = dlg.querySelector('.give-dialog-status');

    dlg.querySelector('.give-cancel').addEventListener('click', function () { dlg.close(); });
    cont.addEventListener('click', function () { setTimeout(function () { dlg.close(); }, 50); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // tap outside closes

    dlg.querySelector('.give-copy').addEventListener('click', async function () {
      var ok = false;
      try { await navigator.clipboard.writeText(ACCOUNT); ok = true; }
      catch (e) {
        try {
          var t = document.createElement('textarea');
          t.value = ACCOUNT; t.setAttribute('readonly', ''); t.style.position = 'absolute'; t.style.left = '-9999px';
          document.body.appendChild(t); t.select(); ok = document.execCommand('copy'); document.body.removeChild(t);
        } catch (e2) { ok = false; }
      }
      status.textContent = ok ? 'Copied. Paste it on AG Giving if it asks which missionary.' : 'Please note account ' + ACCOUNT + '.';
    });

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="https://giving.ag.org"]');
      if (!a || dlg.contains(a)) return;
      e.preventDefault();
      cont.href = a.getAttribute('href') || GIVING_URL;
      status.textContent = '';
      dlg.showModal();
      cont.focus();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
