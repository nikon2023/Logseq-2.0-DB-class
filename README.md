# 《第二大脑》× Logseq 2.0 DB 逐章学习

基于涂子沛《第二大脑》原书章节顺序，以 **Logseq 2.0.2 Beta（DB 图谱）** 为软件基准的独立学习网站和练习材料。

## 在线学习

网站由 Vercel 从本仓库 `main` 自动部署。包含五章教程、23 项实验、章节导航、站内搜索以及**仅保存在浏览器本地**的学习勾选记录。

## 仓库

- `docs/guide.md` — 完整逐章学习指南 V2.0
- `practice/` — 练习文本、验收、差异记录、官方来源
- `src/` — 网站前端
- `index.html` — 站点入口

## 使用方式

```bash
npm install
npm run dev
npm run build
```

Vercel 配置：Framework = Vite；Build Command = `npm run build`；Output Directory = `dist`。

## 使用边界

原书使用传统 Logseq 文件图谱（OG）。本项目侧重 **Logseq 2.0 DB**，因此涉及 Node、Query、任务、标签属性等适配说明。原生白板在 DB 版已移除。练习素材是可供手动输入的文本，**不是直接导入 Logseq 的 SQLite 图谱备份**。

截至 2026-10-08 软件基准为 2.0.2 Beta；功能依据来源于官方文档与版本说明，但操作尚未完成本机 GUI 逐项验证。

本项目为学习用途，不收录原书全文或扫描件。请尊重原著版权。

## 来源

- [Logseq 官方仓库](https://github.com/logseq/logseq)
- [Logseq 2.0.2 发行页](https://github.com/logseq/logseq/releases/tag/2.0.2)
- [Logseq OG](https://github.com/logseq/og)

许可证：本仓库原创网站代码按 MIT 许可；教程与练习材料仅供学习使用，不将第三方书籍内容作开源授权。
