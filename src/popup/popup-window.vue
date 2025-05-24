<script setup>
    import { ref, onMounted } from 'vue';
    import "bootstrap-icons/font/bootstrap-icons";
    import 'bootstrap/dist/css/bootstrap.min.css';

    const isDarkMode = ref(true);
    const isEnabled = ref(true);

    onMounted(() => {
        if (chrome?.storage?.local) {
            chrome.storage.local.get(['isDarkMode', 'isEnabled'], (result) => {
                isDarkMode.value = result.isDarkMode ?? true;
                isEnabled.value = result.isEnabled ?? true;

                chrome.storage.local.set({
                    isDarkMode: isDarkMode.value,
                    isEnabled: isEnabled.value
                });

                applyTheme(isDarkMode.value);
            });
        } else {
            console.error("chrome storage inaccessible");
        }
    });

    function applyTheme(dark) {
        const root = document.documentElement;
        if (dark) {
            root.setAttribute('data-bs-theme', 'dark');
        } else {
            root.setAttribute('data-bs-theme', 'light');
        }
    }

    function toggleTheme() {
        isDarkMode.value = !isDarkMode.value;
        chrome.storage.local.set({ isDarkMode: isDarkMode.value });
        applyTheme(isDarkMode.value);
    }

    function toggleFunction() {
        isEnabled.value = !isEnabled.value;
        chrome.storage.local.set({ isEnabled: isEnabled.value });
    }
</script>

<template>
    <div class="popup-wrapper">
        <div class="popup-window container p-3">
            <h2 class="mb-3 text-center">Status</h2>

            <div class="mb-3 d-flex justify-content-center align-items-center">
                <button v-if="isEnabled" id="toggleButton" @click="toggleFunction" class="btn btn-success square-button-large">
                    <i class="bi bi-lock big-icon"></i>
                </button>
                <button v-else id="toggleButton" @click="toggleFunction" class="btn btn-danger square-button-large">
                    <i class="bi bi-unlock big-icon"></i>
                </button>
            </div>

            <div class="d-flex justify-content-center gap-3">
                <button @click="toggleTheme" class="btn btn-outline-secondary square-button">
                    <i v-if="isDarkMode" class="bi bi-moon-stars"></i>
                    <i v-else class="bi bi-sun"></i>
                </button>
                <button @click="openDashboard" class="btn btn-outline-secondary square-button">
                    <i class="bi bi-gear"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            openDashboard() {
                const url = chrome.runtime.getURL('src/dashboard/dashboard.html');
                chrome.tabs.create({ url });
            }
        }
    }
</script>

<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #app {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup-wrapper {
        padding: 5px;
        margin: 0;
        width: 100%;
        overflow-x: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup-window {
        box-sizing: border-box;
        padding: 16px;
        margin: 0 auto;
        max-width: 100%;
        width: 100%;
    }

    .big-icon {
        font-size: 4.5rem;
    }

    .square-button {
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .square-button-large {
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    [data-bs-theme='dark'] {
        background-color: #121212;
        color: white;
    }

    [data-bs-theme='dark'] .btn-outline-success {
        color: #0f0;
        border-color: #0f0;
    }
</style>
