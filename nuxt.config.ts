// https://nuxt.com/docs/api/configuration/nuxt-config
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseStringPromise } from 'xml2js';
import { genFeed } from './utils/feed';

export default defineNuxtConfig({
  devtools: { enabled: false },
  extends: ['shadcn-docs-nuxt'],
  i18n: {
    vueI18n: './locales/i18n.config.ts',
    locales: [
      { code: 'zh-Hant', language: 'zh-Hant', name: '繁體中文', file: 'zh-Hant.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ja', language: 'ja', name: '日本語', file: 'ja.json' },
    ],
    defaultLocale: 'zh-Hant',
    langDir: '../locales',
    strategy: 'no_prefix',
    lazy: true,
  },
  modules: ['nuxt-og-image', '@nuxtjs/i18n', '@nuxt/image', '@nuxtjs/robots', '@nuxtjs/sitemap'],
  components: {
    dirs: [
      {
        path: './components',
        ignore: ['**/*.ts'],
      },
    ],
  },
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini'],
    },
  },
  ogImage: {
    fonts: [
      'Noto+Sans+SC:400',
    ],
  },
  app: {
    head: {
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'zh-TW',
      },
      title: 'Michael\'s Blog',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        {
          rel: 'prefetch',
          // href: 'https://www.youtube.com/iframe_api',
        },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        { rel: 'manifest', href: '/site.webmanifest' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'preconnect',
          crossorigin: 'anonymous',
          href: 'https://fonts.gstatic.com',
        },
        {
          rel: 'preconnect',
          crossorigin: 'anonymous',
          href: 'https://fonts.googleapis.com',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A Software Engineer. Get Web Development, Javascript, Typescript, React/VueJs, Next/Nuxt, Related Articles, Tips, Learning resources and more.' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: 'black' },
        { name: 'referrer', content: 'no-referrer-when-downgrade' },
        { name: 'author', content: 'Michael Lo' },
        { name: 'keywords', content: 'taiwan, software engineer, frontend, backend, full stack, leetcode, coding, self-learning' },
        { name: 'application-name', content: 'Michael' },
        { name: 'apple-mobile-web-app-title', content: 'Michael' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        {
          name: 'google-site-verification',
          content: 'cqjGZwBOhXTLTKIT6iq_X0Dc2wO_yYQeGsREqWJcgjc',
        },
      ],
      // script: [
      //   {
      //     src: '',
      //     async: true,
      //   },
      //   {
      //     innerHTML: `
      //       window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag(\'js\', new Date());\ngtag(\'config\', \'G-R6YQL587WJ\');
      //     `,
      //     type: 'text/javascript',
      //   },
      //   {
      //     innerHTML: `;(() => {
      //       !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      //       posthog.init('phc_fzR4XnxYjp4sB38xz1F8L1halakmuZtr1sIRkIaCpNG', {api_host: 'https://app.posthog.com'})
      //     })()`,
      //     type: 'text/javascript',
      //   },
      // ],
    },
  },
  site: {
    url: 'https://www.michaello.me', // Canonical URL
    name: 'Michael\'s Blog',
  },
  runtimeConfig: {
    public: {
      GITHUB_COMMENT_CLIENT_ID: '',
      GITHUB_COMMENT_SECRET: '',
    },
    baseURL: 'https://www.michaello.me',
  },
  nitro: {
    // preset: 'node-server',
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    prerender: {
      crawlLinks: false,
      failOnError: false,
      routes: ['/sitemap.xml'],
    },
    watchOptions: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
      ],
    },

    hooks: {
      'prerender:generate': async (route, nitro) => {
        // eslint-disable-next-line node/prefer-global/process
        if (process.env.CI || process.env.SKIP_RSS === 'true') {
          console.log('Skipping RSS generation in build.');
          return;
        }
        try {
          const response = await fetch('https://www.michaello.me/sitemap.xml', {
            signal: AbortSignal.timeout(10_000),
          });

          if (!response.ok)
            throw new Error(`Error fetching sitemap: ${response.status} ${response.statusText}`);

          const xmlText = await response.text();
          const parsedSitemap = await parseStringPromise(xmlText);
          const urlEntries = parsedSitemap?.urlset?.url || [];

          const rssXml = await genFeed(urlEntries);
          const outputPath = join(nitro.options.output.publicDir, 'rss.xml');
          writeFileSync(outputPath, rssXml, 'utf-8');
          console.log(`RSS feed generated at: ${outputPath}`);
        } catch (error) {
          console.error('Failed to generate RSS feed', error);
        }
      },
    },
  },
  vite: {
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 4500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    ssr: {
      noExternal: ['debug'],
    },
  },
  image: {
    formats: ['webp', 'jpeg'],
    quality: 75,
  },
  robots: {
    sitemap: 'https://www.michaello.me/sitemap.xml',
  },
  sitemap: {
    xsl: false,
    defaults: {
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
  },
  experimental: {
    appManifest: false,
  },
  compatibilityDate: '2025-02-01',
});
