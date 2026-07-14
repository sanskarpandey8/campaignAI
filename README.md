# 🚀 CampaignAI - AI Powered CRM Platform

CampaignAI is an AI-powered CRM platform that enables businesses to create intelligent marketing campaigns, segment customers, generate AI-powered messages, and analyze campaign performance.

Built using **React, Node.js, Express, MongoDB, and OpenAI/OpenRouter**.

---

## ✨ Features

### 📊 Dashboard

* Total Campaigns
* Total Customers
* Delivery Rate
* Click Through Rate (CTR)

### 🤖 AI Copilot

Generate campaigns using natural language prompts.

Example:

> "Create a campaign for premium users in Delhi inactive for 90 days."

AI automatically generates:

* Campaign Name
* Audience Rules
* Recommended Channel
* Personalized Message
* AI Reasoning

### 🎯 Campaign Creation

Create campaigns with:

* Customer segmentation
* City filters
* Tag filters
* Last order conditions
* AI-generated messages

### 📢 Multi-channel Campaigns

Supported channels:

* EMAIL
* SMS
* WHATSAPP
* RCS

### 📝 AI Subject Generator

Generate multiple email subject lines using AI.

### 📈 Campaign Management

* View all campaigns
* Campaign details page
* Communication logs
* Delivery statistics

### 🧠 AI Insights

Generate AI-powered campaign summaries and recommendations.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI

* OpenAI SDK
* OpenRouter API

---

## 📂 Project Structure

```bash
CampaignAI/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── scripts/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd CampaignAI
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
OPENROUTER_API_KEY=your_openrouter_api_key
```

Run backend:

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Dashboard

```http
GET /api/dashboard/stats
```

### Campaigns

```http
POST /api/campaigns
GET /api/campaigns
GET /api/campaigns/:id
GET /api/campaigns/:id/stats
GET /api/campaigns/:id/logs
```

### AI Copilot

```http
POST /api/copilot/generate
POST /api/copilot/launch
```

### Subject Generator

```http
POST /api/subjects/generate
```

---

## 🧪 Sample AI Prompt

```text
Create a campaign for premium users in Delhi who have not ordered in 90 days.
```

---

## 📸 Screenshots

Add screenshots of:

* Dashboard
* AI Copilot
* Campaign Details
* Create Campaign

---

## 🔮 Future Improvements

* Authentication & Authorization
* Real-time campaign analytics
* A/B testing
* Email integration
* WhatsApp Business API integration
* Campaign scheduling

---

## 👨‍💻 Author

**Sanskar Pandey**

B.Tech Student | Full Stack Developer | AI Enthusiast

---
