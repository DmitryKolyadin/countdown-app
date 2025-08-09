App({
  globalData: {
    targetTimestamp: null
  },

  onCreate(options) {
    console.log('CountdownApp created')
    this.loadGlobalSettings()
  },

  onDestroy(options) {
    console.log('CountdownApp destroyed')
    this.saveGlobalSettings()
  },

  loadGlobalSettings() {
    // Загружаем глобальные настройки
    // В реальном приложении можно использовать персистентное хранилище
  },

  saveGlobalSettings() {
    // Сохраняем глобальные настройки
  },

  getGlobalData(key) {
    return this.globalData[key]
  },

  setGlobalData(key, value) {
    this.globalData[key] = value
  }
})