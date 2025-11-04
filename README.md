This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

🧩 Task Management App – Frontend (Next Js)

A modern, responsive Task Management Dashboard built with Next.js and TypeScript.
It connects to a NestJS backend API and provides an interface for managing users, tasks, states, subtasks and users with drag-and-drop and smart filtering and data visualization features.

📋 Table of Contents

    ✨ Features

    🧰 Tech Stack

    ⚙️ Installation

    🔗 Environment Variables

    ▶️ Run the App

    🧠 Project Structure

    📊 UI Overview

    🧱 Technical Notes

    📄 Example Data

✨ Features

    ✅ Task and subtask management with drag-and-drop
    ✅ Task grouping by state (columns: e.g. “To Do”, “In Progress”, “Done”)
    ✅ CRUD operations on all entities (User, Task, State, Subtask)
    ✅ Realtime updates using optimistic UI updates
    ✅ Dashboard with monthly task and user statistics
    ✅ Toast notifications and error handling
    ✅ Users managemet (add, edit, delete)
    ✅ Fully responsive layout

🧰 Tech Stack
    | Category             | Technology                                                    |
    | -------------------- | ------------------------------------------------------------- |
    | **Framework**        | [Next.js 14](https://nextjs.org/)                             |
    | **Language**         | TypeScript                                                    |
    | **Styling**          | [TailwindCSS](https://tailwindcss.com/)                       |
    | **State Management** | React Hooks + Context                                         |
    | **HTTP Client**      | Axios                                                         |
    | **Drag & Drop**      | [dnd-kit](https://dndkit.com/)                                |
    | **Charts**           | [react-chartjs-2](https://react-chartjs-2.js.org/) + Chart.js |


⚙️ Installation
    1️⃣ Clone the repository
        git clone https://github.com/SoufianeAzri/next-tasks-app.git
        cd next-tasks-app

    2️⃣ Install dependencies
        npm install

        or

        yarn install


🔗 Environment Variables

    Create a .env.local file in the project root:

    NEXT_PUBLIC_API_URL=https://tasks-app-74ls.onrender.com


Run the App
    npm run dev
    Then open:
👉 http://localhost:3000/dashboard



🧠 Project Structure
    src/
    ┣ app/               # Next.js app router (pages, routes, layouts)
    ┣ components/        
                ┣features/    # Feature modules (tasks, users, dashboard)              
                        ┣ hooks/             # Custom React hooks
                        ┣ services/          # API calls via Axios
                        ┣ components/        # custom components
                ┣ui/          # Reusable components (modals, toasts, button) 
                ┣layouts/      # (SideBar, Header)
    ┣ utils/             # Helpers, constants, and types
    ┣ libs/              # External libraries (Axios)
    ┗ styles/            # Global CSS/Tailwind configuration

📊 UI Overview
    🏠 Dashboard

        Displays:

        Total users, tasks, and states

        Monthly task trends (line & bar charts)

        State distribution with color-coded charts

        Recent user activities

        Recent added tasks

    🧾 Tasks Board

        Displays tasks grouped by state

        Tasks can be dragged and dropped between states

        Each task can have multiple subtasks

        CRUD actions available for all entities

    👤 Users

        View, add, and delete users

        Role-based UI (Manager, Team Member)


🧱 Technical Notes

    Axios instance is configured in /lib/api.ts with automatic base URL and token headers.

    Dnd-kit handles task movement between states — the UI updates optimistically before confirming with the backend.

    Chart.js + react-chartjs-2 provide dynamic dashboards that update based on fetched API data.

    date-fns is used to format and calculate monthly statistics.

    ToastProvider shows contextual success/error notifications.

🧩 Example Screenshot 
![Dashboard Preview](./src/assets/images/Capture%20d'écran%202025-11-04%20101509.png)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
