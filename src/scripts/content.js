let isDarkMode = true;
let isEnabled = true;
let websites = [];
let urlInput = null;

const config = {
	title: "",
	message: "",
};

function blockPage() {
	window.stop();

	document.documentElement.innerHTML = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Blocked</title>
        <style>
            body {
                margin: 0;
                background-color: #ffffff;
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
            #vue-block-overlay{
                width: 100vw;
                height: 100vh;
            }
        </style>
    </head>
    <body>
        <div id="vue-block-overlay" data-config='${JSON.stringify(config)}'></div>
    </body>
    </html>
    `;

	const blockStyleLink = document.createElement("link");
	blockStyleLink.rel = "stylesheet";
	blockStyleLink.type = "text/css";
	blockStyleLink.href = chrome.runtime.getURL("src/block/block.css");
	document.head.appendChild(blockStyleLink);

	const blockScript = document.createElement("script");
	blockScript.src = chrome.runtime.getURL("src/block/block.js");
	document.body.appendChild(blockScript);
	applyTheme(isDarkMode);
}

function unblockPage() {
	const overlay = document.getElementById("vue-block-overlay");
	if (!overlay) return;

	const blockCssHref = chrome.runtime.getURL("src/block/block.css");
	document
		.querySelectorAll(`link[href="${blockCssHref}"]`)
		.forEach((link) => link.remove());

	const blockScriptSrc = chrome.runtime.getURL("src/block/block.js");
	document
		.querySelectorAll(`script[src="${blockScriptSrc}"]`)
		.forEach((script) => script.remove());

	overlay.remove();

	document.documentElement.removeAttribute("data-bs-theme");

	location.reload();
}

function applyTheme(dark) {
	const root = document.documentElement;
	root.setAttribute("data-bs-theme", dark ? "dark" : "light");
}

function shouldBlock(url) {
	return websites.some((entry) => {
		try {
			const entryUrl = new URL(entry);
			return (
				url === entry ||
				url.startsWith(entry) ||
				location.origin === entryUrl.origin
			);
		} catch {
			return url.includes(entry);
		}
	});
}

function applyBlock() {
	if (isEnabled && shouldBlock(location.href)) {
		blockPage();
	} else {
		unblockPage();
	}
}

function handleStorageChange(changes, areaName) {
	if (areaName !== "local") return;

	if (changes.isEnabled) {
		isEnabled = changes.isEnabled.newValue;
		applyBlock();
	}

	if (changes.isDarkMode) {
		isDarkMode = changes.isDarkMode.newValue;
		if (document.getElementById("vue-block-overlay")) {
			applyTheme(isDarkMode);
			console.log("theme applied on storage change");
		}
	}

	if (changes.websites) {
		try {
			websites = JSON.parse(changes.websites.newValue || "[]");
		} catch {
			websites = [];
		}
		applyBlock();
	}

	if (changes.title) {
		config.title = changes.title.newValue;
	}
	if (changes.message) {
		config.message = changes.message.newValue;
	}
}

function init() {
	chrome.storage.local.get(
		["isDarkMode", "isEnabled", "websites", "title", "message"],
		(result) => {
			isDarkMode = result.isDarkMode ?? true;
			isEnabled = result.isEnabled ?? true;
			config.title = result.title ?? "";
			config.message = result.message ?? "";

			try {
				websites = JSON.parse(result.websites || "[]");
			} catch {
				websites = [];
			}

			if (urlInput) {
				urlInput.focus();
			}

			applyBlock();
		}
	);

	chrome.storage.onChanged.addListener(handleStorageChange);
}

window.addEventListener("beforeunload", () => {
	chrome.storage.onChanged.removeListener(handleStorageChange);
});

init();


// function checkAttr(){
//     if (document.documentElement.hasAttribute("data-bs-theme")) {
//         console.log("Theme is set to:", document.documentElement.getAttribute("data-bs-theme"));
//     } else {
//         console.log("No data-bs-theme attribute set.");
//     }
// };
