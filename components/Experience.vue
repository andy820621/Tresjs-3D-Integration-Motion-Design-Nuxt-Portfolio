<script setup lang="ts">
import ButtonCard from '~/components/ui/MovingBorderCard/index.vue'
import { workExperience } from '~/assets/data'
</script>

<template>
  <div class="py-20 w-full">
    <h1 class="heading">
      My <span class="text-purple">work experience</span>
    </h1>

    <div class="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
      <ButtonCard
        v-for="card in workExperience"
        :key="card.id"
        :duration="Math.floor(Math.random() * 10000) + 10000"
        border-radius="1.75rem"
        :style="{
          background: 'rgb(4,7,29)',
          backgroundColor: 'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
          borderRadius: 'calc(1.75rem * 0.96)',
        }"
        class="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        <div class="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
          <NuxtImg
            :src="card.thumbnail"
            :alt="card.thumbnail"
            class="lg:w-32 md:w-20 w-16"
          />
          <div class="lg:ms-5">
            <h1 class="text-start text-xl md:text-2xl font-bold">
              {{ card.title }}
            </h1>
            <p class="text-start text-white-100 mt-3 font-semibold">
              {{ card.desc }}
            </p>
          </div>
        </div>
      </ButtonCard>
    </div>
  </div>
</template>
