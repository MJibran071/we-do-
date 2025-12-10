import { test, expect } from '@playwright/test';

test.describe('Inbox', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/');
    await page.click('text=Sign In');
    await page.fill('input[type="email"]', 'demo@wedo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    
    // Navigate to inbox
    await page.click('[data-tour="inbox"]');
    await expect(page).toHaveURL(/.*inbox/);
  });

  test('should display message threads', async ({ page }) => {
    await expect(page.locator('[data-tour="thread-list"]')).toBeVisible();
    const threads = page.locator('.thread-item');
    await expect(threads.first()).toBeVisible();
  });

  test('should open thread details', async ({ page }) => {
    await page.click('.thread-item:first-child');
    await expect(page.locator('.message-content')).toBeVisible();
  });

  test('should generate AI draft reply', async ({ page }) => {
    await page.click('.thread-item:first-child');
    await page.click('button:has-text("Generate Reply")');
    
    // Wait for AI to generate draft
    await page.waitForSelector('[data-tour="ai-draft"]', { timeout: 10000 });
    await expect(page.locator('[data-tour="ai-draft"]')).not.toBeEmpty();
  });

  test('should send message', async ({ page }) => {
    await page.click('.thread-item:first-child');
    await page.fill('textarea[placeholder*="Type your message"]', 'Test message');
    await page.click('button:has-text("Send")');
    
    await expect(page.locator('text=Test message')).toBeVisible();
  });

  test('should filter threads by status', async ({ page }) => {
    await page.click('button:has-text("All")');
    await page.click('text=Unread');
    
    const threads = page.locator('.thread-item');
    await expect(threads.first()).toHaveAttribute('data-status', 'Unread');
  });

  test('should search threads', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'booking');
    await page.waitForTimeout(500); // Debounce
    
    const threads = page.locator('.thread-item');
    await expect(threads).toHaveCount(1, { timeout: 5000 });
  });

  test('should use message template', async ({ page }) => {
    await page.click('.thread-item:first-child');
    await page.click('[data-tour="templates"]');
    await page.click('.template-item:first-child');
    
    const textarea = page.locator('textarea[placeholder*="Type your message"]');
    await expect(textarea).not.toBeEmpty();
  });
});
