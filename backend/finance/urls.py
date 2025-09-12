from django.urls import path
from . import views

urlpatterns = [
    # Main dashboard
    path('dashboard/', views.FinanceDashboardView.as_view(), name='finance-dashboard'),
    
    # Chart data endpoints
    path('charts/revenue/', views.RevenueChartView.as_view(), name='finance-revenue-chart'),
    path('charts/expenses/', views.ExpenseChartView.as_view(), name='finance-expense-chart'),
    path('data/monthly/', views.MonthlyDataView.as_view(), name='finance-monthly-data'),
    path('data/cashflow/', views.CashFlowDataView.as_view(), name='finance-cashflow-data'),
    path('data/aging/', views.AgingDataView.as_view(), name='finance-aging-data'),
    path('data/bridge/', views.BridgeDataView.as_view(), name='finance-bridge-data'),
    
    # Invoice data endpoints
    path('invoices/ar/', views.ARInvoicesView.as_view(), name='finance-ar-invoices'),
    path('invoices/ap/', views.APInvoicesView.as_view(), name='finance-ap-invoices'),
    
    # Metrics endpoints
    path('metrics/working-capital/', views.WorkingCapitalMetricsView.as_view(), name='finance-working-capital-metrics'),
    
    # Filters and configuration
    path('filters/', views.FiltersView.as_view(), name='finance-filters'),
    
    # Analytics
    path('analytics/commentary/', views.FinanceCommentaryView.as_view(), name='finance-commentary'),
]
