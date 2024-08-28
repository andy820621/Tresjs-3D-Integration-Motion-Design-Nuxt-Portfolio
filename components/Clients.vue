<script setup lang="ts">
import { companies, testimonials } from '~/assets/data'
</script>

<template>
  <section id="testimonials" class="py-20">
    <h1 class="heading dark:text-white">
      Kind words from &nbsp;
      <span class="text-purple"> satisfied clients</span>
    </h1>

    <div class="flex flex-col items-center max-lg:mt-10">
      <div
        class="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden"
      >
        <UiInfiniteMovingCards
          :items="testimonials"
          direction="right"
          speed="slow"
        />
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 md:gap-16 max-lg:mt-10">
        <div
          v-for="company in companies"
          :key="company.id"
          class="flex md:max-w-60 max-w-32 gap-2"
        >
          <img
            :src="company.img"
            :alt="company.name"
            class="md:w-10 w-5"
          >
          <img
            :src="company.nameImg"
            :alt="company.name"
            :width="company.id === 4 || company.id === 5 ? 100 : 150"
            class="md:w-24 w-20"
          >
        </div>
      </div>
    </div>
  </section>
</template>
