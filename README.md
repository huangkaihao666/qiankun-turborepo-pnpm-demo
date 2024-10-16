## 前言
小编在实习过程中接触了 Qiankun 微前端的项目，个人还是比较感兴趣的，所以参考公司的项目搭建一个 Qiankun 微前端 + Turborepo + pnpm 实践的 demo 作为演示和学习，以进一步去了解这一套体系结构......

在现代前端开发中，`微前端架构已经成为一种流行的解决方案，它允许我们将一个大型应用拆分为多个独立的子应用，每个子应用可以独立开发、测试和部署`。这种架构不仅提高了开发效率，还增强了系统的可维护性和扩展性。

接下来小编将介绍如何使用 `qiankun` 微前端框架、`Turborepo` 构建系统和 `pnpm` 包管理器来实现一个基于 Vue 的主应用和子应用的微前端项目。我们将详细探讨如何配置和组织项目结构，确保主应用和子应用能够无缝集成，并利用 Turborepo 和 pnpm 的优势来提高开发和构建效率。

开始之前，可以推荐下掘友们先看一下小编之前写过的一篇关于 `如何使用 vue3 + pnpm 搭建 monorepo 项目`的一篇文章，然后再来看 monorepo 架构是如何结合微前端搭配使用到项当中的，小编觉得这个恰好是一个循序渐进的过程哈，理解起来比较容易一点，链接如下：

