// Stripe Payment Links for the pricing page.
// Set each value to a full https://buy.stripe.com/... URL when the account exists.
// Leave the empty string, or any placeholder, until then.
// pricing.js treats empty and placeholder values as not ready.
var STRIPE_MONTHLY_URL = "https://buy.stripe.com/eVq8wIfbBaaVaqGclF9fW00";

// Card checkout is open. Invoices are net-30, paid by bank transfer (ACH).
// The mailing address and Cullman County venue are set. The house number
// lives only on the next line.
var BUSINESS_ADDRESS = "4166 County Road 1564, Baileyton, AL 35019";

function fillBusinessAddress() {
  if (typeof document === "undefined") return;
  var nodes = document.querySelectorAll("[data-field=\"business-address\"]");
  for (var i = 0; i < nodes.length; i++) nodes[i].textContent = BUSINESS_ADDRESS;
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillBusinessAddress);
  } else {
    fillBusinessAddress();
  }
}
// Checkout opened Nov 24, 2026 on Nicolaas's word.
// Nicolaas will turn on Stripe's own terms checkbox in the Dashboard later
// (consent_collection.terms_of_service = required) and point Stripe's terms URL
// at https://dailyshiftbrief.net/customer-agreement.html.
// This static site cannot record that Stripe consent.
var CHECKOUT_OPEN = true;

// Shown on the customer agreement and sent with an invoice request or card checkout.
// The agreement page also has this text in the HTML so it shows with JavaScript off.
var AGREEMENT_VERSION = "Version 0.1 draft, Nov 13, 2026";
