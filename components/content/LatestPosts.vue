<template>
  <section class="relative mt-10 flex flex-col lg:grid lg:grid-cols-4 lg:gap-8">
    <!-- 左側標題區塊 -->

    <AuroraBackground>
      <Motion
        as="div"
        :initial="{ opacity: 0, y: 40, filter: 'blur(10px)' }"
        :in-view="{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }"
        :transition="{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }"
        class="relative flex flex-col items-center justify-center gap-4 rounded-xl  px-4"
      >
        <div class="text-center text-4xl font-medium dark:text-white">
          Latest Blog Posts
        </div>
        <!-- <div class="py-4 text-base font-extralight dark:text-neutral-200">
          And this, is chemical burn.
        </div> -->
        <!-- <button
          class="w-fit rounded-full bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Burn it now
        </button> -->
      </Motion>
    </AuroraBackground>

    <!-- 右側文章列表區塊 -->
    <div class="col-span-3">
      <div class="space-y-6">
        <!-- 第一張卡片 - 最新文章 -->
        <article
          v-if="latestPosts?.[0]"
          class="group relative flex flex-col space-y-4 rounded-xl border bg-gradient-to-b from-background to-muted/20 p-6 shadow-sm transition-all hover:bg-muted/20 hover:shadow-lg"
        >
          <div class="inline-flex w-fit items-center space-x-2 rounded-full bg-muted/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Icon name="lucide:hash" class="size-4" />
            <span class="font-medium">{{ getTopicFromPath(latestPosts[0]._path) }}</span>
          </div>

          <div class="flex flex-1 flex-col justify-between">
            <div class="space-y-4">
              <h3 class="text-xl font-semibold tracking-tight md:text-2xl">
                <NuxtLink
                  :to="latestPosts[0]._path"
                  class="after:absolute after:inset-0 after:rounded-xl"
                >
                  {{ latestPosts[0].title }}
                </NuxtLink>
              </h3>
              <p class="text-sm text-muted-foreground lg:w-2/3">
                {{ latestPosts[0].description }}
              </p>
            </div>

            <div class="mt-6 flex items-center justify-between">
              <time class="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="lucide:calendar" class="size-4" />
                <span>{{ formatDate(latestPosts[0].date) }}</span>
              </time>
              <div class="rounded-full p-2 transition-all group-hover:bg-foreground group-hover:text-background">
                <Icon name="lucide:arrow-right" class="size-4" />
              </div>
            </div>
          </div>
        </article>

        <!-- 其餘兩張卡片 -->
        <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          <article
            v-for="post in latestPosts?.slice(1)"
            :key="post._path"
            class="group relative flex flex-col space-y-4 rounded-xl border bg-gradient-to-b from-background to-muted/20 p-6 shadow-sm transition-all hover:shadow-lg"
          >
            <div class="inline-flex w-fit items-center space-x-2 rounded-full bg-muted/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Icon name="lucide:hash" class="size-4" />
              <span class="font-medium">{{ getTopicFromPath(post._path) }}</span>
            </div>

            <div class="flex flex-1 flex-col justify-between">
              <div class="space-y-4">
                <h3 class="line-clamp-2 text-xl font-semibold tracking-tight">
                  <NuxtLink
                    :to="post._path"
                    class="after:absolute after:inset-0 after:rounded-xl"
                  >
                    {{ post.title }}
                  </NuxtLink>
                </h3>
                <p class="line-clamp-3 text-sm text-muted-foreground">
                  {{ post.description }}
                </p>
              </div>

              <div class="mt-6 flex items-center justify-between">
                <time class="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="lucide:calendar" class="size-4" />
                  <span>{{ formatDate(post.date) }}</span>
                </time>
                <div class="rounded-full p-2 transition-all group-hover:bg-foreground group-hover:text-background">
                  <Icon name="lucide:arrow-right" class="size-4" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import { Motion } from 'motion-v';

defineOptions({
  name: 'LatestPosts',
});

const { data: latestPosts } = await useAsyncData('latest-posts', () => queryContent()
  .where({
    _partial: false,
    _draft: false,
    navigation: { $ne: false },
  })
  .sort({ date: -1 })
  .limit(3)
  .find());

const formatDate = (date: string) => useDateFormat(date, 'MMMM D, YYYY').value;

function getTopicFromPath(path: string | undefined): string {
  if (!path)
    return 'General';
  return path.split('/')[1] || 'General';
}
</script>
