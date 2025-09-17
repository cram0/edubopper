<script setup lang="ts"></script>

<template>
	<div
	class="h-14 bg-beige border-b-2  border-beige-300 p-3"
	@click="$router.push({ name: 'index' })"
	>
		<img class="cursor-pointer" src="@/assets/images/logo.svg">
	</div>
</template>
