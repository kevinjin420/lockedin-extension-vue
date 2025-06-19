import { createApp } from "vue";
import blockPage from "./block-page.vue";

const container = document.getElementById("vue-block-overlay");
let config = {};

try {
	config = JSON.parse(container.getAttribute("data-config"));
} catch (e) {
	console.log(e);
}

if (Object.keys(config).length === 0) {
	config.title = "Page Blocked";
	config.message = "Stay Focused!";
}

const title = config.title?.trim() || "Page Blocked";
const message = config.message?.trim() || "Stay Focused!";

createApp(blockPage, {
	title,
	message,
}).mount("#vue-block-overlay");
