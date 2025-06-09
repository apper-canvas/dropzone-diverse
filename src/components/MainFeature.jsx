import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DropZone from './DropZone'
import FileList from './FileList'
import SharePanel from './SharePanel'

function MainFeature() {
  const [files, setFiles] = useState([])
  const [sessionData, setSessionData] = useState(null)

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
      uploadedAt: new Date().toISOString()
    }))

    setFiles(prev => [...prev, ...filesWithMetadata])
    
    // Simulate upload for demo
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
      updateFile({ status: 'uploading', progress: 0 })

      for (let progress = 0; progress <= 100; progress += Math.random() * 15) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
        
        const finalProgress = Math.min(progress, 100)
        const speed = 1.2 + Math.random() * 3
        
        updateFile({ 
          progress: finalProgress,
          uploadSpeed: finalProgress < 100 ? speed : 0
        })
      }

      const shareLink = `https://dropzone.pro/file/${fileData.id}`
      updateFile({ 
        status: 'completed', 
        progress: 100, 
        uploadSpeed: 0,
        shareLink 
      })

    } catch (error) {
      updateFile({ 
        status: 'error', 
        progress: 0, 
        uploadSpeed: 0 
      })
    }
  }

  const handleFileDelete = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const completedFiles = files.filter(f => f.status === 'completed')

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
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
        {completedFiles.length > 0 && (
          <SharePanel 
            sessionData={{
              sessionId: `session-${Date.now()}`,
              files: completedFiles,
              shareableLink: `https://dropzone.pro/share/${Date.now()}`
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature