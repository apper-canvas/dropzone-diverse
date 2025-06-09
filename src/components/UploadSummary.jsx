import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'

function UploadSummary({ files, allCompleted }) {
  const totalFiles = files.length
  const completedFiles = files.filter(f => f.status === 'completed').length
  const uploadingFiles = files.filter(f => f.status === 'uploading').length
  const errorFiles = files.filter(f => f.status === 'error').length
  
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const completedSize = files.filter(f => f.status === 'completed').reduce((sum, f) => sum + f.size, 0)
  
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-surface/80 to-surface/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Upload Progress</h2>
        {allCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 text-accent"
          >
            <ApperIcon name="CheckCircle" className="w-5 h-5" />
            <span className="font-medium">All Complete!</span>
          </motion.div>
        )}
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Overall Progress</span>
          <span className="text-sm font-medium text-white">
            {overallProgress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {uploadingFiles > 0 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "linear"
                }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalFiles}</div>
          <div className="text-sm text-gray-400">Total Files</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{completedFiles}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        
        {uploadingFiles > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-primary flex items-center justify-center">
              {uploadingFiles}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1,
                  ease: "linear"
                }}
                className="ml-1"
              >
                <ApperIcon name="Loader" className="w-4 h-4" />
              </motion.div>
            </div>
            <div className="text-sm text-gray-400">Uploading</div>
          </div>
        )}
        
        {errorFiles > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{errorFiles}</div>
            <div className="text-sm text-gray-400">Errors</div>
          </div>
        )}
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-300">
            {formatFileSize(completedSize)}
          </div>
          <div className="text-sm text-gray-400">
            of {formatFileSize(totalSize)}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UploadSummary