# Business Intelligence Hub

A comprehensive business intelligence dashboard application built with Django backend and Next.js frontend.

## Project Structure

```
business_intelligence_hub/
├── backend/                 # Django REST API
│   ├── core/               # Main Django project
│   ├── finance/            # Finance app (based on app_finance1.py)
│   ├── order_journey/      # Order tracking app (based on orderjourney2.py)
│   ├── marketing/          # Marketing analytics app (based on market.py)
│   ├── supply_chain/       # Supply chain app (based on SCD5.py)
│   ├── hr/                 # HR analytics app (based on hrhead4.py)
│   └── requirements.txt    # Python dependencies
└── frontend/               # Next.js frontend (to be created)
```

## Applications Overview

### 1. Finance App (`/api/finance/`)

- **Source**: Based on `app_finance1.py`
- **Features**:
  - Financial dashboards and KPIs
  - Revenue and expense analytics
  - Budget vs actual comparisons
  - AI-powered financial commentary

### 2. Order Journey App (`/api/order-journey/`)

- **Source**: Based on `orderjourney2.py` and `RVC3.py`
- **Features**:
  - Order tracking and lifecycle management
  - SLA monitoring
  - Revenue analytics by channel
  - Logistics cost analysis

### 3. Marketing App (`/api/marketing/`)

- **Source**: Based on `market.py`
- **Features**:
  - Campaign performance tracking
  - Customer engagement analytics
  - ROI analysis
  - Lead generation metrics

### 4. Supply Chain App (`/api/supply-chain/`)

- **Source**: Based on `SCD5.py` and `scd4.py`
- **Features**:
  - Inventory management
  - Replenishment analytics
  - Cost-to-serve analysis
  - Supply chain KPIs

### 5. HR App (`/api/hr/`)

- **Source**: Based on `hrhead4.py`
- **Features**:
  - People analytics
  - Headcount tracking
  - Performance metrics
  - Payroll analytics

## Backend Setup

### Prerequisites

- Python 3.12+
- Virtual environment

### Installation

1. Navigate to the backend directory:

   ```bash
   cd business_intelligence_hub/backend
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:

   ```bash
   python manage.py migrate
   ```

4. Start the development server:
   ```bash
   python manage.py runserver 8000
   ```

### API Endpoints

#### Finance

- `GET /api/finance/dashboard/` - Main finance dashboard data
- `GET /api/finance/charts/revenue/` - Revenue chart data
- `GET /api/finance/charts/expenses/` - Expense chart data
- `GET /api/finance/analytics/commentary/` - AI-generated commentary

#### Order Journey

- `GET /api/order-journey/dashboard/` - Order dashboard data
- `GET /api/order-journey/charts/orders/` - Order charts
- `GET /api/order-journey/analytics/sla/` - SLA analytics
- `GET /api/order-journey/analytics/revenue/` - Revenue analytics

#### Marketing

- `GET /api/marketing/dashboard/` - Marketing dashboard
- `GET /api/marketing/charts/campaigns/` - Campaign charts
- `GET /api/marketing/analytics/engagement/` - Engagement analytics
- `GET /api/marketing/analytics/roi/` - ROI analytics

#### Supply Chain

- `GET /api/supply-chain/dashboard/` - Supply chain dashboard
- `GET /api/supply-chain/charts/inventory/` - Inventory charts
- `GET /api/supply-chain/analytics/replenishment/` - Replenishment analytics
- `GET /api/supply-chain/analytics/cost-to-serve/` - Cost-to-serve analytics

#### HR

- `GET /api/hr/dashboard/` - HR dashboard
- `GET /api/hr/charts/headcount/` - Headcount charts
- `GET /api/hr/analytics/performance/` - Performance analytics
- `GET /api/hr/analytics/payroll/` - Payroll analytics

## Data Sources

The application reads data from CSV files located in the parent directory:

- `gl_txn.csv` - General ledger transactions
- `budget.csv` - Budget data
- `ap_invoices.csv` - Accounts payable
- `ar_invoices.csv` - Accounts receivable
- `orders.csv` - Order data
- `customers.csv` - Customer data
- `products.csv` - Product data
- `inventory.csv` - Inventory data
- `employees.csv` - Employee data
- `payroll.csv` - Payroll data
- And more...

## Technology Stack

### Backend

- **Django 5.2.5** - Web framework
- **Django REST Framework** - API framework
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Plotly** - Data visualization
- **Django CORS Headers** - Cross-origin requests

### Frontend (To be implemented)

- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **Chart.js/Recharts** - Charts and graphs
- **Axios** - HTTP client

## Current Status

✅ **Completed:**

- Django project structure created
- All 5 business apps created with basic API endpoints
- Database migrations completed
- CORS configuration for frontend communication
- Shared utilities for data processing
- Basic API views with placeholder data

🚧 **In Progress:**

- Implementing actual data processing logic in views
- Creating comprehensive data models

📋 **To Do:**

- Create Next.js frontend application
- Implement authentication and authorization
- Add comprehensive error handling
- Implement Azure OpenAI integration
- Add data caching and optimization
- Create deployment configurations

## Next Steps

1. **Complete Backend Implementation:**

   - Implement actual data processing logic in each app
   - Add proper error handling and validation
   - Integrate Azure OpenAI for commentary generation

2. **Create Frontend:**

   - Set up Next.js application
   - Create responsive dashboard layouts
   - Implement API integration
   - Add interactive charts and visualizations

3. **Testing and Deployment:**
   - Add unit tests
   - Set up CI/CD pipeline
   - Deploy to cloud platform

## Configuration

### Environment Variables

```bash
# Django settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Data settings
DATA_FOLDER=/path/to/csv/files

# Azure OpenAI (optional)
AZURE_OPENAI_KEY=your-openai-key
AZURE_OPENAI_ENDPOINT=your-openai-endpoint
```
# SciKiq-BI
