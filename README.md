# 🛍️ Shopno - E-Commerce Platform

একটি আধুনিক এবং সম্পূর্ণ ই-কমার্স অনলাইন দোকান যা পণ্য তালিকা, শপিং কার্ট, পেমেন্ট সিস্টেম এবং ডাটাবেস সহ আসে।

## ✨ ফিচার

- ✅ পণ্য তালিকা এবং বিস্তারিত তথ্য
- ✅ শপিং কার্ট ম্যানেজমেন্ট
- ✅ Stripe পেমেন্ট সিস্টেম
- ✅ অর্ডার ম্যানেজমেন্ট
- ✅ SQLite ডাটাবেস
- ✅ আধুনিক এবং সাজানো ডিজাইন
- ✅ Responsive ডিজাইন (মোবাইল-বন্ধুত্বপূর্ণ)

## 🚀 ইনস্টলেশন

### প্রয়োজনীয় প্যাকেজ ইনস্টল করুন

```bash
npm install
```

### পরিবেশ ভেরিয়েবল সেটআপ

`.env.example` ফাইল কপি করে `.env` তৈরি করুন এবং আপনার Stripe কী যোগ করুন:

```bash
cp .env.example .env
```

`.env` ফাইল এডিট করুন:

```
PORT=5000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
NODE_ENV=development
```

### সার্ভার চালান

**ডেভেলপমেন্ট মোডে:**
```bash
npm run dev
```

**প্রোডাকশন মোডে:**
```bash
npm start
```

সার্ভার `http://localhost:5000` এ চলবে।

## 📁 প্রজেক্ট স্ট্রাকচার

```
shopno/
├── package.json
├── server.js
├── .env.example
├── README.md
├── shopno.db (স্বয়ংক্রিয়ভাবে তৈরি হবে)
└── public/
    ├── index.html
    ├── styles.css
    └── script.js
```

## 🔌 API এন্ডপয়েন্টস

### পণ্য

- `GET /api/products` - সব পণ্য পান
- `GET /api/products/:id` - নির্দিষ্ট পণ্য পান
- `POST /api/products` - নতুন পণ্য যোগ করুন

### পেমেন্ট

- `POST /api/create-payment-intent` - Stripe পেমেন্ট ইন্টেন্ট তৈরি করুন

### অর্ডার

- `GET /api/orders` - সব অর্ডার পান
- `GET /api/orders/:id` - নির্দিষ্ট অর্ডার পান
- `POST /api/orders` - নতুন অর্ডার তৈরি করুন

## 💳 Stripe সেটআপ

1. [Stripe](https://stripe.com) এ একটি অ্যাকাউন্ট তৈরি করুন
2. আপনার API কী পান
3. `.env` ফাইলে যোগ করুন

## 🛠️ প্রযুক্তি স্ট্যাক

- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Frontend:** HTML5, CSS3, JavaScript
- **Payment:** Stripe API
- **Hosting:** Heroku, Vercel বা অন্য কোনো সার্ভার

## 📝 লাইসেন্স

ISC

## 👨‍💻 লেখক

শপনো টিম

## 📞 সাপোর্ট

যেকোনো সমস্যার জন্য একটি Issue তৈরি করুন অথবা যোগাযোগ করুন।
