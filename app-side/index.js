import { gettext } from 'i18n'

AppSideService({
  globalData: {
    targetTimestamp: null,
    missionCode: 'OPERATION COUNTDOWN',
    agentId: null,
    lastSync: null
  },

  onInit() {
    console.log('[SPY-SYSTEM] CountdownApp initialized')
    this.initializeMission()
    this.loadSettings()
  },

  onRun() {
    console.log('[SPY-SYSTEM] Mission commenced')
    this.syncMissionData()
  },

  onDestroy() {
    console.log('[SPY-SYSTEM] Mission terminated')
    this.saveSettings()
  },

  initializeMission() {
    // Генерируем ID агента если его нет
    if (!this.globalData.agentId) {
      this.globalData.agentId = this.generateAgentId()
    }
    
    // Генерируем код миссии
    this.globalData.missionCode = this.generateMissionCode()
    
    console.log(`[SPY-SYSTEM] Agent ${this.globalData.agentId} assigned to ${this.globalData.missionCode}`)
  },

  generateAgentId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    
    let agentId = 'AGENT-'
    
    // Добавляем 2 буквы
    for (let i = 0; i < 2; i++) {
      agentId += letters[Math.floor(Math.random() * letters.length)]
    }
    
    agentId += '-'
    
    // Добавляем 3 цифры
    for (let i = 0; i < 3; i++) {
      agentId += numbers[Math.floor(Math.random() * numbers.length)]
    }
    
    return agentId
  },

  generateMissionCode() {
    const operations = [
      'OPERATION COUNTDOWN',
      'MISSION CRITICAL',
      'PROJECT OMEGA',
      'ALPHA ZERO',
      'CODE CRIMSON',
      'OPERATION PHOENIX'
    ]
    
    return operations[Math.floor(Math.random() * operations.length)]
  },

  syncMissionData() {
    this.globalData.lastSync = Date.now()
    console.log('[SPY-SYSTEM] Mission data synchronized')
  },

  loadSettings() {
    // Загружаем сохраненные настройки из локального хранилища
    try {
      const savedTimestamp = this.getStorageSync('targetTimestamp')
      const savedAgentId = this.getStorageSync('agentId')
      const savedMissionCode = this.getStorageSync('missionCode')
      
      if (savedTimestamp) {
        this.globalData.targetTimestamp = parseInt(savedTimestamp)
        console.log('[SPY-SYSTEM] Target timestamp loaded')
      }
      
      if (savedAgentId) {
        this.globalData.agentId = savedAgentId
      }
      
      if (savedMissionCode) {
        this.globalData.missionCode = savedMissionCode
      }
      
    } catch (error) {
      console.log('[SPY-SYSTEM] Error loading mission data:', error)
    }
  },

  saveSettings() {
    // Сохраняем настройки в локальное хранилище
    try {
      if (this.globalData.targetTimestamp) {
        this.setStorageSync('targetTimestamp', this.globalData.targetTimestamp.toString())
      }
      
      if (this.globalData.agentId) {
        this.setStorageSync('agentId', this.globalData.agentId)
      }
      
      if (this.globalData.missionCode) {
        this.setStorageSync('missionCode', this.globalData.missionCode)
      }
      
      console.log('[SPY-SYSTEM] Mission data saved')
      
    } catch (error) {
      console.log('[SPY-SYSTEM] Error saving mission data:', error)
    }
  },

  getGlobalData(key) {
    return this.globalData[key]
  },

  setGlobalData(key, value) {
    this.globalData[key] = value
    
    // Автоматически сохраняем критичные данные
    if (key === 'targetTimestamp') {
      try {
        this.setStorageSync('targetTimestamp', value.toString())
        console.log('[SPY-SYSTEM] Target updated and saved')
      } catch (error) {
        console.log('[SPY-SYSTEM] Error auto-saving target:', error)
      }
    }
  },

  // Проверка статуса миссии
  getMissionStatus() {
    if (!this.globalData.targetTimestamp) {
      return 'STANDBY'
    }
    
    const now = Date.now()
    const diff = this.globalData.targetTimestamp - now
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (diff <= 0) {
      return 'COMPLETE'
    } else if (minutes <= 5) {
      return 'CRITICAL'
    } else if (minutes <= 60) {
      return 'WARNING'
    } else {
      return 'ACTIVE'
    }
  },

  // Генерация отчета о миссии
  generateMissionReport() {
    const status = this.getMissionStatus()
    const timeRemaining = this.globalData.targetTimestamp ? 
      this.globalData.targetTimestamp - Date.now() : 0
    
    return {
      agentId: this.globalData.agentId,
      missionCode: this.globalData.missionCode,
      status: status,
      timeRemaining: timeRemaining,
      lastSync: this.globalData.lastSync,
      timestamp: Date.now()
    }
  },

  // Заглушки для методов хранилища (в реальном приложении используйте API Zepp OS)
  getStorageSync(key) {
    // В реальном приложении здесь будет вызов API хранилища
    // Например: hmFS.SysProGetString(key)
    return null
  },

  setStorageSync(key, value) {
    // В реальном приложении здесь будет вызов API хранилища  
    // Например: hmFS.SysProSetString(key, value)
  }
})
