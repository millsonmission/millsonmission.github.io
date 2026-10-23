// Single source of truth for every URL in the Dynamic Prayer Card.
// Change links here, never inside individual pages.
window.PRAYER_CARD_CONFIG = {
  siteUrl:          "https://millsonmission.com/",
  cardUrl:          "https://millsonmission.com/card/",
  prayUrl:          "https://millsonmission.com/pray/",
  newsletterUrl:    "https://millsonmission.com/windmills/",
  privacyUrl:       "https://millsonmission.com/privacy/",
  sendingAgencyUrl: "https://agwm.org",
  immUrl:           "https://imm.edu/",
  assets: {
    videoHevc: "/assets/portrait-loop.mp4",
    videoWebm: "/assets/portrait-loop.webm",
    greeting:  "/assets/greeting.mp3"
  },
  // Paste your Apps Script Web App URL here (ends in /exec)
  appsScriptEndpoint: "https://script.google.com/macros/s/AKfycbw5TNJMypcwhFx509iWrorTQ1yPq9jHUI-uIfJlSzghQp630kZ7lsD1Bfp0oGnsdJ0V/exec",
  // Paste your Cloudflare Turnstile SITE key here (the public one, never the secret)
  turnstileSiteKey: "0x4AAAAAAFg7atEJlEAIrw9O"
};
