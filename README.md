## TaskPilot - Phase 1 MVP

A modern, responsive task management application built with React, TypeScript, Supabase, and Tailwind CSS. This is the Phase 1 implementation focusing on core task management functionality and authentication.

## 🚀 Features (Phase 1)

- ✅ User authentication (register, login, logout)
- ✅ Create, read, update, delete tasks
- ✅ Task status management (Backlog, Todo, Upcoming, Done)
- ✅ Task priority levels (Low, Medium, High)
- ✅ Due date tracking
- ✅ Task filtering by status
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ PWA support (installable, offline-ready)
- ✅ Modern UI matching design specifications

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query (TanStack Query) + Zustand
- **Routing**: React Router 6
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **PWA**: vite-plugin-pwa (Workbox)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

#### Run Database Migrations





### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Find these values in your Supabase project settings under API.

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📁 Project Structure

```
task-manager/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components (Sidebar, Header)
│   │   ├── tasks/          # Task-related components
│   │   └── common/         # Shared components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Third-party library configs
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Design System

### Colors

- **Primary**: #FFC107 (Yellow accent)
- **Sidebar**: #1F1F1F (Dark background)
- **Background**: #FAFAFA (Light gray)
- **Text Primary**: #1A1A1A
- **Text Secondary**: #6B7280

### Status Colors

- **Backlog**: #94A3B8 (Slate)
- **Todo**: #3B82F6 (Blue)
- **Upcoming**: #F59E0B (Amber)
- **Done**: #10B981 (Green)

## 🔐 Authentication

The app uses Supabase Auth with email/password authentication. Features include:

- User registration with email verification
- Secure login
- Password reset functionality
- Protected routes
- Automatic session management

## 📱 PWA Support

The application is configured as a Progressive Web App:

- Installable on desktop and mobile devices
- Offline-first architecture
- Service worker with caching strategies
- App manifest for native-like experience

## 🔄 State Management

- **Server State**: React Query for data fetching, caching, and synchronization
- **Client State**: React hooks (useState, useContext) for UI state
- **Authentication**: Custom `useAuth` hook with Supabase integration

## 🧪 Development

### Code Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

## 🚀 Deployment

### Recommended Platforms

- **Vercel**: Connect your Git repository for automatic deployments
- **Netlify**: Similar Git-based deployment
- **Cloudflare Pages**: Fast edge deployment

### Environment Variables

Make sure to set your environment variables in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📝 Phase 1 Completion Checklist

- [x] Project setup with Vite, React, TypeScript
- [x] Tailwind CSS configuration with design tokens
- [x] Supabase integration
- [x] Authentication system (register, login, logout)
- [x] Database schema with RLS policies
- [x] Core task CRUD operations
- [x] Task filtering by status
- [x] Responsive layout and navigation
- [x] PWA configuration
- [x] User dashboard
- [x] Task cards with priority and status
- [x] Task modal for create/edit
- [x] Protected routes
- [x] Error handling
- [x] Loading states

## 🔜 Coming in Phase 2

- Team collaboration features
- Task assignment to team members
- Real-time updates
- Comments on tasks
- Activity feed
- Enhanced permissions

## 🔜 Coming in Phase 3

- Analytics dashboard
- Calendar integration
- Document attachments
- Time tracking
- Advanced search and filters
- Export functionality

## 📄 License

MIT

## 👥 Contributing

Phase 1 is feature-complete. For Phase 2 development, please refer to the project planning documents.

## 🐛 Known Issues

None at the moment. Please report issues via GitHub Issues.

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.
