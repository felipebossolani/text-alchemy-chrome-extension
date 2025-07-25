import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TextAlchemy',
  description: 'Transform your plain text into magical Unicode styles!',
  
  // Multi-language support
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'TextAlchemy',
      description: 'Transform your plain text into magical Unicode styles!'
    },
    pt: {
      label: 'Português',
      lang: 'pt',
      title: 'TextAlchemy',
      description: 'Transforme seu texto simples em estilos Unicode mágicos!',
      link: '/pt/',
      themeConfig: {
        nav: [
          { text: 'Início', link: '/pt/' },
          { text: 'Instalação', link: '/pt/installation' },
          { text: 'Recursos', link: '/pt/features' },
          { text: 'Privacidade', link: '/pt/privacy' },
          { text: 'GitHub', link: 'https://github.com/felipebossolani/text-alchemy-chrome-extension' }
        ]
      }
    }
  },

  // Theme configuration
  themeConfig: {
    // Logo
    logo: {
      light: '/icon48.png',
      dark: '/icon48.png'
    },

    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Installation', link: '/installation' },
      { text: 'Features', link: '/features' },
      { text: 'Privacy', link: '/privacy' },
      { text: 'GitHub', link: 'https://github.com/felipebossolani/text-alchemy-chrome-extension' }
    ],

    // Sidebar
    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Installation', link: '/installation' },
            { text: 'Quick Start', link: '/quick-start' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Text Styles', link: '/features' },
            { text: 'Usage Guide', link: '/usage' },
            { text: 'Keyboard Shortcuts', link: '/shortcuts' }
          ]
        },
        {
          text: 'Development',
          items: [
            { text: 'Contributing', link: '/contributing' },
            { text: 'API Reference', link: '/api' }
          ]
        },
        {
          text: 'Legal',
          items: [
            { text: 'Privacy Policy', link: '/privacy' },
            { text: 'FAQ', link: '/faq' }
          ]
        }
      ],
      '/pt/': [
        {
          text: 'Começando',
          items: [
            { text: 'Introdução', link: '/pt/' },
            { text: 'Instalação', link: '/pt/installation' },
            { text: 'Início Rápido', link: '/pt/quick-start' }
          ]
        },
        {
          text: 'Funcionalidades',
          items: [
            { text: 'Estilos de Texto', link: '/pt/features' },
            { text: 'Guia de Uso', link: '/pt/usage' },
            { text: 'Atalhos de Teclado', link: '/pt/shortcuts' }
          ]
        },
        {
          text: 'Desenvolvimento',
          items: [
            { text: 'Contribuindo', link: '/pt/contributing' },
            { text: 'Referência da API', link: '/pt/api' }
          ]
        },
        {
          text: 'Legal',
          items: [
            { text: 'Política de Privacidade', link: '/pt/privacy' },
            { text: 'FAQ', link: '/pt/faq' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/felipebossolani/text-alchemy-chrome-extension' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/felipebossolani/' }
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Felipe Bossolani'
    },

    // Search
    search: {
      provider: 'local'
    }
  },

  // Custom CSS variables for theme colors
  appearance: true,
  
  // Head configuration
  head: [
    // Modern favicons
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    
    // Open Graph / Social Media Sharing
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'TextAlchemy - Transform Text into Magical Unicode Styles' }],
    ['meta', { property: 'og:description', content: 'Transform your plain text into beautiful Unicode styles! Bold, italic, monospace, and decorative fonts for social media, messaging, and more.' }],
    ['meta', { property: 'og:url', content: 'https://textalchemy.cc' }],
    ['meta', { property: 'og:image', content: 'https://textalchemy.cc/web-app-manifest-512x512.png' }],
    ['meta', { property: 'og:image:width', content: '512' }],
    ['meta', { property: 'og:image:height', content: '512' }],
    ['meta', { property: 'og:image:alt', content: 'TextAlchemy Chrome Extension Icon' }],
    ['meta', { property: 'og:site_name', content: 'TextAlchemy' }],
    
    // Twitter Cards
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'TextAlchemy - Transform Text into Magical Unicode Styles' }],
    ['meta', { name: 'twitter:description', content: 'Transform your plain text into beautiful Unicode styles! Bold, italic, monospace, and decorative fonts for social media, messaging, and more.' }],
    ['meta', { name: 'twitter:image', content: 'https://textalchemy.cc/web-app-manifest-512x512.png' }],
    ['meta', { name: 'twitter:image:alt', content: 'TextAlchemy Chrome Extension Icon' }],
    
    // Meta tags
    ['meta', { name: 'theme-color', content: '#6C3EF4' }],
    ['meta', { name: 'msapplication-TileColor', content: '#6C3EF4' }],
    ['meta', { name: 'google-site-verification', content: 'l_j6zqukjZdEe8L5S_5gg-LWjSBTooxS5xUNEEmXi-I' }]
  ],

  // Build configuration
  outDir: '../dist-docs',
  
  // Base URL - empty for custom domain
  base: '/'
}) 