export const pageTransition = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.02, y: -8 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

export const heartPageTransition = {
  initial: { opacity: 0, scale: 0.9, rotate: -2 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 1.05, rotate: 2 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.4, delayChildren: 0.15 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const floatY = {
  animate: {
    y: [0, -10, 0],
    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
  },
};

export const breathe = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 2.4, ease: "easeInOut" },
  },
};
