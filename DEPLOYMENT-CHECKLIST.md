# 🚀 Vercel + Clerk + Supabase Deployment Checklist

## 📋 Pre-Deployment Setup

### 1. Clerk Application Setup
- [ ] Create Clerk application at [clerk.com](https://clerk.com)
- [ ] Configure OAuth providers (Google, GitHub, etc.)
- [ ] Set up webhook endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
- [ ] Copy webhook secret to environment variables
- [ ] Configure sign-in/sign-up settings

### 2. Supabase Project Setup
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Note project URL and anon key
- [ ] Enable Row Level Security (RLS)
- [ ] Configure database connection pooling
- [ ] Set up production database (not free tier for production)

### 3. GitHub Repository
- [ ] Push all code to GitHub
- [ ] Ensure `.env.local` is in `.gitignore`
- [ ] Verify `pnpm-lock.yaml` is committed
- [ ] Check all dependencies are in `package.json`

## 🔧 Vercel Configuration

### 4. Project Import
- [ ] Go to [vercel.com](https://vercel.com) and sign in
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Verify framework detection: Next.js
- [ ] Set project name: `mdm-inventory`

### 5. Environment Variables
Set these in Vercel dashboard under Settings → Environment Variables:

#### Required Variables
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase Database
DATABASE_URL=postgresql://...?pgbouncer=true&sslmode=require
DIRECT_URL=postgresql://...?sslmode=require
```

#### Optional Variables
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app
```

### 6. Build Settings
- [ ] Verify build command: `pnpm build`
- [ ] Verify install command: `pnpm install --frozen-lockfile`
- [ ] Check output directory: `.next` (auto-detected)
- [ ] Ensure Node.js version: 18.x

## 🗄️ Database Deployment

### 7. Schema Deployment
```bash
# Generate Drizzle client
pnpm db:generate

# Push schema to production database
pnpm db:push

# Seed initial data
pnpm db:seed
```

### 8. Database Views
```bash
# Create valuation views
pnpm db:views
```

### 9. Verify Database
- [ ] Check all tables created successfully
- [ ] Verify RLS policies are active
- [ ] Confirm app_roles seeded correctly
- [ ] Test database connection from Vercel

## 🔐 Authentication Configuration

### 10. Clerk Webhook Verification
- [ ] Deploy application first
- [ ] Update Clerk webhook URL to production domain
- [ ] Test webhook delivery
- [ ] Verify user creation in database

### 11. Supabase Auth Settings
- [ ] Update site URL in Supabase dashboard
- [ ] Add Vercel domain to allowed origins
- [ ] Configure CORS settings if needed

## 🚀 Deployment Process

### 12. Initial Deployment
1. Click "Deploy" in Vercel
2. Monitor build logs for errors
3. Verify deployment success
4. Test application functionality

### 13. Post-Deployment Verification
- [ ] Home page loads correctly
- [ ] Clerk sign-in/sign-up works
- [ ] Database connections succeed
- [ ] API endpoints return expected responses
- [ ] Dark mode toggle functions
- [ ] Responsive design works on mobile/tablet/desktop

## 📱 UI/UX Testing

### 14. Responsive Design
- [ ] **375px (Mobile)**: Single column layout, no horizontal scroll
- [ ] **768px (Tablet)**: Two-column layout, proper spacing
- [ ] **1280px+ (Desktop)**: Full dashboard layout, optimal spacing

### 15. Dark Mode
- [ ] System preference detection works
- [ ] User preference persists across sessions
- [ ] No flicker on page load
- [ ] Smooth transitions between themes

### 16. Core Functionality
- [ ] Dashboard loads with valuation data
- [ ] Authentication flow complete
- [ ] Role-based access control working
- [ ] API endpoints protected properly

## 🧪 Testing & Validation

### 17. Playwright Tests
```bash
# Install Playwright
pnpm dlx playwright install

# Run smoke tests
pnpm test:e2e

# Run with UI for debugging
pnpm test:e2e:ui
```

### 18. Manual Testing
- [ ] First user sign-up creates admin role
- [ ] Organization creation works
- [ ] Invitation system functions
- [ ] All user roles have appropriate access

## 🔄 Continuous Deployment

### 19. Automatic Deployments
- [ ] Verify GitHub integration
- [ ] Test push to main branch triggers deployment
- [ ] Check preview deployments for pull requests
- [ ] Verify environment variables in all environments

### 20. Monitoring
- [ ] Set up Vercel analytics
- [ ] Monitor build success rates
- [ ] Track API response times
- [ ] Watch for database connection issues

## 🚨 Rollback Procedures

### 21. Emergency Rollback
If deployment fails or issues arise:

1. **Disable Clerk Webhook**
   - Go to Clerk dashboard
   - Temporarily disable webhook endpoint
   - This prevents new user creation issues

2. **Revert Database Migration**
   ```bash
   # Revert to previous schema version
   pnpm db:rollback
   ```

3. **Manual Admin User Creation**
   ```sql
   -- Create admin user manually if needed
   INSERT INTO users (clerk_user_id, email, display_name)
   VALUES ('clerk_user_id', 'admin@company.com', 'Admin User');
   
   INSERT INTO memberships (org_id, user_id, role_key)
   VALUES ('org_id', 'user_id', 'admin');
   ```

4. **Revert Vercel Deployment**
   - Go to Vercel dashboard
   - Select previous successful deployment
   - Click "Promote to Production"

## 📊 Data Import Planning

### 22. Almyta Migration Schema

#### Components.txt → Items Table
- **Part** → SKU (unique identifier)
- **Descr** → Description (text field)
- **Units** → UOM (unit of measure)
- **Warehouse** → Warehouse assignment
- **Revision, V1, V2, V3** → Version tracking fields

#### SerialHistory.txt → Movements Table
- **Item ID** → item_id (foreign key)
- **Serial** → Reference tracking
- **trType** → Movement type mapping
- **trDate** → moved_at timestamp
- **trUnits** → Quantity (numeric)

#### InventoryLabels.txt → Enhanced Items
- **Part** → SKU
- **Descr** → Description
- **PO** → Purchase order reference
- **BatchID** → Batch tracking
- **ExpDate, ProdDate, RcvDate** → Date tracking fields

### 23. Import Process
1. **Data Validation**: Clean and validate CSV data
2. **Schema Mapping**: Map legacy fields to new schema
3. **Batch Import**: Use database tools for bulk import
4. **Verification**: Check data integrity post-import

## ✅ Final Verification

### 24. Production Readiness
- [ ] All environment variables set correctly
- [ ] Database schema deployed and verified
- [ ] Authentication working end-to-end
- [ ] API endpoints responding correctly
- [ ] UI responsive on all devices
- [ ] Dark mode functioning properly
- [ ] Role-based access control active
- [ ] Webhook processing successfully
- [ ] No build errors or warnings
- [ ] Performance metrics acceptable

### 25. Documentation
- [ ] README.md updated with production details
- [ ] Environment variable documentation complete
- [ ] Deployment procedures documented
- [ ] Troubleshooting guide available
- [ ] Rollback procedures documented

---

## 🎯 Next Steps After Deployment

1. **Monitor Performance**: Watch Vercel analytics and database performance
2. **User Onboarding**: Create first admin user and test all roles
3. **Data Migration**: Plan and execute Almyta data import
4. **Feature Development**: Continue building additional functionality
5. **Security Review**: Regular security audits and updates

---

**🚀 Your MDM Inventory System is now ready for production use!**