[教你如何使用 vue3 + pnpm 搭建 monorepo 项目](https://juejin.cn/post/7425227672421908495)

闲话不多赘述，我们步入正题吧

## 技术栈介绍、调研与选型

**微前端介绍：** 微前端（Micro Frontends）是一种架构风格，旨在将前端应用拆分为多个独立的、可独立开发和部署的子应用。每个子应用可以由不同的团队开发，使用不同的技术栈，并且可以独立部署。微前端的核心思想是将前端应用拆分为多个小的、独立的模块，每个模块负责特定的功能或页面，从而提高开发效率、可维护性和可扩展性。

**微前端的应用场景**

1.  `大型企业应用`：将大型企业应用拆分为多个独立的子应用，每个子应用由不同的团队开发和维护。
1.  `多技术栈项目`：在同一个项目中使用不同的技术栈，每个子应用可以使用不同的技术栈。
1.  `渐进式升级`：逐步升级和替换旧的前端应用，每个子应用可以独立升级和替换。

**常见微前端实现方案：**

| 技术方案 | 核心特点 | 支持框架 | 集成难度 | 性能 | 社区支持 | 适用场景 |
|----------|----------|----------|----------|------|----------|----------|
| **iframe** | 简单易用，完全隔离 | 任意 | 简单 | 较差 | 一般 | 简单应用、需要完全隔离的场景 |
| **Web Components** | 标准化的 Web API，完全隔离 | 原生 JavaScript | 简单 | 较好 | 一般 | 组件化开发、多技术栈项目 |
| **single-spa** | 提供生命周期管理，支持多种前端框架 | React, Vue, Angular 等 | 较高 | 较好 | 活跃 | 大型企业应用、多技术栈项目 |
| **qiankun** | 基于 single-spa 封装，提供更简洁的 API | React, Vue, Angular 等 | 中等 | 较好 | 活跃 | 大型企业应用、多技术栈项目 |
| **Module Federation** | 基于 Webpack 5，提供模块共享机制 | React, Vue, Angular 等 | 较高 | 较好 | 活跃 | 大型企业应用、多技术栈项目 |
| **wujie** | 基于 Web Components，提供组件化开发 | 原生 JavaScript | 简单 | 较好 | 一般 | 组件化开发、多技术栈项目 |
| **micro-app** | 基于 Web Components，提供组件化开发 | 原生 JavaScript | 简单 | 较好 | 一般 | 组件化开发、多技术栈项目 |

`本文小编选择的是 qiankun 微前端的方案`，因为小编所在的实习公司也是使用的这一套方案，所以想进一步加深一下对这套方案的了解，并且 `qiankun 基于 single-spa 封装，提供了更简洁的 API，使得集成和使用更加简单。你不需要深入了解 single-spa 的复杂性，就可以快速上手`。

**Turborepo 介绍：** Turborepo 是一个用于 JavaScript 和 TypeScript 代码库的高性能构建系统。它旨在通过`并行构建、缓存和增量构建`等技术，显著提高构建速度，从而提升开发效率。Turborepo 特别适用于大型 Monorepo（单一代码库）项目，其中包含多个子项目或包。

**Turborepo 的核心特点**

1.  `并行构建`：Turborepo 可以并行构建多个包，充分利用多核处理器的性能。
1.  `缓存`：Turborepo 会缓存构建结果，避免重复构建相同的代码，从而提高构建速度。
1.  `增量构建`：Turborepo 支持增量构建，只构建发生变化的部分，而不是整个代码库。
1.  `依赖图`：Turborepo 会自动分析包之间的依赖关系，确保构建顺序正确。
1.  `Monorepo 支持`：Turborepo 特别适用于 Monorepo 项目，可以管理多个包和子项目。

**Turborepo 的使用场景**

1.  `大型 Monorepo 项目`：Turborepo 特别适用于包含多个包和子项目的大型 Monorepo 项目。
1.  `多团队协作`：在多团队协作的项目中，Turborepo 可以提高构建速度，减少等待时间。
1.  `持续集成/持续部署（CI/CD）` ：Turborepo 可以显著提高 CI/CD 管道的构建速度，减少构建时间。

**Turborepo VS Lerna**：由于小编借助 Turborepo 主要是想实现 Monorepo 架构的思想，涉及到多包管理的时候也还有 Lerna 方案，以下简要对比分析一下这两者：


| 特性 | Turborepo | Lerna |
|------|-----------|-------|
| **核心功能** | 高性能构建系统，支持并行构建、缓存和增量构建 | 用于管理 JavaScript 项目的工具，支持版本管理、发布和依赖管理 |
| **适用场景** | 大型 Monorepo 项目，特别适用于需要高性能构建的场景 | 大型 Monorepo 项目，特别适用于需要版本管理和发布的场景 |
| **并行构建** | 支持并行构建，充分利用多核处理器的性能 | 支持并行构建，但需要手动配置 |
| **缓存** | 支持缓存构建结果，避免重复构建相同的代码 | 支持缓存，但需要手动配置 |
| **增量构建** | 支持增量构建，只构建发生变化的部分 | 支持增量构建，但需要手动配置 |
| **依赖图** | 自动分析包之间的依赖关系，确保构建顺序正确 | 自动分析包之间的依赖关系，确保构建顺序正确 |
| **版本管理** | 不支持版本管理 | 支持版本管理，可以自动更新依赖包的版本 |
| **发布** | 不支持发布 | 支持发布，可以自动发布包到 npm |
| **依赖管理** | 支持依赖管理，可以自动安装和更新依赖 | 支持依赖管理，可以自动安装和更新依赖 |
| **配置** | 配置简单，使用 `turbo.json` 文件进行配置 | 配置相对复杂，使用 `lerna.json` 文件进行配置 |
| **社区支持** | 社区相对较小，但正在快速发展 | 社区较大，有丰富的文档和示例代码 |
| **性能** | 高性能，特别适用于需要快速构建的场景 | 性能较好，但需要手动配置以提高性能 |
| **集成** | 可以与其他工具集成，如 Webpack、Babel 等 | 可以与其他工具集成，如 Webpack、Babel 等 |

总的来说，Lerna 是较早出现的工具，主要用于管理 JavaScript 项目的版本管理、发布和依赖管理。Turborepo 是相对较新的工具，主要用于高性能构建，特别适用于需要快速构建的大型 Monorepo 项目。

**pnpm**: 小编在开头介绍的上一篇博客，也就是`如何使用 vue3 + pnpm 搭建 monorepo 项目`中有对于 pnpm 构建 monorepo 项目的优势进行介绍，这里就不再赘述...

## 初始化项目：

首先，我们需要初始化一个新的项目，并配置 Turborepo 和 pnpm。

```js
mkdir qiankun-turborepo-pnpm-demo
cd qiankun-turborepo-pnpm-demo
pnpm init
```
## 配置 pnpm 工作区
在项目根目录下创建 `pnpm-workspace.yaml` 文件，定义工作区。

```js
packages:
  - 'apps/*'
  - 'packages/*'
```
##  配置 Turborepo

在项目根目录下创建 `turbo.json` 文件，配置 Turborepo，该文件用于配置 Turborepo 的构建管道和任务，以下是一个示例配置，实际开发看具体需求而定

```js
{
  "$schema": "https://turborepo.org/schema.json",
  "tasks": {
    "build": {
      "dependsOn": [
        "^build"
      ],
      "outputs": [
        "dist/**"
      ]
    },
    "test": {
      "dependsOn": [
        "build"
      ],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```
现在再简单介绍一下 `turbo.json` 文件的作用，方便理解

在 Turborepo 项目中，`turbo.json` 文件是一个重要的配置文件，它用于定义和管理项目的构建、测试、运行等任务的执行流程。以下是 `turbo.json` 文件的主要作用：

 1. **定义任务管道（Pipeline）**
`turbo.json` 文件的核心功能是定义任务管道（Pipeline）。任务管道是一系列任务的执行顺序和依赖关系。通过定义任务管道，我们可以控制任务的执行顺序、并行执行的任务、以及任务之间的依赖关系。

例如：
```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}
```

- `build`: 表示构建任务。`dependsOn: ["^build"]` 表示当前包的构建任务依赖于所有依赖包的构建任务完成。
- `test`: 表示测试任务。`dependsOn: ["build"]` 表示测试任务依赖于构建任务完成。
- `lint`: 表示代码检查任务。`outputs: []` 表示该任务没有输出文件。

 2. **配置缓存行为**
`turbo.json` 文件还可以配置缓存行为，以提高任务的执行效率。Turborepo 会自动缓存任务的输出结果，并在后续执行时复用缓存结果，从而减少重复工作。

例如：
```json
{
  "pipeline": {
    "build": {
      "cache": true,
      "outputs": ["dist/**"]
    }
  }
}
```

- `cache: true`: 表示启用缓存。Turborepo 会缓存 `build` 任务的输出结果，并在下次执行时检查是否可以复用缓存。
- `outputs`: 指定任务的输出文件路径，Turborepo 会根据这些路径来判断缓存是否有效。

 3. **定义全局配置**
`turbo.json` 文件还可以包含一些全局配置，例如环境变量、全局任务等。

例如：
```json
{
  "globalDependencies": ["package.json", "tsconfig.json"],
  "globalEnv": ["NODE_ENV", "API_URL"]
}
```

- `globalDependencies`: 指定全局依赖文件，这些文件的变化会影响所有任务的执行。
- `globalEnv`: 指定全局环境变量，这些变量会在所有任务中可用。

 4. **自定义任务**
你可以通过 `turbo.json` 文件定义自定义任务，并指定它们的执行顺序和依赖关系。

例如：
```json
{
  "pipeline": {
    "customTask": {
      "dependsOn": ["build"],
      "outputs": ["custom-output/**"]
    }
  }
}
```

- `customTask`: 定义一个自定义任务，该任务依赖于 `build` 任务完成。
- `outputs`: 指定自定义任务的输出文件路径。

 5. **集成其他工具**
`turbo.json` 文件还可以与其他工具集成，例如 ESLint、TypeScript 等。你可以通过配置文件来指定这些工具的执行方式和参数。

例如：
```json
{
  "pipeline": {
    "lint": {
      "outputs": [],
      "command": "eslint src/**/*.js"
    }
  }
}
```

- `command`: 指定执行 `lint` 任务时运行的命令。

 **总结：**
`turbo.json` 文件在 Turborepo 项目中起到了核心配置的作用，它定义了任务的执行流程、缓存行为、全局配置等。通过合理配置 `turbo.json`，我们可以优化项目的构建、测试、运行等任务的执行效率，提高开发效率。


## 创建主应用

在 `apps/` 目录下创建主应用 `main-app`。

```js
mkdir apps
cd apps
npm init vite@latest main-app --template vue
```
## 创建子应用

```js
npm init vite@latest sub-app-1 --template vue
npm init vite@latest sub-app-2 --template vue
```
**当前目录结构**

```js
├── qiankun-turborepo-pnpm-demo
   ├── apps
   |   ├── main-app // 主应用
   |   |   ├── .vscode
   |   |   ├── public
   |   |   ├── src
   |   |   |    ├── assets
   |   |   |    ├── components
   |   |   |    ├── router
   |   |   |    ├── stores
   |   |   |    ├── views
   |   |   |    ├── App.vue
   |   |   |    └── main.js
   |   |   ├── .gitignore
   |   |   ├── .prettierrc.json
   |   |   ├── eslint.config.js
   |   |   ├── index.html
   |   |   ├── package.json
   |   |   ├── README.md
   |   |   └── vite.config.js
   |   ├── sub-app-1 // 第一个子应用
   |   |   ├── .vscode
   |   |   ├── public
   |   |   ├── src
   |   |   |    ├── assets
   |   |   |    ├── components
   |   |   |    ├── router
   |   |   |    ├── stores
   |   |   |    ├── views
   |   |   |    ├── App.vue
   |   |   |    └── main.js
   |   |   ├── .gitignore
   |   |   ├── .prettierrc.json
   |   |   ├── eslint.config.js
   |   |   ├── index.html
   |   |   ├── package.json
   |   |   ├── README.md
   |   |   └── vite.config.js
   |   └── sub-app-2 // 第二个子应用
   |       ├── .vscode
   |       ├── public
   |       ├── src
   |       |    ├── assets
   |       |    ├── components
   |       |    ├── router
   |       |    ├── stores
   |       |    ├── views
   |       |    ├── App.vue
   |       |    └── main.js
   |       ├── .gitignore
   |       ├── .prettierrc.json
   |       ├── eslint.config.js
   |       ├── index.html
   |       ├── package.json
   |       ├── README.md
   |       └── vite.config.js
   ├── package.json // 公共库声明文件
   ├── pnpm-workspace.yaml // pnpm 管理的 workspace
   └── turbo.json // Turborepo 的配置文件


```

## 依赖安装
`共享依赖安装：`由于我们主应用和子应用都需要使用到 qiankun 这个库，所以我们就可以把共同的依赖安装在根目录下面，这很好地体现 Monorepo 架构的思想 ==》实现包的复用。

```js
// 安装 qiankun 项目依赖

pnpm i qiankun -S -w


// vite-plugin-qiankun 提供了简洁的 API，使得在 Vite 项目中集成 qiankun 变得更加容易。

pnpm i vite-plugin-qiankun --save-dev -w
```
`安装各个项目的依赖`:在 Monorepo 架构中，如果我们在根目录执行 `pnpm i`，pnpm 会根据 `pnpm-workspace.yaml` 文件中的配置，自动安装所有子项目的依赖。这样可以确保所有子项目的依赖都被正确安装，而无需在每个子项目中单独执行 `pnpm i`。

```js
// 在项目根目录执行
 pnpm i
```
## 配置主应用
在主应用的 `src/main.js` 文件中配置 qiankun

```js
import { createApp } from 'vue';
import App from './App.vue';
import { registerMicroApps, start } from 'qiankun';
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);
registerMicroApps([
  {
    name: 'sub-app-1',
    entry: '//localhost:8091',
    container: '#subapp-container-1',
    activeRule: '/sub-app-1',
  },
  {
    name: 'sub-app-2',
    entry: '//localhost:8092',
    container: '#subapp-container-2',
    activeRule: '/sub-app-2',
  },
]);

start();
app.use(router);
app.use(createPinia());
app.mount('#app');

```
在主应用的 `src/App.vue` 文件中配置子应用挂载点

```js
<template>
  <div id="app">
    <router-view />
    // 注意这里的subapp-container-1要与上面main.js中配置的container属性值一致
    <div id="subapp-container-1"></div>
    // 与subapp-container-1同理
    <div id="subapp-container-2"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
```
新建组件，用于加载子应用


```js
<template>
  <div>
    <h1>Sub App 1</h1>
  </div>
</template>

<script>
export default {
  name: 'SubApp1View',
};
</script>
```
子应用2同理，不再赘述，如图：

<p align=center><img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/ccebe408c623417fafe6b2804b0b42ba~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oC75piv552h5LiN5aSf:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjU3MTEzMTIzMTE1MDQ4MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729171666&x-orig-sign=DWLIITxOSSq8vmhPoc1TMhxkKoI%3D" alt="微信图片_20241016212720.png" width="90%" /></p>

接下来在组件 HomeView.vue 中设置简单的跳转逻辑，分别展示子应用

```js
<template>
  <div>
    <h1>Home Page</h1>
    <button @click="goToSubApp1">Go to Sub App 1</button>
    <button @click="goToSubApp2">Go to Sub App 2</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToSubApp1() {
      this.$router.push({ name: 'SubApp1' });
    },
    goToSubApp2() {
      this.$router.push({ name: 'SubApp2' });
    },
  },
};
</script>
```

<p align=center><img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/eb5ab75df6f44843970f46eee3fc7e3b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oC75piv552h5LiN5aSf:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjU3MTEzMTIzMTE1MDQ4MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729171807&x-orig-sign=JnIoQh8UfzxNUMe1S%2BM0RQBzH1Q%3D" alt="微信图片_20241016212952.png" width="90%" /></p>


接下来调整主应用的路由文件 src/router/index.js 设置路由关系

```js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/sub-app-1',
    name: 'SubApp1',
    component: () => import('../views/SubApp1View.vue'),
  },
  {
    path: '/sub-app-2',
    name: 'SubApp2',
    component: () => import('../views/SubApp2View.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

<p align=center><img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a239221dff054b35a3194f151f63f3c5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oC75piv552h5LiN5aSf:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjU3MTEzMTIzMTE1MDQ4MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729172073&x-orig-sign=rUmwBsOvmZfERNYpQhyg627aEeE%3D" alt="微信图片_20241016213415.png" width="90%" /></p>

## 配置子应用

修改第一个子应用 sub-app-1 的 vite.config.js

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { name } from './package.json';
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  plugins: [
    vue(),
    qiankun('sub-app-1', { // 微应用名字，与主应用注册的微应用名字保持一致
      useDevMode: true
    })
  ],
  server: {
    port: 8091,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    rollupOptions: {
      input: 'src/main.js', // 或者 'src/main.ts'
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
        format: 'umd',
        name: `${name}-[name]`,
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
```
`注意：`由于路由模式为history，需要匹配子应用的入口规则，修改src/router/index.js


```js
import { createRouter, createWebHistory } from 'vue-router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(
  qiankunWindow.__POWERED_BY_QIANKUN__
      ? '/sub-app-1/'
      : '/'
  ),
  routes,
});

export default router;
```

<p align=center><img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/815e0b91eda147c6978d2ebdb66af364~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oC75piv552h5LiN5aSf:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjU3MTEzMTIzMTE1MDQ4MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729172554&x-orig-sign=K3%2BlLCo9gZxCQfp0a1WjrRORh58%3D" alt="微信图片_20241016214206.png" width="90%" /></p>

在子应用的`main.js`里添加生命周期等相关配置

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  renderWithQiankun,
  qiankunWindow
} from 'vite-plugin-qiankun/dist/helper'

