# [Admin One &mdash; Free Vue 3.x Tailwind 4.x Admin Dashboard with dark mode](https://justboil.me/tailwind-admin-templates/free-vue-dashboard/)

## Estrutura

- `web/` â€” aplicaÃ§Ã£o Nuxt (todo o cÃ³digo web, `package.json`, config e assets).
- `Dockerfile`, `docker-compose.yaml` e `docker/` â€” build e publicaÃ§Ã£o em `/app/admin/`.
- `.github/` â€” CI e publicaÃ§Ã£o da imagem `admin-ui`.

Comandos de desenvolvimento, a partir de `web/`:

```bash
npm install
npm run dev     # http://localhost:3000/app/admin/
npm run build   # typecheck + build de produÃ§Ã£o
```

## Docker / Deploy

Este painel roda em um container nginx prÃ³prio e Ã© publicado pelo nginx dos
microservices em **`/app/admin/`**:

```bash
docker compose up -d --build
# http://localhost/app/admin/
```

- O compose local usa a rede externa `ehs_microservices_default` e publica a porta 3000 para depuraÃ§Ã£o.
- A API Ã© consumida na mesma origem (`NUXT_PUBLIC_USERS_API_URL=/users`), pelo gateway dos microservices.
- Login Google: o `NUXT_PUBLIC_GOOGLE_CLIENT_ID` Ã© compilado no bundle estÃ¡tico, entÃ£o precisa existir no build (local: `ADMIN_GOOGLE_CLIENT_ID=... docker compose build`; CI: var de repositÃ³rio `ADMIN_GOOGLE_CLIENT_ID`). Vazio = botÃ£o oculto.
- A imagem publicada pelo GitHub Actions Ã© `ghcr.io/eduhsilva/admin-ui` (tags `latest` e `<sha>`), gerada por `.github/workflows/build.yml`.
- Em produÃ§Ã£o, use `docker-compose.prod.yml`. Ele nÃ£o publica portas no host e usa por padrÃ£o a rede `microservices_backend`:
  `docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d`.
- Para fixar uma versÃ£o, defina `IMAGE_TAG=<sha>`. Se a rede tiver outro nome, defina `EHS_MICROSERVICES_NETWORK`; `ADMIN_UI_IMAGE` substitui a imagem completa.

