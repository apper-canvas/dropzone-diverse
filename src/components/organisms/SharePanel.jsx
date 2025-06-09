import React from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function SharePanel({ sessionData }) {
  if (!sessionData) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionData.shareableLink)
      .then(() => toast.success('Share link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link.'));
  };

  const totalFilesSize = sessionData.files.reduce((sum, f) => sum + f.size, 0);
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
className="bg-gradient-to-br from-surface-800 to-surface-900 rounded-lg p-6 shadow-xl border border-surface-600 text-center"
    >
      <h2 className="text-3xl font-bold text-white mb-4">Sharing Ready!</h2>
      <p className="text-gray-200 text-lg mb-6">
        {sessionData.files.length} files ({formatBytes(totalFilesSize)}) uploaded.
      </p>

<div className="flex items-center justify-between bg-surface-700 rounded-lg p-3 pr-4 mb-6 break-all">
        <span className="text-gray-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{sessionData.shareableLink}</span>
        <button
          onClick={handleCopyLink}
className="ml-4 px-4 py-2 bg-accent text-white rounded-md hover:bg-green-600 transition-colors flex-shrink-0"
        >
          Copy Link
        </button>
      </div>

      <p className="text-gray-400 text-sm">
        This link is valid for a limited time.
      </p>
    </motion.div>
  );
}

export default SharePanel;