'use client';

import { Modal, type ModalProps } from './Modal';

/** Side panel docked to the inline-end edge (right in LTR, left in RTL). */
export function Drawer(props: Omit<ModalProps, 'variant'>) {
  return <Modal {...props} variant="drawer" />;
}
