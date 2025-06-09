const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UploadSessionService {
  constructor() {
    this.storageKey = 'dropzone_upload_sessions'
  }

  async getAll() {
    await delay(200)
    const sessions = this.getSessions()
    return [...sessions]
  }

  async getById(id) {
    await delay(150)
    const sessions = this.getSessions()
    const session = sessions.find(s => s.sessionId === id)
    if (!session) {
      throw new Error('Session not found')
    }
    return { ...session }
  }

  async create(sessionData) {
    await delay(300)
    const newSession = {
      ...sessionData,
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date().toISOString(),
      shareableLink: `https://dropzone.pro/share/${Date.now()}`
    }
    
    const sessions = this.getSessions()
    const updatedSessions = [...sessions, newSession]
    this.saveSessions(updatedSessions)
    
    return { ...newSession }
  }

  async update(id, updateData) {
    await delay(200)
    const sessions = this.getSessions()
    const sessionIndex = sessions.findIndex(s => s.sessionId === id)
    
    if (sessionIndex === -1) {
      throw new Error('Session not found')
    }
    
    const updatedSession = { ...sessions[sessionIndex], ...updateData }
    sessions[sessionIndex] = updatedSession
    this.saveSessions(sessions)
    
    return { ...updatedSession }
  }

  async delete(id) {
    await delay(250)
    const sessions = this.getSessions()
    const updatedSessions = sessions.filter(s => s.sessionId !== id)
    this.saveSessions(updatedSessions)
    
    return { success: true }
  }

  // Utility methods for localStorage
  getSessions() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading upload sessions:', error)
      return []
    }
  }

  saveSessions(sessions) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(sessions))
    } catch (error) {
      console.error('Error saving upload sessions:', error)
    }
  }

  async createFromFiles(files) {
    const completedFiles = files.filter(f => f.status === 'completed')
    
    if (completedFiles.length === 0) {
      throw new Error('No completed files to create session')
    }
    
    const sessionData = {
      files: completedFiles,
      totalSize: completedFiles.reduce((sum, f) => sum + f.size, 0),
      completedSize: completedFiles.reduce((sum, f) => sum + f.size, 0)
    }
    
    return await this.create(sessionData)
  }
}

export default new UploadSessionService()