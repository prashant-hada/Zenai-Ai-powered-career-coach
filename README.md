# Zenai

**Zenai** is a next-generation AI-powered career coach platform designed to help users excel in their careers. By providing tailored industry insights, dynamic market trends, and AI-assisted tools for resume and cover letter creation, Zenai empowers professionals to stay ahead in today’s competitive job market.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Database Schema & Backend Logic](#database-schema--backend-logic)
- [E-R Representation](#e-r-representation)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
<!-- - [License](#license) -->

---

## Overview

Zenai delivers a comprehensive career coaching experience by integrating multiple functionalities into one platform:

- **Industry Insights Dashboard:** Get up-to-date information on salary ranges, growth rates, market trends, and in-demand skills tailored to your industry.
- **Interview Preparation:** Practice with curated, MCQ-based mock questions and track your performance through intuitive analytics.
- **AI-Powered Resume Builder:** Craft optimized, ATS-friendly resumes with AI suggestions.
- **AI-Powered Cover Letter Generator:** Generate personalized cover letters for specific companies and roles, ensuring a better match with job requirements.
- **Streamlined Onboarding:** Enjoy a smooth onboarding experience that gets you started quickly.

---

## Features

- **Personalized Industry Insights:**  
  Dive deep into salary ranges, market growth, and trends with regularly updated data.

- **Mock Interview Prep:**  
  Prepare for interviews with practice questions (MCQ-based) and track your progress visually.

- **Resume Builder:**  
  Create ATS-optimized resumes with the help of AI, including real-time feedback and scoring.

- **Cover Letter Generator:**  
  Generate customized cover letters targeted for specific roles and companies.

- **User Analytics:**  
  Gain insights into your progress and performance through interactive dashboards.

---

## Tech Stack

- **Frontend:**

  - Next.js
  - Tailwind CSS
  - ShadCN UI

- **Backend:**

  - Next.js API routes
  - Prisma ORM

- **Database:**

  - PostgreSQL (hosted on Neon)

- **Authentication & User Management:**

  - Clerk

- **Task Scheduling:**
  - Inngest (for cron jobs)

---

## Setup & Installation

### Prerequisites

- **Node.js** (v14 or later)
- **PostgreSQL** database (configured via Neon)
- **npm** or **Yarn** as your package manager

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/prashant-hada/Zenai-Ai-powered-career-coach
   cd Zenai-Ai-powered-career-coach
   ```

2. **Install Dependencies:**

   `npm install`

3. **Environment Setup:** Create a `.env` file in the root directory and add the following variables:

    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
    DATABASE_URL=
    GEMINI_API_KEY=
    ```

4. **Configure Prisma:**

   - **Generate Prisma Client:**

     `npx prisma generate`

   - **Run Database Migrations:**

     `npx prisma migrate dev --name init`

5. **Start the Development Server:**

   `npm run dev`

---

## Database Schema & Backend Logic

Zenai uses Prisma to interact with a PostgreSQL database. Below is a brief overview of the core models:

- **User:**  
  Stores user details along with relationships to assessments, cover letters, resumes, and industry insights.
- **IndustryInsight:**  
  Contains dynamic data for various industries including salary ranges, growth rates, market outlook, and key trends. Indexed by industry for efficient queries.
- **Resume, Assessment, and CoverLetter:**  
  Represent user-generated career documents and performance data.
---


## E-R Representation
- **ER Diagram:**  
  An ER diagram that better show the relationship between different entities of this system to better help you out under stand the flow.

  ![ER-Diagram](https://github.com/prashant-hada/Zenai-Ai-powered-career-coach/blob/main/public/erd.png?raw=true)

-----

## Future Enhancements

- **Interview Preparation Module:**  
  Develop a robust module for MCQ-based interview practice with real-time analytics.
- **Enhanced Analytics Dashboard:**  
  Integrate visually engaging charts and detailed reports to track interview and application progress.
- **Additional AI Features:**  
  Expand the capabilities of the AI tools to provide more personalized recommendations for resumes and cover letters.

---
## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests to help improve Zenai. For major changes, open an issue first to discuss what you would like to change.