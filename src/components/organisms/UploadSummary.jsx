import React from 'react';
import { motion } from 'framer-motion';

function UploadSummary({ files, allCompleted }) {
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const completedSize = files.filter(f => f.status === 'completed').reduce((sum, f) => sum + f.size, 0);

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const calculateOverallProgress = () => {
    if (totalSize === 0) return 0;
    return (completedSize / totalSize) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-surface rounded-lg p-6 shadow-xl border border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Upload Summary</h2>
      <div className="grid grid-cols-2 gap-4 text-gray-300">
        <div>
          <p className="text-sm">Total Files:</p>
          <p className="text-lg font-semibold">{totalFiles}</p>
        </div>
        <div>
          <p className="text-sm">Completed:</p>
          <p className="text-lg font-semibold">{completedFiles}</p>
        </div>
        <div>
          <p className="text-sm">Total Size:</p>
          <p className="text-lg font-semibold">{formatBytes(totalSize)}</p>
        </div>
        <div>
          <p className="text-sm">Uploaded Size:</p>
          <p className="text-lg font-semibold">{formatBytes(completedSize)}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">Overall Progress</h3>
<div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${allCompleted ? 'bg-green-500' : 'bg-primary'}`}
            style={{ width: `${calculateOverallProgress()}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-400 mt-1">{calculateOverallProgress().toFixed(1)}%</p>
      </div>

      {allCompleted && (
        <p className="text-center text-green-400 mt-4 text-md font-medium">
          All files successfully uploaded! 🎉
        </p>
      )}
    </motion.div>
  );
}

export default UploadSummary;