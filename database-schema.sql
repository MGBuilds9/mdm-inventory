-- MDM Inventory Management System Database Schema
-- This file contains all the necessary tables, relationships, and RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (multi-tenant support)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'buyer', 'approver', 'warehouse', 'manager', 'auditor')),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    payment_terms VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table (inventory)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit_of_measure VARCHAR(50) NOT NULL DEFAULT 'EA',
    cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_stock_level INTEGER NOT NULL DEFAULT 0,
    max_stock_level INTEGER NOT NULL DEFAULT 1000,
    current_stock INTEGER NOT NULL DEFAULT 0,
    bin_location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, sku)
);

-- Purchase Orders table
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    po_number VARCHAR(100) NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    supplier_name VARCHAR(255) NOT NULL,
    buyer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE RESTRICT,
    buyer_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'ordered', 'received', 'cancelled')),
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, po_number)
);

-- Purchase Order Items table
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    item_sku VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    received_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Orders table
CREATE TABLE shipping_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    so_number VARCHAR(100) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT,
    customer_city VARCHAR(100),
    customer_state VARCHAR(100),
    customer_zip VARCHAR(20),
    customer_country VARCHAR(100) DEFAULT 'USA',
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'picking', 'picked', 'shipped', 'delivered', 'cancelled')),
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ship_date DATE,
    tracking_number VARCHAR(100),
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, so_number)
);

-- Shipping Order Items table
CREATE TABLE shipping_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipping_order_id UUID NOT NULL REFERENCES shipping_orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    item_sku VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    picked_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Transactions table (audit trail)
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    item_sku VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('receipt', 'issue', 'adjustment', 'transfer')),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_items_organization_sku ON items(organization_id, sku);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_purchase_orders_organization ON purchase_orders(organization_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_shipping_orders_organization ON shipping_orders(organization_id);
CREATE INDEX idx_shipping_orders_status ON shipping_orders(status);
CREATE INDEX idx_stock_transactions_item ON stock_transactions(item_id);
CREATE INDEX idx_stock_transactions_organization ON stock_transactions(organization_id);
CREATE INDEX idx_user_profiles_organization ON user_profiles(organization_id);
CREATE INDEX idx_suppliers_organization ON suppliers(organization_id);

-- Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organizations
CREATE POLICY "Users can view their own organization" ON organizations
    FOR SELECT USING (id IN (
        SELECT organization_id FROM user_profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Admins can manage organizations" ON organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role = 'admin' 
            AND organization_id = organizations.id
        )
    );

-- RLS Policies for User Profiles
CREATE POLICY "Users can view profiles in their organization" ON user_profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage user profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role = 'admin' 
            AND organization_id = user_profiles.organization_id
        )
    );

-- RLS Policies for Suppliers
CREATE POLICY "Users can view suppliers in their organization" ON suppliers
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Buyers and Admins can manage suppliers" ON suppliers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'buyer') 
            AND organization_id = suppliers.organization_id
        )
    );

-- RLS Policies for Items
CREATE POLICY "Users can view items in their organization" ON items
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Warehouse and Admins can manage items" ON items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'warehouse') 
            AND organization_id = items.organization_id
        )
    );

-- RLS Policies for Purchase Orders
CREATE POLICY "Users can view purchase orders in their organization" ON purchase_orders
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Buyers can create purchase orders" ON purchase_orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'buyer') 
            AND organization_id = purchase_orders.organization_id
        )
    );

CREATE POLICY "Buyers and Admins can update purchase orders" ON purchase_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'buyer') 
            AND organization_id = purchase_orders.organization_id
        )
    );

-- RLS Policies for Purchase Order Items
CREATE POLICY "Users can view PO items in their organization" ON purchase_order_items
    FOR SELECT USING (
        purchase_order_id IN (
            SELECT id FROM purchase_orders 
            WHERE organization_id IN (
                SELECT organization_id FROM user_profiles WHERE id = auth.uid()
            )
        )
    );

-- RLS Policies for Shipping Orders
CREATE POLICY "Users can view shipping orders in their organization" ON shipping_orders
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Warehouse and Admins can manage shipping orders" ON shipping_orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'warehouse') 
            AND organization_id = shipping_orders.organization_id
        )
    );

-- RLS Policies for Stock Transactions
CREATE POLICY "Users can view stock transactions in their organization" ON stock_transactions
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Warehouse and Admins can create stock transactions" ON stock_transactions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'warehouse') 
            AND organization_id = stock_transactions.organization_id
        )
    );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at updates
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_orders_updated_at BEFORE UPDATE ON shipping_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, organization_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User'),
        -- You'll need to set a default organization or handle this differently
        (SELECT id FROM organizations LIMIT 1)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample organization (you can modify this)
INSERT INTO organizations (name, address, city, state, zip_code, country, phone, email)
VALUES (
    'MDM Group Inc.',
    '123 Business Street',
    'New York',
    'NY',
    '10001',
    'USA',
    '+1-555-0123',
    'info@mdmgroup.com'
) ON CONFLICT DO NOTHING;
