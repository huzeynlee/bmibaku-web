import type { LoanApplicationPayload, LoanApplicationResult } from '../types/banking';
import { config } from './config';

export const isDemoMode = (): boolean => config.loanApplicationUrl === null;

/**
 * Sends a loan application.
 * - With VITE_LOAN_APPLICATION_API_URL: POSTs JSON and returns { mode: 'live', reference }
 *   only when the server answers 2xx with a `reference` string.
 * - Without it: returns { mode: 'demo' }. Nothing is sent or stored.
 */
export async function submitLoanApplication(
  payload: LoanApplicationPayload,
  signal?: AbortSignal,
): Promise<LoanApplicationResult> {
  if (!config.loanApplicationUrl) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { mode: 'demo' };
  }
  const res = await fetch(config.loanApplicationUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'omit',
    signal,
  });
  if (!res.ok) throw new Error(`Application request failed: HTTP ${res.status}`);
  const data: unknown = await res.json().catch(() => null);
  const reference = typeof data === 'object' && data !== null ? (data as Record<string, unknown>).reference : undefined;
  if (typeof reference !== 'string' || reference.length === 0) throw new Error('Application response has no reference');
  return { mode: 'live', reference };
}
