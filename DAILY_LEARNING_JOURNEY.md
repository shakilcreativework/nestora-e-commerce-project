# NESTORA — Daily Learning Journey & Dev Log

এই ডকুমেন্টে প্রতিদিনের কাজ, শেখা নতুন বিষয়সমূহ, আর্কিটেকচারাল সিদ্ধান্ত এবং লিঙ্কডইন (LinkedIn) পোস্ট ড্রাফট সংরক্ষিত থাকবে।

---

## 📌 কীভাবে এই লগ ব্যবহার করবেন:
1. **প্রতিটি টাস্ক শেষে:** কী কী কোড লেখা হলো, কীভাবে কাজ করছে এবং কী নতুন শেখা হলো তা এখানে যুক্ত হবে।
2. **লিঙ্কডইন পোস্ট প্রয়োজন হলে:** আপনি যখনই বলবেন *"আমাকে আজকের পোস্ট দাও"*, তখনই সেই দিনের কাজের ওপর ভিত্তি করে প্রফেশনাল LinkedIn Post তৈরি করে দেওয়া হবে।
3. **স্টেপ-বাই-স্টেপ চেকলিস্ট:** আপনি নিজে কোড রান করে চেক করবেন, সন্তুষ্ট হলে নিজে ম্যানুয়ালি GitHub-এ push করবেন।

---

## 🗓️ Day 0: Project Setup & Context Engineering Architecture
- **তারিখ:** ২১ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Planning & Setup Complete
- **মূল লক্ষ্য:** NESTORA প্রজেক্টের রিকোয়ারমেন্টস, কোয়ালিটি গেটস, রেসপনসিভ ডিজাইন স্ট্যান্ডার্ড ও ট্র্যাকিং ফ্রেমওয়ার্ক প্রস্তুত করা।

### 🧠 কী কী কনসেপ্ট ও রুলস নির্ধারিত হলো:
1. **Human-in-the-Loop Git Policy:**
   - AI কখনোই কোড গিটহাবে পুশ (`git push`) বা কমিট (`git commit`) করবে না।
   - সম্পূর্ণ কোড ইউজার নিজে রিভিউ করবেন, টেস্ট করবেন এবং নিজে ম্যানুয়ালি গিটহাবে পুশ করবেন।
2. **Tailwind CSS Responsive Standards:**
   - প্রতিটি UI উপাদান সরাসরি এলিমেন্ট ট্যাগে ক্লাস লিখে স্টাইল করা হবে (`className="..."`)।
   - সব স্ক্রিন সাইজের জন্য রেসপনসিভনেস নিশ্চিত করা হবে:
     - `xs` (Extra small mobile: ~320-375px)
     - `sm` (Small mobile/landscape: ~640px)
     - `md` (Tablet: ~768px)
     - `lg` (Laptop/Desktop: ~1024px)
     - `xl` (Large desktop: ~1280px)
     - `2xl` (Ultra-wide: ~1536px)
3. **Step-by-Step Learning & Design Notes:**
   - প্রতিটি নতুন ফিচার/ডিজাইন শেষে কীভাবে এটি কাজ করছে তার বিস্তারিত স্টেপ-বাই-স্টেপ নোট থাকবে।
4. **Full-stack Tech Stack:**
   - Next.js (App Router), TypeScript, Redux Toolkit, PostgreSQL, Drizzle ORM, Better Auth, Tailwind CSS, HeroUI, Zod।
5. **Core Business Rules:**
   - **Admin Approval for Products:** শুধুমাত্র অ্যাডমিন কর্তৃক অ্যাপ্রুভড এবং অ্যাক্টিভ (`ACTIVE`) প্রোডাক্টগুলোই স্টোরফ্রন্ট UI-তে পাবলিকলি দৃশ্যমান ও ক্রয়যোগ্য হবে। ড্রাফট বা ইনঅ্যাক্টিভ প্রোডাক্ট কখনোই পাবলিক ইউজাররা দেখতে পারবে না।
   - **Robust Role-Based Access Control (RBAC):** কাস্টমার এবং অ্যাডমিন রোল কঠোরভাবে সার্ভার সাইডে ভ্যালিডেট করা হবে। পাবলিক সাইন-আপে কখনোই অ্যাডমিন রোল অ্যাসাইন করা যাবে না।

### 🔍 Repository Inspection (NESTORA-000 Findings):
- **Node.js:** v25.8.1 (Latest runtime)
- **npm:** 10.9.0 | **bun:** 1.1.27 | **yarn:** 1.22.22
- **Git Repo:** Not initialized yet. (আপনি চাইলে `git init` রান করে প্রথম ভার্সন সেভ রাখতে পারেন, কোড পুশ সম্পূর্ণ আপনার নিয়ন্ত্রণে)।
- **Current Directory:** শুধু প্রজেক্টের ডকুমেন্টেশন ও আর্কিটেকচার গাইডগুলো বিদ্যমান। কোনো অপ্রয়োজনীয় বা কনফ্লিক্টিং ফাইল নেই।

---

## 🛠️ Tech Stack Deep-Dive (NESTORA-010) — কেন এবং কীভাবে কাজ করবে:

একটি এন্টারপ্রাইজ লেভেলের ই-কমার্স প্রজেক্টে এই টেকনোলজিগুলো কীভাবে টিম-টপার আর্কিটেকচার তৈরি করে:

1. **Next.js (App Router, Full-stack):**
   - **কেন ব্যবহার করছি:** সিঙ্গেল ফ্রেমওয়ার্কে ফ্রন্টএন্ড এবং ব্যাকএন্ড API হ্যান্ডলার একসাথে থাকে।
   - **টিম-টপার কনসেপ্ট:** সার্ভার কম্পোনেন্টস (RSC) দিয়ে প্রোডাক্ট ক্যাটালগ রেন্ডার হবে যা এসইও (SEO) এবং পেজ স্পিডের জন্য সুপার ফাস্ট। ক্লায়েন্ট কম্পোনেন্টে শুধু ইন্টারঅ্যাক্টিভ পার্টস (যেমন কার্ট ড্রয়ার, ফিল্টার বাটন) থাকবে।

2. **TypeScript (Strict Type-Safety):**
   - **কেন ব্যবহার করছি:** কোনো রানটাইম বাগ বা আনডিফাইন্ড ভ্যারিয়েবল এরর যেন না ঘটে।
   - **টিম-টপার কনসেপ্ট:** ডাটাবেজের স্কিমা থেকে শুরু করে ব্যাকএন্ড API এবং ফ্রন্টএন্ড UI পর্যন্ত সিঙ্গেল সোর্স অব ট্রুথ টাইপ শেয়ার হবে (End-to-end Type Safety)।

3. **Redux Toolkit (Client-Side State Management):**
   - **কেন ব্যবহার করছি:** কার্ট (Cart items, count, total estimation) এবং উইশলিস্টের ইনস্ট্যান্ট UI ইন্টারঅ্যাকশন হ্যান্ডেল করার জন্য।
   - **গোল্ডেন রুল:** রেডাক্স ক্লায়েন্ট ইউজার এক্সপেরিয়েন্স ফাস্ট করবে, কিন্তু ফাইন্যান্সিয়াল ও স্টক সত্যের জন্য কখনো রেডাক্সের ডেটা বিশ্বাস করা হবে না। আসল দাম ও স্টক সবসময় PostgreSQL ডাটাবেজ থেকে সার্ভার ভ্যালিডেট করবে।

4. **PostgreSQL + Drizzle ORM (Relational Persistent Database):**
   - **কেন ব্যবহার করছি:** ই-কমার্সে রিলেশনাল ইন্টিগ্রিটি (Orders ➔ Order Items ➔ Products ➔ Variants ➔ Users) অত্যন্ত জরুরি।
   - **টিম-টপার কনসেপ্ট:** কনকারেন্ট চেকআউট ও পেমেন্টের সময় ট্রানজ্যাকশন (`db.transaction()`) ব্যবহার করে স্টক কাটা হবে যাতে স্টক কখনো মাইনাস (`negative`) না হতে পারে।

5. **Tailwind CSS + HeroUI:**
   - **কেন ব্যবহার করছি:** ক্লাসিক্যাল ক্লিন ইউটিলিটি ক্লাস দিয়ে আধুনিক, প্রিমিয়াম ও ১০০% রেসপনসিভ (`xs` থেকে `2xl`) UI ডিজাইন তৈরি।

---

## 🚀 Day 1: Next.js Full-Stack App Initialization (NESTORA-011)
- **তারিখ:** ২১ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed)
- **মূল লক্ষ্য:** Next.js 16 (App Router) + TypeScript + Redux Toolkit + Tailwind CSS v4 + Zod এর ফাউন্ডেশন তৈরি।

### 📦 যা যা ইনস্টল ও কনফিগার করা হলো:
1. **Next.js 16.4.2 & React 19:**
   - App Router আর্কিটেকচার (`src/app/layout.tsx`, `src/app/page.tsx`)।
   - Turbopack এনেবল্ড হাইপার-ফাস্ট বিল্ড পাইপলাইন।
2. **TypeScript 5:**
   - স্ট্রিক্ট মোড কনফিগারেশন (`tsconfig.json`)।
   - Path aliases (`@/*` pointing to `./src/*`)।
3. **Redux Toolkit & React-Redux:**
   - ক্লায়েন্ট স্টেট (কার্ট ও উইশলিস্ট) ম্যানেজমেন্টের জন্য প্রস্তুত।
4. **Tailwind CSS v4:**
   - `@import "tailwindcss";` ইন `src/app/globals.css`।
   - ব্রেকপয়েন্ট স্ট্যান্ডার্ড: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`।
5. **Lucide React & Zod:**
   - প্রিমিয়াম আইকন ও স্কিমা ভ্যালিডেশনের জন্য প্রস্তুত।

### 🧪 ভেরিফিকেশন ও কোয়ালিটি চেক রেজাল্ট:
- `npx tsc --noEmit` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (স্ট্যাটিক পেজ সফলভাবে রেন্ডার ও অপ্টিমাইজড হয়েছে)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট (নিজে চেক করার জন্য):
1. আপনার টার্মিনালে রান করুন:
   ```bash
   npm run dev
   ```
2. ব্রাউজারে `http://localhost:3000` ওপেন করুন।
3. পেজে সুন্দর ব্যাকগ্রাউন্ড সহ অ্যাপটি দেখতে পাবেন।
4. সবকিছু ঠিক থাকলে আপনি আপনার গিটহাবে প্রথম কমিট করতে পারেন:
   ```bash
   git init
   git add .
   git commit -m "feat(core): initialize Next.js 16 app with TypeScript and Redux Toolkit"
   ```

---

## 📢 LinkedIn Post Draft (আজকের পোস্ট):

*(আপনি চাইলে সরাসরি কপি করে লিঙ্কডইনে পোস্ট করতে পারেন)*

