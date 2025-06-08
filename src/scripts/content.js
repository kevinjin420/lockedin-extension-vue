//   const overlay = document.createElement('div');
//   overlay.id = 'vue-block-overlay';
//   document.body.appendChild(overlay);

//   const script = document.createElement('script');
//   script.src = chrome.runtime.getURL('src/block/block.js');
//   script.type = 'module';
//   console.log(script.src);
//   document.body.appendChild(script);
// too tedious, just bare html instead

console.log('Content script loaded!');

let isDarkMode = true;
let isEnabled = true;
let websites = [];
let urlInput = null;

function blockPage() {
    document.open();
    document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Blocked</title>
        <style>
            body {
                margin: 0;
                background-color: #111;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: sans-serif;
            }
            h1 {
                font-size: 3rem;
            }
        </style>
    </head>
    <body>
        <h1>Blocked</h1>
    </body>
    </html>
    `);
    document.close();
}

function applyTheme(dark) {
    const root = document.documentElement;
    root.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    chrome.storage.local.set({ isDarkMode });
    applyTheme(isDarkMode);
}

function handleStorageChange(changes, areaName) {
    if (areaName !== 'local') return;

    if (changes.isDarkMode) {
        isDarkMode = changes.isDarkMode.newValue;
        applyTheme(isDarkMode);
    }
    if (changes.isEnabled) {
        isEnabled = changes.isEnabled.newValue;
    }
}

function shouldBlock(url) {
    return websites.some(entry => {
        try {
            // Match either full match or origin-only match
            const entryUrl = new URL(entry);
            return url === entry || url.startsWith(entry) || location.origin === entryUrl.origin;
        } catch {
            // fallback if entry isn't a valid URL
            return url.includes(entry);
        }
    });
}

function init() {
    chrome.storage.local.get(['isDarkMode', 'isEnabled', 'websites'], (result) => {
        isDarkMode = result.isDarkMode ?? true;
        applyTheme(isDarkMode);

        isEnabled = result.isEnabled ?? true;

        try {
            websites = JSON.parse(result.websites || '[]');
        } catch (e) {
            console.warn('Failed to parse websites:', result.websites);
            websites = [];
        }

        if (urlInput) {
            urlInput.focus();
        }

        if (isEnabled && shouldBlock(location.href)) {
            blockPage();
        }
    });

    chrome.storage.onChanged.addListener(handleStorageChange);
}

window.addEventListener('beforeunload', () => {
    chrome.storage.onChanged.removeListener(handleStorageChange);
});

document.addEventListener('DOMContentLoaded', () => {
    init();
});