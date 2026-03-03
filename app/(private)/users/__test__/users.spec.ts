import { test, expect } from '@playwright/test';
import { UsersRepository } from '../../../../src/modules/users/repository/users-repository';
import {
  generateTestUser,
  deleteUser,
} from '../../../../tests/helpers/user-helpers';
import { doLogin } from '../../../../tests/helpers/login-helpers';
import { CreateUser } from '../../../../src/modules/users/schemas/create-user-schema';

test.describe('Users CRUD', () => {
  let usersRepository: UsersRepository;
  let adminUser: CreateUser;
  let testUserId: string;

  test.beforeAll(async () => {
    usersRepository = new UsersRepository();
  });

  test.beforeEach(async () => {
    adminUser = generateTestUser('admin');
    const user = await usersRepository.createUser(adminUser);
    testUserId = user.id;
  });

  test.afterEach(async () => {
    try {
      await usersRepository.deleteUser(testUserId);
    } catch {
      // User already deleted
    }
  });

  doTest('Consultar usuarios', async ({ page }) => {
    await doLogin(page, adminUser.username, adminUser.password);
    await page.waitForURL('/home');
    await page.goto('/users');

    await expect(page.getByTestId('users-title')).toBeVisible();
    await expect(page.getByText(adminUser.username).first()).toBeVisible();
  });

  doTest('Crear usuario', async ({ page }) => {
    await doLogin(page, adminUser.username, adminUser.password);
    await page.waitForURL('/home');
    await page.goto('/users');

    await page.getByTestId('add-user-button').click();

    const newUser = generateTestUser('client');
    await page.getByTestId('add-username-input').fill(newUser.username);
    await page.getByTestId('add-email-input').fill(newUser.email);
    await page.getByTestId('add-password-input').fill(newUser.password);
    await page.getByTestId('add-name-input').fill(newUser.name);

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/users') &&
        response.request().method() === 'POST'
    );
    await page.getByTestId('create-user-button').click();
    await responsePromise;

    await expect(page.getByText(newUser.username).first()).toBeVisible();

    await deleteUser(usersRepository, newUser);
  });

  doTest('Actualizar usuario', async ({ page }) => {
    await doLogin(page, adminUser.username, adminUser.password);
    await page.waitForURL('/home');
    await page.goto('/users');

    await page.getByTestId(`edit-user-${testUserId}`).click();

    const updatedName = 'Usuario Actualizado';
    await page.getByTestId('edit-name-input').fill(updatedName);
    await page.getByTestId('update-user-button').click();

    await expect(page.getByText(updatedName)).toBeVisible();
  });

  doTest('Eliminar usuario', async ({ page }) => {
    const userToDelete = generateTestUser('client');
    const createdUser = await usersRepository.createUser(userToDelete);

    await doLogin(page, adminUser.username, adminUser.password);
    await page.waitForURL('/home');
    await page.goto('/users');

    await page.getByTestId(`delete-user-${createdUser.id}`).click();

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/api/users/${createdUser.id}`) &&
        response.request().method() === 'DELETE'
    );
    await page.getByTestId('confirm-delete-button').click();
    await responsePromise;

    await expect(
      page.getByRole('cell', { name: userToDelete.username })
    ).not.toBeVisible();
  });
});
