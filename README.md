# 🌱 Green Building Platform

An intelligent web-based **Green Building Sustainability Assessment Platform** designed to evaluate the environmental performance of buildings using energy consumption, water usage, material efficiency, and other sustainability parameters.

The platform calculates a comprehensive sustainability score, provides AI-powered recommendations, visualizes environmental performance, and helps users identify practical opportunities to improve building sustainability.

---

## 🚀 Live Application

🌐 **Live Demo:** https://green-building-platform.onrender.com

> The application is deployed using Render. Free-tier instances may take some time to wake up after a period of inactivity.

---

## ✨ Features

### 🏢 Building Sustainability Assessment

Evaluate a building using important environmental parameters such as:

* Building type
* Floor area
* Energy consumption
* Water consumption
* Material efficiency
* Building-related sustainability metrics

The platform processes the submitted data and generates an overall sustainability assessment.

### 📊 Sustainability Scoring Engine

The platform calculates a normalized **0–100 sustainability score** using weighted environmental metrics.

The assessment provides individual performance indicators for areas such as:

* ⚡ Energy efficiency
* 💧 Water efficiency
* 🧱 Material efficiency

The resulting score makes it easier to understand the overall environmental performance of a building.

### 🤖 AI-Powered Recommendations

The platform generates personalized sustainability recommendations based on the building assessment.

Recommendations can help users:

* Reduce energy consumption
* Improve water efficiency
* Optimize material usage
* Increase sustainability performance
* Identify practical improvement opportunities

The application also includes fallback recommendation logic so that core functionality can continue when the external AI service is unavailable.

### 📈 Interactive Data Visualization

The platform provides visual analytics including:

* Sustainability score gauge
* Performance charts
* Environmental metric comparisons
* Score distribution
* Sustainability recommendations

These visualizations make complex environmental data easier to understand.

### 🎨 Modern User Interface

The frontend uses a modern sustainability-focused design with:

* 🌿 Green/emerald visual theme
* Glassmorphism-inspired components
* Responsive layouts
* Interactive cards
* Smooth animations
* Data visualization
* Modern icons
* Mobile-friendly interface

### 🔐 User Authentication

The platform supports user authentication features including:

* User registration
* User login
* JWT-based authentication
* Protected application functionality

### 🗄️ Assessment Data Management

Building assessments can be stored and retrieved through the backend API.

Supported operations include:

* Create assessment
* Retrieve assessments
* Retrieve individual assessment
* Delete assessment

---

## 🧱 System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js +         │
                    │   Express.js        │
                    │     Backend         │
                    └──────┬───────┬──────┘
                           │       │
              ┌────────────┘       └────────────┐
              ▼                                 ▼
     ┌─────────────────┐               ┌─────────────────┐
     │    MongoDB      │               │   AI Service    │
     │    Database     │               │ Recommendations │
     └─────────────────┘               └─────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* Recharts
* Lucide React
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* REST API

### AI

* OpenAI API
* Rule-based fallback recommendation engine

### Deployment

* GitHub
* Render

---

## 📁 Project Structure

```text
green-building-platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── package.json
├── render.yaml
├── DEPLOYMENT.md
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/vamsikrishna18-vs/Green-building-platform.git
cd Green-building-platform
```

### 2. Install dependencies

Install the root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

---

## 🔐 Environment Variables

Create the required environment variables for the backend.

Example:

```env
NODE_ENV=development
PORT=10000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

OPENAI_API_KEY=your_openai_api_key
```

### ⚠️ Security

Never commit your `.env` file or API keys to GitHub.

Add environment files to `.gitignore`:

```text
.env
.env.local
.env.production
node_modules/
```

---

## ▶️ Running Locally

### Start the backend

From the `server` directory:

```bash
npm start
```

The backend will run on the configured port.

### Start the frontend

From the `client` directory:

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

---

## 🔗 API

The backend provides REST API endpoints for building assessments and user authentication.

### Building Assessment

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/buildings`     | Create a sustainability assessment |
| GET    | `/api/buildings`     | Retrieve assessments               |
| GET    | `/api/buildings/:id` | Retrieve a specific assessment     |
| DELETE | `/api/buildings/:id` | Delete an assessment               |

### Authentication

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/api/users/register` | Register a user     |
| POST   | `/api/users/login`    | Authenticate a user |

> API routes may vary depending on the current backend implementation.

---

## 📊 Sustainability Assessment Flow

```text
User enters building data
          │
          ▼
    Input validation
          │
          ▼
  Sustainability engine
          │
          ▼
 Energy ─ Water ─ Materials
          │
          ▼
   Weighted score
          │
          ▼
     Score 0–100
          │
          ├───────────────┐
          ▼               ▼
   Visual analytics   AI analysis
          │               │
          └───────┬───────┘
                  ▼
       Sustainability Report
```

---

## 🌍 Future Enhancements

The platform is designed to evolve into a more comprehensive building sustainability management system.

Planned enhancements include:

* 📈 Historical sustainability tracking
* 🌍 Carbon footprint estimation
* 💰 Sustainability cost-benefit analysis
* 🏆 Building benchmarking
* 🤖 AI sustainability assistant
* 📄 Automated sustainability reports
* 🌱 Personalized sustainability action plans
* 📊 Advanced analytics dashboard
* 🏢 Multi-building management
* 📱 Progressive Web App support
* ☁️ Advanced cloud infrastructure
* 🔔 Sustainability alerts and notifications

---

## 🎯 Project Goals

The primary goals of Green Building Platform are to:

1. Make building sustainability assessment easier.
2. Convert environmental data into understandable scores.
3. Help users identify sustainability weaknesses.
4. Provide actionable improvement recommendations.
5. Use AI to enhance environmental decision-making.
6. Encourage more energy-, water-, and material-efficient buildings.

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome.

```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new sustainability feature"
git push origin feature/new-feature
```

Then open a pull request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🌱 Green Building Platform

**Measure → Analyze → Improve → Build Sustainably**

Built with ❤️ using React, Node.js, MongoDB, and AI.
