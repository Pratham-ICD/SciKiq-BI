from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.utils import read_table, get_data_folder, fmt_aed


class SupplyChainDashboardView(APIView):
    """Supply chain dashboard data"""
    
    def get(self, request):
        return Response({
            "message": "Supply Chain Dashboard",
            "metrics": {
                "inventory_turnover": "4.2x",
                "stockout_rate": "2.1%",
                "fulfillment_rate": "98.5%"
            }
        }, status=status.HTTP_200_OK)


class InventoryChartsView(APIView):
    """Inventory charts data"""
    
    def get(self, request):
        return Response({
            "labels": ["Raw Materials", "WIP", "Finished Goods"],
            "values": [500000, 200000, 800000]
        }, status=status.HTTP_200_OK)


class ReplenishmentAnalyticsView(APIView):
    """Replenishment analytics data"""
    
    def get(self, request):
        return Response({
            "avg_lead_time": "7 days",
            "reorder_accuracy": "94%"
        }, status=status.HTTP_200_OK)


class CostToServeAnalyticsView(APIView):
    """Cost to serve analytics data"""
    
    def get(self, request):
        return Response({
            "cost_to_serve": fmt_aed(125),
            "logistics_cost": fmt_aed(45)
        }, status=status.HTTP_200_OK)
