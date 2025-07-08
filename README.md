# ResumAI - AI-Powered Resume Builder

ResumAI is a modern, full-stack web application designed to help students and job seekers create professional, ATS-friendly resumes with the power of AI. It features a rich, interactive editor, multiple templates, and a suite of AI tools to optimize every section of a resume.

![App Screenshot](https://placehold.co/800x400.png?text=ResumAI+Screenshot)
*A placeholder for the app's screenshot.*

## Key Features

### Core Resume Platform
- **User Authentication**: Secure sign-up and login using Firebase Authentication with Google.
- **Resume Dashboard**: A central place to create, view, edit, duplicate, and delete resumes.
- **Advanced Resume Editor**:
  - Sections for Contact Info, Summary, Experience, Projects, Education, Skills, Languages, and custom sections.
  - Live preview that updates as you type.
  - Photo uploads handled securely via Cloudinary.
- **Multiple Templates**: Choose from several professionally designed templates (Classic, Modern, Creative, etc.) to match your style.
- **PDF Export**: Download high-quality PDF versions of your resumes from the editor or the dashboard.
- **Subscription Management**: A settings page to manage user profiles and subscriptions (Free/Pro), with payments handled by Razorpay.

### AI-Powered Assistance
The application leverages **Genkit** with Google's Gemini models to provide intelligent assistance:
- **AI Summary Generation**: Creates a professional summary based on your experience and skills.
- **AI Experience Optimizer**: Generates impactful, achievement-oriented bullet points for your work experience.
- **AI Project Optimizer**: Transforms academic and personal projects into professional-sounding experience.
- **AI Skill Suggestions**: Recommends relevant technical and soft skills based on job titles and descriptions.
- **ATS Compatibility Checker**: Analyzes your resume against a job description to provide an ATS score and actionable improvement suggestions.

### Pro-Exclusive Features
- **AI Cover Letter Generator**: Creates a tailored cover letter based on your resume and a job description.
- **AI LinkedIn Profile Optimizer**: Rewrites your LinkedIn headline and summary to attract recruiters.
- **AI Career Counselor**: A conversational chat interface to get career advice.
- **Unlimited Resumes**: Pro users can create and manage an unlimited number of resumes.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS with ShadCN UI components
- **AI Backend**: Genkit with Google AI (Gemini)
- **Authentication**: Firebase Authentication
- **Database**: Firestore (for storing user and resume data)
- **Image Storage**: Cloudinary
- **Payments**: Razorpay
- **Deployment**: Vercel / Firebase App Hosting

## Getting Started

Follow these instructions to get a local copy up and running for development.

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add the following keys. These are required for the application to function correctly.

    ```env
    # Firebase Configuration (from your Firebase project settings)
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=

    # Cloudinary Configuration (for image uploads)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    # Razorpay Configuration (for Pro plan subscriptions)
    NEXT_PUBLIC_RAZORPAY_KEY_ID=

    # Google AI / Genkit (if specific key is needed beyond default auth)
    # GOOGLE_API_KEY=
    ```

4.  **Run the development servers:**
    You need to run two servers concurrently in separate terminals: the Next.js app and the Genkit AI flows.

    - **Terminal 1: Run the Next.js app**
      ```bash
      npm run dev
      ```
      The application will be available at `http://localhost:9002`.

    - **Terminal 2: Run the Genkit flows**
      ```bash
      npm run genkit:watch
      ```
      This starts the Genkit flows and watches for changes. The AI features in the app will communicate with this server.

## Project Structure

A brief overview of the key directories:

-   `src/app/`: Contains all the pages and routes for the application, following the Next.js App Router structure.
-   `src/ai/`:
    -   `flows/`: Home to all Genkit AI flows that power the application's intelligent features.
    -   `genkit.ts`: Main Genkit configuration file.
-   `src/components/`: Shared UI components, including ShadCN components, layout (like `app-shell`), and feature-specific components.
-   `src/contexts/`: React context providers for managing global state like Authentication (`auth-context`) and Resumes (`resume-context`).
-   `src/lib/`: Utility functions and third-party library initializations (e.g., `firebase.ts`).
-   `src/types/`: TypeScript type definitions for data structures like `ResumeData`.
