/* =========================================
   Hearth & Grain Bakery - script.js (Part 3)
   ========================================= */
"use strict";

/* ---------- Settings you can edit ---------- */
const RECIPIENT_EMAIL = "healthgrain@email.com"; // contact form sends to this address
const RATES = {
    cakeBase: 350, cakeIncludedGuests: 12, cakeExtraPerGuest: 25, cakeNoticeDays: 5,
    cateringPerPerson: 60, cateringMinPeople: 10, cateringNoticeDays: 7
};
const BAKERY_COORDS = [-23.91096, 29.44923]; // update to the real bakery location

/* ---------- Small DOM helpers ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
function el(tag, text, cls) {
    const e = document.createElement(tag);
    if (text) e.textContent = text;
    if (cls) e.className = cls;
    return e;
}

/* ---------- Validation helpers ---------- */
function showError(input, msg) {
    let err = document.getElementById(input.id + "-error");
    if (!err) {
        err = el("span", "", "error");
        err.id = input.id + "-error";
        input.insertAdjacentElement("afterend", err);
    }
    err.textContent = msg;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", err.id);
}
function clearError(input) {
    if (!input || !input.id) return;
    const err = document.getElementById(input.id + "-error");
    if (err) err.textContent = "";
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
}
function check(input, ok, msg) {
    if (ok) clearError(input); else showError(input, msg);
    return ok;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cleanPhone = v => v.replace(/[\s-]/g, "");
const phoneOk = v => v === "" || /^(\+27|0)\d{9}$/.test(cleanPhone(v));

function validateBasics(form) {
    const f = form.elements;
    return [
        check(f.name, /^[A-Za-z\u00C0-\u024F' -]{2,60}$/.test(f.name.value.trim()),
            "Please enter your full name (letters only, 2-60 characters)."),
        check(f.email, emailRe.test(f.email.value.trim()),
            "Please enter a valid email address, e.g. name@example.com."),
        check(f.phone, phoneOk(f.phone.value.trim()),
            "Use a South African number such as 076 123 4567 or +27 76 123 4567.")
    ];
}
function validateMessage(form, max) {
    const m = form.elements.message;
    const len = m.value.trim().length;
    return check(m, len >= 10 && len <= max,
        `Your message must be between 10 and ${max} characters (currently ${len}).`);
}
const startOfToday = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
const niceDate = d => d.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" });

/* ---------- Async submit (AJAX) ----------
   Replace YOUR_FORM_ID in enquiry.html with a real Formspree ID to send for real.
   Until then the submission is simulated so the page still works. */
async function submitAsync(form) {
    if (form.action.includes("YOUR_FORM_ID")) {
        await new Promise(r => setTimeout(r, 700));
        return true;
    }
    try {
        const res = await fetch(form.action, {
            method: "POST", body: new FormData(form), headers: { Accept: "application/json" }
        });
        return res.ok;
    } catch (e) { return false; }
}

/* ---------- Enquiry quote (cost + availability) ---------- */
function buildQuote(type, qty, dateStr) {
    const date = new Date(dateStr + "T00:00:00");
    const days = Math.round((date - startOfToday()) / 86400000);
    const money = n => "R" + n.toLocaleString("en-ZA");
    const earliest = n => { const d = startOfToday(); d.setDate(d.getDate() + n); return niceDate(d); };

    if (date.getDay() === 0) {
        return { ok: false, title: "We're closed on Sundays", lines: ["Please choose a date from Monday to Saturday."] };
    }
    if (type === "cake") {
        if (days < RATES.cakeNoticeDays) {
            return { ok: false, title: "Not enough notice for that date",
                lines: [`Custom cakes need at least ${RATES.cakeNoticeDays} days' notice. Our earliest date is ${earliest(RATES.cakeNoticeDays)}.`] };
        }
        const extra = Math.max(0, qty - RATES.cakeIncludedGuests) * RATES.cakeExtraPerGuest;
        return { ok: true, title: "Good news - we're available!",
            lines: [`Estimated cost: from ${money(RATES.cakeBase + extra)} for ${qty} guests.`,
                    `Collection date: ${niceDate(date)}.`] };
    }
    if (type === "catering") {
        if (qty < RATES.cateringMinPeople) {
            return { ok: false, title: "Catering minimum not met",
                lines: [`Catering starts at ${RATES.cateringMinPeople} people.`] };
        }
        if (days < RATES.cateringNoticeDays) {
            return { ok: false, title: "Not enough notice for that date",
                lines: [`Catering needs at least ${RATES.cateringNoticeDays} days' notice. Our earliest date is ${earliest(RATES.cateringNoticeDays)}.`] };
        }
        return { ok: true, title: "Good news - we're available!",
            lines: [`Estimated cost: ${money(qty * RATES.cateringPerPerson)} (${money(RATES.cateringPerPerson)} per person for ${qty} people).`,
                    `Event date: ${niceDate(date)}.`] };
    }
    return { ok: true, title: "Thanks for your enquiry!", lines: [`We'll look at your request for ${niceDate(date)} and come back to you with details.`] };
}

function showResult(box, quote, name) {
    box.replaceChildren();
    box.className = "result" + (quote.ok ? "" : " unavailable");
    box.append(el("h3", quote.title));
    quote.lines.forEach(l => box.append(el("p", l)));
    if (quote.ok) {
        box.append(el("p", `Thank you, ${name}. Your enquiry has been sent and we'll confirm everything by email within 1 business day. Prices are estimates until confirmed.`));
    } else {
        box.append(el("p", "Please change your details above and send the enquiry again."));
    }
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function initEnquiry() {
    const form = $("#enquiryForm");
    if (!form) return;
    const result = $("#enquiryResult");
    const dateInput = form.elements.date;
    dateInput.min = new Date().toISOString().split("T")[0];
    form.addEventListener("input", e => clearError(e.target));

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const qty = form.elements.quantity;
        const qn = Number(qty.value);
        const results = [
            ...validateBasics(form),
            check(qty, Number.isInteger(qn) && qn >= 1 && qn <= 500, "Enter a whole number between 1 and 500."),
            check(dateInput, dateInput.value !== "" && new Date(dateInput.value + "T00:00:00") >= startOfToday(),
                "Please choose today's date or a date in the future."),
            validateMessage(form, 500)
        ];
        if (!results.every(Boolean)) {
            const first = $(".invalid", form);
            if (first) first.focus();
            return;
        }
        const btn = $("button[type=submit]", form);
        btn.disabled = true; btn.textContent = "Sending...";
        const sent = await submitAsync(form);
        btn.disabled = false; btn.textContent = "Send Enquiry";
        if (!sent) {
            result.className = "result unavailable";
            result.replaceChildren(el("h3", "Something went wrong"), el("p", "We couldn't send your enquiry. Please try again or call us."));
            return;
        }
        showResult(result, buildQuote(form.elements.type.value, qn, dateInput.value), form.elements.name.value.trim());
        form.reset();
    });
}

/* ---------- Contact form: compile an email ---------- */
function initContact() {
    const form = $("#contactForm");
    if (!form) return;
    const result = $("#contactResult");
    form.addEventListener("input", e => clearError(e.target));

    form.addEventListener("submit", e => {
        e.preventDefault();
        const results = [...validateBasics(form), validateMessage(form, 1000)];
        if (!results.every(Boolean)) {
            const first = $(".invalid", form);
            if (first) first.focus();
            return;
        }
        const f = form.elements;
        const subject = `[${f.topic.value}] Message from ${f.name.value.trim()}`;
        const body = [
            `Name: ${f.name.value.trim()}`,
            `Email: ${f.email.value.trim()}`,
            `Phone: ${f.phone.value.trim() || "not provided"}`,
            `Topic: ${f.topic.value}`,
            "", f.message.value.trim()
        ].join("\n");
        const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        const link = el("a", "Open in my email app", "button");
        link.href = mailto;
        result.replaceChildren(
            el("h3", "Your email is ready"),
            el("p", `To: ${RECIPIENT_EMAIL}`),
            el("p", `Subject: ${subject}`),
            el("pre", body),
            link
        );
        result.className = "result";
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}

/* ---------- Dynamic products: load, search, filter, sort ---------- */
/* ---------- Images: descriptive local file first, online photo as backup ---------- */
const IMAGE_SIZES = "(max-width: 480px) 100vw, (max-width: 900px) 50vw, 33vw";
function useLocalImage(img, localSrc, fallback, link) {
    const swap = () => {
        img.onerror = null;
        img.src = fallback.src;
        if (fallback.srcset) { img.srcset = fallback.srcset; img.sizes = IMAGE_SIZES; }
        if (link && fallback.href) link.href = fallback.href;
    };
    img.onerror = swap;
    img.src = localSrc;
    // the file may already have failed before this code ran
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) swap();
}
function initImageFallbacks() {
    $$("img[data-fallback-src]").forEach(img => {
        const link = img.closest("a");
        useLocalImage(img, img.getAttribute("src"), {
            src: img.dataset.fallbackSrc,
            srcset: img.dataset.fallbackSrcset,
            href: link ? link.dataset.fallbackHref : ""
        }, link);
    });
}

const PRODUCTS = [
    { name: "Classic Sourdough", category: "bread", price: 45, from: false,
      desc: "Freshly baked sourdough with a crispy crust and soft centre.",
      img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80", alt: "Freshly baked sourdough loaf" },
    { name: "Butter Croissant", category: "pastry", price: 22, from: false,
      desc: "A light and flaky croissant made with rich butter.",
      img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80", alt: "Golden butter croissant" },
    { name: "Blueberry Muffin", category: "pastry", price: 25, from: false,
      desc: "A soft muffin filled with sweet blueberries.",
      img: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80", alt: "Blueberry muffin" },
    { name: "Cinnamon Roll", category: "pastry", price: 28, from: false,
      desc: "Soft baked dough with cinnamon, sugar and a sweet topping.",
      img: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80", alt: "Cinnamon roll with icing" },
    { name: "Chocolate Cake", category: "cake", price: 350, from: true,
      desc: "A rich chocolate cake for birthdays and special occasions.",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80", alt: "Rich chocolate cake" },
    { name: "Carrot Cake", category: "cake", price: 320, from: true,
      desc: "A soft carrot cake with a creamy topping and warm spices.",
      img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80", alt: "Carrot cake with cream cheese topping" }
];

function productCard(p) {
    const card = el("div", "", "product-card");
    const img = el("img");
    const base = p.img.replace("&w=600&q=80", "");
    const fileName = p.name.toLowerCase().replace(/\s+/g, "-") + ".jpg"; // e.g. classic-sourdough.jpg
    useLocalImage(img, "images/products/" + fileName, {
        src: p.img,
        srcset: [400, 600, 900].map(w => `${base}&w=${w}&q=80 ${w}w`).join(", ")
    });
    img.alt = p.alt; img.loading = "lazy"; img.width = 600; img.height = 400;
    const info = el("div", "", "product-info");
    info.append(el("h3", p.name), el("p", p.desc), el("span", (p.from ? "From " : "") + "R" + p.price, "price"));
    card.append(img, info);
    return card;
}

function initProducts() {
    const grid = $("#productGrid");
    if (!grid) return;
    const search = $("#searchBox"), cat = $("#categoryFilter"), sort = $("#sortSelect"), count = $("#resultCount");

    function render() {
        const q = search.value.trim().toLowerCase();
        let list = PRODUCTS.filter(p =>
            (cat.value === "all" || p.category === cat.value) &&
            (p.name + " " + p.desc).toLowerCase().includes(q));
        const sorters = {
            "price-asc": (a, b) => a.price - b.price,
            "price-desc": (a, b) => b.price - a.price,
            "name": (a, b) => a.name.localeCompare(b.name)
        };
        if (sorters[sort.value]) list = list.sort(sorters[sort.value]);
        grid.replaceChildren(...list.map(productCard));
        if (!list.length) grid.append(el("p", "No products match your search.", "no-results"));
        count.textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;
    }
    [search, cat, sort].forEach(c => c.addEventListener("input", render));
    render();
}

/* ---------- Gallery lightbox ---------- */
function initLightbox() {
    const items = $$(".gallery-item");
    if (!items.length) return;
    const box = el("div", "", "lightbox");
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    const img = el("img"), cap = el("p", "", "lightbox-caption");
    const mk = (txt, label, cls) => { const b = el("button", txt, "lb-btn " + cls); b.type = "button"; b.setAttribute("aria-label", label); return b; };
    const close = mk("\u00D7", "Close", "lb-close"), prev = mk("\u2039", "Previous image", "lb-prev"), next = mk("\u203A", "Next image", "lb-next");
    box.append(close, prev, img, next, cap);
    document.body.append(box);

    let i = 0;
    const show = n => {
        i = (n + items.length) % items.length;
        img.src = items[i].href;
        img.alt = items[i].querySelector("img").alt;
        cap.textContent = img.alt;
    };
    const hide = () => { box.hidden = true; document.body.classList.remove("no-scroll"); };
    items.forEach((a, n) => a.addEventListener("click", e => {
        e.preventDefault(); show(n); box.hidden = false;
        document.body.classList.add("no-scroll"); close.focus();
    }));
    close.addEventListener("click", hide);
    prev.addEventListener("click", () => show(i - 1));
    next.addEventListener("click", () => show(i + 1));
    box.addEventListener("click", e => { if (e.target === box) hide(); });
    document.addEventListener("keydown", e => {
        if (box.hidden) return;
        if (e.key === "Escape") hide();
        if (e.key === "ArrowLeft") show(i - 1);
        if (e.key === "ArrowRight") show(i + 1);
    });
}

/* ---------- FAQ accordion ---------- */
function initAccordion() {
    $$(".accordion-btn").forEach(btn => {
        const panel = btn.nextElementSibling;
        btn.addEventListener("click", () => {
            const open = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", String(!open));
            panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
        });
    });
}

/* ---------- Scroll-reveal animation ---------- */
function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(entries => entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
    }), { threshold: 0.12 });
    $$("body > section:not(.hero):not(.page-header), .feature").forEach(t => { t.classList.add("reveal"); obs.observe(t); });
}

/* ---------- Interactive map (Leaflet + OpenStreetMap) ---------- */
function initMap() {
    const mapEl = $("#map");
    if (!mapEl || !window.L) return;
    const map = L.map("map").setView(BAKERY_COORDS, 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    L.marker(BAKERY_COORDS).addTo(map)
        .bindPopup("<strong>Hearth &amp; Grain Bakery</strong><br>Mon-Sat 08:00-17:00").openPopup();
}

/* ---------- Mobile navigation (hamburger) ---------- */
function initNav() {
    const btn = $(".nav-toggle"), menu = $("#navLinks");
    if (!btn || !menu) return;
    const set = open => {
        menu.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
        btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        btn.innerHTML = open ? "&#10005;" : "&#9776;";
    };
    btn.addEventListener("click", () => set(!menu.classList.contains("open")));
    menu.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 768) set(false); });
}

/* ---------- Start everything ---------- */
initNav();
initImageFallbacks();
initEnquiry();
initContact();
initProducts();
initLightbox();
initAccordion();
initReveal();
initMap();
