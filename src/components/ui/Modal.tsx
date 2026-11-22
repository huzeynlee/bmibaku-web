'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  closeLabel: string;
  children: ReactNode;
  /** `center`: dialog on ≥640px, bottom sheet on phones. `drawer`: docked to the inline end. */
  variant?: 'center' | 'drawer';
  className?: string;
}

/**
 * Accessible dialog on native <dialog>: the browser traps focus, closes on Esc
 * and returns focus to the trigger. Clicking the backdrop also closes it.
 */
export function Modal({ open, onClose, labelledBy, describedBy, closeLabel, children, variant = 'center', className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const drawer = variant === 'drawer';

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cx(
        'bg-transparent p-0 text-ink',
        drawer
          ? 'is-drawer m-0 ms-auto h-dvh max-h-none w-full max-w-lg'
          : 'm-0 mt-auto w-full max-w-none sm:m-auto sm:w-[min(100%-2rem,36rem)]',
      )}
    >
      <div
        className={cx(
          'modal-panel relative flex flex-col overflow-y-auto overscroll-contain bg-white shadow-2xl',
          drawer ? 'h-full' : 'max-h-[92dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)] sm:rounded-2xl',
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="focus-ring absolute end-3 top-3 z-10 grid size-11 place-items-center rounded-full text-slate-500 transition-colors duration-200 ease-out hover:bg-slate-100 hover:text-navy-900"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
