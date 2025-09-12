from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.utils import read_table, get_data_folder, fmt_aed


class OrderJourneyDashboardView(APIView):
    """Order journey dashboard data"""
    
    def get(self, request):
        return Response({
            "message": "Order Journey Dashboard",
            "metrics": {
                "total_orders": "1,234",
                "pending_orders": "56",
                "completed_orders": "1,178"
            }
        }, status=status.HTTP_200_OK)


class OrderChartsView(APIView):
    """Order charts data"""
    
    def get(self, request):
        return Response({
            "labels": ["Jan", "Feb", "Mar", "Apr"],
            "values": [100, 150, 120, 180]
        }, status=status.HTTP_200_OK)


class SLAAnalyticsView(APIView):
    """SLA analytics data"""
    
    def get(self, request):
        return Response({
            "sla_performance": "85%",
            "on_time_delivery": "90%"
        }, status=status.HTTP_200_OK)


class RevenueAnalyticsView(APIView):
    """Revenue analytics data"""
    
    def get(self, request):
        return Response({
            "total_revenue": fmt_aed(1000000),
            "growth_rate": "12%"
        }, status=status.HTTP_200_OK)
