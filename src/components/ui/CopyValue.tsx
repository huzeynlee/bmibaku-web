'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useI18n } from '@/i18n/client';

export function CopyValue({ value, label }: { value: string; label: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const id = window.setTimeout(() => setState('idle'), 2000);
    return () => window.clearTimeout(id);
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(value).then(() => setState('copied'), () => setState('failed'))}
        aria-label={`${t.common.copy}: ${label}`}
        className="focus-ring grid size-9 shrink-0 place-items-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-900"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={state} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
            {state === 'copied' ? <Check className="size-4 text-success" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </button>
      <span className="sr-only" aria-live="polite">
        {state === 'copied' ? t.common.copied : state === 'failed' ? t.common.copyFailed : ''}
      </span>
    </>
  );
}
