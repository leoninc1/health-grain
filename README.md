# Hearth & Grain Bakery Website

**Module:** Web Development (Introduction), WEDE5020
**Student:** Khavharendwe Leon Ndou (ST10510011), Group 1
**Repository:** https://github.com/leoninc1/health-grain
**Live site:** 

A responsive website for Hearth & Grain Bakery, a fictional small family bakery that started as a weekend stall and now runs from one shop, known for sourdough bread and custom celebration cakes.

---

## Table of Contents

1. [About the Organisation](#1-about-the-organisation)
2. [Website Goals](#2-website-goals)
3. [Pages and Features](#3-pages-and-features)
4. [Design and Styling](#4-design-and-styling)
5. [Responsive Design](#5-responsive-design)
6. [SEO](#6-seo)
7. [Accessibility](#7-accessibility)
8. [Project Structure](#8-project-structure)
9. [How to Run and Deploy](#9-how-to-run-and-deploy)
10. [Notes and Limitations](#10-notes-and-limitations)
11. [Working Through Feedback](#11-working-through-feedback)
12. [Changelog](#12-changelog)
13. [References](#13-references)

---

## 1. About the Organisation

- **History:** A family bakery that has operated from one shop for six years, growing from a weekend stall into a local bakery known for sourdough bread and custom cakes.
- **Mission:** Bring people together with fresh, well-made food using traditional baking methods and good local ingredients.
- **Vision:** Become a trusted bakery in the local community and reach more customers through a website, instead of relying only on passing trade.
- **Target audience:** Local people aged 25 to 55 who want good-quality food and convenience, plus people looking for custom cakes for events. Most visitors are expected to use mobile phones.

## 2. Website Goals

- Create an online presence so more people can find and learn about the bakery.
- Let customers send custom cake and catering enquiries through an online form.
- Show opening hours, location and products so customers do not need to phone for basic information.

**KPIs:** number of enquiry forms received each month, average time spent on the Products page, and fewer phone calls asking about opening hours or location.

## 3. Pages and Features

| Page | What it contains |
|------|------------------|
| `index.html` | Hero with call-to-action buttons, welcome section, three feature cards, LocalBusiness structured data |
| `about.html` | Story, mission, vision and a FAQ accordion |
| `product.html` | Products loaded with JavaScript, with search, category filter and sort, plus a custom cake call to action |
| `gallery.html` | Photo gallery with a lightbox (next, previous, Esc to close) |
| `enquiry.html` | Custom cake and catering form with validation and an instant cost and availability response |
| `contact.html` | Contact details, opening hours, interactive Leaflet map and a contact form that builds an email |

### Interactive elements
- **FAQ accordion** (`about.html`): each question opens and closes its answer with a height transition. Buttons use `aria-expanded`.
- **Mobile hamburger menu:** opens a dropdown, closes on link click, Esc or when the window is resized to desktop width.
- **Scroll-reveal animations** and card hover and fade-in transitions, switched off for visitors who prefer reduced motion.

### Interactive map
`contact.html` uses Leaflet with OpenStreetMap tiles. The visitor can drag and zoom, and a marker popup shows the bakery name and opening hours. The location is set by `BAKERY_COORDS` at the top of `js/script.js`.

### Gallery lightbox
Clicking a photo opens it enlarged over a dark overlay. Visitors can move between images with the on-screen arrows or the left and right arrow keys, and close with the button, the Esc key or a click outside the image. The lightbox is built with JavaScript DOM methods and has dialog and aria labels.

### Dynamic content and search
Product cards are generated from a JavaScript array rather than hardcoded HTML. Visitors can search by name or description, filter by category (bread, pastries, cakes) and sort by price or name. A live count shows how many products match, and a message appears when none do.

### Enquiry form (`enquiry.html`)
- **Controls:** full name, email, phone, enquiry type (dropdown), servings or guests (number), date needed (date picker) and message (textarea), all with labels.
- **Validation:** JavaScript checks every field. Names must be 2 to 60 letters, email must be valid, phone must be a South African number (`076 123 4567` or `+27 76 123 4567`), servings between 1 and 500, the date cannot be in the past and the message must be 10 to 500 characters. Red error messages appear under the field, and the first invalid field receives focus.
- **Processing and response:** once valid, the form is submitted asynchronously with `fetch` (AJAX) and the page shows an estimated cost and availability. Cakes start from R350 plus R25 per guest above 12 and need 5 days' notice. Catering is R60 per person, needs at least 10 people and 7 days' notice. The bakery is closed on Sundays.
- **Submission:** the `action` attribute points to a Formspree endpoint. Until a real Formspree ID is added, submission is simulated so the page still works.

### Contact form (`contact.html`)
- **Controls:** full name, email, phone (optional), type of message (dropdown) and message (textarea).
- **Validation:** same JavaScript checks as above, with a message limit of 1000 characters.
- **Processing:** the validated details are compiled into an email and shown as a preview. An "Open in my email app" button opens a `mailto:` link addressed to the recipient set in `RECIPIENT_EMAIL` at the top of `js/script.js`.

## 4. Design and Styling

The proposal planned a cream, terracotta and dark brown palette. During development the design was refined to match the logo, so the final site uses:

| Role | Colour |
|------|--------|
| Brand maroon (headings, buttons) | `#5b1f17` |
| Wheat gold (accents) | `#b8862b` |
| Cream (backgrounds) | `#fbf5ea` |
| Terracotta (custom cake section) | `#c97c4b` |

- **Typography:** Playfair Display (serif) for headings and Lato for body text, with Georgia and Arial as fallbacks.
- **Layout:** content centred in a 1100px column, CSS Grid for cards and galleries, Flexbox for the navigation and buttons.
- **Visual styling:** rounded corners, soft shadows, pill-shaped buttons, hover, focus and active states, and smooth transitions.
- **Single external stylesheet:** all styling lives in `css/style.css` (no inline styles), built with CSS variables so colours and spacing are changed in one place.

## 5. Responsive Design

| Device | Width | Layout |
|--------|-------|--------|
| Large desktop | 1440px | Full navigation bar, 3-column grids |
| Laptop | 1024px | Full navigation bar, 3-column grids |
| Tablet | 768px | Hamburger menu, 2-column grids |
| Phone | 390px | Hamburger menu, single column, full-width buttons |
| Small phone | 320px | Same as phone, no sideways scrolling |

**Techniques:** media queries at 900px, 768px, 600px and 480px (plus large-screen and landscape rules), relative units (`rem`, `%`, `clamp()` for headings), `auto-fit` grids, `<picture>` with WebP and PNG logo, `srcset` and `sizes` on product and gallery images, lazy loading, and hover effects switched off on touch devices.

**Testing:** Chrome DevTools device mode, plus an automated check that none of the six pages scrolls sideways at the widths above.

**Screenshots:** see the `screenshots/` folder. ADD YOUR OWN SCREENSHOTS (desktop, tablet, phone and open mobile menu) TO THIS FOLDER AND LIST THEM HERE.

## 6. SEO

- **Title tags:** a unique, descriptive title on every page that includes the bakery name and the page topic.
- **Meta descriptions:** a unique description on every page, written for the content of that page, plus Open Graph tags.
- **Headings:** one `<h1>` per page with a logical `<h2>` and `<h3>` order.
- **Meta keywords:** a short, relevant keyword list on every page (for example `sourdough bread, custom cakes, Polokwane bakery` on the home page and `bakery opening hours, bakery location` on the contact page), kept to 5 to 8 phrases each to avoid keyword stuffing.
- **Images:** descriptive file names (`hearth-grain-bakery-logo.png`, `classic-sourdough.jpg`, `chocolate-cake.jpg` and so on), descriptive alt text on every image, lazy loading, width and height attributes, and a compressed logo.
- **Crawling:** `robots.txt` and `sitemap.xml` (replace the placeholder domain after deployment).
- **Local SEO:** LocalBusiness structured data (JSON-LD) on the home page, with phone number and opening hours.
- **Internal linking:** navigation, footer links and call-to-action buttons connect all pages.
- **Mobile-friendly:** responsive layout and viewport tag on every page.
- **Off-page plan:** claim a Google Business Profile, list the bakery in local directories, share products and cakes on social media, and get links from local community sites.

## 7. Accessibility

- Every form field has a visible `<label>`, and error messages are linked with `aria-describedby` and announced with `aria-live`.
- Clear focus outlines on links, buttons and fields.
- Buttons for the menu, lightbox and accordion have accessible names and `aria-expanded` where needed.
- Colours were chosen for readable contrast, and animations are disabled for `prefers-reduced-motion`.

## 8. Project Structure

```
health-grain/
├── index.html
├── about.html
├── product.html
├── gallery.html
├── enquiry.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── hearth-grain-bakery-logo (png), plus -160 and -320 sizes in png and webp
│   └── products/
│       └── classic-sourdough.jpg, butter-croissant.jpg, blueberry-muffin.jpg,
│           cinnamon-roll.jpg, chocolate-cake.jpg, carrot-cake.jpg
└── screenshots/
```

## 9. How to Run and Deploy

**Run locally**
1. Clone the repository: `git clone https://github.com/leoninc1/health-grain.git`
2. Open `index.html` in a browser, or use the VS Code Live Server extension.

**Optional: send enquiries for real**
Create a free form at Formspree and replace `YOUR_FORM_ID` in the `action` of `enquiry.html`.

**Settings you can edit** (top of `js/script.js`): `RECIPIENT_EMAIL`, `RATES` (prices and notice periods) and `BAKERY_COORDS` (map location).

**Deploy**
The site is static, so it can be hosted free. Using GitHub Pages: open the repository on GitHub, go to Settings, then Pages, choose the `main` branch and the root folder, and save. Using Netlify: choose "Import an existing project", connect the GitHub repository and deploy with no build command. After deploying, replace the placeholder domain in `sitemap.xml` and `robots.txt`, and put the live link at the top of this README.

## 10. Notes and Limitations

- The bakery is fictional. The phone number, email address, prices, notice periods and the map location are placeholders.
- Product and gallery photos are from Unsplash and are examples only.
- The contact form opens the visitor's email app rather than sending from a server, because the site is static.
- Enquiry submissions are simulated until a Formspree ID is added.

---

## 11. Working Through Feedback

### Part 2 feedback (81 / 100)

| Feedback received | What I changed |
|-------------------|----------------|
| Changelog "detailed but could be improved" (Part 1 feedback, 7 / 10) | The changelog below now lists every file, what changed, and why |
| No README document provided (0 / 5) | Created this README with the project overview, features, design notes, testing, deployment and changelog |
| No changelog provided (0 / 5) | Added the changelog in section 12 |
| No references provided (0 / 5) | Added a Harvard-style reference list in section 13 |
| Navigation menu adjustments "present but could be improved" (4 / 5) | Replaced the stacked links on small screens with a hamburger button and dropdown menu, with larger touch areas, `aria-expanded`, and closing on link click, Esc or resize |
| Typography adjustments "present but could be improved" (5 / 5, with a comment) | Headings now scale with `clamp()`, body text is slightly smaller on phones, line height was set for readability, and form fields use a 16px or larger font so phones do not zoom in |

---

## 12. Changelog

### Part 2: CSS styling and responsive design
| File | Change | Reason |
|------|--------|--------|
| `css/style.css` | Rebuilt the stylesheet around the real class names used in the HTML (`.navbar`, `.nav-links`, `.hero`, `.features`, `.page-header`, `.content`, `.contact`, `.form-section`) | The original template styled elements that did not exist in the pages, so several sections had no styling |
| `css/style.css` | Added CSS variables for colour, shadows, radius and fonts | One place to change the theme and consistent styling |
| `css/style.css` | Replaced semi-transparent colour values with solid colours | The old values made the navigation and headings partly see-through |
| `css/style.css` | Added hover, focus and active styles for links, buttons and fields | Interactive elements need visible feedback |
| `css/style.css` | Added breakpoints for tablet and phone with a multi-column to single-column layout | Responsive design requirement |
| All pages | Linked every page to `css/style.css` | External stylesheet requirement |

### Part 3: functionality and SEO
| File | Change | Reason |
|------|--------|--------|
| all pages | Renamed the logo to `images/hearth-grain-bakery-logo.png` and added resized `-160` and `-320` versions in PNG and WebP | The original filename (a ChatGPT date stamp) had spaces and commas, was not descriptive for SEO, and the file was 1.8 MB |
| all pages | Added a `<meta name="keywords">` tag with page-specific keywords | SEO: relevant keywords for each page |
| `product.html`, `gallery.html`, `js/script.js` | Product and gallery images now load from `images/products/` using descriptive names such as `classic-sourdough.jpg`, with the online photo as a backup if a file is missing | SEO image file names and faster loading |
| all pages | Added `<picture>`, `srcset`, `sizes`, width and height to the logo | Responsive images and less layout shift |
| all pages | Added a Gallery link, hamburger menu button, a four-column footer and a favicon | Navigation and consistency |
| all pages | Added a unique title, meta description and Open Graph tags | SEO |
| `index.html` | Added LocalBusiness structured data | Local SEO |
| `about.html` | Added a FAQ accordion | Interactive element |
| `product.html` | Replaced six hardcoded cards with a JavaScript-generated grid with search, category filter and sort | Dynamic content and search |
| `product.html` | Removed the inline `<style>` block and moved its rules into `style.css` | All styling in one external stylesheet |
| `gallery.html` | New page with an image grid and lightbox | Gallery lightbox requirement |
| `enquiry.html` | Added quantity and date fields, an `action` attribute, `novalidate` and a result area | Form functionality and validation |
| `contact.html` | Added a contact form (name, email, phone, message type, message) | Contact form requirement |
| `contact.html` | Replaced the Google Maps iframe with a Leaflet map and marker | Interactive map |
| `contact.html` | Fixed the uppercase `<P>` tag and spacing in the contact details | Clean, valid HTML |
| `js/script.js` | Rewrote from a single alert into validation, quote calculation, AJAX submission, email builder, product grid, lightbox, accordion, scroll reveal, map and mobile menu | All Part 3 JavaScript features |
| `css/style.css` | Added styles for the footer, products page, forms, errors, result panels, accordion, gallery, lightbox, map and mobile menu | Styling for the new features |
| `robots.txt`, `sitemap.xml` | New files | Crawling and indexing |
| `README.md` | New project documentation | README requirement |

---

## 13. References

Bake This Happen (n.d.) *Three must-haves for your baking business website*. Available at: https://www.bakethishappen.com/blog/three-must-haves-for-your-baking-business-website (Accessed: 31 October 2026).

Canva (n.d.) *Logo maker*. Available at: https://www.canva.com/create/logos/ (Accessed: 31 October 2026).

Google (n.d.) *Google Fonts: Playfair Display and Lato*. Available at: https://fonts.google.com (Accessed: 31 October 2026).

Google Search Central (n.d.) *Search engine optimization (SEO) starter guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 31 October 2026).

Leaflet (2023) *Leaflet: an open-source JavaScript library for interactive maps*. Available at: https://leafletjs.com (Accessed: 31 October 2026).

MDN Web Docs (n.d.) *Client-side form validation; Fetch API; Intersection Observer API; Responsive images*. Available at: https://developer.mozilla.org (Accessed: 31 October 2026).

OpenStreetMap contributors (n.d.) *OpenStreetMap*. Available at: https://www.openstreetmap.org/copyright (Accessed: 31 October 2026).

Unsplash (n.d.) *Free photographs*. Available at: https://unsplash.com (Accessed: 31 October 2026).

Wix (n.d.) *Cafe and bakery website templates*. Available at: https://www.wix.com/website/templates/html/restaurants-food/cafe-bakery (Accessed: 31 October 2026).
