/**
 * Integration endpoints from environment variables (see .env.example).
 * Production builds accept only HTTPS or same-origin relative URLs.
 */
function endpoint(value: string | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw, window.location.origin);
    const sameOrigin = url.origin === window.location.origin;
    if (import.meta.env.PROD && url.protocol !== 'https:' && !sameOrigin) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const config = {
  loanApplicationUrl: endpoint(import.meta.env.VITE_LOAN_APPLICATION_API_URL),
  ratesUrl: endpoint(import.meta.env.VITE_RATES_API_URL),
  ratesHistoryUrl: endpoint(import.meta.env.VITE_RATES_HISTORY_API_URL),
} as const;
