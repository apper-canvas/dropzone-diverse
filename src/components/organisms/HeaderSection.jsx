import React from 'react';
import { motion } from 'framer-motion';

const HeaderSection = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
        >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
                DropZone Pro
            </h1>
            <p className="text-gray-400 text-lg">
                Upload and share files quickly with beautiful progress tracking
            </p>
        </motion.div>
    );
};

export default HeaderSection;