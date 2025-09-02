import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ShippingPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Shipping Management
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage shipping orders and logistics
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Shipping Management Coming Soon
              </h3>
              <p className="text-gray-600">
                Complete shipping and logistics features are being developed.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
