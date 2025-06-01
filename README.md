# HyperGro Form Builder

A modern, visual form builder application that allows users to create beautiful, responsive forms through an intuitive drag-and-drop interface.

## 🔗 Live Demo

- **🌐 Live Application**: [https://form-builder-azure-mu.vercel.app/](https://form-builder-azure-mu.vercel.app/)
- **📹 Demo Video**: [Google Drive Demo](https://drive.google.com/drive/u/1/folders/183ueqgE3lDeZCArK5Ip77oDIOG640oOs)

## 🚀 Features That Could Be Added With More Time

- **Auto-save functionality** - Automatically save form changes every few seconds to prevent data loss
- **Undo/Redo system** - Allow users to undo and redo their form building actions with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **Conditional logic** - Show/hide fields based on user responses (e.g., show "Other" text field when "Other" is selected)
- **CSV/Excel export** - Export form responses in various formats for data analysis
- **Form themes & styling** - Pre-built visual themes and custom styling options for better branding

---

## 🎯 Current Features

### 🎨 Visual Form Builder
- **Intuitive Drag & Drop Interface** - Build forms visually by dragging field types into sections
- **Real-time Preview** - See exactly how your form will look as you build it
- **Multiple Field Types** - Support for text inputs, email, select dropdowns, checkboxes, radio buttons, textareas, and more
- **Section Management** - Organize fields into logical sections with custom titles
- **Field Configuration** - Detailed field settings including labels, placeholders, validation rules, and options
- **Responsive Design** - Forms automatically adapt to different screen sizes and devices

### 📋 Template System
- **Pre-built Templates** - Start quickly with professionally designed form templates from the backend
- **Template Selection Modal** - Choose from default templates or start with a blank canvas
- **Template Customization** - Modify templates to fit your specific needs
- **Smart Template Loading** - Templates include pre-configured sections and fields

### 🔐 User Management & Security
- **Secure Authentication** - Complete user registration and login system with Supabase Auth
- **Protected Routes** - Form builder features are only accessible to authenticated users
- **User-specific Data** - Each user only sees and can edit their own forms
- **Row Level Security (RLS)** - Database-level security ensuring data privacy

### 📊 Form Management Dashboard
- **My Forms Page** - Centralized dashboard to manage all your created forms
- **Form Status Tracking** - Visual indicators for active/inactive forms
- **Form Statistics** - See section count, field count, and creation dates
- **Quick Actions** - Edit, view responses, or open public forms directly from the dashboard
- **Form Expiration** - Automatic form deactivation after set expiry dates

### 🌐 Form Sharing & Distribution
- **Public Form URLs** - Generate shareable links for form distribution
- **Clean Public Interface** - Public forms display without navigation for distraction-free completion
- **Mobile-Optimized** - Public forms work seamlessly on all devices
- **Direct Form Access** - Users can fill forms without needing accounts

### 📈 Response Collection & Analytics
- **Response Dashboard** - Comprehensive view of all form submissions with statistics
- **Real-time Analytics** - Daily, weekly, and monthly submission tracking
- **Detailed Response View** - Click any response to see full submission details in a modal
- **Response Sorting** - Sort responses by newest or oldest first
- **Response Statistics** - Track total responses and submission patterns
- **Clean Data Display** - Properly formatted display of different field types (text, arrays, objects)

### 🎛️ Advanced Builder Features
- **Field Reordering** - Drag and drop to reorder fields within sections
- **Section Management** - Add, edit, and delete form sections with confirmation dialogs
- **Field Validation** - Set required fields and validation rules
- **Preview Mode** - Test your form before publishing
- **Form Saving** - Save drafts and publish when ready

## 🛠️ Tech Stack

### Frontend Framework
- **[Remix](https://remix.run/)** - Full-stack web framework with server-side rendering
- **[React](https://reactjs.org/)** - UI library for building interactive interfaces

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid UI development
- **[Ant Design](https://ant.design/)** - React component library for additional UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon library

### State Management
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management for form builder store

### Drag & Drop
- **[@dnd-kit](https://dndkit.com/)** - Modern drag and drop toolkit for React
  - `@dnd-kit/core` - Core drag and drop functionality
  - `@dnd-kit/sortable` - Sortable functionality for form fields

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service providing:
  - PostgreSQL database
  - Authentication system
  - Real-time subscriptions
  - Row Level Security (RLS)

### Development Tools
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better developer experience
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[ESLint](https://eslint.org/)** - Code linting and quality assurance

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend/form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Set up the required tables in your Supabase project:
   - `form_templates` - Store form structures and metadata
   - `form_submissions` - Store form responses
   
   Apply the necessary Row Level Security (RLS) policies for user data protection.

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

## 📁 Project Structure

```
form-builder/
├── app/
│   ├── components/          # Reusable UI components
│   │   └── ui/             # Core UI components
│   ├── hooks/              # Custom React hooks
│   ├── routes/             # Remix route components
│   ├── services/           # API service layers
│   ├── stores/             # Zustand state stores
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🗄️ Database Schema

### form_templates
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `form_name` (text) - Name of the form
- `description` (text) - Form description
- `form_structure` (jsonb) - Form sections and fields
- `is_active` (boolean) - Form status
- `is_default` (boolean) - Default template flag
- `expires_at` (timestamp) - Form expiration date
- `tags` (text[]) - Form tags for categorization
- `created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

### form_submissions
- `id` (UUID) - Primary key
- `form_id` (UUID) - Foreign key to form_templates
- `form_data` (jsonb) - Submitted form data
- `created_at` (timestamp) - Submission timestamp

## 🎨 Key Components

### Form Builder Core
- **DroppableSection** - Handles drag & drop zones for form sections
- **FieldPreview** - Shows field previews in the builder
- **RenderField** - Renders actual form fields
- **FormBuilderStore** - Zustand store managing form state

### Template System
- **TemplateSelectionModal** - Choose from default templates
- **TemplateCard** - Display template information and selection

### Response Management
- **ResponsesPage** - View and analyze form submissions
- **ResponseModal** - Detailed view of individual responses

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level security ensuring users only access their own data
- **Protected Routes** - Authentication required for form building features
- **Secure Authentication** - Supabase Auth with email verification
- **Form Expiration** - Automatic form deactivation after expiry dates

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Deploy to Other Platforms
The built application can be deployed to any Node.js hosting platform:
- Railway
- Render
- DigitalOcean App Platform
- AWS/Google Cloud/Azure

## 📝 Usage Guide

### Creating a Form
1. Navigate to the form builder (`/builder`)
2. Choose a template or start fresh
3. Drag field types from the sidebar to sections
4. Configure field properties in the field editor
5. Preview your form in real-time
6. Save and publish when ready

### Sharing Forms
1. Go to "My Forms" to see all your created forms
2. Click on a form to view options
3. Use the "Open" button to view the public form
4. Share the public URL with your audience

### Viewing Responses
1. Click "Responses" on any form in "My Forms"
2. View dashboard statistics (daily, weekly, monthly)
3. Click on individual responses to see detailed submissions
4. Sort responses by newest or oldest first

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Remix](https://remix.run/) for the excellent full-stack framework
- [Supabase](https://supabase.com/) for the powerful backend infrastructure
- [dnd-kit](https://dndkit.com/) for the smooth drag and drop experience
- [Tailwind CSS](https://tailwindcss.com/) for rapid UI development
- [Zustand](https://github.com/pmndrs/zustand) for simple state management

---

Built with ❤️ using modern web technologies