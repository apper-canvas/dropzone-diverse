import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalDragOverlay = ({ isDragging }) => {
    return (
        <AnimatePresence>
            {isDragging && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                    >
                        <div className="text-6xl mb-4">📁</div>
                        <h2 className="text-3xl font-bold text-white">Drop files anywhere to upload</h2>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalDragOverlay;