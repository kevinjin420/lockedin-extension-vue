<template>
  <div class="popup-window">
    <h1>POPUP</h1>
    <button @click="openDashboard">Open Dashboard</button>
  </div>
</template>

<script>
export default {
  methods: {
    openDashboard() {
      const url = chrome.runtime.getURL('src/dashboard/dashboard.html')
      chrome.tabs.create({ url })
      console.log("open")
    }
  }
}
</script>

<style>

.popup-window{
  margin: 10px
}

</style>
