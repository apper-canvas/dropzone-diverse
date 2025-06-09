import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

function DropZone({ onFilesAdded, hasFiles }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const validateFiles = (files) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    const validFiles = []
    const errors = []

    files.forEach(file => {
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max 100MB)`)
      } else if (!allowedTypes.includes(file.type) && file.type) {
        errors.push(`${file.name} type not supported`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
    }

    return validFiles
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles = validateFiles(files)
    
    if (validFiles.length > 0) {
      onFilesAdded(validFiles)
      toast.success(`${validFiles.length} file(s) added for upload`)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = validateFiles(files)
    
    if (validFiles.length > 0) {
      onFilesAdded(validFiles)
      toast.success(`${validFiles.length} file(s) added for upload`)
    }
    
    // Reset input
    e.target.value = ''
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${hasFiles ? 'h-48' : 'h-64 md:h-80'} transition-all duration-300`}
    >
      <motion.div
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200 backdrop-blur-sm
          ${isDragging 
            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/25 scale-105' 
            : 'border-gray-600 bg-surface/50 hover:border-secondary hover:bg-surface/70'
          }
        `}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx"
        />

        <motion.div
          animate={isDragging ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className={`
            w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4
            ${isDragging 
              ? 'bg-gradient-to-r from-primary to-secondary' 
              : 'bg-gradient-to-r from-gray-700 to-gray-600'
            }
          `}>
            <ApperIcon 
              name={isDragging ? "Download" : "Upload"} 
              className="w-10 h-10 text-white" 
            />
          </div>
        </motion.div>

        <div>
          <h3 className="text-2xl font-semibold mb-2 text-white">
            {isDragging ? 'Drop files here' : 'Drag & drop files'}
          </h3>
          <p className="text-gray-400 mb-4">
            or <span className="text-primary font-medium">browse</span> to choose files
          </p>
          <p className="text-sm text-gray-500">
            Supports images, PDFs, documents up to 100MB
          </p>
        </div>

        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl pointer-events-none"
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default DropZone