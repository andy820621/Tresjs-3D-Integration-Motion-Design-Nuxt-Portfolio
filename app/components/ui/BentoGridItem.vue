<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import animationData from '~/assets/data/confetti.json'

defineProps<{
  className?: string
  title: string | VNode
  description: string | VNode
  id: number
  img?: string
  imgClassName?: string
  titleClassName?: string
  spareImg?: string
}>()

// id === 2 parts
const leftLists = ['ReactJS', 'Express', 'Typescript']
const rightLists = ['VueJS', 'NuxtJS', 'GraphQL']

// id === 6 parts
const email = 'hsu@jsmastery.pro'
const { copy, copied } = useClipboard()

const lottieProps = {
  width: 400,
  height: 200,
  loop: copied.value,
  autoplay: copied.value,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

async function handleCopy() {
  await copy(email)
}
</script>

<template>
  <div
    class="row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4"
    :class="className"
    :style="{
      background: 'rgb(4,7,29)',
      backgroundImage:
        'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
        // generate the color from here https://cssgradient.io/
    }"
  >
    <div class="h-full" :class="id === 6 && 'flex justify-center'">
      <div class="w-full h-full absolute">
        <NuxtImg v-if="img" format="webp" :src="img" :class="imgClassName" class="w-full object-cover object-center" :alt="img" />
      </div>

      <div class="min-w-[50%] absolute right-0 -bottom-5" :class="id === 5 && 'w-full opacity-80'">
        <NuxtImg v-if="spareImg" format="webp" :src="spareImg" class="object-cover object-center w-full h-full" :alt="spareImg" />
      </div>

      <UiGradientBg v-if="id === 6">
        <!-- <div class="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl" /> -->
      </UiGradientBg>

      <div :class="titleClassName" class="group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10">
        <div class="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
          {{ description }}
        </div>

        <div class="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10 text-white">
          {{ title }}
        </div>

        <UiGlobeGrid v-if="id === 2" />

        <div v-if="id === 3" class="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
          <div class="flex flex-col gap-3 md:gap-3 lg:gap-8">
            <span
              v-for="(item, i) in leftLists"
              :key="i"
              class="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50
                    lg:opacity-100 rounded-lg text-center bg-[#10132E] dark:text-white"
            >
              {{ item }}
            </span>
            <span class="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center bg-[#10132E]" />
          </div>
          <div class="flex flex-col gap-3 md:gap-3 lg:gap-8">
            <span class="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center bg-[#10132E]" />
            <span
              v-for="(item, i) in rightLists"
              :key="i"
              class="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50
                    lg:opacity-100 rounded-lg text-center bg-[#10132E] dark:text-white"
            >
              {{ item }}
            </span>
          </div>
        </div>

        <div v-if="id === 6" class="mt-5 relative">
          <div
            class="absolute -bottom-5 right-0"
            :class="copied ? 'block' : 'block'"
          >
            <ClientOnly>
              <Vue3Lottie
                v-bind="lottieProps"
              />
            </ClientOnly>
          </div>

          <UiMagicBtn
            :title="copied ? 'Email is Copied!' : 'Copy my email'"
            :icon="copied ? 'i-ion-copy' : 'i-ion-copy-outline'"
            position="left"
            other-classes="!bg-[#161A31]"
            @click="handleCopy"
          />
        </div>
      </div>
    </div>
  </div>
</template>
