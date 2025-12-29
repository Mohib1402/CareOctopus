# 🐙 CareOctopus
**The Intelligent, Multitasking "Second Brain" for Caregivers.**

> **🚀 Submitted for Octopus Hackathon 2025**
> *Theme: Intelligent Multitasking & Health Tech*

[![Demo App](https://img.shields.io/badge/Live_Demo-Visit_App-blue?style=for-the-badge&logo=vercel)](https://care-octopus-b3ak.vercel.app/)
[![Pitch Video](https://img.shields.io/badge/Pitch_Video-Watch_Now-red?style=for-the-badge&logo=youtube)](YOUR_YOUTUBE_LINK_HERE)

![Project Banner](https://via.placeholder.com/1200x600.png?text=CareOctopus+Dashboard+Preview)

---

## 💡 The Problem
Caregiving is the ultimate multitasking challenge. A single caregiver must simultaneously be a nurse, a pharmacist, a dietitian, and a data analyst.
* **Data Overload:** Tracking 10+ medications and fluctuating symptoms manually is prone to error.
* **fragmented Focus:** Writing down notes takes time away from actually caring for the loved one.
* **Doctor Disconnect:** Critical details get lost between the living room and the doctor's office.

## 🚀 The Solution
**CareOctopus** is a multimodal AI web app designed to extend the caregiver's capabilities. Like an octopus, it handles multiple streams of information—Vision, Voice, and Logic—simultaneously.

It allows caregivers to:
1.  **See** medication labels and instantly extract dosage safety info.
2.  **Hear** spoken symptom logs and structure them into medical records.
3.  **Think** by calculating a real-time "Health Score" based on severity trends.

---

## ✨ Key Features (The Tentacles)

### 👁️ Tentacle 1: AI Vision Scanner
Don't type complex drug names. Just snap a photo.
* **Tech:** Google Gemini 1.5 Flash (Multimodal Vision).
* **Function:** instantly OCRs pill bottles, extracts the drug name (e.g., "Ursodiol"), dosage, and safety warnings.

### 🗣️ Tentacle 2: Voice-to-Data Engine
Speak naturally: *"Grandpa had chest pain at 2 PM but feels better now."*
* **Tech:** Web Speech API + Gemini 1.5 Pro.
* **Function:** Transcribes audio, analyzes sentiment/severity, and logs structured data without a single keystroke.

### ❤️ Tentacle 3: Dynamic Health Score
A living algorithm that tracks patient stability.
* **Smart Math:** Starts at 100%. Penalizes for critical events (Heart Attack = -60) but rewards recovery trends (Feeling Well = +10).
* **Time Decay:** The score automatically "heals" over time if no negative logs are added for 24 hours, simulating recovery.

### 📄 Tentacle 4: Instant Reporting
* **Function:** Generates a professional PDF summary of the last 30 days with one click.
* **Impact:** Empowers caregivers to hand a physical report to doctors, ensuring no symptom is overlooked.

---

## 🛠️ Tech Stack & Innovation

This project was built during the hackathon timeline using a modern, scalable stack:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
* **AI Model:** Google Gemini 1.5 Pro & Flash (via Google AI Studio)
* **UI/UX:** Tailwind CSS + [Shadcn UI](https://ui.shadcn.com/)
* **Security:** Server-Side API Key injection (Client never sees the keys)
* **Persistence:** LocalStorage (Privacy-first architecture)
* **Responsiveness:** Mobile-first design with adaptive navigation (Sidebar for Desktop, Bottom Nav for Mobile).

---

## 📱 Mobile Responsiveness (Judging Criteria)
CareOctopus works seamlessly on any device, adapting its layout to the caregiver's context:
* **Desktop:** Full dashboard with sidebar navigation for detailed analysis.
* **Mobile:** Auto-switches to a thumb-friendly bottom navigation bar for logging on the go.

---

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/care-octopus.git](https://github.com/YOUR_USERNAME/care-octopus.git)
    cd care-octopus
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file and add your Google Gemini API Key:
    ```env
    GEMINI_API_KEY=AIzaSy...
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 🎥 Pitch Video
[Link to YouTube/Vimeo Video Placeholder]

---

## 🏆 Hackathon Tracks
* **Health Tech:** Solving the global aging population crisis.
* **AI Innovation:** Utilizing Multimodal LLMs for real-world impact.

---

*Built with 🐙 by [Mohibkhan Pathan]*
