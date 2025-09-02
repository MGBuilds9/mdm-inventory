import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Inventory Management
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your inventory items and stock levels
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Inventory Management Coming Soon
              </h3>
              <p className="text-gray-600">
                Full inventory management features are being developed.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
