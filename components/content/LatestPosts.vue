<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import { Motion } from 'motion-v';
import { onMounted, ref } from 'vue';

defineOptions({
  name: 'LatestPosts',
});

interface Post {
  title: string;
  description: string;
  date: string;
  _path: string;
}

const latestPosts = ref<Post[]>([]);

async function fetchPosts() {
  try {
    const posts = await queryContent()
      .where({
        _partial: false,
        _draft: false,
        navigation: { $ne: false },
      })
      .sort({ date: -1 })
      .limit(3)
      .find();

    latestPosts.value = (posts as unknown) as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    latestPosts.value = [];
  }
}

onMounted(() => {
  fetchPosts();
});

function formatDate(date: string) {
  if (!date)
    return '';
  return useDateFormat(date, 'MMMM D, YYYY').value;
}

function getTopicFromPath(path: string | undefined): string {
  if (!path)
    return 'General';
  const segments = path.split('/');
  return segments[1] || 'General';
}
</script>

<template>
  <section class="relative mt-10 flex flex-col p-6 lg:grid lg:grid-cols-4 lg:gap-8">
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
        <div class="text-center text-2xl font-medium dark:text-white lg:text-4xl">
          Latest Blog Posts
        </div>
      </Motion>
    </AuroraBackground>

    <div class="col-span-3">
      <div class="space-y-6">
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
