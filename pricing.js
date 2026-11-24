// Reads STRIPE_MONTHLY_URL and STRIPE_ANNUAL_URL from config.js.
// Empty or placeholder values leave the HTML links alone (contact.html).

function isLiveStripeUrl(value) {
  if (typeof value !== "string") return false;
  var url = value.trim();
  if (!url) return false;
  if (/placeholder|paste|todo|changeme|example/i.test(url)) return false;
  var parsed;
  try {
    parsed = new URL(url);
  } catch (err) {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  if (parsed.hostname !== "buy.stripe.com") return false;
  if (!parsed.pathname || parsed.pathname === "/") return false;
  return true;
}

function wireStripeButton(id, url, liveLabel) {
  if (typeof document === "undefined") return;
  var link = document.getElementById(id);
  if (!link) return;
  if (!isLiveStripeUrl(url)) return;
  var live = url.trim();
  link.href = live;
  link.setAttribute("data-stripe-url", live);
  link.textContent = liveLabel;
  link.setAttribute("aria-label", liveLabel);
  link.classList.remove("btn-pending");
  link.classList.add("btn-solid");
}

function timestampWithOffset(date) {
  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }
  var off = -date.getTimezoneOffset();
  var sign = off >= 0 ? "+" : "-";
  var abs = Math.abs(off);
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate())
    + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds())
    + sign + pad(Math.floor(abs / 60)) + ":" + pad(abs % 60);
}

function slugPart(value) {
  return String(value || "").replace(/[^A-Za-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function clientReference(version, date, name, company, title, workEmail, secondEmail) {
  var when = timestampWithOffset(date).replace(/:/g, "").replace(/\+/g, "p");
  var out = slugPart(version) + "_" + when;
  [company, name, title, workEmail, secondEmail].forEach(function (part) {
    var bit = slugPart(part);
    if (bit && (out + "_" + bit).length <= 200) out += "_" + bit;
  });
  return out.slice(0, 200);
}

function withClientReference(url, ref) {
  var parsed = new URL(url);
  parsed.searchParams.set("client_reference_id", ref);
  return parsed.toString();
}

function invoiceMailto(version, when, name, company, title, workEmail, secondEmail) {
  var subject = "Daily Shift Brief invoice request " + version;
  var body = [
    "Agreement version: " + version,
    "User name: " + (name || ""),
    "Company: " + (company || ""),
    "Title: " + (title || ""),
    "Work email: " + (workEmail || ""),
    "Second company contact email: " + (secondEmail || ""),
    "Accepted Customer Agreement and Terms: yes",
    "Accepted Release, Waiver and Indemnity: yes",
    "Accepted at: " + when,
    "",
    "A signed order form will follow. Please send the agreement PDF to both email addresses by hand.",
    "Site count:",
    ""
  ].join("\n");
  return "mailto:hello@dailyshiftbrief.net?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

var monthlyUrl = typeof STRIPE_MONTHLY_URL === "string" ? STRIPE_MONTHLY_URL : "";
var annualUrl = typeof STRIPE_ANNUAL_URL === "string" ? STRIPE_ANNUAL_URL : "";
var checkoutOpen = typeof CHECKOUT_OPEN === "boolean" ? CHECKOUT_OPEN : false;

if (checkoutOpen) {
  wireStripeButton("subscribe-monthly", monthlyUrl, "Subscribe - $90/month");
  wireStripeButton("subscribe-annual", annualUrl, "Subscribe annually");
}

function bindAgreement() {
  if (typeof document === "undefined") return;
  var termsBox = document.getElementById("agree-terms");
  var releaseBox = document.getElementById("agree-release");
  if (!termsBox || !releaseBox) return;
  var ids = ["subscribe-monthly", "subscribe-annual", "request-invoice"];
  var version = (typeof AGREEMENT_VERSION === "string" && AGREEMENT_VERSION.trim())
    ? AGREEMENT_VERSION.trim()
    : "Version 0.1 draft, Nov 13, 2026";

  function fieldValue(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function acceptor() {
    return {
      name: fieldValue("accept-name"),
      company: fieldValue("accept-company"),
      title: fieldValue("accept-title"),
      workEmail: fieldValue("accept-email"),
      secondEmail: fieldValue("accept-second-email")
    };
  }

  function fieldsReady() {
    var who = acceptor();
    return who.name && who.company && who.title && who.workEmail && who.secondEmail
      && termsBox.checked && releaseBox.checked;
  }

  function lock(on) {
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (!el.getAttribute("data-real-href")) {
        el.setAttribute("data-real-href", el.getAttribute("href") || "contact.html");
      }
      var hold = on || (id === "request-invoice" && !checkoutOpen);
      if (hold) {
        el.classList.add("btn-locked");
        el.setAttribute("aria-disabled", "true");
        el.setAttribute("tabindex", "-1");
        el.setAttribute("href", "#");
      } else {
        el.classList.remove("btn-locked");
        el.removeAttribute("aria-disabled");
        el.removeAttribute("tabindex");
        el.setAttribute("href", el.getAttribute("data-real-href"));
        if (id === "request-invoice" && checkoutOpen) {
          el.textContent = "Request an invoice";
        }
      }
    });
  }

  document.addEventListener("auxclick", function (event) {
    var link = event.target.closest ? event.target.closest("a.btn-locked") : null;
    if (link) event.preventDefault();
  });

  function refresh() {
    var ready = fieldsReady();
    lock(!ready);
    var invoice = document.getElementById("request-invoice");
    if (invoice && !checkoutOpen) {
      invoice.classList.add("btn-locked");
      invoice.setAttribute("aria-disabled", "true");
      invoice.setAttribute("tabindex", "-1");
      invoice.setAttribute("href", "#");
    }
    var companyLabel = document.getElementById("release-company-label");
    if (companyLabel) {
      var company = fieldValue("accept-company");
      companyLabel.textContent = company || "MY COMPANY";
    }
  }

  refresh();
  termsBox.addEventListener("change", refresh);
  releaseBox.addEventListener("change", refresh);
  ["accept-name", "accept-company", "accept-title", "accept-email", "accept-second-email"].forEach(function (id) {
    var input = document.getElementById(id);
    if (input) input.addEventListener("input", refresh);
  });

  var invoice = document.getElementById("request-invoice");
  if (invoice) {
    invoice.addEventListener("click", function (event) {
      if (invoice.classList.contains("btn-locked")) {
        event.preventDefault();
        return;
      }
      if (!checkoutOpen) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      var who = acceptor();
      window.location.href = invoiceMailto(version, timestampWithOffset(new Date()), who.name, who.company, who.title, who.workEmail, who.secondEmail);
    });
  }

  ["subscribe-monthly", "subscribe-annual"].forEach(function (id) {
    var link = document.getElementById(id);
    if (!link) return;
    link.addEventListener("click", function (event) {
      if (link.classList.contains("btn-locked")) {
        event.preventDefault();
        return;
      }
      var base = link.getAttribute("data-stripe-url");
      if (!base || !isLiveStripeUrl(base)) return;
      event.preventDefault();
      var who = acceptor();
      window.location.href = withClientReference(base, clientReference(version, new Date(), who.name, who.company, who.title, who.workEmail, who.secondEmail));
    });
  });
}

bindAgreement();
