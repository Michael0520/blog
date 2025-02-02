<script setup lang="ts">
import RippleButton from '@/components/RippleButton.vue';

defineOptions({
  name: 'HeroSection',
});

const content = {
  title: 'Michael Lo\'s Tech Blog',
  description: 'Software Engineer exploring Vue, React, and Go. Sharing insights on modern web development, system design, and engineering best practices.',
  buttons: [
    {
      label: 'Read Blog Posts',
      variant: 'primary',
      link: '/frontend/web-performance',
    },
    // {
    //   label: 'About Me',
    //   variant: 'secondary',
    //   link: '/about',
    // },
  ],
};
</script>

<template>
  <div class="mx-auto h-[40rem] w-[calc(100%-4rem)] overflow-hidden rounded-md text-black dark:text-white">
    <!-- <spline-viewer url="https://prod.spline.design/Tci47wI9OnKw7VH8/scene.splinecode" /> -->
    <!-- <spline-viewer url="https://prod.spline.design/UWoeqiir20o49Dah/scene.splinecode" /> -->
    <Vortex
      background-color="transparent"
      class="flex size-full flex-col items-center justify-center px-2 py-4 md:px-10"
    >
      <h2 class="text-center text-2xl font-bold md:text-6xl">
        {{ content.title }}
      </h2>
      <p class="mt-6 max-w-xl text-center text-sm md:text-2xl">
        {{ content.description }}
      </p>
      <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row">
        <NuxtLink v-for="button in content.buttons" :key="button.label" :to="button.link">
          <RippleButton>
            {{ button.label }}
          </RippleButton>
        </NuxtLink>
      </div>
    </Vortex>
  </div>
</template>
