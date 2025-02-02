<script setup lang="ts">
import * as Gitalk from 'gitalk';
import { onMounted } from 'vue';
import 'gitalk/dist/gitalk.css';

const config = useRuntimeConfig();

onMounted(() => {
  const commentConfig = {
    enable: true,
    clientID: config.public.GITHUB_COMMENT_CLIENT_ID,
    clientSecret: config.public.GITHUB_COMMENT_SECRET,
    repo: 'blog',
    owner: 'michael860520',
    admin: ['michael860520'],
    githubID: 'michael860520',
    id: decodeURI(window.location.pathname),
    language: 'zh-TW',
    proxy: 'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
    distractionFreeMode: true,
  };

  // eslint-disable-next-line new-cap
  const gitalk = new Gitalk.default(commentConfig);
  gitalk.render('gitalk-container');
});
</script>

<template>
  <div id="gitalk-container" />
</template>

<style scoped>
#gitalk-container {
  color: black !important;
}
</style>
