import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadFileService } from '@/services';

// Organisms
import HeaderSection from '@/components/organisms/HeaderSection';
import UploadSummary from '@/components/organisms/UploadSummary';
import DropZone from '@/components/organisms/DropZone';
import FileList from '@/components/organisms/FileList';
import SharePanel from '@/components/organisms/SharePanel';
import GlobalDragOverlay from '@/components/organisms/GlobalDragOverlay';

function HomePage() {
  const [files, setFiles] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedFiles = uploadFileService.getUploadHistory();
    if (savedFiles.length > 0) {
      setFiles(savedFiles);
      
      const completedFiles = savedFiles.filter(f => f.status === 'completed');
      if (completedFiles.length > 0) {
        setSessionData({
          sessionId: `session-${Date.now()}`,
          files: completedFiles,
          totalSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
          completedSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
          shareableLink: `https://dropzone.pro/share/${Date.now()}`
        });
      }
    }
  }, []);

  const handleFilesAdded = (newFiles) => {
    const filesWithMetadata = newFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      uploadSpeed: 0,
      shareLink: '',
      thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      uploadedAt: new Date().toISOString(),
      file: file // Keep reference to actual file
    }));

    setFiles(prev => [...prev, ...filesWithMetadata]);
    
    filesWithMetadata.forEach(fileData => {
      simulateUpload(fileData);
    });
  };

  const simulateUpload = async (fileData) => {
    const updateFile = (updates) => {
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, ...updates } : f
      ));
    };

    try {
      updateFile({ status: 'uploading', progress: 0 });

      for (let progress = 0; progress <= 100; progress += Math.random() * 15) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        
        const finalProgress = Math.min(progress, 100);
        const speed = 1.2 + Math.random() * 3;
        
        updateFile({ 
          progress: finalProgress,
          uploadSpeed: finalProgress < 100 ? speed : 0
        });
      }

      const shareLink = `https://dropzone.pro/file/${fileData.id}`;
      updateFile({ 
        status: 'completed', 
        progress: 100, 
        uploadSpeed: 0,
        shareLink 
      });

      // The original Home.jsx had this call here, capturing 'files' from the closure.
      // Keeping it as is to preserve original functionality.
      uploadFileService.saveUploadHistory([...files, { ...fileData, status: 'completed', shareLink }]);

    } catch (error) {
      updateFile({ 
        status: 'error', 
        progress: 0, 
        uploadSpeed: 0 
      });
    }
  };

  const handleFileDelete = (fileId) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      uploadFileService.saveUploadHistory(updated);
      return updated;
    });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFilesAdded(droppedFiles);
    }
  };

  const completedFiles = files.filter(f => f.status === 'completed');
  const totalCompleted = completedFiles.length;
  const allCompleted = files.length > 0 && files.every(f => f.status === 'completed');

  // Preserve original dependency array from Home.jsx
  useEffect(() => {
    if (completedFiles.length > 0) {
      setSessionData({
        sessionId: `session-${Date.now()}`,
        files: completedFiles,
        totalSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
        completedSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
        shareableLink: `https://dropzone.pro/share/${Date.now()}`
      });
    } else {
      setSessionData(null);
    }
  }, [completedFiles.length]);

  return (
    <div 
      className="min-h-screen p-4 max-w-full overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <GlobalDragOverlay isDragging={isDragging} />

      <div className="max-w-6xl mx-auto space-y-8">
        <HeaderSection />

        {files.length > 0 && (
          <UploadSummary 
            files={files}
            allCompleted={allCompleted}
          />
        )}

        <DropZone 
          onFilesAdded={handleFilesAdded}
          hasFiles={files.length > 0}
        />

        <AnimatePresence>
          {files.length > 0 && (
            <FileList 
              files={files}
              onFileDelete={handleFileDelete}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sessionData && totalCompleted > 0 && (
            <SharePanel sessionData={sessionData} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HomePage;