import { Montserrat, Open_Sans } from 'next/font/google';

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-montserrat',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-open-sans',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const fontConfig = {
  primary: 'var(--font-open-sans)',
  secondary: 'var(--font-montserrat)',
  fallback:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;
