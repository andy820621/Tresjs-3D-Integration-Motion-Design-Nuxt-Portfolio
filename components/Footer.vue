<script setup lang="ts">
import { socialMedia } from '~/assets/data'
</script>

<template>
  <footer id="contact" class="w-full pt-20 pb-10">
    <!-- background grid -->
    <div class="w-full absolute left-0 -bottom-72 min-h-96">
      <NuxtImg
        src="/footer-grid.svg"
        alt="grid"
        class="w-full h-full opacity-50"
      />
    </div>

    <div class="flex flex-col items-center">
      <h1 class="dark:text-white heading lg:max-w-[45vw]">
        Ready to take <span class="text-purple">your</span> digital presence to the next level?
      </h1>
      <p class="text-white-200 md:mt-10 my-5 text-center">
        Reach out to me today and let&apos;s discuss how I can help you achieve your goals.
      </p>
      <a href="mailto:contact@jsmastery.pro">
        <UiMagicBtn
          title="Let's get in touch"
          icon="i-fa6-solid-location-arrow"
          position="right"
        />
      </a>
    </div>
    <div class="flex mt-16 md:flex-row flex-col justify-between items-center">
      <p class="md:text-base text-sm md:font-normal font-light">
        Copyright © 2024 Adrian Hajdin
      </p>

      <div class="flex items-center md:gap-3 gap-6">
        <NuxtLink
          v-for="info in socialMedia"
          :key="info.id"
          :to="info.link"
          target="_blank"
          class="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300 mt-4 md:mt-0"
        >
          <NuxtImg :src="info.img" alt="icons" width="20" height="20" />
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
