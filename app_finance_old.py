import os
import glob
from datetime import datetime
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

st.set_page_config(
    page_title="Finance Cockpit – CFO Demo", page_icon="💼", layout="wide"
)

# =============== Settings ===============
DEFAULT_DATA_FOLDER = r"C:\Users\pinkk\PyCharmMiscProject\MH"  # or set env var MH_DATA
CATEGORY_COST_FACTOR = {
    "FMCG-Food": 0.70,
    "FMCG-Non-Food": 0.65,
    "Chemical": 0.85,
    "Pharma": 0.60,
}


# --- Currency formatting ---
def fmt_aed(x, decimals: int = 0):
    try:
        return f"AED {float(x):,.{decimals}f}"
    except Exception:
        return f"AED {x}"


# === Azure OpenAI Configuration ===
# In production, prefer env vars or Streamlit secrets (st.secrets).
AZURE_OPENAI_KEY = os.environ.get(
    "AZURE_OPENAI_KEY",
    "CzH7jRvU7B7Y1mYPbaBHcsL3dn44wwMe0iZl3P5pOqk2S9UOMjKaJQQJ99BCACYeBjFXJ3w3AAABACOGFWmq",
)
AZURE_OPENAI_ENDPOINT = os.environ.get(
    "AZURE_OPENAI_ENDPOINT", "https://llmay1.openai.azure.com/"
)
AZURE_MODEL = os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-35-turbo-16k")
AZURE_API_VERSION = os.environ.get("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")