[![version](https://img.shields.io/github/v/release/justboil/admin-one-vue-tailwind)](https://justboil.me/tailwind-admin-templates/free-vue-dashboard/)  [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://justboil.me/tailwind-admin-templates/free-vue-dashboard/)

### Tailwind 4.x Vue 3.x with Vite or Nuxt or Laravel

[![Free Vue 3 Tailwind 4 admin dashboard with dark mode](https://static.justboil.me/templates/one/repo-tailwind-vue.png?v=4)](https://justboil.github.io/admin-one-vue-tailwind/)

[![Vue Tailwind white & dark styles](https://static.justboil.me/templates/one/repo-styles.png)](https://justboil.github.io/admin-one-vue-tailwind/)

### Tailwind 4.x Vue 3.x with Vite or Nuxt or Laravel

**Admin One** is simple, beautiful and free Vue.js 3.x Tailwind CSS 4.x admin dashboard. Nuxt 3.x or Laravel 12.x integrations available

* Built with **Vue.js 3**, **Tailwind CSS 4** framework & **Composition API**
* **Vite** under the hood &mdash; [Info](https://vitejs.dev)
* **Laravel Inertia Vue** integration available &mdash; [Info](#laravel-12x-integration)
* **Nuxt 3** integration available &mdash; [Info](#nuxt-3-integration)
* **SFC** `<script setup>` &mdash; [Info](https://v3.vuejs.org/api/sfc-script-setup.html)
* **Pinia** state library (official Vuex 5) &mdash; [Info](https://pinia.vuejs.org/)
* **Dark mode**
* **Styled** scrollbars
* SPA with **Router**
* **Production CSS** is only **&thickapprox;38kb**
* Reusable components
* Free under MIT License
* [Premium version](https://justboil.me/tailwind-admin-templates/vue-dashboard/) available

## Table of Contents

* [React TypeScript version](#looking-for-react-typescript-version)
* [Responsive layout](#responsive-layout)
  * [Mobile & tablet](#mobile--tablet)
  * [Small laptops](#small-laptops-1024px)
  * [Laptops & desktops](#laptops--desktops)
* [Demo](#demo)
  * [Free dashboard demo](#free-dashboard-demo)
  * [Premium dashboard demo](#premium-dashboard-demo)
* [Quick Start](#quick-start)
  * [Get code & install](#get-code--install)
  * [Vite builds](#vite-builds)
  * [Linting](#linting)
  * [Nuxt 3.x integration](#nuxt-3x-integration)
  * [Laravel 12.x integration](#laravel-12x-integration)
* [Docs](#docs)
* [Browser Support](#browser-support)
* [Reporting Issues](#reporting-issues)
* [Licensing](#licensing)
* [Useful Links](#useful-links)

## Looking for React TypeScript version?

This is **Tailwind Vue dashboard** version

Looking for **Tailwind React TypeScript**? Check [Admin One - React TypeScript Tailwind dashboard](https://github.com/justboil/admin-one-react-tailwind) version

## Responsive layout

### Mobile & tablet

Mobile layout with hidden aside menu and collapsable cards & tables

[![Free Vue 3 Tailwind CSS 4 admin dashboard](https://static.justboil.me/templates/one/one-tailwind-vue-mobile.png)](https://justboil.github.io/admin-one-vue-tailwind/)

### Small laptops 1024px

Small laptop layout with show/hide aside menu option

[![Free Vue 3 Tailwind CSS 4 admin dashboard](https://static.justboil.me/templates/one/one-tailwind-vue-1024.png)](https://justboil.github.io/admin-one-vue-tailwind/)

[![Free Vue 3 Tailwind CSS 4 admin dashboard](https://static.justboil.me/templates/one/one-tailwind-vue-1024-menu-open.png)](https://justboil.github.io/admin-one-vue-tailwind/)

### Laptops & desktops

Classic layout with aside menus on the left

[![Free Vue 3 Tailwind CSS 4 admin dashboard](https://static.justboil.me/templates/one/one-tailwind-vue-widescreen.png)](https://justboil.github.io/admin-one-vue-tailwind/)

## Demo

### Free Dashboard Demo

https://justboil.github.io/admin-one-vue-tailwind/

### Premium Dashboard Demo

https://tailwind-vue.justboil.me/

## Quick Start

Get code & install. Then `dev` or `build` with [Vite](#vite-builds) or integrate with [Nuxt](#nuxt-3x-integration) or [Laravel](#laravel-12x-integration)

* [Get code & install](#get-code--install)
* [Vite builds](#vite-builds)
* [Linting](#linting)
* [Nuxt 3.x integration](#nuxt-3x-integration)
* [Laravel 12.x integration](#laravel-12x-integration)

### Get code & install

#### Get the repo

* [Create new repo](https://github.com/justboil/admin-one-vue-tailwind/generate) with this template
* &hellip; or clone this repo on GitHub
* &hellip; or [download .zip](https://github.com/justboil/admin-one-vue-tailwind/archive/master.zip) from GitHub

#### Install

`cd` to project's dir and run `npm install`

### Vite builds

[Vite](https://vitejs.dev) is next Generation Frontend Tooling featuring unbundled web-development

#### Hot-reloads for development

```
npm run dev
```

#### Builds and minifies for production

```
npm run build
```

#### Serves recently built app

```
npm run preview
```

### Linting

#### Lint

```
npm run lint
```

### Nuxt 3.x integration

This dashboard can be integrated with Nuxt 3.x. [Check guide](https://github.com/justboil/admin-one-vue-tailwind/tree/master/.nuxt-guide) for more information

### Laravel 12.x integration

This dashboard can be integrated with Laravel 12.x Inertia + Vue.js stack. [Check guide](https://github.com/justboil/admin-one-vue-tailwind/tree/master/.laravel-guide) for more information

## Docs

Customization & info: https://justboil.github.io/docs/

## Browser Support

We try to make sure Dashboard works well in the latest versions of all major browsers

<img src="https://justboil.me/images/browsers-svg/chrome.svg" width="64" height="64" alt="Chrome"> <img src="https://justboil.me/images/browsers-svg/firefox.svg" width="64" height="64" alt="Firefox"> <img src="https://justboil.me/images/browsers-svg/edge.svg" width="64" height="64" alt="Edge"> <img src="https://justboil.me/images/browsers-svg/safari.svg" width="64" height="64" alt="Safari"> <img src="https://justboil.me/images/browsers-svg/opera.svg" width="64" height="64" alt="Opera">

## Reporting Issues

JustBoil's free items are limited to community support on GitHub.

The issue list is reserved exclusively for bug reports and feature requests. That means we do not accept usage questions. If you open an issue that does not conform to the requirements, it will be closed.

1. Make sure that you are using the latest version of the Dashboard. Issues for outdated versions are irrelevant
2. Provide steps to reproduce
3. Provide an expected behavior
4. Describe what is actually happening
5. Platform, Browser & version as some issues may be browser specific

## Licensing

- Copyright &copy; 2019-2025 JustBoil.me (https://justboil.me)
- Licensed under MIT

## Useful Links

- [JustBoil.me](https://justboil.me/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vue.js 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev)

