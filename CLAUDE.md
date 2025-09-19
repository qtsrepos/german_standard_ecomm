# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev        # Start development server on port 3035
npm run build      # Build the application for production  
npm start          # Start production server on port 3035
npm run lint       # Run ESLint
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with credentials, Google, and phone providers
- **State Management**: Redux Toolkit with redux-persist
- **UI Libraries**: Ant Design (antd), Bootstrap, React Icons
- **Styling**: SASS/SCSS modules
- **API Communication**: Axios with TanStack React Query
- **Internationalization**: i18next with React i18next

### Project Structure

This is an e-commerce application with three main user roles:
- **User**: Regular customers who can browse products, add to cart, and place orders
- **Seller**: Store owners who can manage products and view orders  
- **Admin**: Platform administrators with full access to all features

### Key Architecture Patterns

#### Authentication Flow
- NextAuth configuration in `src/app/api/auth/[...nextauth]/options.ts`
- Three authentication providers: credentials (email/password), Google OAuth, phone OTP
- JWT-based sessions with 7-day expiration
- Middleware protection in `src/middleware.ts` for role-based access control

#### State Management
- Redux store configuration in `src/redux/store/store.ts`
- Persisted slices: Cart, Category, Settings, Location, Language, Auth, Checkout, LocalCart
- Redux Toolkit slices in `src/redux/slice/` directory

#### API Configuration
- Base API configuration in `src/config/API.ts` (public endpoints)
- Admin API endpoints in `src/config/API_ADMIN.ts`
- API utilities in `src/util/apicall.ts` and `src/util/apicall_server.ts`

#### Route Structure
- `(auth)` - Authentication pages (login, signup, forgot password)
- `(dashboard)/auth` - Admin/seller dashboard protected routes
- `(screens)` - Public pages (home, product listings, checkout)
- `(user)` - Protected user account pages

#### Component Organization
- Shared components in `src/components/`
- Route-specific components in `_components/` folders within each route
- Custom hooks in `src/shared/hook/`
- Helper functions in `src/shared/helpers/`

### Important Configuration
- Next.js configuration allows all remote image domains
- Application runs on port 3035 in both development and production
- Firebase integration for authentication and notifications
- Google Maps API integration for location services