def _generate_commentary_azure(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.35,
    max_tokens: int = 420,
):
    """Return (text, error). Requires `pip install openai` and an Azure OpenAI deployment."""
    try:
        from openai import AzureOpenAI
    except Exception as e:
        return None, f"OpenAI SDK not available: {e}. Install with: pip install openai"
    try:
        client = AzureOpenAI(
            api_key=AZURE_OPENAI_KEY,
            azure_endpoint=AZURE_OPENAI_ENDPOINT,
            api_version=AZURE_API_VERSION,
        )
        resp = client.chat.completions.create(
            model=AZURE_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content.strip(), None
    except Exception as e:
        return None, str(e)


# =============== Helpers (I/O & base transforms) ===============
def _find_path(folder: str, stem: str):
    for ext in ("csv", "xlsx", "xls"):
        p = os.path.join(folder, f"{stem}.{ext}")
        if os.path.exists(p):
            return p
        g = glob.glob(os.path.join(folder, f"{stem}*.{ext}")) + glob.glob(
            os.path.join(folder, f"{stem.capitalize()}*.{ext}")
        )
        if g:
            return g[0]
    return None


def _read_table(folder: str, stem: str):
    p = _find_path(folder, stem)
    if not p:
        return None, None
    if p.lower().endswith((".xlsx", ".xls")):
        return pd.read_excel(p), p
    return pd.read_csv(p), p


def _ensure_dates(df: pd.DataFrame, cols):
    df = df.copy()
    for c in cols:
        if c in df.columns:
            df[c] = pd.to_datetime(df[c], errors="coerce")
    return df


def _estimate_unit_cost(row, product_costs_df=None):
    if (
        product_costs_df is not None
        and "unit_cost" in product_costs_df.columns
        and pd.notna(row.get("unit_cost", np.nan))
    ):
        return float(row["unit_cost"])
    f = CATEGORY_COST_FACTOR.get(row.get("category", ""), 0.7)
    return float(row["unit_price"]) * f


def _build_flat(orders, order_items, customers, channels, products, brands):
    o = _ensure_dates(orders, ["order_date", "delivery_date"])
    flat = (
        order_items.merge(o, on="order_id", how="left")
        .merge(customers, on="customer_id", how="left")
        .merge(channels, on="channel_id", how="left")
        .merge(products, on="product_id", how="left")
        .merge(brands, on="brand_id", how="left")
    )
    flat["extended_price"] = flat["quantity"] * flat["unit_price"]
    return flat


def _to_month(s):
    return pd.to_datetime(s, errors="coerce").dt.to_period("M").dt.to_timestamp()


def _num(s):
    return pd.to_numeric(s, errors="coerce").fillna(0.0)


# =============== Finance loaders ===============
def _load_ar(folder):
    ar, p1 = _read_table(folder, "ar_invoices")
    rc, p2 = _read_table(folder, "ar_receipts")
    if ar is not None:
        for c in ["invoice_date", "due_date", "paid_date"]:
            if c in ar.columns:
                ar[c] = pd.to_datetime(ar[c], errors="coerce")
        for c in ["amount", "paid_amount"]:
            if c in ar.columns:
                ar[c] = _num(ar[c])
        if "paid_amount" not in ar.columns:
            ar["paid_amount"] = 0.0
        ar["open_amount"] = _num(ar.get("amount", 0)) - _num(ar.get("paid_amount", 0))
    if rc is not None and "receipt_date" in rc.columns:
        rc["receipt_date"] = pd.to_datetime(rc["receipt_date"], errors="coerce")
    return ar, rc


def _load_ap(folder):
    ap, p1 = _read_table(folder, "ap_invoices")
    pay, p2 = _read_table(folder, "payments")
    if ap is not None:
        for c in ["invoice_date", "due_date", "paid_date"]:
            if c in ap.columns:
                ap[c] = pd.to_datetime(ap[c], errors="coerce")
        for c in ["amount", "paid_amount"]:
            if c in ap.columns:
                ap[c] = _num(ap[c])
        if "paid_amount" not in ap.columns:
            ap["paid_amount"] = 0.0
        ap["open_amount"] = _num(ap.get("amount", 0)) - _num(ap.get("paid_amount", 0))
    if pay is not None and "payment_date" in pay.columns:
        pay["payment_date"] = pd.to_datetime(pay["payment_date"], errors="coerce")
    return ap, pay


def _load_budget(folder):
    bud, _ = _read_table(folder, "budget")
    if bud is not None:
        if "month" in bud.columns:
            bud["month"] = _to_month(bud["month"])
        if "amount" in bud.columns:
            bud["amount"] = _num(bud["amount"])
    return bud


# =============== P&L & Working Capital ===============
def _pnl_month(flat_df, product_costs=None):
    df = flat_df.copy()
    if "extended_price" not in df.columns:
        df["extended_price"] = df["quantity"] * df["unit_price"]
    if product_costs is not None and "product_id" in product_costs.columns:
        df = df.merge(
            product_costs[["product_id", "unit_cost"]], on="product_id", how="left"
        )
    df["est_cost"] = df.apply(lambda r: _estimate_unit_cost(r, product_costs), axis=1)
    df["cogs_val"] = df["quantity"] * df["est_cost"]
    out = (
        df.groupby(_to_month(df["order_date"]))
        .agg(net_revenue=("extended_price", "sum"), cogs=("cogs_val", "sum"))
        .reset_index(names="month")
    )
    out["gm"] = out["net_revenue"] - out["cogs"]
    out["gm_pct"] = (
        (out["gm"] / out["net_revenue"] * 100)
        .replace([np.inf, -np.inf], np.nan)
        .fillna(0)
    )
    return out


def _wc_metrics(
    flat_df,
    ar_df=None,
    ap_df=None,
    inventory_df=None,
    product_costs=None,
    trailing_days=90,
):
    if flat_df.empty:
        return {
            "dso": 0,
            "dpo": 0,
            "dio": 0,
            "ccc": 0,
            "nwc": 0,
            "ar": 0,
            "ap": 0,
            "inv": 0,
        }
    maxd = pd.to_datetime(flat_df["order_date"]).max()
    win = flat_df[
        flat_df["order_date"] >= (maxd - pd.Timedelta(days=trailing_days))
    ].copy()
    if "extended_price" not in win.columns:
        win["extended_price"] = win["quantity"] * win["unit_price"]
    if product_costs is not None and "product_id" in product_costs.columns:
        win = win.merge(
            product_costs[["product_id", "unit_cost"]], on="product_id", how="left"
        )
    win["est_cost"] = win.apply(lambda r: _estimate_unit_cost(r, product_costs), axis=1)
    win["cogs_val"] = win["quantity"] * win["est_cost"]
    rev_daily = (win.groupby(win["order_date"].dt.date)["extended_price"].sum()).mean()
    cogs_daily = (win.groupby(win["order_date"].dt.date)["cogs_val"].sum()).mean()

    ar_bal = (
        float(_num(ar_df["open_amount"]).sum())
        if ar_df is not None and "open_amount" in ar_df.columns
        else 0.0
    )
    ap_bal = (
        float(_num(ap_df["open_amount"]).sum())
        if ap_df is not None and "open_amount" in ap_df.columns
        else 0.0
    )

    inv_val = 0.0
    if inventory_df is not None and not inventory_df.empty:
        inv = inventory_df.copy()
        if product_costs is not None and "product_id" in inv.columns:
            inv = inv.merge(
                product_costs[["product_id", "unit_cost"]], on="product_id", how="left"
            )
        if "unit_cost" not in inv.columns:
            # last observed unit_price × factor
            last_price = (
                flat_df.groupby("product_id")["unit_price"]
                .last()
                .rename("unit_price_last")
            )
            inv = inv.merge(last_price, on="product_id", how="left")
            inv["unit_cost"] = inv["unit_price_last"] * 0.7
        inv_val = float(
            (_num(inv.get("on_hand", 0)) * _num(inv.get("unit_cost", 0))).sum()
        )

    dso = (ar_bal / rev_daily * 365) if rev_daily else 0.0
    dpo = (ap_bal / cogs_daily * 365) if cogs_daily else 0.0
    dio = (inv_val / cogs_daily * 365) if cogs_daily else 0.0
    return {
        "dso": dso,
        "dpo": dpo,
        "dio": dio,
        "ccc": dio + dso - dpo,
        "nwc": ar_bal + inv_val - ap_bal,
        "ar": ar_bal,
        "ap": ap_bal,
        "inv": inv_val,
    }


def _cash_forecast_13w(ar_df=None, ap_df=None, starting_cash=0.0):
    if ar_df is None and ap_df is None:
        return pd.DataFrame()
    today = pd.Timestamp.today().normalize()
    end = today + pd.Timedelta(weeks=13)
    weeks = pd.date_range(today, end, freq="W-MON")
    cf = pd.DataFrame({"week": weeks})
    if ar_df is not None and not ar_df.empty:
        ar = ar_df.copy()
        ar["due_date"] = pd.to_datetime(ar["due_date"], errors="coerce")
        ar["open_amount"] = _num(
            ar.get("open_amount", ar.get("amount", 0) - ar.get("paid_amount", 0))
        )
        rec = (
            ar.groupby(pd.Grouper(key="due_date", freq="W-MON"))["open_amount"]
            .sum()
            .reindex(weeks, fill_value=0)
            .reset_index()
        )
        rec.columns = ["week", "receipts"]
    else:
        rec = pd.DataFrame({"week": weeks, "receipts": 0.0})
    if ap_df is not None and not ap_df.empty:
        ap = ap_df.copy()
        ap["due_date"] = pd.to_datetime(ap["due_date"], errors="coerce")
        ap["open_amount"] = _num(
            ap.get("open_amount", ap.get("amount", 0) - ap.get("paid_amount", 0))
        )
        pay = (
            ap.groupby(pd.Grouper(key="due_date", freq="W-MON"))["open_amount"]
            .sum()
            .reindex(weeks, fill_value=0)
            .reset_index()
        )
        pay.columns = ["week", "payments"]
    else:
        pay = pd.DataFrame({"week": weeks, "payments": 0.0})
    plan = cf.merge(rec, on="week").merge(pay, on="week")
    plan["net"] = plan["receipts"] - plan["payments"]
    plan["cash"] = starting_cash + plan["net"].cumsum()
    return plan


# =============== Sidebar ===============
st.sidebar.header("📁 Data & Filters")
data_folder = os.environ.get("MH_DATA", DEFAULT_DATA_FOLDER)
st.sidebar.write(f"Folder: `{data_folder}`")

# Load flat data
flat, flat_path = _read_table(data_folder, "sales_flat")
if flat is None:
    channels, _ = _read_table(data_folder, "channels")
    brands, _ = _read_table(data_folder, "brands")
    products, _ = _read_table(data_folder, "products")
    customers, _ = _read_table(data_folder, "customers")
    orders, _ = _read_table(data_folder, "orders")
    order_items, _ = _read_table(data_folder, "order_items")
    missing = [
        n
        for n, df in {
            "channels": channels,
            "brands": brands,
            "products": products,
            "customers": customers,
            "orders": orders,
            "order_items": order_items,
        }.items()
        if df is None
    ]
    if missing:
        st.error(f"Missing required files: {', '.join(missing)}")
        st.stop()
    flat = _build_flat(orders, order_items, customers, channels, products, brands)

flat["order_date"] = pd.to_datetime(flat["order_date"], errors="coerce")
min_date, max_date = (
    pd.to_datetime(flat["order_date"]).min(),
    pd.to_datetime(flat["order_date"]).max(),
)
date_range = st.sidebar.date_input("Order Date Range", [min_date, max_date])

countries = sorted(flat.get("country", pd.Series(dtype=str)).dropna().unique().tolist())
channels_list = sorted(
    flat.get("channel_name", pd.Series(dtype=str)).dropna().unique().tolist()
)
status_list = sorted(
    flat.get("status", pd.Series(dtype=str)).dropna().unique().tolist()
)

country_sel = st.sidebar.multiselect(
    "Country", countries, default=countries[:3] if len(countries) > 3 else countries
)
channel_sel = st.sidebar.multiselect("Channel", channels_list, default=channels_list)
status_sel = st.sidebar.multiselect("Status", status_list, default=status_list)

mask = pd.Series(True, index=flat.index)
if isinstance(date_range, (list, tuple)) and len(date_range) == 2:
    start, end = pd.to_datetime(date_range[0]), pd.to_datetime(
        date_range[1]
    ) + pd.Timedelta(days=1)
    mask &= (flat["order_date"] >= start) & (flat["order_date"] < end)
if country_sel and "country" in flat.columns:
    mask &= flat["country"].isin(country_sel)
if channel_sel and "channel_name" in flat.columns:
    mask &= flat["channel_name"].isin(channel_sel)
if status_sel and "status" in flat.columns:
    mask &= flat["status"].isin(status_sel)

flat_f = flat[mask].copy()

# Optional supporting files
product_costs, _ = _read_table(data_folder, "product_costs")
inventory_df, _ = _read_table(data_folder, "inventory")
ar_df, ar_rcpts = _load_ar(data_folder)
ap_df, ap_pay = _load_ap(data_folder)
budget_df = _load_budget(data_folder)

# =============== Finance Tabs ===============
st.title("💼 Finance Cockpit – CFO Demo")

tabs = st.tabs(
    ["Cockpit", "P&L Bridge", "Working Capital", "AR Workbench", "AP Workbench"]
)

# Cockpit
with tabs[0]:
    pnl = _pnl_month(flat_f, product_costs)
    # Approx EBITDA: GM - Opex (if budget has opex account use it; else 20% demo assumption)
    if not pnl.empty:
        if budget_df is not None and "account" in budget_df.columns:
            opex_bud = (
                budget_df[
                    budget_df["account"].str.contains("opex", case=False, na=False)
                ]
                .groupby("month")["amount"]
                .sum()
            )
            pnl = pnl.merge(opex_bud.rename("opex"), on="month", how="left")
            pnl["opex"] = pnl["opex"].fillna(pnl["net_revenue"] * 0.20)
        else:
            pnl["opex"] = pnl["net_revenue"] * 0.20
        pnl["ebitda"] = pnl["gm"] - pnl["opex"]
        pnl["ebitda_pct"] = np.where(
            pnl["net_revenue"] > 0, pnl["ebitda"] / pnl["net_revenue"] * 100, 0.0
        )

        ytd_rev = pnl["net_revenue"].sum()
        ytd_gm_pct = (pnl["gm"].sum() / ytd_rev * 100) if ytd_rev else 0
        ytd_ebitda_pct = (pnl["ebitda"].sum() / ytd_rev * 100) if ytd_rev else 0

        wc = _wc_metrics(flat_f, ar_df, ap_df, inventory_df, product_costs)

        c1, c2, c3, c4, c5 = st.columns(5)
        c1.metric("Net Revenue (YTD)", fmt_aed(ytd_rev))
        c2.metric("Gross Margin % (YTD)", f"{ytd_gm_pct:,.1f}%")
        c3.metric("EBITDA % (YTD)", f"{ytd_ebitda_pct:,.1f}%")
        c4.metric("Net Working Capital", fmt_aed(wc["nwc"]))
        c5.metric("Cash Conversion Cycle", f"{wc['ccc']:,.1f} d")

        col1, col2 = st.columns([1.3, 1])
        with col1:
            fig = px.line(
                pnl,
                x="month",
                y=["net_revenue", "ebitda"],
                markers=True,
                title="Revenue & EBITDA (Monthly)",
            )
            fig.update_layout(paper_bgcolor="white", plot_bgcolor="white")
            st.plotly_chart(fig, use_container_width=True)
        with col2:
            if budget_df is not None:
                bud = budget_df.copy()
                if "account" in bud.columns:
                    bud = bud[bud["account"].str.contains("rev", case=False, na=False)]
                bud = (
                    bud.groupby("month")["amount"].sum().reset_index(name="budget_rev")
                )
                var = (
                    pnl[["month", "net_revenue"]]
                    .merge(bud, on="month", how="left")
                    .fillna(0)
                )
                fig = px.bar(
                    var,
                    x="month",
                    y=["net_revenue", "budget_rev"],
                    barmode="group",
                    title="Actual vs Budget – Net Revenue",
                )
                fig.update_layout(paper_bgcolor="white", plot_bgcolor="white")
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("Add budget.csv to compare Actual vs Budget.")
    else:
        st.info("No data in selected range.")

# P&L Bridge (Price–Volume–Mix)
with tabs[1]:
    months = sorted(_to_month(flat_f["order_date"]).dropna().unique())
    if len(months) >= 2:
        p1, p2 = st.select_slider(
            "Compare periods", options=months, value=(months[-2], months[-1])
        )
        a = flat_f[_to_month(flat_f["order_date"]).eq(p1)].copy()
        b = flat_f[_to_month(flat_f["order_date"]).eq(p2)].copy()
        if a.empty or b.empty:
            st.info("Insufficient data for selected periods.")
        else:
            a_gp = (
                a.groupby("product_id")
                .agg(qty=("quantity", "sum"), price=("unit_price", "mean"))
                .reset_index()
            )
            b_gp = (
                b.groupby("product_id")
                .agg(qty=("quantity", "sum"), price=("unit_price", "mean"))
                .reset_index()
            )
            ref = a_gp.merge(
                b_gp, on="product_id", how="outer", suffixes=("_a", "_b")
            ).fillna(0)
            price_effect = (ref["price_b"] - ref["price_a"]) * ref["qty_b"]
            volume_effect = (ref["qty_b"] - ref["qty_a"]) * ref["price_a"]
            rev_a = (ref["qty_a"] * ref["price_a"]).sum()
            rev_b = (ref["qty_b"] * ref["price_b"]).sum()
            mix_effect = rev_b - rev_a - price_effect.sum() - volume_effect.sum()
            bridge = pd.DataFrame(
                {
                    "component": ["Start (P1)", "Price", "Volume", "Mix", "End (P2)"],
                    "value": [
                        rev_a,
                        price_effect.sum(),
                        volume_effect.sum(),
                        mix_effect,
                        rev_b,
                    ],
                }
            )
            fig = go.Figure(
                go.Waterfall(
                    x=bridge["component"],
                    measure=[
                        "absolute",
                        "relative",
                        "relative",
                        "relative",
                        "absolute",
                    ],
                    y=bridge["value"],
                    text=[fmt_aed(v) for v in bridge["value"]],
                )
            )
            fig.update_layout(
                title=f"Price–Volume–Mix Bridge: {p1.date()} → {p2.date()}",
                paper_bgcolor="white",
                plot_bgcolor="white",
            )
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Need at least two distinct months to build the bridge.")

# Working Capital
with tabs[2]:
    trailing = st.slider(
        "Trailing window for DSO/DPO/DIO (days)",
        min_value=30,
        max_value=180,
        value=90,
        step=15,
    )
    wc = _wc_metrics(
        flat_f, ar_df, ap_df, inventory_df, product_costs, trailing_days=trailing
    )
    g1, g2, g3, g4 = st.columns(4)
    g1.metric("DSO", f"{wc['dso']:.1f} d")
    g2.metric("DPO", f"{wc['dpo']:.1f} d")
    g3.metric("DIO", f"{wc['dio']:.1f} d")
    g4.metric("CCC", f"{wc['ccc']:.1f} d")
    st.caption(
        f"Net Working Capital: **{fmt_aed(wc['nwc'])}** (AR {fmt_aed(wc['ar'])} + Inventory {fmt_aed(wc['inv'])} − AP {fmt_aed(wc['ap'])})"
    )

    start_cash = st.number_input("Starting cash (AED)", value=0.0, step=1000.0)
    plan = _cash_forecast_13w(ar_df, ap_df, starting_cash=start_cash)
    if not plan.empty:
        fig = px.bar(
            plan,
            x="week",
            y=["receipts", "payments", "net"],
            title="13-Week Cash Flow Plan",
        )
        fig.update_layout(paper_bgcolor="white", plot_bgcolor="white")
        st.plotly_chart(fig, use_container_width=True)
        fig2 = px.line(
            plan, x="week", y="cash", markers=True, title="Projected Cash Balance"
        )
        fig2.update_layout(paper_bgcolor="white", plot_bgcolor="white")
        st.plotly_chart(fig2, use_container_width=True)
    else:
        st.info("Add AR/AP files to see the cash plan.")

# AR Workbench
with tabs[3]:
    if ar_df is None or ar_df.empty:
        st.info(
            "Add ar_invoices.csv to use this view. Expected columns: invoice_id, customer_id, invoice_date, due_date, amount, paid_amount."
        )
    else:
        today = pd.Timestamp.today().normalize()
        ar = ar_df.copy()
        ar["due_date"] = pd.to_datetime(ar["due_date"], errors="coerce")
        ar["open_amount"] = _num(
            ar.get("open_amount", ar.get("amount", 0) - ar.get("paid_amount", 0))
        )
        ar["days_past_due"] = (today - ar["due_date"]).dt.days
        bins = [-10, 0, 30, 60, 90, 10000]
        labels = ["Current", "1-30", "31-60", "61-90", "90+"]
        ar["bucket"] = pd.cut(ar["days_past_due"], bins=bins, labels=labels, right=True)
        aging = ar.groupby("bucket")["open_amount"].sum().reindex(labels).reset_index()
        fig = px.bar(aging, x="bucket", y="open_amount", title="AR Aging (Open Amount)")
        fig.update_layout(paper_bgcolor="white", plot_bgcolor="white")
        st.plotly_chart(fig, use_container_width=True)
        top = (
            ar[ar["open_amount"] > 0]
            .sort_values(["days_past_due", "open_amount"], ascending=[False, False])
            .head(25)
        )
        st.dataframe(
            top[
                [
                    "invoice_id",
                    "customer_id",
                    "invoice_date",
                    "due_date",
                    "open_amount",
                    "days_past_due",
                ]
            ],
            use_container_width=True,
            height=320,
        )

# AP Workbench
with tabs[4]:
    if ap_df is None or ap_df.empty:
        st.info(
            "Add ap_invoices.csv to use this view. Expected columns: vendor_id, invoice_id, invoice_date, due_date, amount, paid_amount."
        )
    else:
        today = pd.Timestamp.today().normalize()
        ap = ap_df.copy()
        ap["due_date"] = pd.to_datetime(ap["due_date"], errors="coerce")
        ap["open_amount"] = _num(
            ap.get("open_amount", ap.get("amount", 0) - ap.get("paid_amount", 0))
        )
        ap["days_past_due"] = (today - ap["due_date"]).dt.days
        bins = [-10, 0, 30, 60, 90, 10000]
        labels = ["Current", "1-30", "31-60", "61-90", "90+"]
        ap["bucket"] = pd.cut(ap["days_past_due"], bins=bins, labels=labels, right=True)
        aging = ap.groupby("bucket")["open_amount"].sum().reindex(labels).reset_index()
        fig = px.bar(aging, x="bucket", y="open_amount", title="AP Aging (Open Amount)")
        fig.update_layout(paper_bgcolor="white", plot_bgcolor="white")
        st.plotly_chart(fig, use_container_width=True)
        top = (
            ap[ap["open_amount"] > 0]
            .sort_values(["days_past_due", "open_amount"], ascending=[False, False])
            .head(25)
        )
        st.dataframe(
            top[
                [
                    "invoice_id",
                    "vendor_id",
                    "invoice_date",
                    "due_date",
                    "open_amount",
                    "days_past_due",
                ]
            ],
            use_container_width=True,
            height=320,
        )

# =============== 🤖 Automated Commentary ===============
st.divider()
st.subheader("🤖 Automated Commentary")
with st.expander(
    "Generate CFO commentary (monthly view, actions, and risks)", expanded=False
):
    btn2 = st.button("Generate CFO Commentary", type="primary")
    try:
        pnl_ctx = _pnl_month(flat_f, product_costs)
        if pnl_ctx is None or pnl_ctx.empty:
            st.info("Need sales data to generate commentary.")
        else:
            ytd_rev = pnl_ctx["net_revenue"].sum()
            ytd_gm = pnl_ctx["gm"].sum()
            gm_pct = (ytd_gm / ytd_rev * 100) if ytd_rev else 0.0
            # Opex / EBITDA (budget or 20% fallback)
            if budget_df is not None and "account" in budget_df.columns:
                opex = (
                    budget_df[
                        budget_df["account"].str.contains("opex", case=False, na=False)
                    ]
                    .groupby("month")["amount"]
                    .sum()
                    .reindex(pnl_ctx["month"])
                    .fillna(0)
                    .sum()
                )
            else:
                opex = ytd_rev * 0.20
            ebitda = ytd_gm - opex
            ebitda_pct = (ebitda / ytd_rev * 100) if ytd_rev else 0.0

            wc = _wc_metrics(flat_f, ar_df, ap_df, inventory_df, product_costs)
            # Budget variance (latest month revenue)
            bud_var_txt = "n/a"
            if budget_df is not None:
                bud = budget_df.copy()
                if "account" in bud.columns:
                    bud = bud[bud["account"].str.contains("rev", case=False, na=False)]
                bud = (
                    bud.groupby("month")["amount"].sum().reset_index(name="budget_rev")
                )
                merged = (
                    pnl_ctx[["month", "net_revenue"]]
                    .merge(bud, on="month", how="left")
                    .fillna(0)
                )
                if not merged.empty:
                    last = merged.tail(1)
                    bud_var = float(last["net_revenue"] - last["budget_rev"])
                    bud_var_txt = f"{bud_var:+,.0f} vs budget in {pd.to_datetime(last['month'].iloc[0]).date()}"

            # Cash plan min week
            plan = _cash_forecast_13w(ar_df, ap_df, starting_cash=0.0)
            cash_min_txt = "n/a"
            if plan is not None and not plan.empty:
                ridx = int(plan["cash"].idxmin())
                cash_min_txt = f"min cash {fmt_aed(plan['cash'].iloc[ridx])} on week of {pd.to_datetime(plan['week'].iloc[ridx]).date()}"

            user_prompt2 = f"""
Finance context (filtered): YTD Net Revenue {fmt_aed(ytd_rev)}; GM% {gm_pct:,.1f}%; EBITDA% {ebitda_pct:,.1f}%.
Working Capital → DSO {wc['dso']:.1f}d; DPO {wc['dpo']:.1f}d; DIO {wc['dio']:.1f}d; CCC {wc['ccc']:.1f}d; NWC {fmt_aed(wc['nwc'])}.
Budget variance (revenue): {bud_var_txt}. Cash forecast: {cash_min_txt}.
Write 6–9 CFO-ready bullets focusing on: performance drivers (price/volume/mix), Opex control, WC levers, cash actions, and 2 next steps with numbers.
"""
            system2 = "You are a CFO analytics copilot. Produce concise, executive-ready commentary. Use only numbers from the provided context. Avoid filler."
            if btn2:
                text2, err2 = _generate_commentary_azure(system2, user_prompt2)
                if err2:
                    st.error(f"OpenAI error: {err2}")
                else:
                    st.markdown(text2)
                    st.download_button(
                        "Download commentary (TXT)",
                        data=text2.encode("utf-8"),
                        file_name="cfo_commentary.txt",
                        mime="text/plain",
                    )
    except Exception as e:
        st.warning(f"Unable to build finance context: {e}")

st.caption(
    "Data stems used: sales_flat (or atomic tables), product_costs, inventory, ar_invoices, ap_invoices, budget. Place them in the MH folder."
)


# === Override Azure client with backward-compatible shim ===


def _generate_commentary_azure(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.35,
    max_tokens: int = 420,
):
    """Return (text, error). Tries multiple SDK styles for Azure OpenAI."""
    # 1) New SDK with AzureOpenAI
    try:
        from openai import AzureOpenAI  # type: ignore

        client = AzureOpenAI(
            azure_endpoint=AZURE_OPENAI_ENDPOINT,
            api_key=AZURE_OPENAI_KEY,
            api_version=AZURE_API_VERSION,
        )
        resp = client.chat.completions.create(
            model=AZURE_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content.strip(), None
    except Exception as first_err:
        # 2) New SDK generic client via base_url
        try:
            from openai import OpenAI  # type: ignore

            client = OpenAI(
                api_key=AZURE_OPENAI_KEY,
                base_url=f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_MODEL}",
                default_query={"api-version": AZURE_API_VERSION},
                default_headers={"api-key": AZURE_OPENAI_KEY},
            )
            resp = client.chat.completions.create(
                model=AZURE_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return resp.choices[0].message.content.strip(), None
        except Exception as second_err:
            # 3) Legacy SDK (<1.0)
            try:
                import openai  # type: ignore

                openai.api_type = "azure"
                openai.api_base = AZURE_OPENAI_ENDPOINT
                openai.api_version = AZURE_API_VERSION
                openai.api_key = AZURE_OPENAI_KEY
                resp = openai.ChatCompletion.create(
                    engine=AZURE_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
                return resp["choices"][0]["message"]["content"].strip(), None
            except Exception as third_err:
                return None, f"{first_err} | {second_err} | {third_err}"