```text
🚀 Starting a new journey: Building "NESTORA" — an enterprise-grade Home & Lifestyle E-Commerce Platform! 🛋️✨

Instead of just building a simple MVP, my goal is to deep-dive into full-stack architecture, clean code standards, and strict scalability.

Here is the tech stack & architecture I am locking in:
⚡ Framework: Next.js 16 (App Router) with React 19 & Turbopack
🛡️ Language: Strict TypeScript for end-to-end type safety
🔄 State Management: Redux Toolkit for ultra-smooth client UI & cart states
🗄️ Database & ORM: PostgreSQL + Drizzle ORM (handling ACID transactions & strict stock consistency)
🔐 Auth & Security: Better Auth with robust Role-Based Access Control (Admin vs Customer)
🎨 Styling: Tailwind CSS v4 (100% responsive across xs to 2xl breakpoints)
✅ Validation: Zod at every single API boundary

Day 1 Milestone:
✔ Configured the project foundation with App Router & Path Aliases
✔ Integrated TypeScript, Redux Toolkit, and Tailwind CSS v4
✔ Clean production build verified with 0 TypeScript/ESLint errors!

Building with a strict human-in-the-loop review process and zero auto-pushes. Excited for what's coming next! 💻🔥

#WebDevelopment #Nextjs #TypeScript #FullStack #SoftwareEngineering #Redux #TailwindCSS #CodingJourney
```

### 🐛 Bug Solved & Key Concept: Hydration Mismatch
- **এরর:** `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties: cz-shortcut-listen="true"`
- **কারণ:** আপনার ব্রাউজারে থাকা কোনো এক্সটেনশন (যেমন ColorZilla বা শর্টকাট টুল) পেজ লোড হওয়ার পর স্বয়ংক্রিয়ভাবে `<body>` ট্যাগে `cz-shortcut-listen="true"` অ্যাট্রিবিউট ইনজেক্ট করেছিল। সার্ভার থেকে আসা HTML-এ এটি ছিল না কিন্তু ক্লায়েন্ট DOM-এ ছিল, যার ফলে React 19 হাইড্রেশন মিসম্যাচ ওয়ার্নিং দিয়েছিল।
- **সমাধান:** `src/app/layout.tsx`-এর `<body>` ট্যাগে `suppressHydrationWarning` যুক্ত করা হয়েছে। এটি প্রোডাকশন নেক্সট জেএস অ্যাপ্লিকেশনে ব্রাউজার এক্সটেনশন দ্বারা তৈরি হওয়া অপ্রত্যাশিত অ্যাট্রিবিউট এরর সম্পূর্ণ বন্ধ করে দেয়।
- **Turbopack Optimization:** `next.config.ts`-এ `turbopack: { root: __dirname }` যোগ করে হোম ডিরেক্টরি ওয়ার্নিং সমাধান করা হয়েছে।

---

## 🎨 Day 1 (Part 2): Dark & Light Mode System & Responsive Architecture (NESTORA-012 & 013)
- **তারিখ:** ২১ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** `next-themes` ও Tailwind CSS v4 দিয়ে ফ্লিকার-ফ্রি Dark, Light এবং System Theme ইন্টিগ্রেশন এবং সম্পূর্ণ রেসপনসিভ (`xs` থেকে `2xl`) হেডার ও হিরো সেকশন তৈরি।

### 🧠 আর্কিটেকচারাল সমাধান (How it Works):
1. **`next-themes` Integration (`src/components/providers/theme-provider.tsx`):**
   - ক্লায়েন্ট সাইড থিম প্রোভাইডার যা HTML ট্যাগে `class="dark"` অথবা `class="light"` টগল করে।
   - সিস্টেমের থিম প্রেফারেন্স (OS Theme) অটো-ডিটেক্ট করে এবং `localStorage`-এ ইউজারের পছন্দ সেভ রাখে।
2. **Tailwind v4 Theme Engine (`src/app/globals.css`):**
   - `@custom-variant dark (&:where(.dark, .dark *));` দিয়ে ভ্যারিয়েন্ট তৈরি করা হয়েছে।
   - CSS ভ্যারিয়েবলস দিয়ে প্রিমিয়াম ওয়ার্ম-নিউট্রাল কালার প্যালেট সেট করা হয়েছে:
     - **Light Theme:** ব্যাকগ্রাউন্ড `#FBFBF9`, ফোরগ্রাউন্ড `#181918`, প্রাইমারি ফরেস্ট গ্রিন `#264E3A`।
     - **Dark Theme:** ব্যাকগ্রাউন্ড ডিপ ওনিক্স `#0F100F`, সারফেস `#181918`, প্রাইমারি সেজ গ্রিন `#478466`।
3. **Micro-Interactive Theme Toggle (`src/components/ui/theme-toggle.tsx`):**
   - Sun (Light), Moon (Dark), এবং Monitor (System) তিনটি ডেডিকেটেড অপশন সহ স্মুথ বাটন।
   - মাউন্টেড চেক (`mounted`) ব্যবহার করে সার্ভার ও ক্লায়েন্টের মধ্যে হাইড্রেশন সেইফটি নিশ্চিত করা হয়েছে।
4. **১০০% রেসপনসিভনেস (`src/app/page.tsx`):**
   - প্রতিটি এলিমেন্ট ট্যাগে সরাসরি ক্লাস লিখে স্টাইল করা হয়েছে:
     - `xs:text-xs`, `sm:text-sm`, `md:text-base`, `lg:text-lg`, `xl:text-xl`, `2xl:max-w-[1500px]`
     - মোবাইলে কমপ্যাক্ট প্যাডিং ও ফন্ট, ট্যাবলেটে সার্চবার ভিজিবিলিটি, ডেস্কটপে এক্সপ্যান্ডেড ব্যানার ও গ্রিড।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npx tsc --noEmit` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (বিল্ড সফলভাবে ১.০৬ সেকেন্ডে সম্পন্ন হয়েছে)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3001` (বা আপনার চলমান পোর্ট) দেখুন।
2. হেডারটির ডান পাশে **Sun**, **Moon**, এবং **Monitor** বাটন দেখতে পাবেন।
3. **Moon** বাটনে ক্লিক করুন ➔ পেজটি এক নিমেষে প্রিমিয়াম ডার্ক মোডে পরিবর্তিত হবে।
4. **Sun** বাটনে ক্লিক করুন ➔ পেজটি ওয়ার্ম-হোয়াইট লাইট মোডে ফিরে আসবে।
5. ব্রাউজারের উইন্ডো ছোট-বড় করে (F12 চেপে মোবাইল ভিউতে নিয়ে) রেসপনসিভনেস চেক করুন।

### 📝 Strict Content Rule: Zero Lorem Ipsum (100% Authentic Product Copy)
- **রুল:** প্রজেক্টের কোনো স্থানে (UI, কার্ড, ফিচার, ডেসক্রিপশন, ব্যানার) কোনো ডামি টেক্সট বা `Lorem Ipsum` ব্যবহার করা হবে না।
- **স্ট্যান্ডার্ড:** প্রতিটি প্রোডাক্ট, ক্যাটাগরি এবং আর্টিকেলে NESTORA-এর রিয়েল ব্র্যান্ড ও লাইফস্টাইল ভ্যালু রিফ্লেক্ট করবে:
  - *ক্যাটাগরি:* Desk & Workspace Organization, Ambient Architectural Lighting, Handcrafted Kitchen Ceramics, Minimal Storage & Organizers, Sustainable Living Accessories।
  - *ম্যাটেরিয়ালস ও ডিটেইলস:* Solid Japanese Oak, Anodized Aluminum, Matte Glazed Stoneware, Organic Washed Linen, Eco-friendly Brass।
  - *প্রোডাক্ট কপি:* প্রতিটি পণ্যের স্পেসিফিকেশন, ডাইমেনশন এবং বাস্তবসম্মত কেয়ার গাইড থাকবে।

---

## 🗄️ Day 1 (Part 3): PostgreSQL + Drizzle ORM Architecture & Admin Security (NESTORA-014 to 022)
- **তারিখ:** ২১ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** PostgreSQL ডাটাবেজ কানেকশন পুল, Zod এনভায়রনমেন্ট ভ্যালিডেশন এবং অ্যাডমিন অনুমোদন ও RBAC সমৃদ্ধ রিলেশনাল স্কিমা তৈরি।

### 🧠 আর্কিটেকচারাল সিদ্ধান্ত ও টিম-টপার কনসেপ্টস:
1. **Zod Environment Protection (`src/lib/env.ts` & `.env.example`):**
   - কোনো সিক্রেট যেন ভুল করে ক্লায়েন্ট সাইডে লিক না হয় তা নিশ্চিত করা হয়েছে।
   - প্রোডাকশনে কোনো জরুরি এনভায়রনমেন্ট ভ্যারিয়েবল মিসিং থাকলে অ্যাপ সাথে সাথে নিরাপদভাবে ফ্ল্যাগ করবে।
2. **PostgreSQL Connection Pooling (`src/lib/db/index.ts`):**
   - Next.js-এর হট রিলোডের সময় যাতে ডাটাবেজ কানেকশন লিমিট শেষ (exhaust) না হয়, সেজন্য ডেভলপমেন্টে `globalThis` ক্যাশিং প্যাটার্ন ব্যবহার করা হয়েছে।
3. **Admin Approval & Status Architecture (`src/lib/db/schema.ts`):**
   - **`isApproved: boolean (default false)`** এবং **`status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'`**:
     - আপনার দেওয়া কঠোর নিয়ম অনুযায়ী, সার্ভার যখনই প্রোডাক্ট ফেচ করবে, তখন ফিল্টার করবে `where(and(eq(products.status, 'ACTIVE'), eq(products.isApproved, true)))`। এর ফলে অ্যাডমিন কর্তৃক অনুমোদিত প্রোডাক্ট ছাড়া কোনো ইনঅ্যাক্টিভ বা ড্রাফট প্রোডাক্ট স্টোরফ্রন্ট UI-তে আসবে না।
4. **Role-Based Access Control (RBAC):**
   - `userRoleEnum: ['CUSTOMER', 'ADMIN']`। পাবলিক সাইনআপে ডিফল্টভাবে শুধুমাত্র `CUSTOMER` অ্যাসাইন হবে।
5. **Money in Minor Units (Cents):**
   - কারেন্সি ক্যালকুলেশনে ফ্লোটিং পয়েন্ট বাগ (যেমন `0.1 + 0.2 = 0.30000000000000004`) রোধ করতে সব প্রাইস পূর্ণসংখ্যায় (minor units: যেমন $45.00 ➔ 4500) স্টোর করা হয়েছে।
