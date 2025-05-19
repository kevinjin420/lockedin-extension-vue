console.log('background.js')

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('installed')
    chrome.storage.local.set({ enabled: true })
    chrome.tabs.create({ url: 'src/dashboard/dashboard.html' })
  }
})
