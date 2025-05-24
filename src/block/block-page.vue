<script setup>
    import { ref, onMounted } from 'vue';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';

    const isDarkMode = ref(true);

    function applyTheme(dark) {
        const root = document.documentElement;
        root.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    }

    onMounted(() => {
        chrome.storage.local.get(['isDarkMode'], (result) => {
            isDarkMode.value = result.isDarkMode ?? true;
            applyTheme(isDarkMode.value);
        });
    });
    
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.isDarkMode) {
            isDarkMode.value = changes.isDarkMode.newValue;
            applyTheme(isDarkMode.value);
        }
    });

</script>


<template>
    <div class="block-page-wrapper d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <h1 class="big-fucking-text mb-3">NEIN</h1>
        <h1>nicht gut</h1>
    </div>
</template>

<style scoped>
.block-page-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: #f8f9fa;
    padding: 2rem;
}

[data-bs-theme='dark'] .block-page-wrapper {
    background-color: #1c1c1c;
}

.big-fucking-text{
    font-size: 200px;
    font-weight: 900;
}
</style>
