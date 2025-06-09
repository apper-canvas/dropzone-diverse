import React, { useRef } from 'react';
import { toast } from 'react-toastify';

function DropZone({ onFilesAdded, hasFiles }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesAdded(files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`relative p-8 border-2 border-dashed rounded-lg text-center transition-all duration-300 ${
        hasFiles
          ? 'border-gray-600 bg-surface-dark hover:border-primary'
          : 'border-primary-500 bg-primary/10 hover:border-primary-400'
      }`}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="mb-4 text-6xl">
        {hasFiles ? '➕' : '⬆️'}
      </div>
      <p className="text-lg text-gray-300">
        <span className="font-semibold">Drag &amp; Drop files here</span> or{' '}
        <button
          onClick={handleBrowseClick}
          className="text-primary-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1 -m-1"
        >
          browse
        </button>
        {' '}to upload
      </p>
      {hasFiles && (
        <p className="text-sm text-gray-500 mt-2">
          (Adding more files to current session)
        </p>
      )}
    </div>
  );
}

export default DropZone;