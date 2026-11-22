'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Route transition: each page enters with a short fade and rise; header and footer persist. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div data-reveal="" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
