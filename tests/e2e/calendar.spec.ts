import { test, expect } from '@playwright/test';

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/');
    await page.click('text=Sign In');
    await page.fill('input[type="email"]', 'demo@wedo.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    
    // Navigate to calendar
    await page.click('[data-tour="calendar"]');
    await expect(page).toHaveURL(/.*calendar/);
  });

  test('should display calendar view', async ({ page }) => {
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });

  test('should show bookings on calendar', async ({ page }) => {
    const bookings = page.locator('.booking-card');
    await expect(bookings.first()).toBeVisible();
  });

  test('should switch between month and week view', async ({ page }) => {
    await page.click('button:has-text("Week")');
    await expect(page.locator('.week-view')).toBeVisible();
    
    await page.click('button:has-text("Month")');
    await expect(page.locator('.month-view')).toBeVisible();
  });

  test('should navigate to next month', async ({ page }) => {
    const currentMonth = await page.locator('.calendar-header h2').textContent();
    await page.click('button[aria-label="Next month"]');
    const nextMonth = await page.locator('.calendar-header h2').textContent();
    
    expect(currentMonth).not.toBe(nextMonth);
  });

  test('should create new booking', async ({ page }) => {
    await page.click('button:has-text("New Booking")');
    await page.fill('input[name="guestName"]', 'John Doe');
    await page.fill('input[name="checkIn"]', '2024-12-25');
    await page.fill('input[name="checkOut"]', '2024-12-30');
    await page.click('button:has-text("Create")');
    
    await expect(page.locator('text=Booking created')).toBeVisible();
  });

  test('should filter bookings by status', async ({ page }) => {
    await page.click('button:has-text("All Bookings")');
    await page.click('text=Confirmed');
    
    const bookings = page.locator('.booking-card');
    await expect(bookings.first()).toHaveAttribute('data-status', 'Confirmed');
  });
});
