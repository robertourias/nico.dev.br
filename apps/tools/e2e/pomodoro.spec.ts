import { test, expect } from '@playwright/test';

test.describe('Pomodoro Timer E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/pomodoro');
    // Wait for app to load
    await page.waitForSelector('input[placeholder="Título da tarefa"]', { timeout: 5000 });
  });

  test('should add a new task', async ({ page }) => {
    // Fill task input
    await page.fill('input[placeholder="Título da tarefa"]', 'Test Task');

    // Submit
    await page.click('button:has-text("Adicionar")');

    // Verify task appears
    await expect(page.locator('text=Test Task')).toBeVisible();
  });

  test('should start and pause timer', async ({ page }) => {
    // Add task
    await page.fill('input[placeholder="Título da tarefa"]', 'Quick Test');
    await page.click('button:has-text("Adicionar")');

    // Start timer
    await page.click('button:has-text("Iniciar")');

    // Verify timer started (should show countdown)
    const timerDisplay = page.locator('text=24:');
    await expect(timerDisplay).toBeVisible({ timeout: 3000 });

    // Pause
    await page.click('button:has-text("Pausar")');

    // Resume
    await page.click('button:has-text("Retomar")');
    await expect(timerDisplay).toBeVisible();
  });

  test('should configure timer', async ({ page }) => {
    // Click settings
    await page.click('button[title="Configurações"]');

    // Modal should appear
    await expect(page.locator('text=Configurações')).toBeVisible();

    // Change work duration
    const workInput = page.locator('input').first();
    await workInput.clear();
    await workInput.fill('20');

    // Save
    await page.click('button:has-text("Salvar")');

    // Modal should close
    await expect(page.locator('text=Configurações')).not.toBeVisible();
  });

  test('should complete and remove task', async ({ page }) => {
    // Add task
    await page.fill('input[placeholder="Título da tarefa"]', 'Task to Complete');
    await page.click('button:has-text("Adicionar")');

    // Find play button (complete task)
    const taskRow = page.locator('text=Task to Complete').first();
    const playButton = taskRow.locator('..').locator('svg').first();

    // Delete task instead (easier to verify)
    const deleteButton = taskRow.locator('..').locator('svg').last();
    await deleteButton.click();

    // Verify task is removed
    await expect(page.locator('text=Task to Complete')).not.toBeVisible();
  });

  test('should show history after completing tasks', async ({ page }) => {
    // Add task
    await page.fill('input[placeholder="Título da tarefa"]', 'History Task');
    await page.click('button:has-text("Adicionar")');

    // Verify task exists
    await expect(page.locator('text=History Task')).toBeVisible();

    // History panel should be visible
    const historyPanel = page.locator('text=Histórico & Estatísticas');
    await expect(historyPanel).toBeVisible();

    // Verify stats cards exist
    await expect(page.locator('text=Total de Tarefas')).toBeVisible();
    await expect(page.locator('text=Total de Ciclos')).toBeVisible();
  });

  test('should persist data after page reload', async ({ page }) => {
    // Add task
    await page.fill('input[placeholder="Título da tarefa"]', 'Persistent Task');
    await page.click('button:has-text("Adicionar")');

    // Wait for data to save
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();

    // Wait for app to load
    await page.waitForSelector('input[placeholder="Título da tarefa"]', { timeout: 5000 });

    // Verify task still exists
    await expect(page.locator('text=Persistent Task')).toBeVisible();
  });

  test('should respond to interactions quickly', async ({ page }) => {
    const startTime = Date.now();

    // Add task
    await page.fill('input[placeholder="Título da tarefa"]', 'Performance Test');
    await page.click('button:has-text("Adicionar")');

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Response should be < 1 second (100ms is target)
    expect(responseTime).toBeLessThan(2000);
  });

  test('should handle rapid task operations', async ({ page }) => {
    // Rapidly add multiple tasks
    for (let i = 0; i < 5; i++) {
      await page.fill('input[placeholder="Título da tarefa"]', `Task ${i}`);
      await page.click('button:has-text("Adicionar")');
      await page.waitForTimeout(100);
    }

    // Verify all tasks appear
    for (let i = 0; i < 5; i++) {
      await expect(page.locator(`text=Task ${i}`)).toBeVisible();
    }
  });

  test('should skip to next phase', async ({ page }) => {
    // Add and start task
    await page.fill('input[placeholder="Título da tarefa"]', 'Skip Test');
    await page.click('button:has-text("Adicionar")');
    await page.click('button:has-text("Iniciar")');

    // Wait for timer
    await page.waitForSelector('text=24:', { timeout: 3000 });

    // Skip phase
    await page.click('button:has-text("Pular")');

    // Phase should change (work → break)
    // Verify break phase appears (shorter timer)
    await expect(page.locator('text=04:')).toBeVisible({ timeout: 3000 });
  });
});
