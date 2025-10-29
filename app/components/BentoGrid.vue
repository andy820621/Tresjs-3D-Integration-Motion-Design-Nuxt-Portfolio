<script setup lang="ts">
import { gridItems } from '~/assets/data'
</script>

<template>
  <section id="about">
    <div
      class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto w-full py-20"
    >
      <UiBentoGridItem
        v-for="itemProps in gridItems"
        :key="itemProps.id"
        v-bind="itemProps"
      />
    </div>
  </section>
</template>
