chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason === 'install') {
		chrome.storage.local.set({ isEnabled: true, isDarkMode: true })
		chrome.tabs.create({ url: 'src/dashboard/dashboard.html' })
	}
})

let websites = [];
let isEnabled = true;

chrome.storage.local.get(["websites", "isEnabled"], (result) => {
    websites = JSON.parse(result.websites || "[]");
    isEnabled = result.isEnabled ?? true;
    updateBlockRules();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== "local") return;
    if (changes.websites) {
        websites = JSON.parse(changes.websites.newValue || "[]");
    }
    if (changes.isEnabled) {
        isEnabled = changes.isEnabled.newValue;
    }
    updateBlockRules();
});

function createRedirectRule(id, domain) {
    return {
        id: id,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                url: chrome.runtime.getURL("src/block/block.html")
            }
        },
        condition: {
            urlFilter: `||${domain}^`,
            resourceTypes: ["main_frame"]
        }
    };
}

async function updateBlockRules() {
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existing.map(rule => rule.id);

    if (existingIds.length) {
        await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: existingIds });
    }

    if (!isEnabled || websites.length === 0) return;

    const newRules = websites.map((domain, index) => createRedirectRule(index + 1, domain));
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules: newRules });
}