# Finance Cockpit - Next.js Dashboard

A modern, responsive finance dashboard built with Next.js, TypeScript, Tailwind CSS, and Recharts. This application replaces the original Streamlit finance dashboard with a more polished and interactive user interface

## Features

### 📊 Overview Dashboard

- **Key Performance Indicators (KPIs)**: Revenue Growth, Gross Margin, Days Sales Outstanding, Current Ratio, Cash Conversion Cycle
- **Interactive Charts**: P&L Analysis and Working Capital trends
- **Real-time Metrics**: Performance tracking with visual indicators

### 💰 P&L Analysis

- **Revenue vs Expenses**: Detailed comparison charts
- **Profit Tracking**: Monthly profit analysis with trends
- **Summary Cards**: Total revenue, expenses, and net profit

### 🔄 Working Capital Management

- **Component Analysis**: Inventory, Accounts Receivable, Accounts Payable
- **Trend Visualization**: Historical working capital movements
- **Current Position**: Latest month's financial position

### 📋 AR/AP Workbenches

- **Accounts Receivable**: Customer aging analysis with status tracking
- **Accounts Payable**: Supplier payment tracking
- **Outstanding Analysis**: Days outstanding and due date management
- **Status Indicators**: Current, Overdue, and Critical statuses

### 💹 Cash Flow Analysis

- **Operating Cash Flow**: Core business cash generation
- **Investing Cash Flow**: Investment activities tracking
- **Financing Cash Flow**: Financing activities monitoring
- **Net Cash Flow**: Overall cash position

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ARAPTable.tsx
│   ├── KPICard.tsx
│   ├── Navigation.tsx
│   └── charts/
│       ├── CashFlowChart.tsx
│       ├── PLChart.tsx
│       └── WorkingCapitalChart.tsx
├── data/
│   └── sampleData.ts
└── types/
    └── finance.ts
```

## Comparison with Streamlit Version

### Advantages of Next.js Version:

- **Better Performance**: Faster loading and rendering
- **Modern UI**: Clean, professional design with better UX
- **Responsive**: Works seamlessly on all device sizes
- **Interactive**: Smooth animations and transitions
- **Customizable**: Easy to modify and extend
- **Production Ready**: Built for scalability and deployment
