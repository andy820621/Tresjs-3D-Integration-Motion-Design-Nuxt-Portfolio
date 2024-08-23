<script setup lang="ts">
</script>

<template>
  <div class="pb-20 pt-36">
    <div>
      <UiSpotlight class-name="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
      <UiSpotlight class-name="top-10 left-full h-[80vh] w-[50vw]" fill="purple" />
      <UiSpotlight class-name="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
    </div>

    <UiGridBackground
      custom-class="h-screen dark:bg-black-100 bg-white dark:bg-grid-white/[0.024] bg-grid-black/[0.2] absolute top-0 left-0"
      custom-inner-class="dark:bg-black-100"
    />

    <div class="flex justify-center relative my-20 z-10">
      <div class="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
        <h2 class="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
          Dynamic Web Magic with Nuxt
        </h2>

        <UiTextGenerateEffect class-name="text-center text-[40px] md:text-5xl lg:text-6xl" words="Transforming Concepts into Seamless User Experiences" />

        <p class="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl dark:text-white">
          Hi, I'm BarZ Hsieh, a Frontend Developer based in Taiwan.
        </p>

        <NuxtLink to="/about">
          <UiMagicBtn title="Show My Work" icon="i-fa6-solid-location-arrow" position="right" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
