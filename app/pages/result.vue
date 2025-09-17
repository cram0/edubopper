<script setup lang="ts"></script>

<template>
	<div class="flex flex-col flex-1 gap-4">
		<!-- Result header -->
		<div class="flex flex-col items-center bg-beige-300 p-4 rounded-2xl gap-1">
			<div class=" text-sm text-gris-600 gap-2 flex flex-row ">
				<span>EDHEC Business School</span>
				<span class="text-gris-400">|</span>
				<div class="flex flex-row items-center-safe gap-1">
					<img src="@/assets/icons/pin-result.svg" class="size-3 text-gris-600 inline-block">
					<span class="text-sm">Roubaix</span>
				</div>
			</div>
			<p class="text-lg font-semibold">International BBA</p>
		</div>

		<div class="rounded-3xl bg-white py-8 px-6 flex flex-col gap-6 items-center">
			<!-- Logo -->
			 <div class="size-28 bg-yellow-100 rounded-full flex items-center justify-center">
				<img src="@/assets/images/rating.png" alt="rating" class="object-fill size-16"/>
			 </div>
			<!-- Score -->
			 <div class="flex flex-col items-center gap-1">
				 <div class="py-1.5 px-4 text-xl flex flex-row gap-2 font-semibold">
					 <span class="">91%</span>
					 <span class="">•</span>
					 <span class="">Très élevées</span>
					</div>
					<!-- Fiability & stars -->
					<div>
						<FiabilityRating :rating="4"/>
					</div>
				</div>
			<!-- Description -->
			 <div>
				<p class="text-gris-600 text-sm text-center">
					Cette estimation est fournie à titre indicatif et ne garantit en aucun cas la décision d’admission de l’établissement.
				</p>
			 </div>
		</div>

		<!-- Button -->
		 <div class="flex-1 flex flex-col-reverse sm:flex-col">
			<EDButton variant="primary" size="lg" class="mx-auto w-full sm:w-1/2" @click.prevent="() => {$router.push('/')}">Tester une autre formation</EDButton>
		</div>
	</div>
</template>
