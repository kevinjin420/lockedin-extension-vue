<script setup>
    import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';

    const isDarkMode = ref(true);
    const isEnabled = ref(true);
    const url = ref('');
    const websites = ref([]);
    const urlInput = ref(null);

    function applyTheme(dark) {
        const root = document.documentElement;
        root.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    }

    function toggleTheme() {
        isDarkMode.value = !isDarkMode.value;
        chrome.storage.local.set({ isDarkMode: isDarkMode.value });
        applyTheme(isDarkMode.value);
    }

    function toggleEnabled() {
        isEnabled.value = !isEnabled.value;
        chrome.storage.local.set({ isEnabled: isEnabled.value });
    }

    function handleStorageChange(changes, areaName) {
        if (areaName !== 'local') return;

        if (changes.isDarkMode) {
            isDarkMode.value = changes.isDarkMode.newValue;
            applyTheme(isDarkMode.value);
        }
        if (changes.isEnabled) {
            isEnabled.value = changes.isEnabled.newValue;
        }
    }

    // Load from storage
    onMounted(() => {
        chrome.storage.local.get(['isDarkMode', 'isEnabled', 'websites'], (result) => {
            isDarkMode.value = result.isDarkMode ?? true;
            isEnabled.value = result.isEnabled ?? true;
            websites.value = JSON.parse(result.websites);
            applyTheme(isDarkMode.value);
            console.log("loaded");
        });

        chrome.storage.onChanged.addListener(handleStorageChange);
        nextTick(() => urlInput.value?.focus());
    });

    onBeforeUnmount(() => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
    });

    function syncWebsites() {
        // chrome.storage.local.set({ websites: websites.value });
        chrome.storage.local.set({ websites: JSON.stringify(websites.value) });
    }

    function handleSubmit() {
        const trimmed = url.value.trim();
        if (trimmed) {
            websites.value.push(trimmed);
            url.value = '';
            syncWebsites();
            nextTick(() => {
                urlInput.value?.focus();
            });
        }
    }

    function removeSite(index) {
        websites.value.splice(index, 1);
        console.log("del");
        syncWebsites();
    }
</script>


<template>
    <div class="dashboard-page-wrapper">
        <div class="dashboard-page-container shadow-sm rounded">
            <div class="d-flex align-items-center justify-content-between mb-2 gap-3">
                <div class="d-flex align-items-center toggle-wrapper">
                    <span :class="['toggle-label', !isEnabled ? 'active' : '']">Disabled</span>

                    <div class="form-check form-switch mx-3">
                        <input
                            class="form-check-input custom-switch"
                            type="checkbox"
                            role="switch"
                            :checked="isEnabled"
                            @change="toggleEnabled"
                            id="enabledSwitch"
                        />
                    </div>

                    <span :class="['toggle-label', isEnabled ? 'active' : '']">Locked In</span>
                </div>

                <button @click="toggleTheme" class="btn btn-outline-secondary square-button" :title="'Toggle Theme'">
                    <i v-if="isDarkMode" class="bi bi-moon-stars"></i>
                    <i v-else class="bi bi-sun"></i>
                </button>
            </div>


            <div class="text-center">
                <h3>URLs to Block</h3>

                <div class="url-form-wrapper">
                    <form @submit.prevent="handleSubmit" class="d-flex gap-2">
                        <input
                            v-model="url"
                            ref="urlInput"
                            type="text"
                            class="form-control"
                            placeholder="Enter a website (e.g., tiktok.com)"
                            @keydown.enter.prevent="handleSubmit"
                        />
                        <button type="submit" class="btn btn-primary">Add</button>
                    </form>

                    <ul class="mt-3 list-group">
                        <li
                        v-for="(site, index) in websites"
                        :key="index"
                        class="list-group-item d-flex align-items-center gap-3"
                        >
                            <div class="icon-bubble">
                                <img
                                :src="`https://www.google.com/s2/favicons?domain=${site}&sz=32`"
                                alt="favicon"
                                class="favicon"
                                />
                            </div>

                            <div class="site-url text-start flex-grow-1">
                                {{ site }}
                            </div>

                            <button
                                class="icon-bubble btn btn-outline-danger p-0"
                                @click="removeSite(index)"
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-page-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: #f8f9fa; /* light gray background */
    padding: 2rem;
}

.dashboard-page-container {
    background-color: #ffffff; /* white center block (light mode) */
    padding: 2rem;
    width: 100%;
    min-width: 300px;
    max-width: 700px;
    border-radius: 12px;
}

[data-bs-theme='dark'] .dashboard-page-wrapper {
    background-color: #1c1c1c;
}

[data-bs-theme='dark'] .dashboard-page-container {
    background-color: #2b2b2b;
    color: #ffffff;
}

.square-button {
    aspect-ratio: 1 / 1;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-bubble {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.favicon {
  width: 28px;
  height: 28px;
}

.form-check-input {
  cursor: pointer;
  transform: scale(1.5);
}

.toggle-label {
    font-weight: bold;
    font-size: 1.1rem;
    color: #6c757d;
    transition: color 0.3s ease;
}

.toggle-label.active {
    color: #ff0000;
}

[data-bs-theme='dark'] .toggle-label.active {
    color: #ff0000;
}

.custom-switch:focus {
    box-shadow: none;
}

.custom-switch {
    transition: background-color 0.3s ease, transform 0.3s ease;
}

</style>
