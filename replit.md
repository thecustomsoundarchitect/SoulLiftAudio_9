# SoulLift Audio - Personalized Audio Message Creator

## Overview

SoulLift Audio is a full-stack web application that enables users to create personalized audio messages called "Soul Hugs." The application guides users through a multi-step process to craft meaningful audio messages with AI-generated voices, background music, and custom cover images. It's built as a modern React application with a Node.js/Express backend, using TypeScript throughout for type safety.

## System Architecture

The application follows a monorepo structure with clear separation between frontend, backend, and shared components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for global state (SoulHugContext)
- **Styling**: Tailwind CSS with custom design system and shadcn/ui components
- **UI Components**: Custom components built on Radix UI primitives
- **Animations**: Framer Motion for smooth interactions and transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling
- **Storage**: In-memory storage with interface for future database integration

### Development Setup
- **Monorepo**: Single repository with client/, server/, and shared/ directories
- **Path Aliases**: Configured for clean imports (@/, @shared/)
- **Development Server**: Vite dev server with Express API proxy
- **Hot Reload**: Full-stack hot reloading in development

## Key Components

### User Journey Components
1. **DefinePage**: Initial step for defining recipient, core feeling, occasion, and tone
2. **GatherPage**: Collecting specific memories and descriptors about the recipient
3. **CraftPage**: Composing and editing the personalized message
4. **AudioHugPage**: Recording or generating AI voice, adding music and cover art

### Audio Processing Components
- **AudioRecorder**: Browser-based audio recording with MediaRecorder API
- **AIVoiceSelector**: Integration point for AI text-to-speech generation
- **BackgroundMusicSelector**: Music library with volume controls
- **CoverImageSelector**: Image selection and upload functionality

### Delivery Components
- **DeliveryOptions**: QR codes, download packages, and sharing options
- **MyHugsPage**: Personal library of created Soul Hugs

### UI/UX Components
- **Navigation**: Responsive navigation with progress indicators
- **BottomNavigation**: Mobile-optimized tab navigation
- **ProgressIndicator**: Multi-step process visualization
- **Animated Components**: Various UI animations and transitions

## Data Flow

### State Management
The application uses React Context for managing the current Soul Hug creation process:

```typescript
interface SoulHug {
  recipient?: string
  coreFeeling?: string
  occasion?: string
  tone?: string
  ingredients?: string[]
  descriptors?: string[]
  message?: string
  audioUrl?: string
  coverImage?: string
  backgroundMusic?: string
}
```

### Data Persistence
- **Development**: In-memory storage for rapid prototyping
- **Production Ready**: Database schema defined with Drizzle ORM
- **Future Integration**: PostgreSQL with Neon Database planned

### User Flow
1. **Define** → Basic parameters (recipient, feeling, occasion, tone)
2. **Gather** → Specific memories and descriptors
3. **Craft** → Message composition with drag-and-drop ingredients
4. **Audio** → Voice recording/generation, music, and visual elements
5. **Deliver** → Export, share, and save options

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Animations**: Framer Motion
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Utilities**: clsx, class-variance-authority for styling

### Backend Dependencies
- **Server**: Express.js with TypeScript
- **Database**: Drizzle ORM with PostgreSQL support
- **Session**: Planned session management with connect-pg-simple
- **Development**: tsx for TypeScript execution

### Planned Integrations
- **AI Voice**: OpenAI Text-to-Speech API
- **Database**: Neon PostgreSQL
- **File Storage**: Cloud storage for audio/image assets
- **Authentication**: User accounts and session management

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express API
- **Hot Reloading**: Full-stack development with instant updates
- **Environment**: NODE_ENV=development with development middleware

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: esbuild compilation to single JavaScript file
- **Deployment**: Static frontend with Node.js backend
- **Environment Variables**: DATABASE_URL for PostgreSQL connection

### Replit Integration
- **Development Banner**: Replit-specific development tools
- **Cartographer**: Replit code mapping in development
- **Runtime Error Overlay**: Enhanced error handling in development

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
- July 02, 2025. Successfully migrated from Bolt to Replit
  - Installed missing dependencies: simplex-noise, @tabler/icons-react, qrcode, jszip, file-saver
  - Fixed React context provider issue by moving SoulHugProvider to App.tsx
  - Application now running successfully on port 5000
  - All components and pages loading correctly
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```