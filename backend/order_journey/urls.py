from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.OrderJourneyDashboardView.as_view(), name='order-journey-dashboard'),
    path('charts/orders/', views.OrderChartsView.as_view(), name='order-charts'),
    path('analytics/sla/', views.SLAAnalyticsView.as_view(), name='sla-analytics'),
    path('analytics/revenue/', views.RevenueAnalyticsView.as_view(), name='revenue-analytics'),
]
