# Finance Dashboard Backend Integration Guide

## Overview

This guide explains how to connect the refactored Finance Dashboard frontend to the Django backend instead of using mock data.

## Backend Changes Made

### 1. New API Endpoints Added

The following endpoints have been added to `/backend/finance/views.py`:

```python
# Existing endpoints
/api/finance/dashboard/                   # Main dashboard data
/api/finance/charts/revenue/              # Revenue chart data
/api/finance/charts/expenses/             # Expense chart data
/api/finance/analytics/commentary/        # AI commentary

# New endpoints for refactored dashboard
/api/finance/filters/                     # Filter options (countries, channels, statuses)
/api/finance/data/monthly/                # Monthly revenue/budget/EBITDA data
/api/finance/data/cashflow/               # 13-week cash flow projections
/api/finance/data/aging/                  # AR/AP aging analysis
/api/finance/data/bridge/                 # P&L bridge analysis data
/api/finance/invoices/ar/                 # Top overdue AR invoices
/api/finance/invoices/ap/                 # Top overdue AP invoices
/api/finance/metrics/working-capital/     # DSO/DPO/DIO/CCC metrics
```

### 2. Backend View Classes Added

Each endpoint has a corresponding view class:

- `FiltersView` - Dynamic filter options from real data
- `MonthlyDataView` - Monthly performance data with revenue, budget, EBITDA
- `CashFlowDataView` - Weekly cash flow projections
- `AgingDataView` - Receivables/payables aging analysis
- `ARInvoicesView` - Top overdue customer invoices
- `APInvoicesView` - Top overdue vendor bills
- `WorkingCapitalMetricsView` - Working capital KPIs
- `BridgeDataView` - Price-volume-mix analysis

## Frontend Changes Made

### 1. Updated API Client (`/lib/api.ts`)

Added new TypeScript interfaces and API methods:

```typescript
-FilterOptions -
  MonthlyDataItem -
  CashFlowDataItem -
  AgingDataItem -
  InvoiceItem -
  WorkingCapitalMetrics -
  BridgeData;
```

### 2. Component Updates

**FilterSidebar**: Now fetches filter options from `/api/finance/filters/`
**CockpitTab**: Loads monthly data from `/api/finance/data/monthly/`
**WorkingCapitalTab**: Uses real cash flow and metrics data
**ARWorkbenchTab**: Shows real AR aging and invoice data
**APWorkbenchTab**: Shows real AP aging and invoice data
**PnLBridgeTab**: Uses real bridge analysis data
**AutomatedCommentary**: Connects to backend commentary endpoint

### 3. Removed Dependencies

- All components no longer import from `/constants/financeMockData.ts`
- Data is now fetched dynamically from backend APIs
- Fallback data is handled within each component

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
# or if using conda:
conda install --file requirements.txt
```

### 2. Run Django Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 3. Start Backend Server

```bash
cd backend
python manage.py runserver
```

Backend will be available at `http://127.0.0.1:8000`

### 4. Configure Frontend API URL

In `/frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## Data Flow

1. **Frontend Component Loads** → Calls `financeAPI.getXXX()` method
2. **API Client** → Makes HTTP request to Django backend
3. **Django View** → Processes CSV data or database records
4. **Response** → Returns structured JSON data
5. **Frontend** → Updates component state and renders

## Error Handling

All components include error handling:

- Network errors fall back to default data
- Missing CSV files use placeholder values
- API timeouts show error states with retry options

## Performance Optimizations

1. **Caching**: Backend views can be cached for frequently requested data
2. **Lazy Loading**: Chart data is loaded only when tabs are accessed
3. **Error Boundaries**: Components handle failures gracefully
4. **Pagination**: Large datasets (invoices) are limited to top N records

## Data Sources

The backend views attempt to read from these CSV files in order of preference:

1. **Revenue Data**: `sales_flat.csv` → `ar_invoices.csv` → `gl_txn.csv`
2. **Filter Options**: `sales_flat.csv` → `ar_invoices.csv` → default values
3. **AR/AP Data**: `ar_invoices.csv` / `ap_invoices.csv`
4. **Budget Data**: `budget.csv`
5. **GL Transactions**: `gl_txn.csv`

## Testing

To test the integration:

1. Place sample CSV files in the backend data folder
2. Start both backend and frontend servers
3. Visit the Finance Dashboard
4. Check browser network tab for API calls
5. Verify data is loading from backend endpoints

## Troubleshooting

**Issue**: "Cannot connect to backend"
**Solution**: Ensure Django server is running and CORS is configured

**Issue**: "No data available"
**Solution**: Check if CSV files exist in backend data folder

**Issue**: "Type errors in frontend"
**Solution**: Verify API response structure matches TypeScript interfaces

**Issue**: "Charts not rendering"
**Solution**: Ensure data has `name`, `value` properties and index signature

## Future Enhancements

1. **Authentication**: Add user authentication for secure access
2. **Real-time Data**: WebSocket connections for live updates
3. **Export Features**: PDF/Excel export of dashboard data
4. **Advanced Filtering**: Date range filtering in backend queries
5. **Database Integration**: Move from CSV to proper database tables
