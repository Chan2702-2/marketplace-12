Bro, ini prompt yang lebih lengkap dan detail. Tinggal copy-paste ke Claude, GPT, Gemini, atau AI coding lainnya.

---

# PROMPT

Create a complete **Marketplace Website** using **HTML5 + Tailwind CSS + Vanilla JavaScript**, fully responsive and optimized for deployment on **Vercel Static Hosting**.

## Technology Stack

* HTML5
* Tailwind CSS (CDN)
* Vanilla JavaScript
* LocalStorage
* Font Awesome Icons
* Unsplash Images
* No React
* No Bootstrap
* No jQuery
* No backend
* Clean and reusable code

---

# DESIGN STYLE

Modern UI inspired by:

* Tokopedia
* Shopee
* Amazon
* Apple Website

Requirements:

* White background
* Orange primary color (#FF6B00)
* Rounded corners
* Shadow-md cards
* Smooth hover animation
* Glassmorphism effects
* Responsive desktop, tablet, and mobile
* Sticky navbar
* Beautiful spacing
* Premium e-commerce appearance

---

# NAVBAR

Sticky top navigation containing:

* Marketplace logo
* Home
* Products
* Categories
* About
* Contact
* Search bar
* Dark mode toggle
* User icon
* Shopping cart icon with badge counter

Navbar should collapse into hamburger menu on mobile.

---

# HOME PAGE (index.html)

### Hero Section

Large headline:

```text
Find Your Favorite Products
```

Subtitle:

```text
Shop smarter with our modern marketplace.
```

Buttons:

* Shop Now
* Explore Products

Hero image from Unsplash.

---

### Categories Section

Display cards:

* Electronics
* Fashion
* Home & Living
* Accessories
* Sports
* Beauty

Each card contains:

* Icon
* Title
* Hover animation

---

### Featured Products

Display 12 products in grid layout.

Each card contains:

* Product image
* Product title
* Category
* Rating
* Price
* Favorite icon
* Add to Cart button

Use images from Unsplash.

---

### Testimonials

3 customer cards with:

* Profile image
* Name
* Review
* Star rating

---

### Newsletter

Email subscription form.

---

### Footer

Contains:

* About Us
* Contact
* FAQ
* Privacy Policy
* Terms of Service
* Social media icons

---

# PRODUCTS PAGE (products.html)

Show all products.

Features:

### Search Product

Real-time search.

### Category Filter

Dropdown:

* All
* Electronics
* Fashion
* Home
* Accessories
* Sports
* Beauty

### Sorting

* Latest
* Price Low to High
* Price High to Low
* Highest Rating

### Grid Layout

Responsive:

Desktop:

* 4 columns

Tablet:

* 2 columns

Mobile:

* 1 column

---

# PRODUCT DETAIL PAGE (product-detail.html)

Display:

Large image gallery

Product title

Category badge

Price

Star rating

Description

Features list

Quantity selector

Buttons:

* Add to Cart
* Buy Now

Related products section

---

# CART PAGE (cart.html)

Display:

Product image

Product title

Quantity buttons

Increase quantity

Decrease quantity

Remove product

Price

Subtotal

Total price

Coupon input

Checkout button

Cart data must be saved using LocalStorage.

---

# CHECKOUT PAGE (checkout.html)

Customer information:

Full Name

Email

Phone Number

Address

City

Postal Code

Payment Method:

* Bank Transfer
* E-Wallet
* Cash On Delivery

Order Summary

Place Order button

After success:

Show toast notification.

---

# ABOUT PAGE

Company information

Mission

Vision

Statistics section

Team members

---

# CONTACT PAGE

Contact form:

Name

Email

Message

Google Maps section

Social media icons

---

# PRODUCT DATA

Generate 30 dummy products.

Example:

* Wireless Headphones
* Mechanical Keyboard
* Smart Watch
* Gaming Mouse
* Bluetooth Speaker
* Laptop Backpack
* Office Chair
* Monitor
* Running Shoes
* Sunglasses
* Power Bank
* Desk Lamp

Use random images from Unsplash.

---

# JAVASCRIPT FEATURES

Implement:

### Product Search

Real-time filtering.

---

### Category Filter

Filter products by category.

---

### Sorting

Price ascending

Price descending

Highest rating

Latest products

---

### Shopping Cart

Add to Cart

Remove Item

Update Quantity

Cart Badge Counter

Total Price

LocalStorage persistence

---

### Favorite Product

Heart icon.

Save favorites using LocalStorage.

---

### Dark Mode

Save preference in LocalStorage.

---

### Toast Notifications

Success message when:

* Add to Cart
* Remove Item
* Checkout Success

---

### Loading Skeleton

Before products appear.

---

### Pagination

6 products per page.

---

### Empty State

Show illustration when no product found.

---

### Mobile Responsive

Hamburger menu.

---

### Smooth Animations

Transition effects.

Hover effects.

Fade animations.

---

# FILE STRUCTURE

```text
marketplace/

│
├── index.html
├── products.html
├── product-detail.html
├── cart.html
├── checkout.html
├── about.html
├── contact.html
│
├── css/
│      style.css
│
├── js/
│      app.js
│      products.js
│      cart.js
│      checkout.js
│      darkmode.js
│      search.js
│
├── data/
│      products.json
│
├── assets/
│      images/
│
└── components/
       navbar.html
       footer.html
```

---

# TAILWIND

Use CDN:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Configure:

```javascript
tailwind.config = {
theme: {
extend: {
colors: {
primary: "#FF6B00"
}
}
}
}
```

---

# IMPORTANT

Generate the FULL source code for every page.

Code must be:

* Clean
* Reusable
* Well organized
* Production-ready
* SEO friendly
* Responsive
* Compatible with Vercel
* Without backend
* Without React
* Without Bootstrap
* Without jQuery

Design should look like a modern marketplace similar to Tokopedia, Shopee, and Amazon with Apple-style premium UI and smooth animations.

---

Menurut gw, prompt ini sudah cukup untuk menghasilkan marketplace yang tampilannya sangat bagus dan profesional, bahkan bisa dijadikan proyek portfolio atau dikembangkan lagi menjadi marketplace dengan backend Laravel atau Supabase.
