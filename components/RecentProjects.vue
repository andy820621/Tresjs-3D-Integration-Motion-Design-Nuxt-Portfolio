<script lang="ts" setup>
// import { FaLocationArrow } from 'react-icons/fa6'
// import PinContainer from './ui/Pin.vue'
import { projects } from '~/assets/data/index'
import PinContainer from '~/components/ui/Pin/index.vue'
</script>

<template>
  <div id="projects" class="py-20 dark:text-white">
    <h1 class="heading">
      A small selection of &nbsp;
      <span class="text-purple">recent projects</span>
    </h1>
    <div class="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
      <div
        v-for="item in projects"
        :key="item.id"
        class="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
      >
        <PinContainer
          :title="item.link"
          :href="item.link"
        >
          <div
            class="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10"
          >
            <div
              class="relative w-full h-full overflow-hidden lg:rounded-3xl bg-[#13162D]"
            >
              <NuxtImg src="/bg.png" alt="bgimg" />
            </div>

            <NuxtImg
              :src="item.img"
              alt="cover"
              class="z-10 absolute w-full bottom-0"
            />
          </div>

          <h1 class="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
            {{ item.title }}
          </h1>

          <p
            class="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
            :style="{ color: '#BEC1DD', margin: '1vh 0' }"
          >
            {{ item.des }}
          </p>

          <div class="flex items-center justify-between mt-7 mb-3">
            <div class="flex items-center">
              <div
                v-for="(icon, index) in item.iconLists"
                :key="index"
                class="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                :style="{ transform: `translateX(-${5 * index + 2}px)` }"
              >
                <NuxtImg :src="icon" alt="icon5" class="p-2 w-full" />
              </div>
            </div>

            <div class="flex justify-center items-center">
              <p class="flex lg:text-xl md:text-xs text-sm text-purple">
                Check Live Site
              </p>
              <Icon name="i-fa6-solid-location-arrow" class="ms-3" style="color: #CBACF9" />
            </div>
          </div>
        </PinContainer>
      </div>
    </div>
  </div>
</template>
