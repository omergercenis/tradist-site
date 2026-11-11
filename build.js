// Builds the static site into ./dist. No dependencies: `node build.js`
const fs = require('fs');
const path = require('path');
const { company: C, services } = require('./src/content');

const DIST = path.join(__dirname, 'dist');
const SRC = path.join(__dirname, 'src');
fs.rmSync(DIST, { recursive: true, force: true });

const write = (rel, html) => {
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
};
const copyDir = (from, to) => fs.cpSync(from, to, { recursive: true });

const addressInline = `${C.street1}, ${C.street2}, ${C.city} ${C.postcode}`;
const year = new Date().getFullYear();

/* ---------- shared pieces ---------- */

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  name: C.brand,
  legalName: C.name,
  url: C.domain + '/',
  email: C.email,
  telephone: C.phoneIntl,
  logo: C.domain + '/assets/img/tradist-logo.png',
  image: C.domain + '/assets/img/og-image.png',
  address: { '@type': 'PostalAddress', streetAddress: `${C.street1}, ${C.street2}`, addressLocality: C.city, postalCode: C.postcode, addressCountry: 'GB' },
  areaServed: 'GB',
  identifier: { '@type': 'PropertyValue', propertyID: 'Companies House company number', value: C.number },
  makesOffer: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: `${C.domain}/services/${s.slug}/` } })),
};

