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

*(পরবর্তী দিনের লগগুলো এখানে পর্যায়ক্রমে যোগ হবে)*
