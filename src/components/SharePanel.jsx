import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

function SharePanel({ sessionData }) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionData.shareableLink)
    toast.success('Share link copied to clipboard!')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const generateQRCode = (text) => {
    // Simple QR code pattern for demo - in real app would use QR library
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(text)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-accent/10 to-primary/10 backdrop-blur-md rounded-2xl p-6 border border-accent/30"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
          <ApperIcon name="Share2" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Share Your Files</h3>
          <p className="text-gray-400 text-sm">
            {sessionData.files.length} files • {formatFileSize(sessionData.totalSize)} total
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Share Link */}
        <div className="space-y-4">
          <h4 className="font-medium text-white">Shareable Link</h4>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-background/50 rounded-lg p-3 border border-gray-600 min-w-0">
              <p className="text-sm text-gray-300 truncate break-words">
                {sessionData.shareableLink}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg hover:shadow-primary/25 transition-all duration-200"
            >
              <ApperIcon name="Copy" className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
            >
              <ApperIcon name="Mail" className="w-4 h-4 inline mr-2" />
              Email
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
            >
              <ApperIcon name="MessageCircle" className="w-4 h-4 inline mr-2" />
              WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors"
            >
              <ApperIcon name="Share" className="w-4 h-4 inline mr-2" />
              More
            </motion.button>
          </div>
        </div>

        {/* QR Code */}
        <div className="space-y-4">
          <h4 className="font-medium text-white">QR Code</h4>
          
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white rounded-xl shadow-lg"
            >
              <img
                src={generateQRCode(sessionData.shareableLink)}
                alt="QR Code"
                className="w-24 h-24"
              />
            </motion.div>
          </div>
          
          <p className="text-xs text-gray-400 text-center">
            Scan to download files on mobile
          </p>
        </div>
      </div>

      {/* File Summary */}
      <div className="mt-6 pt-6 border-t border-gray-600">
        <h4 className="font-medium text-white mb-3">Files in this share</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-full overflow-hidden">
          {sessionData.files.slice(0, 4).map((file) => (
            <div key={file.id} className="flex items-center space-x-2 text-sm text-gray-300 min-w-0">
              <ApperIcon name="File" className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate break-words">{file.name}</span>
            </div>
          ))}
          {sessionData.files.length > 4 && (
            <div className="text-sm text-gray-400">
              +{sessionData.files.length - 4} more files
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default SharePanel