from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.utils import read_table, get_data_folder, fmt_aed


class MarketingDashboardView(APIView):
    """Marketing dashboard data"""
    
    def get(self, request):
        return Response({
            "message": "Marketing Dashboard",
            "metrics": {
                "total_campaigns": "25",
                "active_campaigns": "8",
                "total_leads": "2,500"
            }
        }, status=status.HTTP_200_OK)


class CampaignChartsView(APIView):
    """Campaign charts data"""
    
    def get(self, request):
        return Response({
            "labels": ["Email", "Social", "PPC", "Print"],
            "values": [400, 300, 200, 100]
        }, status=status.HTTP_200_OK)


class EngagementAnalyticsView(APIView):
    """Engagement analytics data"""
    
    def get(self, request):
        return Response({
            "engagement_rate": "8.5%",
            "click_through_rate": "3.2%"
        }, status=status.HTTP_200_OK)


class ROIAnalyticsView(APIView):
    """ROI analytics data"""
    
    def get(self, request):
        return Response({
            "marketing_roi": "245%",
            "cost_per_lead": fmt_aed(150)
        }, status=status.HTTP_200_OK)
