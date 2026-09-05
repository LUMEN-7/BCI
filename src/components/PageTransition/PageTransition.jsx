import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                x: 30,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            exit={{
                opacity: 0,
                x: -30,
            }}
            transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            }}
            style={{
                width: '100%',
                minHeight: '100%',
            }}
        >
            {children}
        </motion.div>
    );
}