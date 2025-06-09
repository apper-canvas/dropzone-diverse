import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import FilePreview from './FilePreview'
import { useState } from 'react'

function FileList({ files, onFileDelete }) {
  const [previewFile, setPreviewFile] = useState(null)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image'
    if (type === 'application/pdf') return 'FileText'
    if (type.includes('document') || type.includes('word')) return 'FileText'
    if (type.includes('sheet') || type.includes('excel')) return 'FileSpreadsheet'
    return 'File'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-accent'
      case 'uploading': return 'text-primary'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle'
      case 'uploading': return 'Loader'
      case 'error': return 'XCircle'
      default: return 'Clock'
    }
  }

  const handleCopyLink = (shareLink) => {
    navigator.clipboard.writeText(shareLink)
    toast.success('Share link copied to clipboard!')
  }

  const handleDelete = (fileId, fileName) => {
    onFileDelete(fileId)
    toast.success(`${fileName} removed`)
  }

  const handlePreview = (file) => {
    if (file.type.startsWith('image/')) {
      setPreviewFile(file)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-surface/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Uploaded Files ({files.length})
          </h3>
          <div className="text-sm text-gray-400">
            {files.filter(f => f.status === 'completed').length} completed
          </div>
        </div>

        <div className="space-y-4 max-w-full overflow-hidden">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background/50 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-all duration-200"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  {/* File Icon/Thumbnail */}
                  <div className="flex-shrink-0">
                    {file.thumbnailUrl ? (
                      <motion.img
                        src={file.thumbnailUrl}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handlePreview(file)}
                        whileHover={{ scale: 1.05 }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                        <ApperIcon 
                          name={getFileIcon(file.type)} 
                          className="w-6 h-6 text-gray-400" 
                        />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate break-words">
                      {file.name}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      <span className={getStatusColor(file.status)}>
                        {file.status}
                      </span>
                      {file.uploadSpeed > 0 && (
                        <span className="text-primary">
                          {file.uploadSpeed.toFixed(1)} MB/s
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">
                            {file.progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full relative overflow-hidden"
                            style={{ width: `${file.progress}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 1.5,
                                ease: "linear"
                              }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <motion.div
                      animate={file.status === 'uploading' ? { rotate: 360 } : {}}
                      transition={{ 
                        repeat: file.status === 'uploading' ? Infinity : 0,
                        duration: 1,
                        ease: "linear"
                      }}
                    >
                      <ApperIcon 
                        name={getStatusIcon(file.status)} 
                        className={`w-5 h-5 ${getStatusColor(file.status)}`} 
                      />
                    </motion.div>

                    {file.status === 'completed' && file.shareLink && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopyLink(file.shareLink)}
                        className="p-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
                        title="Copy share link"
                      >
                        <ApperIcon name="Copy" className="w-4 h-4 text-primary" />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(file.id, file.name)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* File Preview Modal */}
      <FilePreview 
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  )
}

export default FileList