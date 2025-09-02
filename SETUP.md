# MDM Inventory Management System - Setup Guide

This guide will walk you through setting up the enhanced inventory management system with Supabase integration and deploying to Vercel.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project
- Vercel account (recommended for deployment)
- Git (for version control)

## Step 1: Clone and Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd mdm-inventory

# Install dependencies
npm install
```

## Step 2: Supabase Project Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `mdm-inventory`
   - Database Password: Choose a strong password
   - Region: Select closest to your users
5. Click "Create new project"

### 2.2 Get Project Credentials

1. In your Supabase project dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key

### 2.3 Environment Configuration

1. Copy the environment example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Database Setup

### 3.1 Run Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `database-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables, indexes, and RLS policies

### 3.2 Verify Database Setup

After running the schema, you should see:
- ✅ All tables created successfully
- ✅ Row Level Security enabled
- ✅ RLS policies configured
- ✅ Indexes created for performance
- ✅ Triggers for automatic timestamp updates

## Step 4: Authentication Setup

### 4.1 Configure Auth Settings

1. In Supabase dashboard, go to Authentication → Settings
2. Configure your site URL (for development: `http://localhost:5173`)
3. Add redirect URLs:
   - `http://localhost:5173/login`
   - `http://localhost:5173/`

### 4.2 Email Templates (Optional)

1. Go to Authentication → Email Templates
2. Customize welcome and confirmation emails
3. Test email delivery

## Step 5: Row Level Security (RLS) Verification

### 5.1 Test RLS Policies

1. Create a test user account
2. Verify they can only see data from their organization
3. Test role-based access controls

### 5.2 RLS Policy Summary

The system includes these RLS policies:
- **Organizations**: Users can only see their own organization
- **User Profiles**: Users can view profiles in their organization, update their own
- **Items**: Warehouse users and admins can manage inventory
- **Purchase Orders**: Buyers can create, approvers can approve, warehouse can receive
- **Shipping Orders**: Warehouse users can manage shipping operations
- **Stock Transactions**: Warehouse users can create audit trail entries

## Step 6: Local Development

### 6.1 Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6.2 Production Build (Local Testing)

```bash
npm run build
npm run preview
```

## Step 7: Vercel Deployment (Recommended)

### 7.1 Deploy to Vercel

1. **Push to GitHub**: Ensure your code is committed and pushed to a GitHub repository
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

### 7.2 Configure Environment Variables

1. In your Vercel project dashboard, go to Settings → Environment Variables
2. Add the following variables:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 7.3 Deploy

1. Click "Deploy" - Vercel will automatically:
   - Install dependencies
   - Build the project
   - Deploy to a production URL
   - Set up automatic deployments on future commits

### 7.4 Update Supabase Auth Settings

1. In your Supabase dashboard, go to Authentication → Settings
2. Update the site URL to your Vercel domain
3. Add your Vercel domain to redirect URLs

## Step 8: Initial Data Setup

### 8.1 Create First Organization

The schema automatically creates a default organization, but you can customize it:

```sql
UPDATE organizations 
SET name = 'Your Company Name',
    address = 'Your Address',
    city = 'Your City',
    state = 'Your State',
    zip_code = 'Your ZIP',
    phone = 'Your Phone',
    email = 'your-email@company.com'
WHERE id = (SELECT id FROM organizations LIMIT 1);
```

### 8.2 Create Admin User

1. Sign up through the application
2. The system will automatically create a user profile
3. Update the user role to 'admin' in the database:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@company.com';
```

### 8.3 Add Sample Data (Optional)

You can add sample inventory items, suppliers, and other data for testing:

```sql
-- Sample supplier
INSERT INTO suppliers (organization_id, name, contact_person, email, phone, address, city, state, zip_code)
SELECT 
    o.id,
    'Sample Supplier Inc.',
    'John Doe',
    'john@supplier.com',
    '+1-555-0123',
    '123 Supplier St',
    'Supplier City',
    'SC',
    '12345'
FROM organizations o LIMIT 1;

-- Sample inventory item
INSERT INTO items (organization_id, sku, name, description, category, unit_of_measure, cost_price, selling_price, min_stock_level, max_stock_level, current_stock)
SELECT 
    o.id,
    'SAMPLE-001',
    'Sample Product',
    'This is a sample product for testing',
    'Electronics',
    'EA',
    10.00,
    15.00,
    5,
    100,
    25
FROM organizations o LIMIT 1;
```

## Step 9: Testing the System

### 9.1 Test User Roles

1. **Admin User**: Should have access to all features
2. **Buyer User**: Should be able to create purchase orders
3. **Approver User**: Should be able to approve purchase orders
4. **Warehouse User**: Should be able to manage inventory and shipping
5. **Manager User**: Should have operational oversight
6. **Auditor User**: Should have read-only access

### 9.2 Test Core Features

1. **Dashboard**: Verify statistics load correctly
2. **Inventory**: Test item creation, editing, and deletion
3. **Purchase Orders**: Test PO workflow from draft to received
4. **Shipping**: Test shipping order workflow
5. **Search**: Test search functionality across all modules

## Step 10: Vercel Benefits & Features

### 10.1 Automatic Deployments

- Every push to main branch triggers automatic deployment
- Preview deployments for pull requests
- Easy rollback to previous versions

### 10.2 Performance & Analytics

- Global CDN for fast loading worldwide
- Built-in performance monitoring
- Automatic HTTPS and security headers

### 10.3 Environment Management

- Separate environment variables for development/staging/production
- Easy management through Vercel dashboard
- Secure handling of sensitive data

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env` file exists and has correct values (local development)
   - Verify environment variables are set in Vercel dashboard (production)
   - Restart the development server after changing environment variables

2. **"Row Level Security policy violation"**
   - Verify RLS policies are properly configured
   - Check user organization assignment
   - Ensure user has appropriate role permissions

3. **"Database connection failed"**
   - Verify Supabase project is active
   - Check network connectivity
   - Verify API keys are correct

4. **"Authentication not working"**
   - Check Supabase Auth settings
   - Verify redirect URLs include your Vercel domain
   - Check browser console for errors

5. **"Build failed on Vercel"**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Ensure Node.js version compatibility (18+)

### Getting Help

1. Check the browser console for error messages
2. Verify Supabase dashboard for any service issues
3. Check Vercel deployment logs for build issues
4. Review the RLS policies and database schema

## Next Steps

After successful setup, consider implementing:

1. **Advanced Features**:
   - Barcode scanning integration
   - Mobile app development
   - Advanced reporting and analytics
   - Integration with accounting systems

2. **Performance Optimization**:
   - Database query optimization
   - Caching strategies
   - Real-time updates optimization

3. **Security Enhancements**:
   - Two-factor authentication
   - Audit logging
   - Advanced role permissions

4. **Business Process Automation**:
   - Automated reorder points
   - Email notifications
   - Workflow automation

## Support

For technical support or questions:
- Check the project documentation
- Review Supabase documentation
- Review Vercel documentation
- Contact the development team
- Create issues in the project repository

---

**Note**: This system is designed for enterprise use with proper security measures. Always test thoroughly in a staging environment before deploying to production. Vercel deployment provides the best performance and ease of management for production use.
