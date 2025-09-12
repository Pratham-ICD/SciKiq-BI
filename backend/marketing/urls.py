from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.MarketingDashboardView.as_view(), name='marketing-dashboard'),
    path('charts/campaigns/', views.CampaignChartsView.as_view(), name='campaign-charts'),
    path('analytics/engagement/', views.EngagementAnalyticsView.as_view(), name='engagement-analytics'),
    path('analytics/roi/', views.ROIAnalyticsView.as_view(), name='roi-analytics'),
]
