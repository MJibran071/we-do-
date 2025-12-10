import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('WeDo');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page.locator('h2')).toContainText('Welcome Back');
  });

  test('should login successfully', async ({ page }) => {
    await page.click('text=Sign In');
    await page.fill('input[type="email"]', 'demo@wedo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('text=Sign In');
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('text=Get Started');
    await expect(page.locator('h2')).toContainText('Create Account');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.click('text=Sign In');
    await page.fill('input[type="email"]', 'demo@wedo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    // Should redirect to landing page
    await expect(page).toHaveURL('/');
  });
});
