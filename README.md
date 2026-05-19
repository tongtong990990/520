# 琪琪520快乐鸭

**副标题：** 一只永远陪着琪琪的小狗 ❤️

微信 H5 竖屏恋爱互动小游戏 — 通过与小狗互动，一步步收到专属 520 告白。

## 技术栈

| 模块 | 技术 |
|------|------|
| 前端 | Next.js 15 |
| UI | TailwindCSS |
| 动画 | Framer Motion |
| 游戏 | Phaser.js |
| 音效 | Howler.js |
| 状态 | Zustand |

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000 ，使用浏览器手机模式（9:16）预览。

## 页面流程

开屏 → 互动 → 小游戏 → 游戏成功 → 告白（打字机）→ 抱抱 → 隐藏彩蛋

## 彩蛋

- **互动页** 连续点击小狗 5 次：小狗偷偷亲了你一下 🐶❤️
- **彩蛋页** 长按小狗：不要丢下小狗好不好 🥺

## 目录结构

```
src/
├── app/                 # Next.js 路由（主流程在 /）
├── components/          # Puppy, PinkButton, TypewriterText…
├── game/                # Phaser 接爱心
├── store/gameStore.ts
├── lib/animations.ts, sfx.ts
└── styles/globals.css
```

## 音效（可选）

将 mp3 放入 `public/sounds/`，详见该目录 README。未放置时使用内置合成音。

## 部署

```bash
npm run build
npm start
```

推荐部署至 [Vercel](https://vercel.com)。
