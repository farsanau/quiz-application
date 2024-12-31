const { test, expect } = require("@playwright/test");

test("Main page has expected title", async ({ page }) => {
    await page.goto("http://localhost:7777/");
    const title = await page.title();
    expect(title).toBe("Quiz Application");
});

test("Main page has expected headings.", async ({ page }) => {
    await page.goto("http://localhost:7777/");
    await expect(page.locator("h1")).toHaveText("Quiz Application");
    await expect(page.locator('a:has-text("Topics")')).toHaveText("Topics");
});

test("Login form displays correctly", async ({ page }) => {
    await page.goto("http://localhost:7777/auth/login");
    await expect(page.locator("h1")).toHaveText("Login!");
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[type="submit"]')).toHaveValue("Login");
});

test("User can register with valid details", async ({ page }) => {
    await page.goto("http://localhost:7777/auth/register");
    await page.fill('input[name="email"]', "testuser@test.com");
    await page.fill('input[name="password"]', "test1234");
    await page.fill('input[name="verification"]', "test1234");
    await page.click('button:has-text("Register")');

    // Assuming successful registration redirects to login page
    await expect(page).toHaveURL("http://localhost:7777/auth/login");
});

test("Admin can log in with correct credentials", async ({ page }) => {
    await page.goto("http://localhost:7777/auth/login");
    await page.fill('input[name="email"]', "admin@admin.com");
    await page.fill('input[name="password"]', "123456");
    await page.click('input[type="submit"]');
    await page.waitForURL("http://localhost:7777/topics");
});

test("Admin creates a new topic", async ({ page }) => {
    // Login as admin
    await page.goto("http://localhost:7777/auth/login");
    await page.fill('input[name="email"]', "admin@admin.com");
    await page.fill('input[name="password"]', "123456");
    await page.click('input[type="submit"]');

    // Create a topic
    await page.goto("http://localhost:7777/topics");
    await page.fill('input[name="name"]', "New Topic");
    await page.click('button:has-text("Add Topic")');
    await expect(page.locator('a:has-text("New Topic")')).toHaveText(
        "New Topic",
    );
});

test("Topics page shows no topics when none exist", async ({ page }) => {
    await page.goto("http://localhost:7777/quiz");

    // Assuming the page shows an alert or text when no topics are available
    await expect(page.locator("div.alert")).toHaveText(
        "No topics available for quiz.",
    );
});

test("Topic page lists all questions", async ({ page }) => {
    await page.goto("http://localhost:7777/topics/1");
    await expect(page.locator("h1")).toHaveText("Questions for Topic: ");
    await expect(page.locator("ul li")).toBeVisible(); // Assuming there's at least one question
});
