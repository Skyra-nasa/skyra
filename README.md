# 🌤️ Skyra Frontend  

**Skyra** is an intelligent weather-aware activity assistant — helping users plan their outdoor activities safely and efficiently based on real weather data from **NASA** and AI-powered recommendations.

---

## 🚀 Overview  

Skyra’s frontend provides an interactive interface where users can:  
- Select an **activity**, **location**, and **date/time**  
- View **weather analysis results** instantly  
- Get **AI-powered suggestions** for safer or better activities  
- Chat with an integrated **AI assistant** for natural weather advice  

---

## ✨ Features  

- ✅ **Real-Time Weather Evaluation** — Analyzes temperature, humidity, wind, and precipitation to check if your activity is safe.  
- 🤖 **AI Recommendations** — Suggests better alternatives when conditions aren’t ideal.  
- 🗺️ **Location & Time Support** — Works with user-input coordinates or selected cities and times.  
- 💬 **Chat Interface** — Interact with an AI chatbot for weather insights and activity planning.  
- 🎨 **Responsive UI** — Built with modern design principles for seamless use across devices.  

---

## 🔗 Integration with Backend  

The frontend communicates with the **Skyra Backend API** (FastAPI-based) to process data and get intelligent results.

### API Endpoints Used  

| Method | Endpoint | Description |
|:------:|:----------|:-------------|
| `POST` | `/analyze` | Sends activity, location, and date → returns weather analysis & recommendations |
| `POST` | `/chat` | Sends user message → returns AI-generated response (used in chatbot) |

##  Project Structure  

```bash
Skyra-Frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # App pages (Home, Chat, Analysis)
│   ├── shared/            # Shared logic and utilities
│   │   ├── layout/         # Header
│   │   ├── context/       # Global state (Context API / Zustand)
│   │   ├── api/      # API calls and helpers (Axios)
│   │   └── assets/        # Shared images, icons, and static resources
│   └── App.tsx            # App root
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md


# Clone the frontend repository
git clone https://github.com/Skyra-nasa/Skyra-Frontend.git
cd Skyra-Frontend

# Install dependencies
npm install

# Run the development server
npm run dev