let app

const render = (container) => {
  app = createApp(App)
  app
    .use(router)
    .mount(container ? container.querySelector('#app') : '#app')
}

const initQianKun = () => {
  renderWithQiankun({
    mount(props) {
      const { container } = props
      render(container)
    },
    bootstrap() {},
    unmount() {
      app.unmount()
    }
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()

```

<p align=center><img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/c6709ce976604ab2915cf34563eebe2f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oC75piv552h5LiN5aSf:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjU3MTEzMTIzMTE1MDQ4MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729172714&x-orig-sign=d%2FOCQYfxPB9sGEbx8kYZKI4wdq8%3D" alt="微信图片_20241016214500.png" width="90%" /></p>

第二个子应用 sub-app-2 的配置基本一样，只需要注意 sub-app-1 中写为 sub-app-1 的地方替换为 sub-app-2就好了，还有就是端口号改一下，避免冲突

简单修改一下子应用的App.vue的内容，如下，如果子应用加载成功，页面将会显示应用的 `hello from micro app 1`

```js
<template>
  <div>hello from micro app 1</div>
</template>

<script setup>
</script>


<style scoped>
</style>

```

##  运行项目
修改根目录下的脚本配置以启动项目：

```js
{
  "name": "qiankun-turborepo-pnpm-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "pnpm run --parallel dev",
    "build": "pnpm run --parallel build",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "qiankun": "^2.10.16"
  },
  "devDependencies": {
    "vite-plugin-qiankun": "^1.0.15"
  }
}
```
接着执行 `pnpm dev`, 项目就可以跑起来了

## 效果展示：

<p align=center><img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a7075e5db6ed414f95d437fa7cb15f33~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oC75piv552h5LiN5aSf:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjU3MTEzMTIzMTE1MDQ4MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729173912&x-orig-sign=5a%2FegnP4JxtyDaqWwGL%2FtC27kYM%3D" alt="微信图片_20241016220502.png" width="90%" /></p>


<p align=center><img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/59b8bd068d72467a84c7bac47a61d36a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oC75piv552h5LiN5aSf:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjU3MTEzMTIzMTE1MDQ4MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729174199&x-orig-sign=qWo%2BDNvU1jt18mxE7kiwNdf4m9Q%3D" alt="微信图片_20241016220947.png" width="90%" /></p>

<p align=center><img src="https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/91fdf36a81b2408a95d984817eee1e9e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oC75piv552h5LiN5aSf:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjU3MTEzMTIzMTE1MDQ4MCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729174166&x-orig-sign=lttMUsHKAXDBDaumOMgtp4tpxuI%3D" alt="微信图片_20241016220906.png" width="90%" /></p>

最后，如果需要有一些公共的UI组件库和工具的配置的话可以在 apps 同级目录下新建一个 packages 文件夹，里面存放共享包，实现过程可以参考小编开头提到的那篇文章

