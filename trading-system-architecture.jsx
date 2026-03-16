import { useState } from "react";

const COLORS = {
  bg: "#0a0e17",
  card: "#111827",
  cardHover: "#1a2235",
  border: "#1e293b",
  borderActive: "#3b82f6",
  text: "#e2e8f0",
  textDim: "#64748b",
  textMuted: "#475569",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,0.15)",
  green: "#10b981",
  greenDim: "rgba(16,185,129,0.12)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.12)",
  yellow: "#f59e0b",
  yellowDim: "rgba(245,158,11,0.12)",
  purple: "#8b5cf6",
  purpleDim: "rgba(139,92,246,0.12)",
  cyan: "#06b6d4",
  cyanDim: "rgba(6,182,212,0.12)",
};

const modules = [
  {
    id: "scheduler",
    title: "调度器 Scheduler",
    icon: "⏱",
    color: COLORS.cyan,
    colorDim: COLORS.cyanDim,
    desc: "APScheduler 定时轮询",
    details: [
      "可配置周期：1h / 4h / 1d",
      "可配置币种列表",
      "每个周期结束触发一次分析",
    ],
    col: 0,
    row: 0,
  },
  {
    id: "data",
    title: "数据层 Data Layer",
    icon: "📡",
    color: COLORS.accent,
    colorDim: COLORS.accentGlow,
    desc: "币安API + 外部数据源",
    details: [
      "币安REST API → K线OHLCV",
      "自算EMA(7/21/55)、MAVOL(10)",
      "alternative.me → 恐慌贪婪指数",
      "经济日历API → 宏观事件",
    ],
    col: 1,
    row: 0,
  },
  {
    id: "circuit",
    title: "熔断层 Circuit Breaker",
    icon: "🚨",
    color: COLORS.red,
    colorDim: COLORS.redDim,
    desc: "硬编码风控规则",
    details: [
      "恐慌指数 < 10 或 > 90 → 禁止",
      "距CPI/非农/FOMC < 12h → 禁止",
      "触发后直接跳过后续分析",
      "100%代码逻辑，零AI介入",
    ],
    col: 2,
    row: 0,
  },
  {
    id: "analysis",
    title: "分析引擎 Analysis",
    icon: "🧠",
    color: COLORS.purple,
    colorDim: COLORS.purpleDim,
    desc: "代码硬逻辑 + AI辅助",
    details: [
      "代码：HH/HL结构检测 → 2分",
      "代码：量能 vs MAVOL(10) → 2分",
      "代码：EMA排列状态 → 3分",
      "AI辅助：K线形态识别 → 2分",
      "代码：情绪+宏观修正 → ±2分",
    ],
    col: 0,
    row: 1,
  },
  {
    id: "decision",
    title: "决策引擎 Decision",
    icon: "⚖️",
    color: COLORS.yellow,
    colorDim: COLORS.yellowDim,
    desc: "评分→仓位→点位",
    details: [
      "≥7分：重仓（可配置比例）",
      "5-6分：轻仓",
      "≤4分：观望，不下单",
      "计算进场价 / 止损 / 止盈",
    ],
    col: 1,
    row: 1,
  },
  {
    id: "execution",
    title: "执行层 Execution",
    icon: "⚡",
    color: COLORS.green,
    colorDim: COLORS.greenDim,
    desc: "币安API下单",
    details: [
      "限价单进场",
      "OCO单挂止盈+止损",
      "Paper Trading模式开关",
      "持仓管理 & 订单状态追踪",
    ],
    col: 2,
    row: 1,
  },
];

const flowArrows = [
  { from: "scheduler", to: "data", label: "触发" },
  { from: "data", to: "circuit", label: "数据" },
  { from: "circuit", to: "analysis", label: "通过" },
  { from: "analysis", to: "decision", label: "评分" },
  { from: "decision", to: "execution", label: "指令" },
];

