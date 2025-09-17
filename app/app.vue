<template>
	<div class="min-h-dvh flex flex-col bg-beige">
		<Navbar />
		<div class="p-4 flex flex-col flex-1 max-w-3xl w-full mx-auto">
			<Transition
				name="page-fade"
				mode="out-in"
				enter-active-class="transition-opacity duration-300 ease-out"
				leave-active-class="transition-opacity duration-200 ease-in"
				enter-from-class="opacity-0"
				enter-to-class="opacity-100"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<NuxtPage />
			</Transition>
		</div>
	</div>
</template>
