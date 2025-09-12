from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.HRDashboardView.as_view(), name='hr-dashboard'),
    path('charts/headcount/', views.HeadcountChartsView.as_view(), name='headcount-charts'),
    path('analytics/performance/', views.PerformanceAnalyticsView.as_view(), name='performance-analytics'),
    path('analytics/payroll/', views.PayrollAnalyticsView.as_view(), name='payroll-analytics'),
]
