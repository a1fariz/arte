# 📋 PROJECT_SPEC.md — Arte (Oxford Classic White Gallery)

## 1. 📌 Overview
- **Nama Project:** Arte
- **Konsep:** Personal Art Gallery & Collection Manager
- **Tujuan:** Aplikasi frontend untuk manage dan showcase koleksi artwork/foto dengan tampilan elegan, klasik, dan modern.
- **Target:** Memenuhi 100% ketentuan UAS React Fundamental & layak dipajang di portfolio.

## 2. 🛠 Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (100% utility-first, zero custom CSS class)
- **Routing:** React Router DOM
- **State Management:** Context API + useState
- **Persistence:** localStorage
- **Animation:** Framer Motion + Tailwind Transitions
- **Deployment:** Vercel

## 3. 🎨 Design System (Oxford Classic White)

### Color Palette
- **Primary Background:** `Ivory` (`#FAF9F6`) — *Putih krem lembut di mata.*
- **Secondary Background:** `Parchment` (`#F4F1EA`) — *Untuk section alternatif/sidebar.*
- **Card Background:** `Pure White` (`#FFFFFF`) — *Buat kontras card di background ivory.*
- **Text Primary:** `Dark Sepia` (`#2C2A26`) — *Tinta, hitam agak cokelat.*
- **Text Secondary:** `Faded Brown` (`#6B6356`) — *Meta info, deskripsi.*
- **Accent (Active/Hover):** `Oxford Brass` (`#B8932E`) — *Emas tua/brass.*
- **Border:** `Warm Light Gray` (`#E6E1D6`) — *Pembatas lembut.*

### Typography
- **Headings (Hero, Page Title, Artwork Title):** `Playfair Display` (Serif classic)
- **Body & UI (Text biasa, Form, Button, Pagination):** `Inter` (Sans-serif modern)

### CSS Setup
```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
```

## 4. 📁 Struktur Folder
```text
src/
├── assets/              
├── components/          
│   ├── layout/          # Navbar, Footer, Layout
│   ├── ui/              # Button, Input, Badge, Pagination
│   ├── ArtworkCard.jsx  
│   ├── Lightbox.jsx     
│   └── ConfirmDialog.jsx
├── context/
│   └── GalleryContext.jsx
├── data/
│   └── dummyData.js
├── pages/
│   ├── Dashboard.jsx
│   ├── GalleryPage.jsx
│   ├── ArtworkDetail.jsx
│   ├── ArtworkForm.jsx
│   └── NotFound.jsx
├── utils/
│   └── storage.js
├── App.jsx
└── index.css
```

## 5. 📄 Data Model
- **artworks:** `id, title, artist, year, category, medium, description, image_url, is_favorite, created_at`
- **collections:** `id, name, description, cover_image`
- **categories:** `Renaissance, Impressionism, Modern, Photography, Sculpture, Abstract`

## 6. 🛣 Routing (React Router)
1. `/` → **Dashboard** (Stats: Total Artworks, Favorites, Collections + Grid "Featured")
2. `/gallery` → **Gallery** (Main grid + Search + Filter by Category + Sort by Year/Title + Pagination)
3. `/gallery/:id` → **Detail** (Big image + metadata + description)
4. `/gallery/add` → **Form Tambah**
5. `/gallery/:id/edit` → **Form Edit**
6. `*` → **404 Not Found**

## 7. ✨ Animasi & Microinteractions
- **Page Transition:** Fade + Slide up saat pindah route (`AnimatePresence`)
- **Grid Item Mount:** Staggered fade in (item muncul bergantian)
- **Card Hover:** Gambar `scale(1.05)`, border jadi `brass`, shadow muncul
- **Lightbox:** Backdrop fade-in, image scale-up dari posisi card
- **Filter/Search:** Item yang ke-filter fade-out, sisa reflow smoothly (Framer `layout` prop)

## 8. ✅ Pemenuhan Syarat UAS
- [x] **JSX & Komponen:** Navbar, Card, Form, Pagination, Layout
- [x] **Props:** Card terima data, Form terima fungsi `onSubmit`
- [x] **Styling:** Tailwind CSS (Responsive grid, Oxford Classic White)
- [x] **List Rendering:** `.map()` dengan `key` unik
- [x] **Conditional Rendering:** Empty state, search not found, loading, form add vs edit
- [x] **Event Handling:** `onClick`, `onChange`, `onSubmit`
- [x] **State Management:** `useState` untuk search, filter, sort, page, edit data
- [x] **CRUD:** Add, Read, Update, Delete + Confirm delete modal
- [x] **Filter & Search:** Real-time `.filter()` by title/category
- [x] **Sorting:** `.sort()` by Year, Title A-Z
- [x] **Pagination:** `Math.ceil`, Prev/Next, active state
- [x] **Context API:** `GalleryContext` buat global state & CRUD functions
- [x] **React Router:** 6+ pages, `useParams`, Not Found
- [x] **Deployment:** Vercel + `README.md` lengkap

## 9. 📝 Step-by-Step Pengerjaan
1. Init project Vite + React + Tailwind.
2. Setup fonts & Tailwind config (Oxford Classic White).
3. Bikin data dummy 20+ artworks bertema sejarah/lukisan klasik.
4. Bikin Context API + localStorage helper.
5. Bikin Layout (Navbar/Footer) & Routing.
6. Bikin Components (Card, Pagination, Lightbox, dll).
7. Bikin Pages (Dashboard, Gallery, Detail, Form).
8. Masukin Framer Motion buat animasi.
9. Final check & deploy Vercel.