function layout({ title, desc, pathname, body, current, noindex }) {
  const canonical = C.domain + pathname;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<meta name="theme-color" content="#f1ede4">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${C.brand}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${C.domain}/assets/img/og-image.png">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/archivo-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

function header(current) {
  const cur = (k) => (current === k ? ' aria-current="page"' : '');
  return `<header class="site-header">
<div class="wrap">
<a class="logo" href="/" aria-label="Tradist — home">tradist<span>.</span></a>
<nav class="nav" aria-label="Main">
<a href="/#services"${cur('services')}>Services</a>
<a href="/about/"${cur('about')}>About</a>
<a class="nav-cta" href="/contact/"${cur('contact')}>Let’s talk</a>
</nav>
</div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
<div class="wrap">
<p class="footer__logo" aria-hidden="true">tradist<span>.</span></p>
<div class="footer__cols">
<div>
<h2>Visit</h2>
<address>${C.street1}<br>${C.street2}<br>${C.city} ${C.postcode}</address>
</div>
<div>
<h2>Contact</h2>
<ul>
<li><a href="tel:${C.phoneIntl}">${C.phoneDisplay}</a></li>
<li><a href="mailto:${C.email}">${C.email}</a></li>
</ul>
</div>
<div>
<h2>Services</h2>
<ul>
${services.map((s) => `<li><a href="/services/${s.slug}/">${s.name}</a></li>`).join('\n')}
</ul>
</div>
<div>
<h2>Tradist</h2>
<ul>
<li><a href="/about/">About</a></li>
<li><a href="/contact/">Contact</a></li>
<li><a href="/privacy/">Privacy notice</a></li>
</ul>
</div>
</div>
<div class="footer__legal">
<p>${C.name} · Registered in England &amp; Wales · Company No. ${C.number} · Registered office: ${addressInline}</p>
<p>© ${year} ${C.name}</p>
</div>
</div>
</footer>`;
}

const marquee = () => {
  const items = ['Debit', '=', 'Credit', '✶', 'Assets', '=', 'Liabilities + Equity', '✶', '0 Surprises', '✶', 'Filed Early', '✶'];
  const run = items.map((x) => (/^[=✶]$/.test(x) ? `<i>${x}</i>` : `<span>${x}</span>`)).join('');
  return `<div class="marquee-wrap" aria-hidden="true"><div class="marquee"><div class="marquee__track">${run}${run}</div></div></div>`;
};

const ctaBand = (heading = 'Let’s <span class="serif-i accent">balance</span> the books.') => `<section class="section" style="padding-top:0">
<div class="wrap">
<div class="cta-band">
<h2>${heading}</h2>
<a class="btn btn--accent" href="/contact/">Book a free consultation <span aria-hidden="true">→</span></a>
</div>
</div>
</section>`;

/* ---------- artwork (inline SVG collages) ---------- */

function homeArt() {
  return `<svg viewBox="0 0 480 520" role="img" aria-label="Collage: a vermilion halftone circle holding a giant engraved pound sign, scattered ledger numerals, and a torn ledger page where debit equals credit">
<defs>
<pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.6" fill="#c23412"/></pattern>
<pattern id="lines" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="4" stroke="#111" stroke-width="1"/></pattern>
</defs>
<circle cx="250" cy="240" r="200" fill="url(#dots)"/>
<text x="250" y="330" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="320" fill="url(#lines)" stroke="#111" stroke-width="2.5">£</text>
<text x="70" y="90" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="64" fill="#111">7</text>
<text x="400" y="230" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="54" fill="#111">%</text>
<text x="96" y="250" font-family="Instrument Serif, Georgia, serif" font-size="40" fill="#111" transform="rotate(-14 96 250)">1,840</text>
<text x="330" y="440" font-family="Archivo, Arial, sans-serif" font-weight="800" font-size="30" fill="#111" transform="rotate(6 330 440)">+0.00</text>
<g transform="rotate(-8 120 420)">
<path d="M20 360 L250 350 L246 372 L254 392 L244 414 L252 440 L24 452 Z" fill="#fbf8f0" stroke="#111" stroke-width="1.5"/>
<g stroke="#111" stroke-width="0.8"><line x1="36" y1="378" x2="236" y2="372"/><line x1="36" y1="396" x2="236" y2="390"/><line x1="36" y1="414" x2="236" y2="408"/><line x1="36" y1="432" x2="236" y2="426"/><line x1="140" y1="364" x2="142" y2="444"/></g>
<text x="44" y="392" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="16" fill="#111">Debit</text>
<text x="152" y="388" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="16" fill="#111">Credit</text>
<text x="44" y="428" font-family="Instrument Serif, Georgia, serif" font-size="16" fill="#111">£ 1,000</text>
<text x="152" y="424" font-family="Instrument Serif, Georgia, serif" font-size="16" fill="#111">£ 1,000</text>
</g>
<g transform="rotate(12 400 90)">
<circle cx="400" cy="90" r="56" fill="#111"/>
<text x="400" y="84" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="800" font-size="13" fill="#f1ede4" letter-spacing="1">BALANCED</text>
<text x="400" y="104" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="18" fill="#f1ede4">to the penny</text>
</g>
</svg>`;
}

function serviceArt(s) {
  const a = s.art;
  return `<svg viewBox="0 0 440 440" role="img" aria-label="Collage for ${s.name}: ${a.big} inside a halftone circle, with a note reading ${a.cardLabel.toLowerCase()}, ${a.cardValue}">
<defs>
<pattern id="sdots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.6" fill="#c23412"/></pattern>
<pattern id="slines" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="4" stroke="#111" stroke-width="1"/></pattern>
</defs>
<circle cx="220" cy="220" r="190" fill="url(#sdots)"/>
<text x="220" y="262" text-anchor="middle" textLength="340" lengthAdjust="spacingAndGlyphs" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="150" fill="url(#slines)" stroke="#111" stroke-width="2.5">${a.big}</text>
<g transform="rotate(-7 150 340)">
<rect x="34" y="300" width="250" height="78" fill="#fbf8f0" stroke="#111" stroke-width="1.5"/>
<text x="50" y="328" font-family="Archivo, Arial, sans-serif" font-weight="800" font-size="12" letter-spacing="1.5" fill="#111">${a.cardLabel}</text>
<text x="50" y="360" font-family="Instrument Serif, Georgia, serif" font-size="25" fill="#c23412">${a.cardValue}</text>
</g>
<g transform="rotate(10 360 80)">
<circle cx="360" cy="80" r="54" fill="#111"/>
<text x="360" y="76" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="800" font-size="13" fill="#f1ede4" letter-spacing="1">${a.stickerTop}</text>
<text x="360" y="97" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="17" fill="#f1ede4">${a.stickerBottom}</text>
</g>
</svg>`;
}

function scaleArt() {
  return `<svg viewBox="0 0 380 300" role="img" aria-label="Collage: a balance scale with equal pans labelled debit and credit, over a halftone circle">
<defs><pattern id="cdots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.6" fill="#c23412"/></pattern></defs>
<circle cx="190" cy="150" r="140" fill="url(#cdots)"/>
<g stroke="#111" stroke-width="4" fill="none">
<line x1="190" y1="40" x2="190" y2="250"/><line x1="150" y1="252" x2="230" y2="252"/><line x1="70" y1="80" x2="310" y2="80"/>
<path d="M70 80 L42 160 M70 80 L98 160"/><path d="M310 80 L282 160 M310 80 L338 160"/>
</g>
<path d="M30 160 L110 160 Q70 196 30 160 Z" fill="#111"/><path d="M270 160 L350 160 Q310 196 270 160 Z" fill="#111"/>
<circle cx="190" cy="36" r="9" fill="#111"/>
<g transform="rotate(-4 70 137)"><rect x="34" y="122" width="72" height="30" fill="#fbf8f0" stroke="#111" stroke-width="1.5"/><text x="70" y="143" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="18" fill="#111">Debit</text></g>
<g transform="rotate(4 310 137)"><rect x="274" y="122" width="72" height="30" fill="#fbf8f0" stroke="#111" stroke-width="1.5"/><text x="310" y="143" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="18" fill="#111">Credit</text></g>
</svg>`;
}

/* ---------- pages ---------- */

const tenets = `<div class="tenets">
<div><p class="tenet__mark" aria-hidden="true">1</p><h3>One clear picture</h3><p>Your numbers explained in plain English, not jargon.</p></div>
<div><p class="tenet__mark" aria-hidden="true">=</p><h3>Always in balance</h3><p>Debit equals credit. Books reconciled, every month.</p></div>
<div><p class="tenet__mark" aria-hidden="true">0</p><h3>Zero surprises</h3><p>Fixed fees agreed up front. Deadlines met before they arrive.</p></div>
</div>`;

function home() {
  const rows = services.map((s) => `<a class="svc-row" href="/services/${s.slug}/"><span class="svc-row__num">${s.num}</span><span class="svc-row__name">${s.name}</span><span class="svc-row__desc">${s.short}</span><span class="svc-row__arrow" aria-hidden="true">→</span></a>`).join('\n');
  const body = `<section class="hero">
<div class="wrap">
<div class="hero__grid">
<h1 class="display hero__title">Old<br>School<br><span class="serif-i accent">numbers,</span><br>new tricks.</h1>
<div class="hero__art">${homeArt()}</div>
</div>
<div class="hero__foot">
<p class="hero__lede">Tradist is an accountancy practice in Liverpool for founders, freelancers and growing companies across the UK. Victorian rigour, modern tools — tax, payroll and company affairs, handled with care.</p>
<a class="btn btn--accent" href="/contact/">Book a free consultation <span aria-hidden="true">→</span></a>
</div>
</div>
</section>
${marquee()}
<section class="section" id="services">
<div class="wrap">
<div class="section__head">
<h2 class="h2">What we <span class="serif-i accent">do</span></h2>
<p>Seven services. Fixed fees. No surprises.</p>
</div>
<div class="svc-list">
${rows}
</div>
</div>
</section>
<section class="section" id="philosophy" style="padding-top:0">
<div class="wrap">
<div class="philosophy">
<p class="eyebrow">Our philosophy</p>
<h2>Every pound has <span class="serif-i">a place.</span></h2>
${tenets}
</div>
</div>
</section>
${ctaBand()}`;
  write('index.html', layout({
    title: 'Tradist — Accountants in Liverpool | Tax, Payroll &amp; Company Services',
    desc: 'Tradist is a Liverpool accountancy practice: Corporation Tax, Self Assessment, VAT, payroll, company formation, company restoration and yacht registration. Fixed fees.',
    pathname: '/', body,
  }));
}

function servicePage(s) {
  const others = services.filter((o) => o.slug !== s.slug).map((o) => `<a href="/services/${o.slug}/">${o.name}</a>`).join('\n');
  const marks = 'abcdefgh';
  const body = `<div class="wrap"><p class="crumb"><a href="/#services">Services</a> <span aria-hidden="true">/</span> ${s.name}</p></div>
<section class="page-hero">
<div class="wrap">
<div class="hero__grid">
<div style="flex: 999 1 560px; min-width: 0;">
<p class="kicker">Service ${s.num}</p>
<h1 class="display hero__title" style="font-size: clamp(44px, 9vw, 132px);">${s.titleLines.join('<br>')}</h1>
<p class="hero__lede" style="margin-top: 28px;">${s.lede}</p>
<div class="btn-row" style="margin-top: 32px;">
<a class="btn btn--accent" href="/contact/?service=${encodeURIComponent(s.name)}">Get a fixed quote <span aria-hidden="true">→</span></a>
<a class="btn btn--outline" href="#how">How it works</a>
</div>
</div>
<div class="hero__art" style="max-width: 440px;">${serviceArt(s)}</div>
</div>
</div>
</section>
<section class="numbers" aria-label="Key numbers">
<div class="wrap">
${s.numbers.map(([b, u, l]) => `<div><p class="num__big">${b}${u ? `<em>${u}</em>` : ''}</p><p class="num__label">${l}</p></div>`).join('\n')}
</div>
</section>
<section class="section">
<div class="wrap split">
<h2 class="h2">What’s <span class="serif-i accent">included</span></h2>
<ul class="included">
${s.included.map((x, i) => `<li data-mark="${marks[i]}.">${x}</li>`).join('\n')}
</ul>
</div>
</section>
<section class="section" id="how" style="padding-top:0">
<div class="wrap">
<h2 class="h2" style="margin-bottom: 32px;">How it <span class="serif-i accent">works</span></h2>
<ol class="steps">
${s.steps.map(([h, p], i) => `<li class="step"><p class="step__n" aria-hidden="true">${i + 1}</p><h3>${h}</h3><p>${p}</p></li>`).join('\n')}
</ol>
</div>
</section>
<section class="section" style="padding-top:0">
<div class="wrap fee-faq">
<div class="fee-card">
<p class="eyebrow">Fixed fee</p>
<h2>Quoted up front.</h2>
<p>You’ll know the full price before we start. No hourly billing, no surprises.</p>
<a class="btn btn--accent" href="/contact/?service=${encodeURIComponent(s.name)}">Request a quote →</a>
</div>
<div class="faq">
<h2>Questions</h2>
${s.faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
</div>
</div>
</section>
<nav class="also" aria-label="Other services">
<div class="wrap">
<span>Also:</span>
${others}
</div>
</nav>`;
  write(`services/${s.slug}/index.html`, layout({
    title: `${s.name} — Tradist, Accountants in Liverpool`,
    desc: s.metaDesc, pathname: `/services/${s.slug}/`, body, current: 'services',
  }));
}

function about() {
  const body = `<section class="page-hero">
<div class="wrap">
<p class="kicker">About Tradist</p>
<h1 class="display hero__title" style="font-size: clamp(44px, 9vw, 132px);">Victorian<br>rigour.<br><span class="serif-i accent">Modern</span> tools.</h1>
</div>
</section>
${marquee()}
<section class="section">
<div class="wrap split">
<h2 class="h2">Why <span class="serif-i accent">Tradist</span></h2>
<div style="flex: 2 1 480px; display: grid; gap: 20px;">
<p class="lead-text">The best Victorian ledgers were works of order: every entry dated, every figure traceable, every page in balance. <span class="serif-i accent">We still believe in that.</span></p>
<p style="font-size: 19px; max-width: 62ch;">Tradist is an accountancy practice based in Liverpool, working with clients across the United Kingdom. We look after the numbers that keep a business legal and healthy — tax returns, VAT, payroll and company filings — and we explain them in plain English. Our fees are fixed and agreed before we start, and our deadlines are met before they arrive.</p>
</div>
</div>
</section>
<section class="section" style="padding-top:0">
<div class="wrap">
<div class="philosophy">
<p class="eyebrow">Our philosophy</p>
<h2>Every pound has <span class="serif-i">a place.</span></h2>
${tenets}
</div>
</div>
</section>
<section class="section" style="padding-top:0">
<div class="wrap">
<h2 class="h2" style="margin-bottom: 32px;">Who we <span class="serif-i accent">help</span></h2>
<div class="cols">
<div class="card"><h3>Founders &amp; directors</h3><p>From the day you incorporate to every year-end, VAT quarter and payroll run after it.</p></div>
<div class="card"><h3>Sole traders &amp; freelancers</h3><p>Self Assessment done properly, and a clear view of when a company would suit you better.</p></div>
<div class="card"><h3>Landlords</h3><p>Rental income, expenses and the new Making Tax Digital rules, kept in order.</p></div>
<div class="card"><h3>Companies in a tangle</h3><p>Overdue filings caught up, struck-off companies restored, HMRC letters answered.</p></div>
<div class="card"><h3>Yacht owners</h3><p>Registration on the UK Ship Register, prepared and submitted for you.</p></div>
</div>
</div>
</section>
${ctaBand()}`;
  write('about/index.html', layout({
    title: 'About — Tradist, Accountants in Liverpool',
    desc: 'Tradist is a Liverpool accountancy practice with Victorian rigour and modern tools. Fixed fees, plain English, deadlines met early.',
    pathname: '/about/', body, current: 'about',
  }));
}

function contact() {
  const options = services.map((s) => `<option value="${s.name}">${s.name}</option>`).join('\n') + '\n<option value="Not sure yet">Not sure yet</option>';
  const body = `<section class="page-hero" style="padding-bottom: 48px;">
<div class="wrap">
<div class="hero__grid">
<h1 class="display hero__title" style="font-size: clamp(44px, 9.5vw, 140px);">Let’s<br>balance<br><span class="serif-i accent">the books.</span></h1>
<div class="hero__art" style="max-width: 380px;">${scaleArt()}</div>
</div>
</div>
</section>
<section class="section" style="padding-top:0">
<div class="wrap contact-grid">
<form class="form" id="contact-form" name="contact" method="POST" action="${C.formEndpoint}">
<input type="hidden" name="_subject" value="New enquiry from tradist.co.uk">
<p class="hp"><label>Leave this empty <input name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
<div class="field"><label for="name">Your name</label><input id="name" name="name" type="text" autocomplete="name" required></div>
<div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div>
<div class="field"><label for="phone">Phone <small>(optional)</small></label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
<div class="field"><label for="service">Service</label><select id="service" name="service">
${options}
</select></div>
<div class="field field--full"><label for="message">Tell us a little</label><textarea id="message" name="message" rows="5" required></textarea></div>
<label class="consent"><input type="checkbox" name="consent" value="yes" required> <span>I agree that Tradist may use these details to reply to my enquiry, as described in the <a href="/privacy/">privacy notice</a>.</span></label>
<div class="form__foot">
<p id="form-status" role="status">We’ll reply by email or phone.</p>
<button class="btn btn--accent" type="submit">Send message <span aria-hidden="true">→</span></button>
</div>
</form>
<aside class="contact-aside" aria-label="Contact details">
<div class="contact-card contact-card--ink"><p class="eyebrow">Write</p><a class="contact-card__value" href="mailto:${C.email}">${C.email}</a></div>
<div class="contact-card"><p class="eyebrow">Call</p><a class="contact-card__value" href="tel:${C.phoneIntl}">${C.phoneDisplay}</a></div>
<div class="contact-card"><p class="eyebrow">Visit</p><address>${C.street1}<br>${C.street2}<br>${C.city} ${C.postcode}</address>
<p style="margin-top: 10px;"><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(addressInline)}" rel="noopener">Open in maps ↗</a></p></div>
</aside>
</div>
</section>
<script>
// Pre-select the service when arriving from a service page (?service=VAT)
(function () {
  var p = new URLSearchParams(location.search).get('service');
  var sel = document.getElementById('service');
  if (p && sel) { for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === p) { sel.selectedIndex = i; } } }
})();
// Send the form in the background and go to the thank-you page
(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form || !window.fetch) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    status.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); location.href = '/thanks/'; })
      .catch(function () {
        btn.disabled = false;
        status.innerHTML = 'Sorry, that didn’t send. Please email <a href="mailto:${C.email}">${C.email}</a>.';
      });
  });
})();
</script>`;
  write('contact/index.html', layout({
    title: 'Contact — Tradist, Accountants in Liverpool',
    desc: `Contact Tradist: ${C.phoneDisplay}, ${C.email}. ${addressInline}.`,
    pathname: '/contact/', body, current: 'contact',
  }));
}

function thanks() {
  const body = `<section class="page-hero">
<div class="wrap">
<p class="kicker">Message received</p>
<h1 class="display hero__title" style="font-size: clamp(44px, 9vw, 120px);">Thank<br><span class="serif-i accent">you.</span></h1>
<p class="hero__lede" style="margin-top: 28px;">We’ve got your message and will be in touch soon. If it’s urgent, call us on <a href="tel:${C.phoneIntl}">${C.phoneDisplay}</a>.</p>
<div class="btn-row" style="margin-top: 32px;"><a class="btn btn--ink" href="/">Back to home</a></div>
</div>
</section>`;
  write('thanks/index.html', layout({ title: 'Thank you — Tradist', desc: 'Thank you for contacting Tradist.', pathname: '/thanks/', body, noindex: true }));
}

function notFound() {
  const body = `<section class="page-hero">
<div class="wrap">
<p class="kicker">Error 404</p>
<h1 class="display hero__title" style="font-size: clamp(44px, 9vw, 120px);">This page<br>doesn’t <span class="serif-i accent">balance.</span></h1>
<p class="hero__lede" style="margin-top: 28px;">The page you’re looking for has moved or never existed.</p>
<div class="btn-row" style="margin-top: 32px;"><a class="btn btn--ink" href="/">Back to home</a><a class="btn btn--outline" href="/#services">See our services</a></div>
</div>
</section>`;
  write('404.html', layout({ title: 'Page not found — Tradist', desc: 'Page not found.', pathname: '/404.html', body, noindex: true }));
}

function privacy() {
  const body = `<section class="page-hero" style="padding-bottom: 24px;">
<div class="wrap">
<p class="kicker">Legal</p>
<h1 class="display hero__title" style="font-size: clamp(40px, 7vw, 96px);">Privacy<br>notice</h1>
</div>
</section>
<section class="section" style="padding-top: 24px;">
<div class="wrap prose">
<p><strong>Last updated:</strong> November 2026</p>
<h2>Who we are</h2>
<p>This website is run by ${C.name} (“Tradist”, “we”, “us”), a company registered in England &amp; Wales, company number ${C.number}, registered office ${addressInline}. We are the controller of the personal data described in this notice.</p>
<p>You can contact us about your data at <a href="mailto:${C.email}">${C.email}</a> or on ${C.phoneDisplay}.</p>
<h2>What we collect</h2>
<p>When you use our contact form or email or call us, we collect the details you give us: usually your name, email address, phone number, the service you are interested in and your message.</p>
<p>If you become a client, we collect the information needed to provide our services, such as financial records, tax references and identity documents. This is covered by our engagement letter.</p>
<h2>Why we use it, and our lawful basis</h2>
<ul>
<li>To reply to your enquiry and give you a quote — legitimate interests, and steps taken at your request before entering into a contract.</li>
<li>To provide our accountancy services — performance of a contract.</li>
<li>To meet our legal obligations, including anti-money laundering checks and record-keeping — legal obligation.</li>
</ul>
<p>We do not sell your data and we do not use it for marketing without your consent.</p>
<h2>Who we share it with</h2>
<p>We share data only where needed to provide our services or meet the law — for example with HMRC, Companies House, the UK Ship Register, and trusted suppliers such as our website host, email and accounting software providers, who process it on our instructions.</p>
<h2>How long we keep it</h2>
<p>Enquiries that do not lead to work are deleted within 12 months. Client records are kept for as long as the law requires, normally six years after the end of our engagement.</p>
<h2>Cookies</h2>
<p>This website does not use analytics, advertising or tracking cookies. Our fonts are hosted on our own website, so no data is sent to third-party font services when you visit.</p>
<h2>Your rights</h2>
<p>You have the right to ask for a copy of your data, to have it corrected or deleted, to object to or restrict how we use it, and to data portability. To use any of these rights, email <a href="mailto:${C.email}">${C.email}</a>.</p>
<p>If you are unhappy with how we have handled your data, you can complain to the Information Commissioner’s Office (ICO) at <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a> or on 0303 123 1113. We would appreciate the chance to put things right first.</p>
</div>
</section>`;
  write('privacy/index.html', layout({ title: 'Privacy notice — Tradist', desc: 'How Tradist Ltd collects, uses and protects personal data.', pathname: '/privacy/', body }));
}

/* ---------- build ---------- */

home();
services.forEach(servicePage);
about();
contact();
thanks();
privacy();
notFound();

copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));
copyDir(path.join(SRC, 'public'), DIST);

const urls = ['/', ...services.map((s) => `/services/${s.slug}/`), '/about/', '/contact/', '/privacy/'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${C.domain}${u}</loc></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${C.domain}/sitemap.xml\n`);

console.log('Built', urls.length + 2, 'pages into dist/');
if (/YOUR_FORM_ID/.test(C.formEndpoint)) console.warn('WARNING: contact form endpoint not set in src/content.js (formEndpoint)');
