"""
Shared utility functions for Business Intelligence Hub
"""
import os
import glob
from datetime import datetime
import pandas as pd
from django.conf import settings


def fmt_aed(x, decimals: int = 0):
    """Format currency in AED"""
    try:
        return f"AED {float(x):,.{decimals}f}"
    except Exception:
        return f"AED {x}"


def find_path(folder: str, stem: str):
    """Find first matching path for a stem: tries exact stem.csv/xlsx/xls, then wildcards"""
    candidates = []
    for ext in ('csv', 'xlsx', 'xls'):
        exact = os.path.join(folder, f"{stem}.{ext}")
        if os.path.exists(exact):
            return exact
        candidates += glob.glob(os.path.join(folder, f"{stem}*.{ext}"))
        candidates += glob.glob(os.path.join(folder, f"{stem.capitalize()}*.{ext}"))
    return candidates[0] if candidates else None


def read_table(folder: str, stem: str):
    """Read CSV or Excel table from data folder"""
    path = find_path(folder, stem)
    if not path:
        return None, None
    
    ext = os.path.splitext(path)[1].lower()
    if ext in ('.xlsx', '.xls'):
        df = pd.read_excel(path)
    else:
        df = pd.read_csv(path)
    
    return df, path


def ensure_dates(df: pd.DataFrame, cols):
    """Ensure specified columns are datetime"""
    for col in cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
    return df


def get_data_folder():
    """Get the data folder path from settings"""
    return getattr(settings, 'DATA_FOLDER', '/Users/prathamgajjar/Downloads/MH')


# Currency conversion constants
DEFAULT_USD_TO_AED = 3.6725  # UAE Dirham peg

# Category cost factors
CATEGORY_COST_FACTOR = {
    "FMCG-Food": 0.70,
    "FMCG-Non-Food": 0.65,
    "Chemical": 0.85,
    "Pharma": 0.60,
}

# SLA by channel
SLA_BY_CHANNEL = {
    "HORECA": 5,
    "Retail": 3,
    "Export": 7,
    "Chemical": 4,
    "Pharma": 2,
}

# Logistics and discount rates
LOGISTICS_RATE_DOMESTIC = 0.02
LOGISTICS_RATE_EXPORT = 0.06
DUTY_RATE_EXPORT = 0.03
HANDLING_RATE = 0.01
DISCOUNT_RATE_BY_CHANNEL = {
    "Retail": 0.03,
    "HORECA": 0.02,
    "Export": 0.015,
    "Chemical": 0.01,
    "Pharma": 0.01
}
