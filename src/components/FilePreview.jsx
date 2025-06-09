import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'

function FilePreview({ file, isOpen, onClose }) {
  if (!file) return null

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-600">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-600">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-white truncate break-words">
                    {file.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-300" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {file.type.startsWith('image/') ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center"
                  >
                    <img
                      src={file.thumbnailUrl}
                      alt={file.name}
                      className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                    />
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="File" className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-400">
                      Preview not available for this file type
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-600 bg-background/50">
                <div className="text-sm text-gray-400">
                  {file.status === 'completed' ? 'Upload completed' : `Status: ${file.status}`}
                </div>
                
                {file.shareLink && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigator.clipboard.writeText(file.shareLink)
                      toast.success('Share link copied!')
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium"
                  >
                    <ApperIcon name="Share2" className="w-4 h-4 inline mr-2" />
                    Share
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilePreview