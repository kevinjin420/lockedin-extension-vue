<script setup>
    import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';

    const isDarkMode = ref(true);
    const isEnabled = ref(true);
    const url = ref('');
    const websites = ref([]);
    const urlInput = ref(null);
    const title = ref('');
    const message = ref('');
    const savedTitle = ref('');
    const savedMessage = ref('');
    const isDirty = ref(false);

    watch([title, message], () => {
        isDirty.value = title.value !== savedTitle.value || message.value !== savedMessage.value;
    });

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
        if (changes.title) {
            title.value = changes.title.newValue;
            savedTitle.value = title.value;
        }
        if (changes.message) {
            message.value = changes.message.newValue;
            savedMessage.value = message.value;
        }
    }

    function saveCustomMessage() {
        chrome.storage.local.set({
            title: title.value,
            message: message.value
        });
        savedTitle.value = title.value;
        savedMessage.value = message.value;
        isDirty.value = false;
    }

    onMounted(() => {
        chrome.storage.local.get(['isDarkMode', 'isEnabled', 'websites', 'title', 'message'], (result) => {
            isDarkMode.value = result.isDarkMode ?? true;
            applyTheme(isDarkMode.value);
            isEnabled.value = result.isEnabled ?? true;
            websites.value = JSON.parse(result.websites); // sometimes throws errors (on initial install??) or not idk
            title.value = result.title ?? '';
            message.value = result.message ?? '';
            savedTitle.value = title.value;
            savedMessage.value = message.value;
            isDirty.value = false;
        });
        
        chrome.storage.onChanged.addListener(handleStorageChange);
        nextTick(() => urlInput.value?.focus());
    });

    onBeforeUnmount(() => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
    });

    function syncWebsites() {
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

            <div class="custom-message-wrapper mb-4 text-center">
                <h5>Customize Block Page</h5>
                <form @submit.prevent="saveCustomMessage" class="d-flex flex-column gap-2">
                    <input
                        v-model="title"
                        type="text"
                        class="form-control"
                        placeholder="Block Title (e.g., Page Blocked)"
                    />
                    <input
                        v-model="message"
                        type="text"
                        class="form-control"
                        placeholder="Block Message (e.g., Stay Focused!)"
                    />
                    <div class="d-flex align-items-center justify-content-end gap-2">
                        <span v-if="isDirty" class="text-warning small me-auto">Unsaved changes</span>
                        <button type="submit" class="btn btn-success">
                            Save Message
                        </button>
                    </div>
                </form>
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

                    <ul class="mt-2 list-group">
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
    background-color: #f8f9fa;
    padding: 2rem;
}

.dashboard-page-container {
    background-color: #ffffff;
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

.custom-message-wrapper input {
    max-width: 100%;
}

</style>
