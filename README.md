# 🕷️ Spider AI Agent

> **AI-Powered Crypto Market Intelligence Dashboard**
> Built for the **Binance Agent OS Mini Hackathon**

Spider AI Agent combines **real-time Binance market data, technical indicators, risk scoring, signal analysis, and an agent decision layer** into one interactive dashboard.

The project integrates with **Binance Agent OS through MCP** and uses **Binance Agent OS Skills** to extend its crypto intelligence capabilities.

---

## 🚀 Key Features

### 📊 Real-Time Market Data

Spider monitors live Binance market information, including:

* 💰 Current Price
* 📈 24H Price Change
* 🔺 24H High
* 🔻 24H Low
* 📊 Trading Volume
* 📉 Historical Price Data

**Supported Markets**

`BTC/USDT` · `ETH/USDT` · `BNB/USDT` · `SOL/USDT` · `XRP/USDT`

---

## 🧠 Spider AI Analysis

Spider processes market information and generates an easy-to-understand **market signal**.

### Signal Types

| Signal                | Meaning                   |
| --------------------- | ------------------------- |
| 🟢 **BULLISH**        | Strong bullish conditions |
| 🟢 **MILDLY BULLISH** | Slight bullish bias       |
| ⚪ **NEUTRAL**         | No clear directional bias |
| 🔴 **MILDLY BEARISH** | Slight bearish bias       |
| 🔴 **BEARISH**        | Strong bearish conditions |

Each analysis provides:

* 🎯 **Confidence Score**
* ⚠️ **Risk Score**
* 💡 **Recommendation**
* 🧠 **Market Reasoning**

---

## 📈 Technical Indicators

Spider calculates multiple technical indicators from market data:

* **RSI** — Relative Strength Index
* **SMA 20** — 20-period Simple Moving Average
* **SMA 50** — 50-period Simple Moving Average
* **Market Momentum**
* **Volatility**

These indicators are combined to evaluate the current market conditions.

---

## ⚖️ Signal Scoring

Spider uses **bullish and bearish factors** to create a transparent scoring system.

### Example

```text
🟢 Bullish Score: 4 / 5
🔴 Bearish Score: 1 / 5
```

Instead of displaying only the final signal, Spider shows the **factors that contributed to its decision**, making the analysis easier to understand and audit.

---

## 🤖 Agent Decision Layer

After analyzing the market, Spider generates an **agent-level decision**.

### Possible Actions

```text
🟢 BUY_SETUP
🟡 WAIT
🔴 RISK_OFF
```

The decision layer evaluates:

* Market Bias
* Risk Mode
* Signal Confidence
* Technical Conditions

---

## 🕷️ Agent Activity Pipeline

When a user runs an analysis, Spider displays the agent's reasoning pipeline:

```text
01  Initialize Spider Agent
        ↓
02  Fetch market data
        ↓
03  Scan price action
        ↓
04  Calculate RSI & Moving Averages
        ↓
05  Analyze momentum
        ↓
06  Score market factors
        ↓
07  Evaluate risk
        ↓
08  Generate Spider signal
        ↓
09  Complete analysis
```

This makes the **agent workflow visible to the user** instead of hiding the reasoning process behind a single final result.

---

## 🧠 Spider Memory

Spider maintains an **Analysis History** so users can review previous agent decisions.

Each history record includes:

| Data             | Description          |
| ---------------- | -------------------- |
| 🕐 Time          | Analysis timestamp   |
| 🪙 Market        | Trading pair         |
| 💰 Price         | Market price         |
| 🤖 Agent Action  | Agent decision       |
| 📊 Signal        | Market signal        |
| 🟢 Bullish Score | Bullish factor score |
| 🔴 Bearish Score | Bearish factor score |
| ⚠️ Risk Score    | Market risk          |
| 🎯 Confidence    | Signal confidence    |

This creates a simple **memory layer for previous market analyses**.

---

# 🟡 Binance Agent OS Integration

Spider AI Agent integrates with **Binance Agent OS** using the official **MCP server**.

### MCP Endpoint

```text
https://agent.binance.com/mcp/agentic
```

The MCP connection gives the development agent access to **Binance Agent OS tools** for retrieving and reasoning over Binance market information.

The project also uses skills from the **Binance Skills Hub**.

### Installed Binance Skill

```text
query-token-info
```

This skill provides token intelligence capabilities including:

* 🔎 Token Search
* 🏷️ Token Metadata
* 💰 Real-Time Market Information
* 📈 Price Data
* 📊 Trading Volume
* 💧 Liquidity Information
* 👥 Holder Information
* 🕯️ K-Line / Candlestick Data

---

# 🔌 MCP Configuration

The Binance Agent OS MCP server is configured in:

```text
.vscode/mcp.json
```

### Configuration

```json
{
  "servers": {
    "binance-agent-os": {
      "type": "http",
      "url": "https://agent.binance.com/mcp/agentic"
    }
  }
}
```

---

## 🕷️ Spider AI Agent

**Market Intelligence · Technical Analysis · Risk Evaluation · Agent Decisions**

> **Analyze the market. Understand the risk. Make better decisions.**

🛠️ Binance Skills Hub

The Binance token information skill can be installed with:

npx skills add https://github.com/binance/binance-skills-hub --skill query-token-info

The installed skill is stored in the agent skills directory and can be used by compatible AI coding agents.

🏗️ Architecture

Spider AI Agent
                   │
                   ▼
            Coin Selection
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
 Market Data     K-Line      Agent Analysis
      │            │            │
      └────────────┼────────────┘
                   ▼
          Technical Indicators
                   │
                   ▼
            Signal Scoring
                   │
                   ▼
             Risk Engine
                   │
                   ▼
         Agent Decision Layer
                   │
                   ▼
            Spider Memory


    Binance Agent OS Integration
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    Agent OS MCP       Binance Skills Hub
         │                   │
         └─────────┬─────────┘
                   ▼
          Binance Intelligence

💻 Tech Stack
Spider AI Agent is built with:
Next.js
React
TypeScript
Tailwind CSS
Recharts
Binance Market APIs
Binance Agent OS MCP
Binance Skills Hub

📂 Project Structure
spider-ai-agent/
│
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   └── market/
│   │       └── chart/
│   │
│   └── page.tsx
│
├── components/
│   ├── AgentActivity.tsx
│   ├── MarketChart.tsx
│   ├── MarketStats.tsx
│   └── Sidebar.tsx
│
├── .agents/
│   └── skills/
│       └── query-token-info/
│
├── .vscode/
│   └── mcp.json
│
└── README.md

⚙️ Run Locally

Clone the repository:
git clone https://github.com/mk29toys/spider-ai-agent.git

Enter the project:
cd spider-ai-agent

Install dependencies:
npm install

Start the development server:
npm run dev

Then open:
http://localhost:3000

🎯 Hackathon

Built for the Binance Agent OS Mini Hackathon.

Track:

Track A — Build an AI Agent using Agent OS

Spider demonstrates how Binance market intelligence, technical analysis, transparent scoring, risk evaluation, memory, and Agent OS tooling can be combined into an interactive crypto analysis agent.

⸻

⚠️ Disclaimer

Spider AI Agent is an experimental hackathon project created for educational and demonstration purposes.

It does not provide financial advice and does not guarantee trading outcomes.

Users should perform their own research and risk assessment before making financial decisions.

🕷️ Spider AI Agent

Scan the market. Understand the signal. Control the risk.