const techStack = [
  { label: "语言", value: "Python 3.11+" },
  { label: "交易所", value: "ccxt (币安统一接口)" },
  { label: "指标计算", value: "pandas + ta-lib" },
  { label: "AI模型", value: "Claude/Gemini API" },
  { label: "调度", value: "APScheduler" },
  { label: "数据库", value: "SQLite (交易日志)" },
  { label: "部署", value: "Linux VPS + systemd" },
  { label: "监控", value: "Telegram Bot (后续)" },
];

const configExample = `{
  "symbols": ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
  "timeframes": ["1h", "4h"],
  "risk": {
    "max_position_pct": 0.1,
    "default_stop_loss_pct": 0.02,
    "default_take_profit_pct": 0.04,
    "fear_greed_block": [10, 90],
    "macro_block_hours": 12
  },
  "scoring": {
    "heavy_threshold": 7,
    "light_threshold": 5,
    "skip_below": 4
  },
  "mode": "paper",
  "ai_provider": "claude"
}`;

const phases = [
  {
    phase: "Phase 1",
    title: "核心骨架",
    time: "1-2周",
    items: ["数据层 + 指标计算", "评分引擎(纯代码)", "Paper Trading模式", "SQLite日志"],
  },
  {
    phase: "Phase 2",
    title: "AI + 风控",
    time: "1周",
    items: ["接入AI形态识别", "熔断机制", "恐慌指数/经济日历", "回测框架"],
  },
  {
    phase: "Phase 3",
    title: "实盘上线",
    time: "1-2周",
    items: ["真实下单(小仓位)", "Telegram通知", "异常告警", "仪表盘(可选)"],
  },
];

