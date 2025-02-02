export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: 'Michael\'s blog',
      description: 'A Software Engineer. Get Web Development, Javascript, Typescript, React/VueJs, Next/Nuxt, Related Articles, Tips, Learning resources and more.',
      ogImageComponent: 'BlogPost',
      ogImageColor: 'dark',
    },
    theme: {
      customizable: true,
      color: 'zinc',
      radius: 0.5,
    },
    header: {
      title: 'Michael\'s Blog',
      showTitle: true,
      darkModeToggle: true,
      logo: {
        light: '/favicon-32x32.png',
        dark: '/favicon-32x32.png',
      },
      nav: [
        {
          title: 'FrontEnd',
          links: [{
            title: 'ESM',
            to: '/frontend/esm',
            description: 'ESM 模組化',
            icon: 'lucide:rocket',
          }],
        },
        { title: 'BackEnd', to: '/backend' },
        { title: 'SmallTalk', to: '/smalltalk' },
        { title: 'LeetCode', to: '/leetcode' },

      ],
      links: [{
        icon: 'lucide:github',
        to: 'https://github.com/eepson123tw',
        target: '_blank',
      }],
    },
    aside: {
      useLevel: true,
      collapse: false,
    },
    main: {
      breadCrumb: true,
      showTitle: true,
    },
    banner: {
      enable: true,
      showClose: true,
      content: 'Welcome to **Michael\'s Blog**! 🎉  currently Renew and moving old post 🫠',
      to: '/',
      target: '_self',
      border: true,
    },
    footer: {
      credits: `All right reserved © ${new Date().getFullYear()} Michael's Blog`,
      links: [{
        icon: 'lucide:file-user',
        to: '',
        target: '_blank',
      }, {
        icon: 'lucide:linkedin',
        to: '',
        target: '_blank',
      }, {
        icon: 'lucide:rss',
        to: 'https://www.michaello.me/rss.xml',
        target: '_blank',
      }],
    },
    toc: {
      enable: true,
      title: 'On This Page',
      links: [{
        title: 'Star on GitHub',
        icon: 'lucide:star',
        to: 'https://github.com/michael860520/blog',
        target: '_blank',
      }, {
        title: 'Create Issues',
        icon: 'lucide:circle-dot',
        to: 'https://github.com/michael860520/blog/issues',
        target: '_blank',
      }],
    },
    search: {
      enable: true,
      inAside: false,
      style: 'input' as 'input' | 'button',
    },
    gitTalk: {
      enable: true,
    },
  },
});
