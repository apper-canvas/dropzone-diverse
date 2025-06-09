import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DropZone from '../components/DropZone'
import FileList from '../components/FileList'
import SharePanel from '../components/SharePanel'
import UploadSummary from '../components/UploadSummary'
import { uploadFileService } from '../services'

function Home() {
  const [files, setFiles] = useState([])
  const [sessionData, setSessionData] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    // Load saved files from localStorage on mount
    const savedFiles = uploadFileService.getUploadHistory()
    if (savedFiles.length > 0) {
      setFiles(savedFiles)
      
      // Create session data for completed files
      const completedFiles = savedFiles.filter(f => f.status === 'completed')
      if (completedFiles.length > 0) {
        setSessionData({
          sessionId: `session-${Date.now()}`,
          files: completedFiles,
          totalSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
          completedSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
          shareableLink: `https://dropzone.pro/share/${Date.now()}`
        })
      }
    }
  }, [])

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
    }))

    setFiles(prev => [...prev, ...filesWithMetadata])
    
    // Start upload simulation for new files
    filesWithMetadata.forEach(fileData => {
      simulateUpload(fileData)
    })
  }

  const simulateUpload = async (fileData) => {
    const updateFile = (updates) => {
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, ...updates } : f
      ))
    }

    try {
      // Start upload
      updateFile({ status: 'uploading', progress: 0 })

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += Math.random() * 15) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
        
        const finalProgress = Math.min(progress, 100)
        const speed = 1.2 + Math.random() * 3 // MB/s
        
        updateFile({ 
          progress: finalProgress,
          uploadSpeed: finalProgress < 100 ? speed : 0
        })
      }

      // Complete upload
      const shareLink = `https://dropzone.pro/file/${fileData.id}`
      updateFile({ 
        status: 'completed', 
        progress: 100, 
        uploadSpeed: 0,
        shareLink 
      })

      // Save to localStorage
      uploadFileService.saveUploadHistory([...files, { ...fileData, status: 'completed', shareLink }])

    } catch (error) {
      updateFile({ 
        status: 'error', 
        progress: 0, 
        uploadSpeed: 0 
      })
    }
  }

  const handleFileDelete = (fileId) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId)
      uploadFileService.saveUploadHistory(updated)
      return updated
    })
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      handleFilesAdded(droppedFiles)
    }
  }

  const completedFiles = files.filter(f => f.status === 'completed')
  const totalCompleted = completedFiles.length
  const allCompleted = files.length > 0 && files.every(f => f.status === 'completed')

  // Update session data when files change
  useEffect(() => {
    if (completedFiles.length > 0) {
      setSessionData({
        sessionId: `session-${Date.now()}`,
        files: completedFiles,
        totalSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
        completedSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
        shareableLink: `https://dropzone.pro/share/${Date.now()}`
      })
    } else {
      setSessionData(null)
    }
  }, [completedFiles.length])

  return (
    <div 
      className="min-h-screen p-4 max-w-full overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
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

        {/* Upload Summary */}
        {files.length > 0 && (
          <UploadSummary 
            files={files}
            allCompleted={allCompleted}
          />
        )}

        {/* Drop Zone */}
        <DropZone 
          onFilesAdded={handleFilesAdded}
          hasFiles={files.length > 0}
        />

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <FileList 
              files={files}
              onFileDelete={handleFileDelete}
            />
          )}
        </AnimatePresence>

        {/* Share Panel */}
        <AnimatePresence>
          {sessionData && totalCompleted > 0 && (
            <SharePanel sessionData={sessionData} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Home