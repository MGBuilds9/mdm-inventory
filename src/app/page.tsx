'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'

export default function HomePage() {
  const { profile, loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If authenticated, show dashboard-style home page
  if (profile) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile.full_name}!
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your inventory, track orders, and monitor operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Items</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Low Stock</h3>
              <p className="text-3xl font-bold text-orange-600">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Purchase Orders</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Orders</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // If not authenticated, show landing page
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MDM Inventory Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Enterprise inventory management with real-time tracking
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
