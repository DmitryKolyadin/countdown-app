App({
  globalData: {
    targetTimestamp: null,
    eventKey: null
  },

  onCreate() {
    console.log('CountdownApp created')
  },

  onDestroy() {
    console.log('CountdownApp destroyed')
  }
})