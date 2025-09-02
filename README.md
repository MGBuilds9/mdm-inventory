# MDM Inventory Management System

A modern, enterprise-grade inventory management system built with Next.js 14, TypeScript, and Drizzle ORM.

## ✨ Features

- **🔐 Modern Authentication** - Clerk-powered authentication with role-based access control
- **📊 Real-time Dashboard** - Live inventory tracking and operational insights
- **🏢 Multi-tenant Support** - Organization-based user management
- **📦 Inventory Management** - SKU tracking, warehouse management, and bin locations
- **📋 Purchase Orders** - Complete PO lifecycle management
- **🚚 Shipping & Logistics** - Order fulfillment and tracking
- **📈 Advanced Reporting** - Comprehensive analytics and compliance reporting
- **🌙 Dark Mode** - Beautiful UI with theme switching
- **📱 Responsive Design** - Works perfectly on all devices

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query + Context API
- **Deployment**: Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mdm-inventory
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Copy the environment template and fill in your values:

```bash
cp env-template.txt .env.local
```

Required environment variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mdm_inventory
DIRECT_URL=postgresql://user:password@localhost:5432/mdm_inventory

# Next.js
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
AUTH_SECRET=your-random-secret-string
```

### 4. Database Setup

```bash
# Generate database migrations
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed initial data
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🗄️ Database Schema

The system includes comprehensive tables for:

- **Users & Organizations** - Multi-tenant user management
- **Inventory Items** - SKU tracking with descriptions and units
- **Warehouses & Bins** - Location-based inventory management
- **Projects** - Project-based inventory allocation
- **Movements** - Complete audit trail of inventory changes
- **Roles & Permissions** - Granular access control

## 🔐 User Roles

- **Admin** - Full system access and user management
- **Buyer** - Purchase order creation and supplier management
- **Approver** - Financial decision approval authority
- **Warehouse** - Inventory and shipping operations
- **Manager** - Operational oversight and reporting
- **Auditor** - Read-only access for compliance

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── inventory/      # Inventory management
│   ├── purchase-orders/ # Purchase order management
│   └── ...
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and constants
├── server/             # Server-side code
│   └── db/            # Database schema and connections
└── types/              # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🧪 Testing

```bash
# Run Playwright tests
pnpm test

# Run tests in UI mode
pnpm test:ui
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the [documentation](docs/)
- Review the [deployment guide](VERCEL-DEPLOYMENT.md)

## 🔄 Changelog

### v1.0.0
- Initial release with core inventory management
- Role-based access control
- Multi-tenant organization support
- Modern Next.js 14 architecture
