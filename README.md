# 🚀 VOID - Bridging the Silence

![VOID Banner](./public/assets/image1.png)

**VOID** is an AI-powered accessibility assistant designed to bridge the communication gap between the Deaf community and society in Egypt. It translates **Egyptian Sign Language (EsL)** to voice/text and vice versa in real-time, breaking down barriers and fostering inclusivity.

Unlike generic tools, VOID is localized to understand the Egyptian dialect and culture, making communication natural and effective.

---

## 🌟 Key Features

### 1. Bi-directional Communication 🔄
* **Sign-to-Text (Camera Mode):** Uses computer vision to recognize Egyptian Sign Language gestures via the camera and translates them into text or speech instantly.
* **Text-to-Sign (Avatar Mode):** Converts typed text into 3D Avatar animations representing sign language for the Deaf user to understand.

### 2. Localized for Egypt 🇪🇬
* Specifically trained on the **Egyptian Sign Language (EsL)** dataset.
* Understands local slang and street signs, not just academic gestures.

### 3. Gamified Learning (Kids Area) 🎮
* An interactive section designed for children (Deaf or hearing) to learn sign language.
* Includes games, stories, and daily challenges to make learning fun (Currently Under Development).

### 4. Accessibility First ♿
* **High Contrast UI:** Designed for ease of use.
* **Offline Mode:** Functional without an internet connection (Pro Plan feature).
* **Multi-platform:** Responsive web design that works on desktops and tablets.

---

## 🛠️ Tech Stack

This project is built using modern web technologies to ensure performance, scalability, and a smooth user experience:

* **Frontend Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Blazing fast build tool)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework)
* **Animations:** [Framer Motion](https://www.framer.com/motion/) (Complex UI transitions)
* **Routing:** [React Router DOM](https://reactrouter.com/) (Client-side routing)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Camera Integration:** `react-webcam`
* **State Management:** React Context API

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
* **Node.js** (v16 or higher)
* **npm** or **yarn**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/void-frontend.git](https://github.com/your-username/void-frontend.git)
    cd void-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:5173` to see the application in action.

---

## 📂 Project Structure

Here is a quick overview of the project structure:

```text
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Navigation bar with Language Toggle
│   ├── Hero.jsx         # Landing page hero section
│   ├── Demo.jsx         # The main AI Translation Interface (Camera/Avatar)
│   ├── Features.jsx     # Features page & Comparison table
│   ├── Pricing.jsx      # Subscription plans
│   └── AuthModal.jsx    # Login/Signup Multi-step form
├── context/             # Global State (Language Context)
├── data/                # Static content & Translations (Ar/En)
├── App.jsx              # Main Application Entry & Routing
└── main.jsx             # React DOM rendering

---
## 🔮 Future Roadmap

* [ ] **FastAPI Integration:** Connect the frontend with the AI Model backend for real-time predictions.
* [ ] **Voice Input:** Add Speech-to-Text feature for easier input.
* [ ] **Mobile App:** Launch a React Native version for iOS and Android.
* [ ] **Kids Area Completion:** Release the full suite of educational games.

---

## 📄 License

This project is licensed under the MIT License.

---

### Vite Configuration (Default)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

* [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh.
* [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh.
