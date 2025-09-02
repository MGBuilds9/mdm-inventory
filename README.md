# MDM Inventory Management System

A modern, enterprise-grade inventory management system built with Next.js 14, Clerk authentication, and Supabase Postgres.

## 🚀 Features

- **🔐 Secure Authentication**: Clerk-powered user management with role-based access control
- **🗄️ Real-time Database**: Supabase Postgres with Drizzle ORM for type-safe database operations
- **📱 Responsive Design**: Mobile-first UI that works on all devices (375px, 768px, 1280px+)
- **🌙 Dark Mode**: Persistent theme preference with no flicker
- **📊 Real-time Dashboard**: Live inventory valuation and project tracking
- **🔒 Role-based Access**: Admin, Buyer, Approver, Warehouse, Manager, Auditor roles
- **📦 Inventory Management**: SKU tracking, warehouse/bin management, movement history
- **📈 Valuation Tracking**: Real-time cost calculations and project-based reporting

## 🏗️ Architecture

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **Authentication**: Clerk (OAuth, MFA, User Management)
- **Database**: Supabase Postgres with Drizzle ORM
- **Deployment**: Vercel (automatic deployments, global CDN)
- **Testing**: Playwright for end-to-end testing

## 📋 Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase account and project
- Clerk account and application
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd mdm-inventory
pnpm install
```

### 2. Environment Setup

Copy the environment template and configure your keys:

```bash
cp env-template.txt .env.local
```

Required environment variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase Database
DATABASE_URL=postgresql://...?pgbouncer=true&sslmode=require
DIRECT_URL=postgresql://...?sslmode=require
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed initial data
pnpm db:seed
```

### 4. Development

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Core Tables

- **`app_roles`**: System roles (admin, buyer, approver, warehouse, manager, auditor)
- **`organizations`**: Multi-tenant organization support
- **`users`**: User profiles linked to Clerk authentication
- **`memberships`**: User-organization-role relationships
- **`items`**: Inventory items with SKU tracking
- **`warehouses` & `bins`**: Location management
- **`projects`**: Project-based inventory tracking
- **`movements`**: All inventory transactions with audit trail

### Database Views

- **`valuation_summary`**: Total inventory value and counts
- **`valuation_by_project`**: Project-specific inventory values

## 🔐 Authentication & Authorization

### Clerk Integration

- OAuth providers (Google, GitHub, etc.)
- Multi-factor authentication
- User profile management
- Webhook-based user provisioning

### Role-based Access Control

- **Admin**: Full system access, user management
- **Buyer**: Purchase order creation, supplier management
- **Approver**: Financial approvals, purchase order approval
- **Warehouse**: Inventory operations, shipping management
- **Manager**: Operational oversight, reporting
- **Auditor**: Read-only access for compliance

## 🎨 UI/UX Features

### Responsive Design

- **Mobile**: 375px+ (single column layout)
- **Tablet**: 768px+ (two-column layout)
- **Desktop**: 1280px+ (full dashboard layout)

### Dark Mode

- System preference detection
- User preference persistence
- No flicker on page load
- Smooth transitions

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**: Ensure code is committed and pushed
2. **Connect to Vercel**: Import repository at [vercel.com](https://vercel.com)
3. **Configure Environment**: Set all required environment variables
4. **Deploy**: Automatic deployment on every push

### Environment Variables in Vercel

```bash
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
DATABASE_URL
DIRECT_URL

# Optional
NEXT_PUBLIC_API_BASE_URL
```

### Database Migrations

```bash
# Production deployment
pnpm db:migrate

# Development
pnpm db:push
```

## 🧪 Testing

### Playwright Tests

```bash
# Install Playwright
pnpm dlx playwright install

# Run tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui
```

### Test Coverage

- User authentication flows
- Role-based access control
- Dark mode persistence
- API endpoint validation
- Dashboard functionality

## 📊 Data Import Planning

### Almyta Headers Mapping

The system is designed to support data import from legacy systems:

#### Components.txt → Items Table
- **Part** → SKU
- **Descr** → Description
- **Units** → UOM
- **Warehouse** → Warehouse assignment
- **Revision, V1, V2, V3** → Version tracking

#### SerialHistory.txt → Movements Table
- **Item ID** → item_id
- **Serial** → Reference tracking
- **trType** → Movement type mapping
- **trDate** → moved_at
- **trUnits** → Quantity

#### InventoryLabels.txt → Enhanced Items
- **Part** → SKU
- **Descr** → Description
- **PO** → Purchase order reference
- **BatchID** → Batch tracking
- **ExpDate, ProdDate, RcvDate** → Date tracking

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
pnpm db:generate  # Generate Drizzle client
pnpm db:push      # Push schema changes
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed initial data
pnpm db:studio    # Database browser
pnpm test:e2e     # End-to-end tests
```

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # React components
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── server/             # Server-side code
│   └── db/            # Database schema & client
└── types/              # TypeScript types
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**: Verify `DATABASE_URL` and `DIRECT_URL`
2. **Clerk Authentication**: Check webhook configuration and environment variables
3. **Build Failures**: Ensure all dependencies are installed with pnpm
4. **Migration Issues**: Use `DIRECT_URL` for migrations, `DATABASE_URL` for runtime

### Rollback Procedures

1. **Webhook Issues**: Disable Clerk webhook temporarily
2. **Database Migration**: Revert to previous migration version
3. **User Access**: Manually seed admin user in database

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation links above

---

**Built with ❤️ using modern web technologies**
