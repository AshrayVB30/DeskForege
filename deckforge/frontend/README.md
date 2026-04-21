# DeckForge — Frontend 🎨

This is the Next.js frontend for **DeckForge**, the AI-powered presentation generator.

## 🚀 Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file in this directory with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run the Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Architecture

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui & Radix UI
- **State Management**: React Hooks & Context
- **Icons**: Lucide React

## 📄 Key Routes

- `/` — Landing Page
- `/dashboard` — List of user presentations
- `/create` — AI prompt interface
- `/preview/[id]` — Interactive slide editor & preview
- `/auth/login` & `/auth/register` — Identity management

---

For full project setup instructions, please refer to the [Root README](../README.md).