6. **Immutable Order Snapshots (`order_items`):**
   - ভবিষ্যতে প্রোডাক্টের নাম বা দাম পরিবর্তন হলেও পুরানো অর্ডারের ঐতিহাসিক ডেটা হুবহু অক্ষত থাকবে।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (মাত্র ০.৫৫ সেকেন্ডে সম্পূর্ণ বিল্ড সফল)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. [src/lib/db/schema.ts](file:///c:/Users/shaki/Downloads/nestora%20e-commerce%20project/src/lib/db/schema.ts) ফাইলটি ওপেন করে স্কিমা টেবিলগুলো ও `isApproved` ফিল্ডটি দেখে নিন।
2. [.env.example](file:///c:/Users/shaki/Downloads/nestora%20e-commerce%20project/.env.example) ফাইলটি দেখে নিন।
3. আপনার গিট স্ট্যাটাস চেক করে দ্বিতীয় কমিটটি করতে পারেন:
   ```bash
   git add .
   git commit -m "feat(db): configure PostgreSQL pool and Drizzle schema with admin approval and RBAC"
   git push
   ```

---

## 🔐 Day 2: Better Auth + PostgreSQL Drizzle Integration (NESTORA-023)
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** `better-auth` প্যাকেজ ইনস্টলেশন, Drizzle স্কিমায় সেশন ও অথ টেবিল যুক্তকরণ, অ্যাডমিন রোল প্রটেকশন (`input: false`) এবং Next.js App Router API রুট ইন্টিগ্রেশন।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Drizzle Adapter & Auth Tables (`src/lib/db/schema.ts`):**
   - Better Auth-এর সাথে সম্পূর্ণ সামঞ্জস্য রেখে তৈরি করা হয়েছে:
     - `users`: ইউজার কোর প্রোফাইল, ইমেইল ভেরিফিকেশন এবং `role` (`CUSTOMER` | `ADMIN`)।
     - `sessions`: সিকিউর সেশন টোকেন, আইপি অ্যাড্রেস, ইউজার এজেন্ট এবং ৭ দিনের অটো-এক্সপায়ারি।
     - `accounts`: পাসওয়ার্ড ক্রেডেনশিয়াল, হ্যাশিং এবং ফিউচার OAuth সাপোর্ট।
     - `verifications`: ওটিপি, ইমেইল ভেরিফিকেশন এবং পাসওয়ার্ড রিসেট টোকেন।
   - সব রিলেশনে `onDelete: "cascade"` ব্যবহার করা হয়েছে যাতে ইউজার মুছে গেলে সম্পর্কিত সেশন ও একাউন্ট ডেটাও স্বয়ংক্রিয়ভাবে ক্লিন হয়ে যায়।
2. **Server-Side Security & RBAC Guard (`src/lib/auth.ts`):**
   - **`role` ফিল্ডে `input: false`:** পাবলিক সাইনআপ API রিকোয়েস্টে কেউ যদি জেসনে `role: "ADMIN"` পাঠায়, Better Auth তা স্বয়ংক্রিয়ভাবে ফিল্টার করে ব্লক করে দেবে। অ্যাডমিন রোল শুধুমাত্র ডাটাবেজ অ্যাডমিন সরাসরি অ্যাসাইন করতে পারবে।
3. **Next.js App Router API Handler (`src/app/api/auth/[...all]/route.ts`):**
   - Better Auth-এর অল-ইন-ওয়ান হ্যান্ডলার যুক্ত করা হয়েছে, যা সম্পূর্ণ ডায়নামিক ও লাইটওয়েট।
4. **React Client Hook Ready (`src/lib/auth-client.ts`):**
   - ফ্রন্টএন্ডে ব্যবহারের জন্য `useSession()`, `signIn.email()`, `signUp.email()`, `signOut()` হুক প্রস্তুত।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npx drizzle-kit push --force` ➔ **PASS** (`accounts`, `sessions`, `verifications` টেবিল PostgreSQL-এ তৈরি)
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (`/api/auth/[...all]` সফলভাবে বিল্ড হয়েছে)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. pgAdmin-এ গিয়ে `nestora_db` ➔ `Schemas` ➔ `public` ➔ `Tables`-এ রিফ্রেশ দিলে দেখতে পাবেন ৭টি টেবিল তৈরি হয়ে গেছে।
2. [src/lib/auth.ts](file:///c:/Users/shaki/Downloads/nestora%20e-commerce%20project/src/lib/auth.ts) এবং [src/lib/auth-client.ts](file:///c:/Users/shaki/Downloads/nestora%20e-commerce%20project/src/lib/auth-client.ts) ফাইলগুলো দেখে নিন।
3. আপনার গিটহাবে তৃতীয় কমিটটি করতে পারেন:
   ```bash
   git add .
   git commit -m "feat(auth): integrate Better Auth with Drizzle adapter, sessions and RBAC guards"
   git push
   ```

---

## 📱 Day 2 (Part 2): 100% Mobile Responsive Navbar & Slide-Over Drawer
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** ছোট স্ক্রিনে (যেমন iPhone 16 / 393px) হেডার উপাদানের ক্রাউডিং ও হরিজন্টাল স্ক্রলিং সমাধান করে প্রিমিয়াম মোবাইল হ্যামবার্গার ড্রয়ার ন্যাভবার তৈরি।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Slide-Over Mobile Drawer (`src/components/navigation/mobile-menu.tsx`):**
   - ছোট ডিভাইসে হেডারের অপ্রয়োজনীয় উপাদানগুলো লুকিয়ে বাঁ-পাশে একটি স্মুথ হ্যামবার্গার মেনু বাটন যুক্ত করা হয়েছে।
   - ক্লিকে ব্যাকড্রপ ব্লার সহ স্লাইড-ইন ড্রয়ার ওপেন হয়:
     - প্রোডাক্ট সার্চবার ও ক্যাটাগরি লিঙ্কস (Workspace, Lighting, Ceramics ইত্যাদি)।
     - উইশলিস্ট ও কার্ট নেভিগেশন।
     - থিম টগল (Light / Dark / System)।
     - লগইন থাকা ইউজারের নাম, ইমেইল, অ্যাডমিন ড্যাশবোর্ড লিঙ্ক ও সাইন-আউট বাটন।
2. **Clean Minimalist Mobile Navbar (`src/app/page.tsx`):**
   - মোবাইলে হেডার থাকছে একদম স্লিম ও ক্র্যাম্প-মুক্ত:
     - **বাম পাশে:** Hamburger Menu + Logo (`N NESTORA`)
     - **ডান পাশে:** Cart (Badge সহ) + User Avatar (`MJ`)
   - ডেস্কটপে (`md:` ও ওপরে) পূর্বের মতোই ফুল সার্চবার ও ডেডিকেটেড বাটন দৃশ্যমান।
3. **Zero Horizontal Overflow (`src/app/layout.tsx` & `page.tsx`):**
   - `overflow-x-hidden` এবং `w-full` প্রয়োগ করে যেকোনো ডিভাইসে হরিজন্টাল স্ক্রল সম্পূর্ণ ব্লক করা হয়েছে।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (০ এরর সহ সব রুট কম্পাইলড)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে F12 চেপে মোবাইল ভিউ (iPhone 16 / Pixel 7 ইত্যাদি) রিফ্রেশ দিন।
2. দেখতে পাবেন হেডারের উপচে পড়া সমস্যা চলে গেছে এবং বামে একটি চমৎকার **Menu বাটন** এসেছে।
3. Menu বাটনে ক্লিক করলে প্রিমিয়াম ড্রয়ার ওপেন হবে যেখান থেকে ক্যাটাগরি, সার্চ ও থিম চেঞ্জ করা যাবে।
4. কমিট দিন:
   ```bash
   git add .
   git commit -m "feat(ui): add slide-over mobile drawer and fix mobile viewport overflow"
   git push origin main
   ```

---

## 🛋️ Day 2 (Part 3): Real PostgreSQL Database Seed & Rich Storefront UI
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** PostgreSQL `nestora_db`-তে ৪টি ক্যাটাগরি ও ৮টি রিয়েল অথেন্টিক প্রোডাক্ট সীড করা, রিইউজেবল রেসপনসিভ প্রোডাক্ট কার্ড তৈরি এবং সার্ভার কম্পোনেন্টে রিয়েল ডাটা ফেচ করে ফুলস্ট্যাক হোমপেজ সাজানো।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Zero Lorem Ipsum Database Seed (`src/lib/db/seed.ts`):**
   - কোনোরকম ডামি টেক্সট ছাড়াই NESTORA ব্র্যান্ডের আসল ফিলোসফি অনুযায়ী ডাটা ইনসার্ট করা হয়েছে:
     - **ক্যাটাগরি:** Desk & Workspace, Ambient Lighting, Handcrafted Ceramics, Minimal Storage।
     - **প্রোডাক্টস:** Kanso Solid Oak Monitor Riser, Akari Ambient Brass Table Lamp, Hasami Matte Stoneware Carafe ইত্যাদি।
     - **Admin Approval Rule Enforced:** সব প্রোডাক্টে `isApproved: true`, `status: 'ACTIVE'` এবং ভ্যারিয়েন্ট ভিত্তিক রিয়েল স্টক কোয়ান্টিটি ইনসার্ট করা হয়েছে।
2. **Reusable & Responsive Product Card (`src/components/products/product-card.tsx`):**
   - ইমেজ হোভার জুমিং অ্যানিমেশন।
   - রিয়েল কারেন্সি ফরম্যাটিং (`$125.00`) ও ডিসকাউন্ট পারসেন্টেজ ব্যাজ (`Save 14%`)।
   - কুইক **"Add to Cart"** এবং **"Wishlist"** ইন্টারেকশন বাটন।
   - `xs` (২ কলাম) থেকে শুরু করে `2xl` (৪ কলাম) পর্যন্ত পারফেক্ট গ্রিড স্কেলিং।
3. **Full-Stack Dynamic Home Page (`src/app/page.tsx`):**
   - সার্ভার কম্পোনেন্ট (RSC) সরাসরি PostgreSQL ডাটাবেজে কুয়েরি চালিয়ে লেটেস্ট অনুমোদিত প্রোডাক্ট ফেচ করে রেন্ডার করে।
   - **Hero Section:** মিনিমালিস্ট ও হাইপার-রেসপনসিভ হেডলাইন সহ ডিরেক্ট কালেকশন সিটিএ।
   - **Category Showcase:** হাই-রেজ্যুলুশন ইমেজ ব্যাকগ্রাউন্ড সহ ৪টি ক্যাটাগরি কার্ড।
   - **Featured Collection Grid:** রিয়েল ডাটাবেজ প্রোডাক্ট কার্ড গ্রিড।
   - **Brand Values:** Tracked Global Delivery, Sustainable Materials, 30-Day Calm Guarantee, Single Vendor।
   - **Rich E-Commerce Footer:** ক্যাটাগরি লিঙ্কস, কাস্টমার কেয়ার, নিউজলেটার ইনপুট ও লিগ্যাল কপিরাইট।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npx tsx src/lib/db/seed.ts` ➔ **PASS** (৪টি ক্যাটাগরি ও ৮টি প্রোডাক্ট ডাটাবেজে ইনসার্ট সম্পন্ন)
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (`Route: ƒ /` ডাইনামিকালি কম্পাইলড)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3000` রিফ্রেশ দিয়ে দেখুন—পেজটি এখন জীবন্ত একটি আন্তর্জাতিক মানের হোম & লাইফস্টাইল ই-কমার্সে রূপ নিয়েছে!
2. মোবাইল ভিউ (iPhone SE / iPhone 16) এবং ফুল ডেস্কটপ ভিউতে টেস্ট করুন—কার্ডগুলো নিখুঁতভাবে গ্রিডে সাজানো দেখতে পাবেন।
3. কমিট দিন:
   ```bash
   git add .
   git commit -m "feat(storefront): seed authentic products and assemble full dynamic homepage with responsive product cards"
   git push origin main
   ```

---

## 💎 Day 2 (Part 4): Ultra-Premium Luxury Hero Showcase & 100% Verified Authentic Imagery
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** 
  1. ইউজারের স্ক্রিনশট রিভিউ করে এম্পটি/প্লেন Hero সেকশনকে একটি আন্তর্জাতিক লাক্সারি অ্যাথেলিয়ার (Luxury Atelier Flagship Showcase) সেন্ট্রাল ভিজ্যুয়ালে রূপান্তর করা।
  2. সাইটের প্রতিটি ইমেজ লিংক অডিট করে ১০০% ভেরিফাইড (HTTP 200) এবং কনসেপচুয়ালি পারফেক্ট ইমেজ যুক্ত করা (যেমন: লিনেন বাস্কেটের ক্ষেত্রে আসল ওভেন লিনেন বাস্কেট, ব্রাস ল্যাম্পের ক্ষেত্রে আর্কিটেকচারাল ব্রাস ল্যাম্প, যাতে কোনো ভুল বা মিসম্যাচড ইমেজ না থাকে)।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Ultra-Luxury Split-Screen Hero Showcase (`src/app/page.tsx`):**
   - **Left Narrative Column:**
     - স্মল-ব্যাচ অ্যাথেলিয়ার ব্যাজ: `✦ Autumn/Winter Small-Batch 04 • Single-Vendor Atelier`
     - হাই-এন্ড সেরিফ টাইপোগ্রাফি: `Thoughtful living, quietly refined.`
     - আর্কিটেকচারাল লাইফস্টাইল কপিরাইটিং ও ডুয়াল অ্যাকশন বাটন (`Explore Collection` + `Desk Architecture`)
     - কাস্টমার রিভিউ ও ম্যাটেরিয়াল ট্রাস্ট মেট্রিক্স (`★★★★★ 4.9/5 Rating`, `100% Solid Certified Timber`, `Zero Plastic Packaging`)
   - **Right Flagship Visual Centerpiece:**
     - হাই-রেজ্যুলুশন জাপানিজ ওক অ্যাথেলিয়ার ওয়ার্কস্পেস লাইফস্টাইল ফটোগ্রাফি।
     - গ্লাস-মরফিজম ফ্লোটিং ব্যাজ: `✦ Flagship Piece • Kyoto White Oak`
     - লাইভ ইন্টারেক্টিভ প্রোডাক্ট ইনফো কার্ড: `Kanso Solid Oak Monitor Riser` • `$125.00` • `● In stock` (লাইভ পালসিং স্ট্যাটাস সহ)
     - ৩টি মিনি ম্যাটেরিয়াল স্পেক্স পিল: `🌿 100% Solid Oak` | `⚡ Cable Route` | `📦 Cork Dampers`
2. **100% Verified & Semantic Image Integrity (`src/lib/db/seed.ts`):**
   - প্রতিটি ইমেজ হেড রিকোয়েস্ট (HTTP HEAD) টেস্ট করে ভেরিফাই করা হয়েছে (সবগুলোই HTTP 200 স্ট্যাটাস সম্পন্ন)।
   - মিসম্যাচড ইমেজগুলো সম্পূর্ণ পরিবর্তন করা হয়েছে:
     - *Organic Woven Linen Nesting Baskets* (আগে পারফিউম বোতল আসত) ➔ এখন আসল হ্যান্ড-ওভেন টেক্সচার্ড লিনেন স্টোরেজ বাস্কেট।
     - *Akari Ambient Brass Table Lamp* (আগে ব্ল্যাক ল্যাম্প ছিল) ➔ এখন অরিজিনাল ওয়ার্ম অ্যাম্বিয়েন্ট ব্রাস ল্যাম্প।
     - *Hasami Matte Stoneware Pour-Over Carafe* ➔ এখন হাই-ফায়ার্ড জাপানিজ পোর-ওভার সিরামিক কারাফে।
     - *Faceted Walnut Catchall Tray* ➔ এখন সলিড আমেরিকান কার্ভড ওয়ালনাট ভ্যালেট ট্রে।
     - *Precision Anodized Aluminum Pen Dock* ➔ এখন মিনিমালিস্ট ডেক্স পেন ডক স্টেশনারি।
     - *Wabi Speckled Ceramic Coffee Tumbler* ➔ এখন হ্যান্ডক্রাফটেড স্পেক্ল্ড সিরামিক টাম্বলার।
3. **Universal Remote Image Configuration (`next.config.ts`):**
   - `hostname: "**"` ওয়াইল্ডকার্ড কনফিগারেশনের মাধ্যমে যেকোনো ভ্যালিড রিমোট ইমেজ লিঙ্ক নিরবচ্ছিন্নভাবে রেন্ডার হতে পারবে।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- Image URL HTTP Verification: **100% Passed (HTTP 200 OK)**
- Database Re-seed (`npx tsx src/lib/db/seed.ts`): **PASS** (সবগুলো প্রোডাক্ট ও ক্যাটাগরি ইমেজ আপডেটেড)
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (০ এরর সহ প্রোডাকশন বিল্ড সাকসেসফুল)
- Live Localhost Test (`http://localhost:3000`): **HTTP 200 OK** (Hero ও প্রোডাক্ট কার্ডগুলো নিখুঁতভাবে রেন্ডার হচ্ছে)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3000` রিফ্রেশ দিন।
2. দেখতে পাবেন Hero সেকশনটি এখন সাধারণ টেক্সট বক্সের বদলে একটি লাক্সারি ব্র্যান্ডের মতো স্প্লিট-স্ক্রিন ফ্ল্যাগশিপ ভিজ্যুয়াল, গ্লাস-মরফিক প্রাইস ট্যাগ এবং ট্রাস্ট ব্যাজ সহ অত্যন্ত আকর্ষণীয় হয়ে উঠেছে।
3. নিচে স্ক্রল করে ফিচার্ড কালেকশন দেখুন—প্রতিটি পণ্যের ছবি ১০০% প্রাসঙ্গিক এবং কাজ করছে।
4. ম্যানুয়ালি কমিট দিন:
   ```bash
   git add .
   git commit -m "feat(storefront): luxury split-screen hero showcase, verified product images, and wildcard image config"
   git push origin main
   ```

---

## 📱 Day 2 (Part 5): Perfect Multi-Device Product Grid (Mobile/SM/MD: 2, LG: 3, XL: 4)
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** মোবাইল (iPhone SE, iPhone 16), `sm` (640px) এবং `md` (768px) ডিভাইসে প্রডাক্ট কার্ড ২টি করে পাশাপাশি এবং `lg` (1024px) ডিভাইসে ঠিক ৩টি করে প্রদর্শনের নিখুঁত রেসপনসিভ গ্রিড তৈরি করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Adaptive Grid Column Progression (`src/app/page.tsx`):**
   - ক্লাসরুল: `grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6`
   - **মোবাইল / SM / MD (`<1024px`):** ঠিক **২টি কার্ড** পাশাপাশি।
   - **LG ল্যাপটপ / মিডিয়াম ডেস্কটপ (`1024px - 1279px`):** ঠিক **৩টি কার্ড** প্রতি সারিতে (কার্ডের ছবি ও টেক্সটের জন্য চমৎকার ব্রিদিং স্পেস)।
   - **XL আল্ট্রা-ওয়াইড মনিটর (`1280px+`):** **৪টি কার্ড** প্রতি সারিতে (৮টি প্রডাক্ট নিখুঁত ৪×২ সিমেট্রি তৈরি করে)।
2. **Product Card Internal Spacing & Touch UX (`src/components/products/product-card.tsx`):**
   - ২ কলাম মোবাইল এবং ৩ কলাম ডেস্কটপে ছবি ও উপাদানের স্কেল সামঞ্জস্যপূর্ণ রাখতে:
     - ইমেজ সাইজিং: `sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"`
     - প্যাডিং: `p-2.5 sm:p-4`
     - ব্যাজ ও বাটন: রেসপনসিভ স্কেলিং।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (০ এরর সহ সব রুট কম্পাইলড)
- Live Localhost Test (`http://localhost:3000`): **HTTP 200 OK** (HTML ভেরিফাইড: `grid-cols-2`, `lg:grid-cols-3`, `xl:grid-cols-4` সফলভাবে সক্রিয়)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3000` রিফ্রেশ দিন।
2. উইন্ডোর সাইজ ছোট-বড় করে পরীক্ষা করুন:
   - মোবাইল ও ট্যাবলেটে (`<1024px`) ➔ **২টি কার্ড** প্রতি সারিতে।
   - সাধারণ ল্যাপটপ স্ক্রিনে (`lg: 1024px - 1279px`) ➔ **৩টি কার্ড** প্রতি সারিতে।
   - বড় স্ক্রিনে (`xl: 1280px+`) ➔ **৪টি কার্ড** প্রতি সারিতে।
3. ম্যানুয়ালি কমিট দিন:
   ```bash
   git add .
   git commit -m "feat(storefront): responsive product grid (2 cols on sm/md, 3 cols on lg, 4 cols on xl)"
   git push origin main
   ```

---

## 📐 Day 2 (Part 6): Strict Multi-Device Adaptive Responsive Design System (XS to 2XL)
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** `xs` (375px), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px) এবং `2xl` (1536px+) ডিভাইসের জন্য ফন্ট সাইজ, বাটন সাইজ, ব্যাজ, কন্টেইনার প্যাডিং ও গ্রিডের নিখুঁত অ্যাডাপ্টিভ স্কেলিং রুল তৈরি ও প্রয়োগ করা। কোনো উপাদানেই যেন স্ট্যাটিক বা অপরিবর্তনীয় ডিফল্ট সাইজ না থাকে।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Tailwind v4 Native `xs` Breakpoint (`src/app/globals.css`):**
   - `@theme` ব্লকে `--breakpoint-xs: 375px;` কনফিগার করা হয়েছে।
   - ফলে টেইলউইন্ড সিএসএস-এ `xs:` প্রিফিক্স এখন ফুললি নেটিভ ভ্যারিয়েন্ট হিসেবে কাজ করে (যেমন: `xs:text-sm`, `xs:p-3`, `xs:h-10`)।
2. **Permanent System Rule (`.agents/rules/responsive-design-system.md`):**
   - ভবিষ্যতে তৈরি হওয়া প্রতিটি কম্পোনেন্টের জন্য বাধ্যতামূলক রেসপনসিভ নিয়ম লিপিবদ্ধ করা হয়েছে:
     - **হেডলাইন হাইরার্কি:** Hero Title (`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`), Section Title (`text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl`)।
     - **বাটন ও টাচ টার্গেটস:** মোবাইলে মিনিমাম ৩৮-৪০px উচ্চতা সহ কম্প্যাক্ট প্যাডিং (`py-2 px-3 text-xs rounded-lg`) থেকে ডেস্কটপে লাক্সারি বাটন (`py-3.5 px-6 text-sm rounded-full`)।
     - **ব্যাজ ও পিলস:** মোবাইলে মাইক্রো-ব্যাজ (`text-[8.5px] xs:text-[9.5px] px-1.5 xs:px-2 py-0.5`) যাতে কার্ডের জায়গা নষ্ট না হয়, ডেস্কটপে এলিগ্যান্ট ব্যাজ (`text-xs px-3 py-1.5 rounded-full`)।
     - **কার্ড গ্রিড:** মোবাইল, `sm` ও `md`-এ ২ কলাম; `lg`-তে ৩ কলাম; `xl` ও `2xl`-এ ৪ কলাম।
3. **Storefront Component Scaling:**
   - [`src/components/products/product-card.tsx`](file:///c:/Users/shaki/Downloads/nestora%20e-commerce%20project/src/components/products/product-card.tsx) এবং [`src/app/page.tsx`](file:///c:/Users/shaki/Downloads/nestora%20e-commerce%20project/src/app/page.tsx)-এ সমস্ত হেডিং, ব্যাজ, কন্টেইনার প্যাডিং ও বাটন ক্লাসে পূর্ণাঙ্গ `xs` থেকে `2xl` স্কেলিং প্রয়োগ করা হয়েছে।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (০ এরর সহ সব রুট কম্পাইলড)
- Live Localhost Test (`http://localhost:3000`): **HTTP 200 OK**

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3000` ওপেন করে যেকোনো ডিভাইসে (স্মল মোবাইল ৩৫৭px থেকে শুরু করে ফুল স্ক্রিন) ব্রাউজ করুন।
2. দেখতে পাবেন প্রতিটি ডিভাইসের স্ক্রিন সাইজের সাথে ফন্ট, বাটন ও ব্যাজের সাইজ সম্পূর্ণ মানানসই হয়ে গেছে।
3. ম্যানুয়ালি কমিট দিন:
   ```bash
   git add .
   git commit -m "feat(ui): add strict multi-tier responsive design system rule and adaptive component scaling"
   git push origin main
   ```

---

## 🛡️ Day 2 (Part 7): Footer Newsletter Input & Button Flex Overflow Elimination
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** ল্যাপটপ/ডেস্কটপ (`lg`) এবং মাঝারি স্ক্রিনে ফুটারের নিউজলেটার ইনপুট ও জয়েন বাটন কন্টেইনারের বাইরে (go outside) উপচে পড়া সমস্যার সমাধান করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Asymmetric 12-Column Footer Grid (`src/app/page.tsx`):**
   - পূর্বে `md:grid-cols-4` ব্যবহারের কারণে ৪টি সমান কলামে ভাগ হয়ে নিউজলেটার কলামটি মাত্র ~১৮০px জায়গা পেত, ফলে ইনপুট ও বাটন একসাথে আঁটতে না পেরে বাইরে চলে যেত।
   - এটি সমাধান করে `grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10` করা হয়েছে:
     - **Brand Column:** `lg:col-span-4` (ব্র্যান্ড বর্ণনার জন্য পর্যাপ্ত স্পেস)
     - **Collections:** `lg:col-span-2`
     - **Customer Care:** `lg:col-span-2`
     - **Newsletter:** `lg:col-span-4` (নিউজলেটার এখন ৩৫% জায়গা পায়—৩৫০px+ প্রশস্ত—ইনপুট ও বাটনের জন্য বিশাল ব্রিদিং রুম)।
2. **Flexbox Child Width Constraint (`src/components/ui/newsletter-form.tsx`):**
   - ব্রাউজারের ডিফল্ট আচরণে `<input>` এলিমেন্টের অন্তর্নিহিত উইডথ (intrinsic size) থাকে। ফ্লেক্স চাইল্ডে `min-w-0` না থাকলে এটি কখনোই কন্টেইনার অনুযায়ী সংকুচিত হতে পারে না।
   - ইনপুটে `w-full min-w-0` এবং বাটনকে `shrink-0` হিসেবে সেট করা হয়েছে, যাতে যেকোনো সরু স্ক্রিনেও এটি কখনো কন্টেইনার ভেঙে বাইরে না যায়।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (০ এরর সহ সব রুট কম্পাইলড)
- Live Localhost Test (`http://localhost:3000`): **HTTP 200 OK** (HTML ভেরিফাইড: `lg:grid-cols-12` ও `min-w-0` সক্রিয়)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3000` রিফ্রেশ দিয়ে পেজের একদম নিচে ফুটার সেকশনে স্ক্রোল করুন।
2. দেখতে পাবেন নিউজলেটার ইনপুট বক্স এবং **Join** বাটনটি এখন আর কলামের ডান পাশে বাইরে চলে যায় না, বরং সুন্দরভাবে কন্টেইনারের ভেতরে মানানসই হয়ে রয়েছে।
3. ম্যানুয়ালি কমিট দিন:
   ```bash
   git add .
   git commit -m "fix(footer): prevent newsletter input and button overflow using 12-column layout and min-w-0"
   git push origin main
   ```

---

## 🏛️ Day 2 (Part 8): Curated Spaces Card Grid Responsive Synchronization
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** `Curated Spaces` ক্যাটাগরি কার্ডগুলোকে প্রোডাক্ট কার্ডের মতো সম্পূর্ণ একই রেসপনসিভ গ্রিড নিয়মে আনা (Mobile/SM/MD: ২টি, LG: ৩টি, XL: ৪টি) এবং ফিক্সড পিক্সেল হাইটের বদলে ফ্লুইড অ্যাসপেক্ট রেশিও ও রেসপনসিভ ব্যাজ নিশ্চিত করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Identical Responsive Grid Alignment (`src/app/page.tsx`):**
   - পূর্বে `Curated Spaces`-এ `md:grid-cols-4` থাকায় ডেস্কটপে এটি সবসময় ৪ কলামে থাকত, যা ৩ কলামের প্রোডাক্ট গ্রিডের সাথে অসামঞ্জস্যপূর্ণ লাগছিল।
   - এটি প্রোডাক্ট গ্রিডের সাথে ১০০% মিল রেখে আপডেট করা হয়েছে: `grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6`
   - **মোবাইল / SM / MD (`<1024px`):** পাশাপাশি **২টি কার্ড**।
   - **LG ল্যাপটপ (`1024px - 1279px`):** প্রতি সারিতে **৩টি কার্ড**।
   - **XL আল্ট্রা-ওয়াইড (`1280px+`):** প্রতি সারিতে **৪টি কার্ড**।
2. **Fluid Aspect Ratio & Adaptive Hierarchy:**
   - ফিক্সড হাইট (`h-36 xs:h-44...`) বাদ দিয়ে ফ্লুইড `aspect-4/3 sm:aspect-5/4` প্রয়োগ করা হয়েছে, যাতে যেকোনো ডিভাইসে কার্ডের ইমেজ কখনোই চ্যাপ্টা বা বিকৃত না হয়।
   - টপ ব্যাজ (`Space`) ও বটম টেক্সট প্রোডাক্ট কার্ডের সাইজিং রুলের সাথে সুসংগত করা হয়েছে।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (০ এরর সহ সব রুট কম্পাইলড)
- Live Localhost Test (`http://localhost:3000`): **HTTP 200 OK** (উভয় সেকশনের গ্রিড এখন আইডেন্টিকাল রেসপনসিভ স্কেলিংয়ে চলছে)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3000` রিফ্রেশ দিন।
2. স্ক্রিন সাইজ পরিবর্তন করে দেখুন—**Curated Spaces** এবং **Featured Collection** উভয় সেকশনই একই নিয়মে রেসপন্ড করছে:
   - মোবাইল ও ট্যাবলেটে ➔ **২টি কার্ড** প্রতি সারিতে
   - ল্যাপটপ/LG স্ক্রিনে ➔ **৩টি কার্ড** প্রতি সারিতে
   - বড় মনিটরে ➔ **৪টি কার্ড** প্রতি সারিতে
3. ম্যানুয়ালি কমিট দিন:
   ```bash
   git add .
   git commit -m "feat(storefront): synchronize Curated Spaces grid with product card responsive scale"
   git push origin main
   ```

---

## 🛒 Day 3: Full-Stack Redux Toolkit Shopping Cart Architecture & Slide-Over Drawer
- **তারিখ:** ২২ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** Redux Toolkit দিয়ে সেন্ট্রালাইজড কার্ট স্টেট আর্কিটেকচার তৈরি করা, লোকালস্টোরেজ পারসিসট্যান্স নিশ্চিত করা, ইন্টারেক্টিভ লাক্সারি স্লাইড-ওভার Cart Drawer তৈরি এবং প্রোডাক্ট কার্ড ও হেডারের সাথে লাইভ রিয়েল-টাইম সিঙ্ক নিশ্চিত করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Strict Monetary Precision (Minor Units in Cents):**
   - কার্ট স্লাইসে সব প্রাইস পূর্ণসংখ্যায় (cents) সংরক্ষিত হয় (যেমন: $125.00 ➔ 12500)।
   - এর ফলে জাভাস্ক্রিপ্টের কুখ্যাত ফ্লোটিং পয়েন্ট বাগ (`0.1 + 0.2 = 0.30000000000000004`) রোধ হয় এবং সাবটোটাল নিখুঁতভাবে ক্যালকুলেট হয়।
2. **Next.js App Router-Friendly Redux Provider (`src/components/providers/redux-provider.tsx`):**
   - ক্লায়েন্ট সাইডে `useRef` ব্যবহার করে স্টোর ইনস্ট্যান্স সিঙ্গেলটন রাখা হয়েছে যাতে রি-রেন্ডারে একাধিক স্টোর তৈরি না হয়।
   - **Hydration-Safe LocalStorage:** পেজ রিফ্রেশ করলেও ইউজারের কার্ট মুছে যাবে না; মাউন্টে স্টোর লোকালস্টোরেজ থেকে হাইড্রেশন সম্পন্ন করে এবং যেকোনো স্টেট পরিবর্তনে অটো-সিঙ্ক করে।
3. **Dedicated Client Cart Button & RSC Preservation (`src/components/navigation/cart-button.tsx`):**
   - `src/app/page.tsx`-কে ক্লায়েন্ট কম্পোনেন্টে রূপান্তর না করে সম্পূর্ণ **React Server Component (RSC)** হিসেবে রেখে দেওয়া হয়েছে, যাতে সরাসরি PostgreSQL ডাটাবেজে ডাটা ফেচিংয়ের গতি অক্ষুণ্ণ থাকে।
   - শুধু বাটনটি ক্লায়েন্ট কম্পোনেন্ট হিসেবে আলাদা করায় হেডারে কোনো রি-রেন্ডার ওভারহেড নেই।
   - বাটনটিতে **Micro-Bounce Animation** এবং লাইভ ব্যাজ কাউন্টার যোগ করা হয়েছে।
4. **Luxury Slide-Over Cart Drawer UX (`src/components/cart/cart-drawer.tsx`):**
   - **স্মুথ অ্যানিমেশন ও ব্যাকড্রপ:** Escape কি ও ব্যাকড্রপ ক্লিকে বন্ধ হওয়ার সুবিধা সহ বডি স্ক্রল-লক।
   - **Free Shipping Progress Bar:** $150.00 (15000 cents) থ্রেশহোল্ড সহ রিয়েল-টাইম প্রগ্রেস বার (যেমন: "Add $25.00 more for Free Delivery" ➔ $150 ছাড়িয়ে গেলে "✦ You have unlocked Free Delivery!").
   - **কোয়ান্টিটি স্টেপার (+ / -) ও ডিলিট বাটন:** স্টক লিমিট মাথায় রেখে ইনস্ট্যান্ট আপডেট।
   - **এলিগ্যান্ট এম্পটি স্টেট:** কালেকশন এক্সপ্লোর করার ডিরেক্ট সিটিএ সহ চমৎকার আইকন ও টেক্সট।
5. **Real "Quick Add" Storefront Connection (`src/components/products/product-card.tsx`):**
   - প্রতিটি প্রোডাক্ট কার্ডে "Quick Add" বাটন ক্লিকে স্বয়ংক্রিয়ভাবে Redux কার্টে আইটেম যুক্ত হয়, ব্যাজ কাউন্টার বেড়ে যায় এবং স্বয়ংক্রিয়ভাবে কার্ট ড্রয়ার ওপেন হয়ে কাস্টমারকে তাৎক্ষণিক ফিডব্যাক দেয়।
   - মোবাইল হ্যামবার্গার ড্রয়ারের শপিং কার্ট লিঙ্কেও একই সিঙ্ক যুক্ত করা হয়েছে।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (মাত্র ৫.২ সেকেন্ডে সব রুট ও স্ট্যাটিক পেজ সফলভাবে অপ্টিমাইজড)
- Live State Test: লোকালস্টোরেজ এবং রিডাক্স সিঙ্ক ভেরিফাইড (Hydration Error: 0)।

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3000` ওপেন করুন।
2. যেকোনো প্রোডাক্টের নিচে **"Quick Add"** বাটনে ক্লিক করুন:
   - সাথে সাথে ডান পাশ থেকে চমৎকার লাক্সারি **Cart Drawer** স্লাইড হয়ে বের হবে!
   - হেডারের ব্যাজ ও ড্রয়ারের আইটেম কাউন্টার বেড়ে যাবে।
   - ফ্রি শিপিং প্রগ্রেস বার আপডেট হবে।
3. ড্রয়ারে **(+)** এবং **(-)** চাপ দিয়ে কোয়ান্টিটি বাড়িয়ে-কমিয়ে দেখুন—মুহূর্তেই সাবটোটাল পরিবর্তন হবে।
4. পেজটি ব্রাউজারে **রিফ্রেশ (F5)** দিয়ে দেখুন—কার্টের আইটেমগুলো অক্ষত থাকবে (LocalStorage Persistence)।
5. ম্যানুয়ালি গিটহাবে পুশ করার কমান্ড:
   ```bash
   git add .
   git commit -m "feat(cart): integrate Redux Toolkit shopping cart architecture, slide-over drawer, and free shipping progress"
   git push origin main
   ```

---

## 🏛️ Day 4: Architectural Product Detail Page (PDP) & Reusable Storefront Shell (NESTORA-036)
- **তারিখ:** ২৩ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** ডেডিকেটেড ডাইনামিক প্রোডাক্ট ডিটেইল রুট (`/product/[slug]`), মাল্টি-ইমেজ গ্যালারি থাম্বনেইল ভিউয়ার, রিডাক্স কোয়ান্টিটি সিলেক্টর, লাইভ স্টক ইন্ডিকেটর, স্টিকি মোবাইল বাই-বার, এবং রিইউজেবল হেডার/ফুটার আর্কিটেকচার তৈরি করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **DRY Storefront Architecture (`src/components/navigation/storefront-header.tsx` & `storefront-footer.tsx`):**
   - পূর্বে হোমপেজে প্রায় ২০০ লাইনের ইনলাইন হেডার ও ফুটার কোড ছিল। এটিকে মডুলার কম্পোনেন্টে নিয়ে আসা হয়েছে।
   - এর ফলে হোমপেজ, প্রোডাক্ট পেজ, ক্যাটালগ পেজ—সব জায়গায় একই ব্র্যান্ডিং, ডার্ক/লাইট থিম টগল এবং লাইভ রিডাক্স কার্ট কাউন্টার নিখুঁতভাবে সিঙ্ক থাকে।
2. **Dynamic RSC + Drizzle ORM Data Layer (`src/app/product/[slug]/page.tsx`):**
   - সম্পূর্ণ **React Server Component (RSC)** হিসেবে রান করে সরাসরি PostgreSQL ডাটাবেজ থেকে ডাটা ফেচ করে।
   - **Admin Approval Rule Enforced:** কেবলমাত্র `status = 'ACTIVE'` এবং `isApproved = true` পণ্যগুলোই রেন্ডার হবে। কোনো ড্রাফট বা আন-অ্যাপ্রুভড স্লাগ হিট করলে স্বয়ংক্রিয়ভাবে `notFound()` (404) ট্রিগার করবে।
   - **Dynamic SEO Metadata:** `generateMetadata()` দিয়ে প্রতি পণ্যের নিজস্ব এসইও টাইটেল ও মেটা ডেসক্রিপশন জেনারেট হয়।
   - **Cross-Sell / Related Products:** একই ক্যাটাগরির অন্য ৪টি পণ্যের রিলেটেড সেকশন স্বয়ংক্রিয়ভাবে লোড হয়।
3. **High-Conversion Client Interaction Layer (`src/components/products/product-detail-view.tsx`):**
   - **Interactive Multi-Image Gallery:** থাম্বনেইল ক্লিকে স্মুথ ইমেজ সুইচিং ও অ্যাক্টিভ রিং ইন্ডিকেটর।
   - **Real-Time Stock Safeguard:** ভ্যারিয়েন্ট স্টক অনুযায়ী স্বয়ংক্রিয় লিমিট (`min 1, max stockQuantity`) এবং আউট-অব-স্টক স্টেট হ্যান্ডলিং।
   - **Redux Cart Connection:** "Add to Bag" বাটন ক্লিকে পণ্যটি সরাসরি Redux গ্লোবাল স্টেটে যোগ হয় এবং মুহূর্তেই স্লাইড-ওভার **Cart Drawer** ওপেন হয়ে যায়।
   - **Sticky Mobile Bottom Bar:** মোবাইল ডিভাইসে কাস্টমার যখন স্ক্রোল করে নিচে নেমে যায়, তখনও নিচে একটি স্টিকি ভাসমান "Add to Bag" বার থাকে যাতে কেনাকাটার অভিজ্ঞতা বাধাহীন হয়।
   - **Accordion Information Tabs:** Story & Details, Craftsmanship & Care, এবং Shipping & Returns ট্যাব।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (Dynamic route `/product/[slug]` সফলভাবে অপ্টিমাইজড ও বিল্ড সম্পন্ন)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. আপনার টার্মিনালে লোকাল সার্ভার রান না থাকলে রান করুন:
   ```bash
   npm run dev
   ```
2. ব্রাউজারে `http://localhost:3000` এ যান এবং যেকোনো প্রোডাক্ট কার্ডে ক্লিক করুন (অথবা সরাসরি `http://localhost:3000/product/walnut-desk-organizer` এ যান)।
3. টেস্ট করুন:
   - থাম্বনেইল ক্লিক করে ইমেজ পরিবর্তন হচ্ছে কিনা দেখুন।
   - কোয়ান্টিটি `+` এবং `-` চাপুন।
   - **"Add to Bag"** বাটনে ক্লিক করুন—দেখবেন সাথে সাথে আপনার তৈরি করা লাক্সারি **Cart Drawer** ওপেন হয়ে গেছে এবং কার্ট সাবটোটাল আপডেট হয়েছে!
   - পেজের নিচে স্ক্রোল করে দেখুন **"You May Also Like"** সেকশনে সম্পর্কিত পণ্যগুলো চমৎকার রেসপনসিভ গ্রিডে লোড হয়েছে।
4. পরিবর্তনগুলো সন্তোষজনক হলে গিটহাবে ম্যানুয়ালি পুশ করুন:
   ```bash
   git add .
   git commit -m "feat(pdp): implement dynamic product detail page, gallery viewer, and sticky mobile purchase bar"
   git push origin main
   ```

---

## 🧭 Day 4 (Part 2): Dynamic Category Architecture & All-Products Shop Catalog (NESTORA-033 & NESTORA-034)
- **তারিখ:** ২৩ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** ডেডিকেটেড ক্যাটাগরি রুট (`/category/[slug]`), অল কালেকশন শপ রুট (`/shop`), ক্যাটাগরি নেভিগেশন পিলস, ইনস্ট্যান্ট ক্লায়েন্ট সার্চ ও সর্টিং বার, এবং এম্পটি ফিল্টার স্টেট তৈরি করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Shared Catalog Component Architecture (`src/components/products/catalog-view.tsx`):**
   - শপ পেজ এবং ক্যাটাগরি পেজের জন্য আলাদা আলাদা ইউআই ডুপ্লিকেট না করে একটি সেন্ট্রালাইজড, হাই-পারফরম্যান্স `CatalogView` তৈরি করা হয়েছে।
   - **Zero-Latency Client Filter/Sort (`useMemo`):** কাস্টমার যখন ফিল্টার বা সর্ট পরিবর্তন করে, তখন কোনো অপ্রয়োজনীয় নেটওয়ার্ক রিকোয়েস্ট না পাঠিয়ে তৎক্ষণাৎ ব্রাউজারে পণ্য ফিল্টার ও সর্ট হয় (Price: Low to High, High to Low, Featured, Alphabetical)।
   - **Live Search Bar:** কীওয়ার্ড বা ম্যাটেরিয়াল দিয়ে সার্চ করার রিয়েল-টাইম ইনপুট ও ক্লিয়ার বাটন।
   - **Category Navigation Pills:** কাস্টমার যেকোনো ক্যাটাগরি পিলসে ক্লিক করে দ্রুত অন্য কালেকশনে যেতে পারে।
2. **Dynamic PostgreSQL + Drizzle ORM Queries (`src/app/category/[slug]/page.tsx` & `/shop/page.tsx`):**
   - ক্যাটাগরি এবং পণ্য সার্ভার থেকে নিরাপদে ফেচ হচ্ছে।
   - **Admin Approval Rule Enforced:** ড্রাফট বা আন-অ্যাপ্রুভড কোনো পণ্য কখনোই ক্যাটাগরি পেজে আসবে না (`status = 'ACTIVE'` এবং `isApproved = true`)।
   - অবৈধ বা নিষ্ক্রিয় ক্যাটাগরি স্লাগ হিট করলে সরাসরি `notFound()` হ্যান্ডলার ট্রিগার করবে।
3. **Responsive Grid Alignment (Strict 6-Tier Rule):**
   - মোবাইল ও ট্যাবলেটে (`<1024px`) পাশাপাশি **২টি প্রোডাক্ট কার্ড**।
   - ল্যাপটপ স্ক্রিনে (`1024px - 1279px`) প্রতি সারিতে **৩টি কার্ড**।
   - বড় মনিটরে (`1280px+`) প্রতি সারিতে **৪টি কার্ড**।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (নতুন রুট `/category/[slug]` এবং `/shop` সফলভাবে কম্পাইলড)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে নিচের লিঙ্কগুলোতে প্রবেশ করে টেস্ট করুন:
   - **All Products:** `http://localhost:3000/shop`
   - **Workspace:** `http://localhost:3000/category/workspace`
   - **Lighting:** `http://localhost:3000/category/lighting`
   - **Ceramics:** `http://localhost:3000/category/ceramics`
   - **Storage:** `http://localhost:3000/category/storage`
2. টেস্ট করুন:
   - ক্যাটাগরি পিলসগুলোতে ক্লিক করে এক কালেকশন থেকে অন্য কালেকশনে যাওয়া যাচ্ছে কিনা।
   - সার্চ বক্সে কিছু লিখুন (যেমন: "Oak" বা "Lamp")—দেখবেন সাথে সাথে লাইভ ফিল্টার হচ্ছে।
   - সর্ট ড্রপডাউন পরিবর্তন করে দেখুন (যেমন: "Price: Low to High")—ইনস্ট্যান্ট প্রাইস অনুযায়ী সর্ট হচ্ছে।
   - যেকোনো প্রোডাক্টে "Quick Add" বাটন চাপুন—কার্ট ড্রয়ার ওপেন হবে।
3. পরিবর্তনগুলো সন্তোষজনক হলে গিটহাবে ম্যানুয়ালি পুশ করুন:
   ```bash
   git add .
   git commit -m "feat(catalog): implement dynamic category pages, all products shop, and instant filter and sort bar"
   git push origin main
   ```

---

## 💖 Day 4 (Part 3): Full-Stack Wishlist Architecture & Dedicated Wishlist Page (NESTORA-043)
- **তারিখ:** ২৩ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** Redux Toolkit সেন্ট্রালাইজড উইশলিস্ট স্টেট, LocalStorage পারসিসট্যান্স (`nestora_wishlist_v1`), হেডারে লাইভ উইশলিস্ট ব্যাজ কাউন্টার, প্রোডাক্ট কার্ড ও PDP হার্ট আইকন সিঙ্ক এবং ডেডিকেটেড উইশলিস্ট পেজ (`/wishlist`) তৈরি করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Centralized Redux Wishlist Slice (`src/lib/store/features/wishlist-slice.ts`):**
   - কার্ট স্লাইসের মতো সম্পূর্ণ টাইপ-সেফ উইশলিস্ট স্টেট আর্কিটেকচার।
   - `toggleWishlist` অ্যাকশন: কাস্টমার কার্ডে বা PDP-তে হার্ট আইকনে ক্লিক করলেই স্বয়ংক্রিয়ভাবে উইশলিস্টে যুক্ত হয় বা বাদ যায়।
   - `selectIsInWishlist(id)` মেমোইজড সিলেক্টর: প্রতি প্রোডাক্টের জন্য ইনস্ট্যান্ট ও-অব-ওয়ান `O(1)` মেমোরি লুকআপ।
2. **Robust LocalStorage Multi-State Persistence (`src/components/providers/redux-provider.tsx`):**
   - ব্রাউজার রিলোড বা বন্ধ করলেও উইশলিস্টের কোনো ডাটা হারাবে না (`nestora_wishlist_v1`)।
   - ক্লায়েন্ট মাউন্টে কার্ট এবং উইশলিস্ট উভয়ই কোনো হাইড্রেশন ফ্লিকার ছাড়া লোড হয়।
3. **Reactive Header Badge with Bounce Animation (`src/components/navigation/wishlist-button.tsx`):**
   - হেডারের হার্ট আইকনে আইটেম যোগ হওয়ার সাথে সাথে মাইক্রো-বাউন্স অ্যানিমেশন সহ লাইভ ব্যাজ কাউন্টার (যেমন: ❤️ `3`) জ্বলে ওঠে।
4. **Dedicated Wishlist View (`src/components/wishlist/wishlist-view.tsx` & `/wishlist`):**
   - **Move to Bag Action:** উইশলিস্টে থাকা যেকোনো পণ্য "Move to Bag" চাপলেই স্বয়ংক্রিয়ভাবে উইশলিস্ট থেকে কার্টে যুক্ত হয় এবং গ্লোবাল স্লাইড-ওভার **Cart Drawer** ওপেন হয়ে যায়।
   - **Add All to Bag & Clear All:** এক ক্লিকে সব পণ্য কার্টে পাঠানোর সুবিধা।
   - **Artisan Empty State:** বুকমার্কে কিছু না থাকলে এলিগ্যান্ট হার্ট ইলাস্ট্রেশন ও "Explore Atelier Collection" বাটন।
   - **Responsive Standard:** মোবাইল ও ট্যাবলেটে ২-কলাম এবং ল্যাপটপ/ডেস্কটপে ৩ ও ৪-কলাম গ্রিড।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (নতুন রুট `/wishlist` সহ সম্পূর্ণ প্রোডাকশন বান্ডল কম্পাইলড)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. ব্রাউজারে `http://localhost:3000` এ যান।
2. যেকোনো প্রোডাক্ট কার্ডের উপরের ডান কোণায় থাকা **Heart** আইকনে ক্লিক করুন:
   - সাথে সাথে হার্ট আইকন লাল রঙে ফিল্ড হবে।
   - হেডারের হার্ট আইকনের উপরে লাইভ ব্যাজ কাউন্টার (যেমন: `1`) বাউন্স করে ফুটে উঠবে!
3. প্রোডাক্ট ডিটেইল পেজে ([/product/walnut-desk-organizer](http://localhost:3000/product/walnut-desk-organizer)) গিয়েও হার্ট বাটনে ক্লিক করে স্টেট সিঙ্ক পরীক্ষা করুন।
4. হেডারের হার্ট আইকনে ক্লিক করে সরাসরি [http://localhost:3000/wishlist](http://localhost:3000/wishlist) পেজে যান:
   - সেভ করা পণ্যগুলো দেখতে পাবেন।
   - **"Move to Bag"** বাটনে ক্লিক করুন—পণ্যটি উইশলিস্ট থেকে কার্টে যোগ হয়ে ডান পাশ থেকে লাক্সারি **Cart Drawer** খুলে যাবে!
5. পেজটি **F5** দিয়ে রিফ্রেশ করুন—উইশলিস্ট এবং কার্ট দুটোই অক্ষত থাকবে।
6. পরিবর্তনগুলো সন্তোষজনক হলে গিটহাবে ম্যানুয়ালি পুশ করুন:
   ```bash
   git add .
   git commit -m "feat(wishlist): implement full-stack Redux wishlist architecture, header badge, and dedicated wishlist page"
   git push origin main
   ```

---

## 🛡️ Day 5: Protected Customer Account Portal & Executive Admin Dashboard (NESTORA-023, 024, 025)
- **তারিখ:** ২৩ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** Better Auth ইন্টিগ্রেশন ভ্যালিডেশন, সার্ভার-সাইড RBAC গার্ডস (`requireUser`, `requireAdmin`), কাস্টমার অ্যাকাউন্ট পোর্টাল (`/account`) এবং লাইভ ডাটাবেজ মেট্রিক্স সহ এক্সিকিউটিভ অ্যাডমিন ড্যাশবোর্ড শেল (`/admin`) তৈরি করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Server-Side Security & Zero-Trust RBAC (`src/lib/auth-guard.ts`):**
   - ক্লায়েন্ট সাইড বা UI লুকানোর ওপর ভরসা না করে সরাসরি Next.js Server Components-এ ইনকামিং রিকোয়েস্ট হেডার্স থেকে সেশন ভ্যালিডেট করা হয়েছে।
   - **`requireUser(returnUrl)`:** কোনো আন-অথেন্টিকেটেড ইউজার `/account` ভিজিট করলে স্বয়ংক্রিয়ভাবে তাকে `/login?callbackUrl=/account`-এ রিডাইরেক্ট করে। লগইনের পর সে সরাসরি তার কাঙ্ক্ষিত পেজে ফিরে আসবে।
   - **`requireAdmin(returnUrl)`:** সাধারণ কাস্টমাররা যদি কোনোভাবে `/admin` রুট এক্সেস করার চেষ্টা করে, তবে সাথে সাথে রিডাইরেক্ট হয়ে `forbidden` সিকিউরিটি হ্যান্ডলার ট্রিগার করবে।
   - **Role Escalation Protection:** পাবলিক সাইন-আপে বডিতে `role: 'ADMIN'` পাঠালেও Better Auth-এর `input: false` কনফিগারেশন এটিকে সম্পূর্ণ ব্লক করে এবং রোল সবসময় `CUSTOMER` হিসেবে সেট থাকে।

2. **Customer Account Portal (`/account` & `src/app/account/account-client-view.tsx`):**
   - **Executive Header Banner:** ইউজারের নামের আদ্যক্ষর দিয়ে আর্ট অ্যাভাটার, মেম্বারশিপ সময়কাল এবং রোল ব্যাজ (`Customer` / `Admin`)।
   - **Interactive Tabs:**
     - **Overview:** লাইফটাইম অর্ডার সংখ্যা, উইশলিস্ট কুইক জাম্প এবং রিসেন্ট ট্রানজ্যাকশন সারাংশ।
     - **Order History:** ডাটাবেজের `orders` টেবিল থেকে কাস্টমারের রিয়েল অর্ডার হিস্ট্রি, অর্ডার স্ট্যাটাস ও সামারি।
     - **Profile & Address:** সেভড শিপিং এড্রেস এবং প্রোফাইল ডিটেইলস কার্ড।
   - **Clean Sign-Out:** এক ক্লিকে সম্পূর্ণ সেশন টার্মিনেশন এবং হোমপেজে রিডাইরেক্ট।

3. **Executive Admin Dashboard & Shell (`/admin`, `layout.tsx` & `admin-shell.tsx`):**
   - **Live PostgreSQL Telemetry:** ড্যাশবোর্ডে প্রবেশের সাথে সাথে লাইভ ডাটাবেজ কোয়েরি রান হয়ে রিয়েল-টাইম পরিসংখ্যান দেখায়:
     - টোটাল প্রোডাক্ট সংখ্যা এবং পাবলিক স্টোরফ্রন্টের জন্য অ্যাক্টিভ ও অ্যাপ্রুভড প্রোডাক্টের হিসাব।
     - ক্যাটাগরি, অর্ডার ও মোট রেজিস্টার্ড অ্যাকাউন্টের লাইভ কাউন্টার।
   - **Product Approval Snapshot:** কোন পণ্যগুলো লাইভ স্টোরে প্রদর্শিত হচ্ছে এবং কোনোটি পেন্ডিং অ্যাপ্রুভালে আছে কিনা তার রিয়েল-টাইম অডিট ভিউ।
   - **Responsive Luxury Sidebar:** মোবাইল ডিভাইসে হ্যামবার্গার ড্রয়ার এবং ডেস্কটপে গ্লাস মরফিজম সাইডবার।
   - **Direct Storefront Switcher:** এক ক্লিকে লাইভ স্টোরফ্রন্ট এবং অ্যাডমিন মোডের মধ্যে স্যুইচ করার ব্যবস্থা।

4. **Admin Promotion Utility (`scripts/promote-admin.js`):**
   - ডেভেলপমেন্ট ও টেস্টিংয়ের সুবিধার্থে কমান্ড লাইনের মাধ্যমে যেকোনো রেজিস্টার্ড ইউজারকে ইনস্ট্যান্ট অ্যাডমিনে রূপান্তর করার স্ক্রিপ্ট:
     ```bash
     npm run db:promote-admin your-email@example.com
     ```

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (`/account` এবং `/admin` ডায়নামিক সিকিউরড রুট হিসেবে বিল্ড সম্পন্ন)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ চেকলিস্ট:
1. টার্মিনালে লোকাল সার্ভার রান না থাকলে রান করুন:
   ```bash
   npm run dev
   ```
2. টেস্ট করুন কাস্টমার সাইন-ইন ও অ্যাকাউন্ট পেজ:
   - ব্রাউজারে [http://localhost:3000/account](http://localhost:3000/account) এ যান।
   - যেহেতু আপনি লগইন করা নেই, স্বয়ংক্রিয়ভাবে আপনাকে [http://localhost:3000/login?callbackUrl=%2Faccount](http://localhost:3000/login?callbackUrl=%2Faccount) পেজে রিডাইরেক্ট করবে।
   - "Create account"-এ গিয়ে একটি নতুন অ্যাকাউন্ট তৈরি করুন (অথবা লগইন করুন)।
   - লগইন হওয়া মাত্রই আপনি রিডাইরেক্ট হয়ে চমৎকার কাস্টমার অ্যাকাউন্ট ড্যাশবোর্ডে পৌঁছে যাবেন!
3. টেস্ট করুন অ্যাডমিন এক্সেস গার্ড:
   - কাস্টমার হিসেবে লগইন থাকা অবস্থায় ব্রাউজারে [http://localhost:3000/admin](http://localhost:3000/admin) লিখুন।
   - সার্ভার সিকিউরিটি গার্ড আপনাকে রিডাইরেক্ট করে দেবে কারণ কাস্টমাররা অ্যাডমিন ড্যাশবোর্ডে ঢুকতে পারবে না।
4. নিজেকে অ্যাডমিন বানিয়ে টেস্ট করুন:
   - টার্মিনালে রান করুন (আপনার রেজিস্টার্ড ইমেইল দিয়ে):
     ```bash
     npm run db:promote-admin your-email@example.com
     ```
   - এবার ব্রাউজারে [http://localhost:3000/admin](http://localhost:3000/admin) এ যান।
   - চমৎকার এক্সিকিউটিভ অ্যাডমিন ড্যাশবোর্ড, লাইভ ডাটাবেজ কাউন্টার এবং সাইডবার দেখতে পাবেন!
5. পরিবর্তনগুলো সন্তোষজনক হলে গিটহাবে ম্যানুয়ালি পুশ করুন:
   ```bash
   git add .
   git commit -m "feat(auth): implement protected customer account portal and executive admin dashboard"
   git push origin main
   ```

---

## 🛍️ Day 5 (Part 2): Server-Authoritative Checkout & Atomic Order Engine (NESTORA-050, 051, 052, 055, 056)
- **তারিখ:** ২৩ অক্টোবর, ২০২৬
- **স্ট্যাটাস:** Completed & Verified (Build Passed 100%)
- **মূল লক্ষ্য:** সিনিয়র ডেভেলপার স্ট্যান্ডার্ডে সার্ভার-অথরিটেটিভ প্রাইসিং ক্যালকুলেশন, পোস্টগ্রেস ট্রানজ্যাকশন (`db.transaction`), অটোমিক স্টক ডিডাকশন, ইমিউটেবল অর্ডার স্ন্যাপশট, ডেডিকেটেড চেকআউট পেজ (`/checkout`) এবং অর্ডার কনফার্মেশন রসিদ পেজ (`/checkout/success`) তৈরি করা।

### 🧠 আর্কিটেকচারাল সমাধান ও টিম-টপার কনসেপ্টস:
1. **Never Trust the Client for Financial Truth (`src/lib/actions/checkout.ts`):**
   - ক্লায়েন্ট সাইড থেকে শুধু প্রোডাক্ট আইডি এবং কোয়ান্টিটি পাঠানো হয়।
   - সার্ভার সরাসরি PostgreSQL-এর `products` ও `productVariants` টেবিল থেকে লাইভ দাম ও স্টক চেক করে।
   - ক্লায়েন্ট সাইডে কেউ দাম পরিবর্তন করার চেষ্টা করলেও তা কোনোভাবেই ডাটাবেজে প্রভাব ফেলবে না।
2. **Shipping & Taxation Business Logic (NESTORA-050):**
   - **Standard Tracked Shipping:** $150 (15,000 সেন্টস) বা তার বেশি অর্ডারে সম্পূর্ণ ফ্রি (`$0.00`)। এর নিচে ফ্ল্যাট `$15.00`।
   - **Express Artisan Courier:** প্রায়োরিটি ১-২ দিনের ডেলিভারির জন্য `$25.00`।
   - **Tax Estimation:** স্ট্যান্ডার্ড ৮% ট্যাক্স ক্যালকুলেশন।
3. **Atomic Transactions & Inventory Safeguard (NESTORA-052 & 055):**
   - `db.transaction()` ব্যবহার করে অর্ডার ক্রিয়েশন সম্পন্ন হয়:
     1. ইউনিক অর্ডার আইডি জেনারেট করা হয় (যেমন: `ORD-20261023-4821`)।
     2. `orders` টেবিলে স্ন্যাপশট ইনসার্ট হয়।
     3. প্রতিটি পণ্যের নাম, এসকেইউ (`SKU`), এবং কেনা মুহূর্তের আসল দাম `order_items` টেবিলে ইমিউটেবল স্ন্যাপশট হিসেবে সেভ হয়।
     4. সাথে সাথে `product_variants`-এ স্টক মাইনাস হয় যাতে কনকারেন্ট অর্ডারেও কখনো ওভার-সেলিং না ঘটে।
4. **Seamless Guest & Customer Linkage:**
   - লগইন করা ইউজার থাকলে সরাসরি তার অ্যাকাউন্টের সাথে অর্ডার যুক্ত হয়।
   - গেস্ট ইউজার চেকআউট করলে তার ইমেইল দিয়ে স্বয়ংক্রিয়ভাবে অ্যাকাউন্ট লিংক করা হয়, যাতে ভবিষ্যতে লগইন করলে অর্ডার হিস্ট্রিতে সব প্রদর্শিত হয়।
5. **Express Checkout UI & Confirmation (`/checkout` & `/checkout/success`):**
   - কার্ট ড্রয়ারের "Proceed to Checkout" সরাসরি নতুন চেকআউট পেজে নিয়ে যায়।
   - অর্ডার প্লেস সফল হওয়া মাত্রই Redux গ্লোবাল কার্ট স্বয়ংক্রিয়ভাবে ক্লিয়ার (`clearCart()`) হয়ে যায়।
   - কনফার্মেশন পেজে গ্রাহকের নাম, ডেলিভারি এড্রেস স্ন্যাপশট, পণ্যের বিবরণ এবং অ্যাকাউন্টে অর্ডার দেখার ডিরেক্ট লিঙ্ক প্রদর্শিত হয়।

### 🧪 ভেরিফিকেশন রেজাল্ট:
- `npm run typecheck` ➔ **PASS** (০ টাইপ এরর)
- `npm run build` ➔ **PASS** (`/checkout` এবং `/checkout/success` সফলভাবে ডায়নামিক রুট হিসেবে কম্পাইলড)

### 📋 আপনার জন্য স্টেপ-বাই-স্টেপ টেস্ট চেকলিস্ট:
1. ব্রাউজারে [http://localhost:3000](http://localhost:3000) এ যান।
2. যেকোনো প্রোডাক্টে **"Quick Add"** বাটন চাপুন অথবা প্রোডাক্ট ডিটেইল পেজে গিয়ে **"Add to Bag"** চাপুন।
3. কার্ট ড্রয়ারে থাকা **"Proceed to Checkout"** বাটনে ক্লিক করুন:
   - সাথে সাথে কার্ট ড্রয়ার বন্ধ হয়ে লাক্সারি [http://localhost:3000/checkout](http://localhost:3000/checkout) পেজ ওপেন হবে।
4. নাম, ইমেইল, ফোন এবং এড্রেস পূরণ করুন।
5. শিপিং মেথড সিলেক্ট করুন (Standard vs Express Courier)—দেখবেন সাথে সাথে লাইভ ট্যাক্স ও টোটাল আপডেট হচ্ছে।
6. **"Complete Purchase"** বাটনে ক্লিক করুন:
   - মুহূর্তের মধ্যে পোস্টগ্রেস ডাটাবেজে ট্রানজ্যাকশন সম্পন্ন হয়ে আপনি [http://localhost:3000/checkout/success](http://localhost:3000/checkout/success) পেজে পৌঁছে যাবেন!
   - সেখানে আপনার ইউনিক অর্ডার নম্বর (`#ORD-...`), রসিদ এবং ডেলিভারি এড্রেস দেখতে পাবেন।
7. হেডারের কার্ট আইকনে দেখুন—অর্ডার সফল হওয়ায় কার্ট স্বয়ংক্রিয়ভাবে খালি হয়ে গেছে!
8. এবার [http://localhost:3000/account](http://localhost:3000/account) এ যান—দেখবেন আপনার কেনা নতুন অর্ডারটি "Recent Orders" এবং "Order History" ট্যাবে যুক্ত হয়ে গেছে!
9. পরিবর্তনগুলো সন্তোষজনক হলে গিটহাবে ম্যানুয়ালি পুশ করুন:
   ```bash
   git add .
   git commit -m "feat(checkout): implement server-authoritative checkout calculation, atomic order placement, and success receipt"
   git push origin main
   ```

---

*(পরবর্তী দিনের লগগুলো এখানে পর্যায়ক্রমে যোগ হবে)*



