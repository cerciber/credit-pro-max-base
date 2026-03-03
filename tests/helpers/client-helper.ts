import { Page } from '@playwright/test';
import { Exceptions } from '../global-types';

export class ClientHelper {
  private page: Page;
  private errors: string[] = [];
  private exceptions: Exceptions;

  constructor(page: Page, exceptions: Exceptions) {
    this.page = page;
    this.exceptions = exceptions;
    this.setupErrorHandling();
  }

  private truncateMessage(text: string, maxLines: number = 2): string {
    const lines = text.split('\n');

    if (lines.length <= maxLines * 2) {
      return text;
    }

    const firstLines = lines.slice(0, maxLines);
    const lastLines = lines.slice(-maxLines);

    return [
      ...firstLines,
      `... (${lines.length - maxLines * 2} líneas omitidas) ...`,
      ...lastLines,
    ].join('\n');
  }

  private setupErrorHandling(): void {
    this.page.on('pageerror', (error) => {
      this.errors.push(`➔  PageError: ${this.truncateMessage(error.message)}`);
    });

    this.page.on('console', (msg) => {
      if (
        msg.type() === 'error' &&
        !msg.text().includes('Failed to load resource')
      ) {
        this.errors.push(
          `➔  ConsoleError: ${this.truncateMessage(msg.text())}`
        );
      }
    });

    this.page.on('response', (response) => {
      if (
        response.status() >= 400 &&
        !this.exceptions.statusCodeExceptions?.includes(response.status())
      ) {
        this.errors.push(
          `➔  HTTPError: ${response.status()}: ${response.url()}`
        );
      }
    });
  }

  public validateNoErrors(): void {
    if (this.errors.length > 0) {
      throw new Error(
        `\x1b[31mDetected errors:\x1b[0m\n\x1b[31m${this.errors.join('\n')}\x1b[0m`
      );
    }
  }

  public getErrors(): string[] {
    return this.errors;
  }

  public clearErrors(): void {
    this.errors = [];
  }
}
