from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.utils import read_table, get_data_folder, fmt_aed


class HRDashboardView(APIView):
    """HR dashboard data"""
    
    def get(self, request):
        return Response({
            "message": "HR Dashboard",
            "metrics": {
                "total_employees": "1,245",
                "new_hires": "35",
                "turnover_rate": "8.2%"
            }
        }, status=status.HTTP_200_OK)


class HeadcountChartsView(APIView):
    """Headcount charts data"""
    
    def get(self, request):
        return Response({
            "labels": ["Engineering", "Sales", "Marketing", "Operations"],
            "values": [450, 200, 150, 445]
        }, status=status.HTTP_200_OK)


class PerformanceAnalyticsView(APIView):
    """Performance analytics data"""
    
    def get(self, request):
        return Response({
            "avg_performance_score": "4.2/5",
            "promotion_rate": "15%"
        }, status=status.HTTP_200_OK)


class PayrollAnalyticsView(APIView):
    """Payroll analytics data"""
    
    def get(self, request):
        return Response({
            "total_payroll": fmt_aed(2500000),
            "avg_salary": fmt_aed(8500)
        }, status=status.HTTP_200_OK)
