import React from 'react';
import ApperIcon from '../ApperIcon'; // Fixed relative import path
import { motion } from 'framer-motion';

function FilePreview({ file, onDelete }) {
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals; // Fixed: changed &lt; to <
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'uploading': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center p-4 bg-surface rounded-lg shadow-lg relative overflow-hidden"
    >
      {file.thumbnailUrl && (
        <img src={file.thumbnailUrl} alt="Thumbnail" className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
      )}
      {!file.thumbnailUrl && (
        <div className="w-16 h-16 bg-gray-700 rounded-md mr-4 flex-shrink-0 flex items-center justify-center">
          <ApperIcon iconName="file" className="text-gray-300 text-3xl" />
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-lg font-semibold truncate">{file.name}</h3>
        <p className="text-sm text-gray-400">{formatBytes(file.size)}</p>
<div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${file.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={`${getStatusColor(file.status)} capitalize`}>{file.status}</span>
          {file.status === 'uploading' && (
            <span className="text-gray-400">{file.uploadSpeed.toFixed(1)} MB/s</span>
          )}
          {file.status === 'completed' && file.shareLink && (
            <a href={file.shareLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Share Link</a>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(file.id)}
        className="ml-4 p-2 rounded-full hover:bg-red-600/30 text-red-400 transition-colors"
      >
        <ApperIcon iconName="trash" className="text-xl" />
      </button>
    </motion.div>
  );
}

export default FilePreview;