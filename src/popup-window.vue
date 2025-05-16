<template>
	<h1>POPUP</h1>
  <button @click="openDashboard">Open Dashboard</button>
</template>

<script>
export default {
  methods: {
    openDashboard() {
      const url = chrome.runtime.getURL('dashboard.html')
      chrome.tabs.create({ url })
    }
  }
}
</script>
