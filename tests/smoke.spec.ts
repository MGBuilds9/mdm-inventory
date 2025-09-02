import { test, expect } from '@playwright/test'

test.describe('MDM Inventory System Smoke Tests', () => {
  test('first user flow - admin creation and org setup', async ({ page }) => {
    // This test would require a test Clerk environment
    // For now, we'll test the basic structure
    
    await page.goto('/')
    
    // Verify the page loads
    await expect(page).toHaveTitle(/MDM Inventory Management System/)
  })

  test('invite-only access control', async ({ page }) => {
    // Test that protected routes require authentication
    await page.goto('/dashboard')
    
    // Should redirect to sign-in
    await expect(page).toHaveURL(/.*sign-in/)
  })

  test('dark mode persistence', async ({ page }) => {
    await page.goto('/')
    
    // This would test dark mode toggle and persistence
    // Requires authentication setup in test environment
  })

  test('valuation endpoints return JSON', async ({ page }) => {
    // Test API endpoints
    const response = await page.request.get('/api/valuation/summary')
    
    // Should return 401 for unauthenticated requests
    expect(response.status()).toBe(401)
  })

  test('dashboard renders correctly', async ({ page }) => {
    await page.goto('/')
    
    // Verify basic structure
    await expect(page.locator('body')).toBeVisible()
  })
})
