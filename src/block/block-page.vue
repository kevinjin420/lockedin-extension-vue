<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { defineProps } from "vue";

const props = defineProps({
	title: String,
	message: String,
});
</script>

<template>
	<div
		class="block-page-wrapper d-flex flex-column justify-content-center align-items-center vh-100 text-center"
	>
		<h1 class="big-fucking-text mb-3">{{ title }}</h1>
		<h1 class="body">{{ message }}</h1>
	</div>
</template>

<style scoped>
.block-page-wrapper {
	height: 100vh;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	background-color: #f8f9fa;
	padding: 2rem;
}

[data-bs-theme="dark"] .block-page-wrapper {
	background-color: #1c1c1c;
}

.big-fucking-text {
	font-size: 120px;
	font-weight: 900;
}

.body {
	font-size: 60px;
	font-weight: 500;
}
</style>
