from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.SupplyChainDashboardView.as_view(), name='supply-chain-dashboard'),
    path('charts/inventory/', views.InventoryChartsView.as_view(), name='inventory-charts'),
    path('analytics/replenishment/', views.ReplenishmentAnalyticsView.as_view(), name='replenishment-analytics'),
    path('analytics/cost-to-serve/', views.CostToServeAnalyticsView.as_view(), name='cost-to-serve-analytics'),
]
