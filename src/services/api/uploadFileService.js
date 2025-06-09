const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UploadFileService {
  constructor() {
    this.storageKey = 'dropzone_upload_history'
  }

  async getAll() {
    await delay(200)
    return this.getUploadHistory()
  }

  async getById(id) {
    await delay(150)
    const files = this.getUploadHistory()
    const file = files.find(f => f.id === id)
    if (!file) {
      throw new Error('File not found')
    }
    return { ...file }
  }

  async create(fileData) {
    await delay(300)
    const newFile = {
      ...fileData,
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      progress: 0,
      uploadSpeed: 0,
      shareLink: '',
      uploadedAt: new Date().toISOString()
    }
    
    const files = this.getUploadHistory()
    const updatedFiles = [...files, newFile]
    this.saveUploadHistory(updatedFiles)
    
    return { ...newFile }
  }

  async update(id, updateData) {
    await delay(200)
    const files = this.getUploadHistory()
    const fileIndex = files.findIndex(f => f.id === id)
    
    if (fileIndex === -1) {
      throw new Error('File not found')
    }
    
    const updatedFile = { ...files[fileIndex], ...updateData }
    files[fileIndex] = updatedFile
    this.saveUploadHistory(files)
    
    return { ...updatedFile }
  }

  async delete(id) {
    await delay(250)
    const files = this.getUploadHistory()
    const updatedFiles = files.filter(f => f.id !== id)
    this.saveUploadHistory(updatedFiles)
    
    return { success: true }
  }

  // Utility methods for localStorage
  getUploadHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading upload history:', error)
      return []
    }
  }

  saveUploadHistory(files) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(files))
    } catch (error) {
      console.error('Error saving upload history:', error)
    }
  }

  async simulateUpload(fileData, onProgress) {
    let progress = 0
    const totalDuration = 2000 + Math.random() * 3000 // 2-5 seconds
    const stepSize = 100 / (totalDuration / 100) // Progress per 100ms
    
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        progress += stepSize + Math.random() * stepSize
        progress = Math.min(progress, 100)
        
        const speed = 1.2 + Math.random() * 3 // MB/s
        
        if (onProgress) {
          onProgress({
            progress,
            uploadSpeed: progress < 100 ? speed : 0,
            status: progress < 100 ? 'uploading' : 'completed'
          })
        }
        
        if (progress >= 100) {
          clearInterval(interval)
          
          // Generate share link
          const shareLink = `https://dropzone.pro/file/${fileData.id}`
          
          try {
            await this.update(fileData.id, {
              status: 'completed',
              progress: 100,
              uploadSpeed: 0,
              shareLink
            })
            resolve({ shareLink })
          } catch (error) {
            reject(error)
          }
        }
      }, 100)
      
      // Simulate occasional errors (5% chance)
      if (Math.random() < 0.05) {
        setTimeout(() => {
          clearInterval(interval)
          reject(new Error('Upload failed'))
        }, Math.random() * 1000)
      }
    })
  }
}

export default new UploadFileService()