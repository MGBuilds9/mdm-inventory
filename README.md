# MDM Inventory

A modern, comprehensive inventory management system built with Next.js, Express, and PostgreSQL. Features include user authentication, role-based access control, purchase orders, sales orders, inventory tracking, and project-based valuation.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Express.js with TypeScript and Drizzle ORM
- **Database**: PostgreSQL with comprehensive schema
- **Authentication**: JWT-based with role-based access control
- **Deployment**: Docker containers with Nginx reverse proxy

## 📁 Project Structure

```
mdm-inventory/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/        # App router pages
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   ├── lib/        # Utility functions
│   │   │   └── types/      # TypeScript type definitions
│   │   ├── package.json
│   │   └── tailwind.config.js
│   └── server/             # Express.js backend API
│       ├── src/
│       │   ├── controllers/ # Route controllers
│       │   ├── db/         # Database schema and connection
│       │   ├── middleware/ # Express middleware
│       │   ├── routes/     # API route definitions
│       │   └── utils/      # Utility functions
│       ├── package.json
│       └── drizzle.config.ts
├── packages/
│   └── shared/             # Shared types and utilities
├── docker-compose.yml      # Production deployment
├── package.json            # Root workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 14+
- Docker (for production deployment)

### 1. Environment Setup

Copy the environment files and update with your values:

```bash
# Server environment
cp apps/server/env.local.example apps/server/.env.local
cp apps/server/env.production.example apps/server/.env.production

# Web environment
cp apps/web/env.local.example apps/web/.env.local
cp apps/web/env.production.example apps/web/.env.production
```

Update the following variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong random secret for JWT tokens
- `CORS_ORIGINS`: Allowed origins for CORS

### 2. Database Setup

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# Seed initial data (optional)
pnpm db:seed
```

### 3. Development

```bash
# Start both applications in development mode
pnpm dev

# Or start individually:
pnpm --filter ./apps/server dev    # Backend on :4000
pnpm --filter ./apps/web dev       # Frontend on :3000
```

### 4. Production Deployment

```bash
# Build and start with Docker
docker compose up -d --build

# Check health status
curl http://localhost:4000/health
curl http://localhost:3000
```

## 🔐 Authentication & Roles

### User Roles

- **Admin**: Full system access, user management, team setup
- **Manager**: Department oversight, approval workflows
- **Buyer**: Purchase order creation and management
- **Approver**: Purchase order approval
- **Warehouse**: Inventory management, receiving, shipping
- **Auditor**: Read-only access to all data
- **Employee**: Basic access based on role
- **Viewer**: Read-only access to assigned areas

### Sign-up Flow

1. **First User**: Automatically becomes admin and creates organization
2. **Subsequent Users**: Require invite code from existing admin
3. **Role Assignment**: Automatically assigned based on invite or admin selection

## 🗄️ Database Schema

### Core Tables

- **Users & Teams**: Authentication and organization structure
- **Inventory**: Items, warehouses, bins, stock levels
- **Purchase Orders**: PO management with line items and charges
- **Sales Orders**: SO management with shipments and invoices
- **Projects**: Project-based inventory valuation
- **Movements**: Append-only ledger for stock tracking

### Key Features

- **Stock Tracking**: Real-time inventory levels with reserved quantities
- **Lot & Serial Tracking**: Support for traceable items
- **Project Valuation**: Track inventory value by project
- **Movement Ledger**: Complete audit trail of all stock changes

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Current user info
- `POST /api/auth/invite` - Create invite codes (admin)

### Inventory
- `GET /api/inventory/items` - List inventory items
- `POST /api/inventory/items` - Create new item
- `PUT /api/inventory/items/:id` - Update item
- `GET /api/inventory/stock` - Current stock levels

### Purchase Orders
- `GET /api/purchase-orders` - List POs
- `POST /api/purchase-orders` - Create PO
- `PUT /api/purchase-orders/:id/status` - Update PO status

### Reports
- `GET /api/reports/inventory-value` - Total inventory value
- `GET /api/reports/project-valuation` - Project-based valuation
- `GET /api/reports/movements` - Stock movement history

## 🎨 Frontend Features

### Theme System
- Light/dark mode toggle
- Persistent theme preference
- Consistent theming across all components

### Responsive Design
- Mobile-first approach
- Responsive tables and forms
- Adaptive navigation

### Component Library
- Built with shadcn/ui
- Accessible and customizable
- Dark mode support

## 🐳 Docker Deployment

### Local Development
```bash
docker compose -f docker-compose.dev.yml up -d
```

### Production
```bash
docker compose up -d --build
```

### Health Checks
- API: `http://localhost:4000/health`
- Web: `http://localhost:3000`

## 🔧 Configuration

### Nginx Proxy Manager Setup

1. Create proxy host for `inventory.mdmgroupinc.ca`
2. Forward `/` to `mdm-web:3000`
3. Forward `/api/*` to `mdm-api:4000`
4. Enable SSL with Let's Encrypt
5. Add headers: `X-Forwarded-Proto`, `X-Forwarded-For`, `X-Real-IP`

### Environment Variables

#### Server (.env.local)
```bash
NODE_ENV=development
DATABASE_URL=postgres://user:pass@localhost:5432/mdm_inventory
JWT_SECRET=your-secret-key
API_BASE_URL=http://localhost:4000
CORS_ORIGINS=http://localhost:3000,https://inventory.mdmgroupinc.ca
TRUST_PROXY=true
```

#### Web (.env.local)
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=MDM Inventory
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,https://inventory.mdmgroupinc.ca
```

## 🧪 Testing

### API Testing
```bash
# Health check
curl http://localhost:4000/health

# Authentication
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","company":"Test Co","email":"admin@test.com","password":"password123"}'
```

### Frontend Testing
```bash
# Run linting
pnpm --filter ./apps/web lint

# Type checking
pnpm --filter ./apps/web type-check
```

## 📊 Monitoring & Health

### Health Endpoints
- **API Health**: `/health` - Database connectivity and system status
- **Web Health**: Root endpoint - Application availability

### Logging
- Structured logging with timestamps
- Error tracking and debugging information
- Production-ready logging configuration

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- CORS protection
- Rate limiting
- Input validation with Zod
- SQL injection protection via Drizzle ORM
- Helmet.js security headers

## 🚀 Performance

- Database connection pooling
- Response compression
- Efficient queries with Drizzle ORM
- Optimized bundle sizes
- Image optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is proprietary software for MDM Group Inc.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Contact the development team

---

**MDM Inventory** - Modern inventory management for the digital age.