function ModuleCard({ mod, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? mod.colorDim : COLORS.card,
        border: `1px solid ${isActive ? mod.color : COLORS.border}`,
        borderRadius: 12,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: mod.color,
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{mod.icon}</span>
        <span style={{ color: mod.color, fontWeight: 700, fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}>
          {mod.title}
        </span>
      </div>
      <div style={{ color: COLORS.textDim, fontSize: 13, marginBottom: isActive ? 12 : 0 }}>
        {mod.desc}
      </div>
      {isActive && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {mod.details.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontSize: 13,
                color: COLORS.text,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: mod.color, flexShrink: 0, marginTop: 2 }}>›</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FlowDiagram() {
  const nodes = [
    { id: "scheduler", label: "⏱ 调度器", x: 60, color: COLORS.cyan },
    { id: "data", label: "📡 数据层", x: 210, color: COLORS.accent },
    { id: "circuit", label: "🚨 熔断", x: 360, color: COLORS.red },
    { id: "analysis", label: "🧠 分析", x: 510, color: COLORS.purple },
    { id: "decision", label: "⚖️ 决策", x: 660, color: COLORS.yellow },
    { id: "execution", label: "⚡ 执行", x: 810, color: COLORS.green },
  ];

  return (
    <svg viewBox="0 0 930 70" style={{ width: "100%", height: 70 }}>
      {nodes.map((n, i) => {
        if (i < nodes.length - 1) {
          const next = nodes[i + 1];
          return (
            <g key={`arrow-${i}`}>
              <line
                x1={n.x + 55}
                y1={35}
                x2={next.x - 5}
                y2={35}
                stroke={COLORS.textMuted}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <polygon
                points={`${next.x - 5},30 ${next.x - 5},40 ${next.x + 2},35`}
                fill={COLORS.textMuted}
              />
            </g>
          );
        }
        return null;
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x - 5}
            y={15}
            width={110}
            height={40}
            rx={8}
            fill={COLORS.card}
            stroke={n.color}
            strokeWidth={1.2}
          />
          <text
            x={n.x + 50}
            y={40}
            textAnchor="middle"
            fill={n.color}
            fontSize={13}
            fontWeight={600}
            fontFamily="'Noto Sans SC', system-ui, sans-serif"
          >
            {n.label}
          </text>
        </g>
      ))}
      {/* Circuit breaker reject path */}
      <text x={395} y={12} textAnchor="middle" fill={COLORS.red} fontSize={10} fontFamily="'JetBrains Mono', monospace">
        ❌ 熔断 → 停止
      </text>
    </svg>
  );
}

export default function TradingSystemArchitecture() {
  const [activeModule, setActiveModule] = useState("data");
  const [activeTab, setActiveTab] = useState("arch");

  const tabs = [
    { id: "arch", label: "系统架构" },
    { id: "config", label: "配置示例" },
    { id: "roadmap", label: "开发路线" },
  ];

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
        fontFamily: "'Noto Sans SC', 'JetBrains Mono', system-ui, sans-serif",
        padding: "32px 24px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Noto+Sans+SC:wght@400;600;700&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>🤖</span>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                margin: 0,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              裸K+EMA 自动交易系统
            </h1>
          </div>
          <p style={{ color: COLORS.textDim, fontSize: 14, margin: 0 }}>
            全自动 · 多币种 · 可配置周期 · 代码硬逻辑+AI辅助
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.card, borderRadius: 10, padding: 4 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1,
                padding: "10px 16px",
                border: "none",
                borderRadius: 8,
                background: activeTab === t.id ? COLORS.accent : "transparent",
                color: activeTab === t.id ? "#fff" : COLORS.textDim,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Architecture Tab */}
        {activeTab === "arch" && (
          <div>
            {/* Flow Diagram */}
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: "20px 16px",
                marginBottom: 24,
                overflowX: "auto",
              }}
            >
              <div style={{ color: COLORS.textDim, fontSize: 12, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                数据流 Pipeline
              </div>
              <FlowDiagram />
            </div>

            {/* Module Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {modules.map((mod) => (
                <ModuleCard
                  key={mod.id}
                  mod={mod}
                  isActive={activeModule === mod.id}
                  onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                />
              ))}
            </div>

            {/* Tech Stack */}
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ color: COLORS.textDim, fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
                技术栈
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {techStack.map((t, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ color: COLORS.textMuted, fontSize: 11 }}>{t.label}</span>
                    <span style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Config Tab */}
        {activeTab === "config" && (
          <div>
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 24,
                marginBottom: 16,
              }}
            >
              <div style={{ color: COLORS.textDim, fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
                config.json 示例
              </div>
              <pre
                style={{
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  padding: 20,
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: COLORS.text,
                  overflowX: "auto",
                }}
              >
                {configExample}
              </pre>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ color: COLORS.green, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>✅ 你可以配置的</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: COLORS.textDim }}>
                  {["币种列表 (symbols)", "K线周期 (timeframes)", "仓位比例 / 止损止盈", "评分阈值", "恐慌指数阈值", "Paper/Live模式切换", "AI模型选择"].map((item, i) => (
                    <div key={i}>› {item}</div>
                  ))}
                </div>
              </div>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ color: COLORS.red, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>🔒 硬编码不可改的</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: COLORS.textDim }}>
                  {["评分公式逻辑", "熔断机制触发条件", "EMA计算方法", "K线结构检测算法", "下单安全检查"].map((item, i) => (
                    <div key={i}>› {item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === "roadmap" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {phases.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: 24,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: idx === 0 ? COLORS.green : idx === 1 ? COLORS.yellow : COLORS.accent,
                  }}
                />
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                  <span
                    style={{
                      color: idx === 0 ? COLORS.green : idx === 1 ? COLORS.yellow : COLORS.accent,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {p.phase}
                  </span>
                  <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 16 }}>{p.title}</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                    {p.time}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {p.items.map((item, i) => (
                    <div key={i} style={{ color: COLORS.textDim, fontSize: 13 }}>
                      <span style={{ color: COLORS.textMuted, marginRight: 6 }}>•</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div
              style={{
                background: COLORS.yellowDim,
                border: `1px solid rgba(245,158,11,0.3)`,
                borderRadius: 12,
                padding: 20,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ color: COLORS.yellow, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                  重要提醒
                </div>
                <div style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.6 }}>
                  Phase 1 必须先跑 Paper Trading 至少 2 周，统计胜率和最大回撤，确认策略有效后再进入 Phase 3 实盘。这是标准量化流程，跳过这步等于赌博。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
