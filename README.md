# SAGA Web Application (Frontend) 🚀

Welcome to the frontend interface for the **SAGA** ecosystem. It is designed to be highly responsive, providing user/member dashboards, control panels, routine tracking, and PDF report downloads directly from the platform gateway.

---

## 👤 Student Metadata

* **Student Name:** Sachindu Chirau
* **Student ID:** `241711023`
* **GCP Project ID:** `directed-post-506508-i4`

---

## 📝 Project Description

The SAGA Web Application serves as the primary client-facing interface. Built with a modern, high-performance web stack, it interacts seamlessly with the backend microservices through the API Gateway, ensuring secure authentication, real-time routine management, and dynamic report rendering.

---

## 🌐 Deployed Application

The application is deployed publicly and accessible at: 
👉 **http://34.93.87.166/**

---

## ⚡ Technology Stack

* **Frontend Framework:** React 18
* **Language:** TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **API Client:** Axios

---

## 📁 Project Structure

```text
webapp/
├── src/
│   ├── assets/        # Static images and icons
│   ├── components/    # Reusable UI components (Member/Dashboard layout)
│   ├── context/       # Auth context and globally shared state
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Dashboard, Workout, and Report page views
│   ├── services/      # REST API endpoints & gateway client functions
│   ├── types/         # TypeScript shared type models
│   ├── utils/         # Helper functions
│   └── validators/    # Validation schemas
├── public/            # Public web assets
├── package.json       # Node dependency registry
└── vite.config.ts     # Bundling configuration