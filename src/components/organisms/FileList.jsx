import React from 'react';
import { motion } from 'framer-motion';
import FilePreview from '@/components/molecules/FilePreview'; // Updated import path

function FileList({ files, onFileDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-surface rounded-lg p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Your Files ({files.length})</h2>
      <div className="space-y-4">
        {files.map(file => (
          <FilePreview key={file.id} file={file} onDelete={onFileDelete} />
        ))}
      </div>
    </motion.div>
  );
}

export default FileList;