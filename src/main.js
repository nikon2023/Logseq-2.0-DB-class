import { marked } from 'marked';
import DOMPurify from 'dompurify';
import guide from '../docs/guide.md?raw';
import './style.css';

const chapterNames = ['开始之前','第一章 · 为什么需要第二大脑','第二章 · 构建数字记忆体','第三章 · 创建高级的思考特质','第四章 · 误区、障碍和方法论','第五章 · 数字遗产与家族传承'];
const chapterDescriptions = ['环境、版本与安全','外部记忆与记录','块、标签、集群、日志','关联、图谱与查询','长期积累与两条路径','传承、备份与未来'];
const sections = guide.split(/(?=^# 第[一二三四五]章)/m);
const chapters = sections.length===6 ? sections : [guide, ...Array(5).fill('章节解析失败，请检查 Markdown 标题结构。')];
const app=document.querySelector('#app');
const storageKey='logseq-second-brain-v2-progress';
const searchKey='logseq-second-brain-v2-search';
let progress={};try{progress=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{}
let active=0,search='',mobileOpen=false;
const exercises=Array.from(guide.matchAll(/练习\s+(\d{2})/g)).map(m=>Number(m[1])).filter((n,i,a)=>a.indexOf(n)===i).sort((a,b)=>a-b);
const escaped=(s)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const completed=()=>exercises.filter(n=>progress[n]).length;
function render(){
  document.title=chapterNames[active]+' · 第二大脑学习工作台';
  const count=completed(), percent=Math.round(100*count/(exercises.length||23));
  const shown=chapters[active]||guide;
  app.innerHTML=`
  <div class="shell">
   <aside class="sidebar ${mobileOpen?'open':''}">
    <a class="brand" href="#start"><span class="brand-mark">◉</span><span>SECOND BRAIN <small>学习工作台 / LOGSEQ 2.0</small></span></a>
    <div class="side-label">COURSE CONTENT</div>
    <nav class="chapters">${chapterNames.map((name,i)=>`<button class="chapter ${active===i?'current':''}" data-chapter="${i}"><span class="chapter-n">${String(i).padStart(2,'0')}</span><span><strong>${name}</strong><small>${chapterDescriptions[i]}</small></span><span class="chapter-arrow">↗</span></button>`).join('')}</nav>
    <div class="side-spacer"></div>
    <div class="sidebar-note"><span class="dot"></span> 基于涂子沛《第二大脑》<p>以 Logseq 2.0.2 DB Beta 为软件基准。独立实验图谱，谨慎使用重要数据。</p></div>
    <a class="repo-link" href="https://github.com/nikon2023/Logseq-2.0-DB-class" target="_blank" rel="noopener noreferrer">GitHub 源代码 ↗</a>
   </aside>
   <div class="main-pane">
    <header class="topbar">
      <button class="menu-toggle" id="menu-toggle" aria-label="展开目录">☰</button>
      <div class="breadcrumbs">COURSE <span>/</span> <b>${String(active).padStart(2,'0')}</b></div>
      <div class="top-actions"><a href="https://github.com/logseq/logseq/releases/tag/2.0.2" target="_blank" rel="noopener noreferrer">软件版本：2.0.2 Beta ↗</a><a class="github-action" href="https://github.com/nikon2023/Logseq-2.0-DB-class">GITHUB ↗</a></div>
    </header>
    <main>
      <div class="hero"><div class="hero-copy">
      <div class="eyebrow"><span class="spark">✦</span> INTERACTIVE STUDY GUIDE <span class="eyebrow-line"></span> V2.0</div>
      <h1>构建你的<span>第二大脑<span class="accent-dot">.</span></span></h1>
      <p>从文字到节点，从知识到关联。沿着原书五章顺序，掌握新一代 Logseq DB 的实际工作方法。</p>
      <div class="hero-tags"><span>05 CHAPTERS</span><span>${String(exercises.length).padStart(2,'0')} PRACTICES</span><span>LOGSEQ 2.0 DB</span></div>
      </div><div class="orbit" aria-hidden="true"><span class="orbit-center">◉</span><span class="orbit-node n1"></span><span class="orbit-node n2"></span><span class="orbit-node n3"></span><span class="orbit-node n4"></span><span class="orbit-ring r1"></span><span class="orbit-ring r2"></span><span class="orbit-ring r3"></span></div></div>
      <div class="dashboard">
        <div class="stat"><div class="stat-label">当前学习进度 <span>PROGRESS</span></div><div class="stat-value">${percent}<em>%</em></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div><div class="stat-footer">${count} / ${exercises.length} 项实践已完成</div></div>
        <div class="stat"><div class="stat-label">本次课程 <span>MODULE</span></div><div class="stat-value">${String(active).padStart(2,'0')}<em> / 05</em></div><div class="stat-footer">${chapterNames[active]}</div></div>
        <div class="stat stat-dark"><div class="stat-label">学习原则 <span>METHOD</span></div><div class="method-line">以原书为纲<span>·</span>以新版为准</div><div class="stat-footer">操作 / 观察 / 验收 / 记录</div></div>
      </div>
      <section class="reading-area">
       <div class="reading-head"><div><div class="eyebrow dark-eye">THE MANUAL</div><h2>${chapterNames[active]}</h2><p>完整章节与实践步骤</p></div><div class="search-wrap"><input id="search" type="search" value="${escaped(search)}" placeholder="在当前章节搜索关键词…"/><span>⌕</span></div></div>
       <article class="article" id="article">${DOMPurify.sanitize(marked.parse(shown))}</article>
       <div class="chapter-pager"><button id="prev" ${active===0?'disabled':''}>← 上一章</button><button id="next" ${active===5?'disabled':''}>下一章 →</button></div>
      </section>
      <section class="practice-area"><div class="template-link"><a href="https://github.com/nikon2023/Logseq-2.0-DB-class/blob/main/practice/03-%E7%BB%83%E4%B9%A0%E9%AA%8C%E6%94%B6%E8%A1%A8.md" target="_blank" rel="noopener noreferrer">↗ 打开并复制《练习验收表.md》模板</a><span>此模板需复制到 Logseq 图谱，网页进度勾选不会自动同步。</span></div><div class="practice-head"><div><div class="eyebrow dark-eye">PRACTICE TRACKER</div><h2>23 项实践验收</h2><p>完成操作并验证结果后勾选。进度仅存储在当前浏览器。</p></div><button id="reset" class="reset-btn">重置进度</button></div><div class="practice-grid">${Array.from({length:23},(_,i)=>{let n=i+1;return `<label class="practice-pill ${progress[n]?'done':''}"><input type="checkbox" data-exercise="${n}" ${progress[n]?'checked':''}/><span>EXP ${String(n).padStart(2,'0')}</span><strong>${progress[n]?'✓':'○'}</strong></label>`}).join('')}</div></section>
      <footer>《第二大脑》Logseq 2.0 DB 学习指南 · 本站为独立学习项目，与原书作者及 Logseq 官方无隶属关系。 <a href="https://github.com/nikon2023/Logseq-2.0-DB-class">查看仓库</a></footer>
    </main>
   </div>
  </div>`;
  document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{active=Number(b.dataset.chapter);search='';mobileOpen=false;render();window.scrollTo({top:0,behavior:'smooth'});location.hash='chapter-'+active});
  document.querySelector('#menu-toggle').onclick=()=>{mobileOpen=!mobileOpen;document.querySelector('.sidebar').classList.toggle('open',mobileOpen)};
  document.querySelector('#prev').onclick=()=>{if(active>0){active--;search='';render();scrollTo(0,0)}};
  document.querySelector('#next').onclick=()=>{if(active<5){active++;search='';render();scrollTo(0,0)}};
  document.querySelectorAll('[data-exercise]').forEach(b=>b.onchange=()=>{progress[Number(b.dataset.exercise)]=b.checked;localStorage.setItem(storageKey,JSON.stringify(progress));render();document.querySelector('.practice-area').scrollIntoView({block:'center'})});
  document.querySelector('#reset').onclick=()=>{if(confirm('确定清空本浏览器所有学习勾选记录？')){progress={};localStorage.removeItem(storageKey);render()}};
  const s=document.querySelector('#search');s.oninput=()=>{search=s.value;const article=document.querySelector('#article');article.innerHTML=DOMPurify.sanitize(marked.parse(shown));if(search.trim()){const walker=document.createTreeWalker(article,NodeFilter.SHOW_TEXT);const matches=[];while(walker.nextNode()){let n=walker.currentNode;if(!n.parentElement.closest('pre,code,a,script,style')&&n.nodeValue.toLowerCase().includes(search.toLowerCase()))matches.push(n)}for(const n of matches){const raw=n.nodeValue;const re=new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'ig');const mark=document.createElement('span');mark.innerHTML=escaped(raw).replace(re,x=>'<mark>'+escaped(x)+'</mark>');n.replaceWith(mark)}document.querySelector('mark')?.scrollIntoView({block:'center'})}};
}
const match=location.hash.match(/^#chapter-(\d)$/);if(match)active=Math.min(5,Number(match[1]));render();
