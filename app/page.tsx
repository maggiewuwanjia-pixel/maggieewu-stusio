'use client';

import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

const chapters = [
  { no: '01', title: '看见趋势', eyebrow: 'CONTENT INTELLIGENCE', copy: '把视频、直播与账号数据收拢成一张经营地图。今天该看什么，一眼就有答案。', tone: 'mint', stat: '22.4w', label: '正在关注你' },
  { no: '02', title: '找到下一步', eyebrow: 'NORTHSTAR GUIDANCE', copy: '从信号到建议，不只报数。每一条建议都有目标、理由和可以立刻执行的动作。', tone: 'violet', stat: '03', label: '件优先去做的事' },
  { no: '03', title: '持续增长', eyebrow: 'CREATOR OPERATING SYSTEM', copy: '选题、脚本、排期和复盘，在一个有节奏的工作流里持续推进。', tone: 'coral', stat: '+287', label: '昨日新增关注' },
];

export default function Home() {
  const [chapter, setChapter] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = chapters[chapter];

  return <main className="showcase">
    <nav className="topbar">
      <a className="brand" href="#top"><span>✦</span> 北极星 <i>NorthStar</i></a>
      <div className={menuOpen ? 'navlinks open' : 'navlinks'}><a href="#product">产品能力</a><a href="#workflow">工作方式</a><a href="#launch">开始体验</a></div>
      <a className="nav-cta" href="#launch">进入工作台 <ArrowUpRight size={15} /></a>
      <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开导航">{menuOpen ? <X /> : <Menu />}</button>
    </nav>
    <section className="hero" id="top">
      <div className="hero-grid" />
      <div className="hero-copy"><p className="kicker"><span /> 视频号经营 AI</p><h1>让每一次内容<br /><em>都有方向。</em></h1><p className="lede">北极星把内容数据、创作节奏和增长建议，聚合成你的下一步。</p><a className="button light" href="#product">探索 NorthStar <ArrowUpRight size={17} /></a></div>
      <div className="star-field" aria-hidden="true"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="star-core"><span>✦</span><small>NORTH<br />STAR</small></div><div className="signal s-one"><b>增长信号</b><span>+12.4%</span></div><div className="signal s-two"><b>内容节奏</b><span>已就绪</span></div><div className="signal s-three"><b>本周目标</b><span>75%</span></div></div>
      <div className="scroll-note">SCROLL TO EXPLORE <ChevronDown size={14} /></div>
    </section>
    <section className="intro" id="product"><p className="kicker dark"><span /> FOR PEOPLE WHO MAKE THINGS HAPPEN</p><h2>经营内容，不该只靠感觉。</h2><p>把零散的后台数据转成清晰的方向，让团队知道今天、下周和下一个增长节点分别该做什么。</p></section>
    <section className={`chapter ${active.tone}`} id="workflow">
      <div className="chapter-tabs" role="tablist">{chapters.map((item, index) => <button key={item.no} role="tab" aria-selected={chapter === index} onClick={() => setChapter(index)}><span>{item.no}</span>{item.title}</button>)}</div>
      <div className="chapter-content"><div className="chapter-copy"><p className="kicker"><span /> {active.eyebrow}</p><h2>{active.title}</h2><p>{active.copy}</p><a href="#launch">了解这一能力 <ArrowUpRight size={16} /></a></div><div className="metric-sculpture" key={active.no}><div className="sculpture-glow" /><div className="sphere sphere-one" /><div className="sphere sphere-two" /><div className="sphere sphere-three" /><div className="metric-card"><small>{active.label}</small><strong>{active.stat}</strong><div className="mini-line"><i /><i /><i /><i /><i /><i /></div></div><div className="floating-label label-one">内容 → 信号</div><div className="floating-label label-two">洞察 → 行动</div></div></div>
    </section>
    <section className="experience"><div className="experience-head"><p className="kicker dark"><span /> THE WORKBENCH</p><h2>从一条内容，<br />看到一整套经营。</h2></div><div className="console"><aside><div className="console-brand">✦ <b>北极星</b></div>{['经营看板','内容洞察','创作排期','直播复盘','对标账号'].map((x,i)=><div className={i===0?'active':''} key={x}>{x}{i>0&&<small>0{i+4}</small>}</div>)}</aside><div className="console-main"><div className="console-top"><b>经营看板</b><span>数据正在更新</span><button>⌘ 搜索</button></div><div className="recommendations">{['下周该怎么做','下条视频怎么拍','下场直播改什么'].map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3><p>{i===0?'把“开学季”作为本周主线，优先优化前 3 秒的情绪钩子。':i===1?'从高频问题出发，先给结果，再给可保存的行动模板。':'用真实案例替代泛泛方法，把互动话题放在开场。'}</p></article>)}</div><div className="northbar"><div><small>北极星指标 · 涨粉</small><strong>22.4w</strong><span>+287 / 日</span></div><div className="progress"><p>目标 30w 粉 <b>75%</b></p><i><em /></i></div><button>涨粉</button></div></div></div></section>
    <section className="cta-section" id="launch"><div className="cta-orbit" /><p className="kicker"><span /> YOUR NEXT MOVE STARTS HERE</p><h2>让内容，<em>走向增长。</em></h2><a className="button light" href="#top">开始使用 NorthStar <ArrowUpRight size={17} /></a><p className="tiny">为视频号内容经营者打造</p></section>
    <footer><span>© 2026 NORTHSTAR</span><span>CONTENT INTELLIGENCE SYSTEM</span><a href="#top">回到顶部 ↑</a></footer>
  </main>;
}
