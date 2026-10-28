import os
import datetime
import streamlit as st
import pandas as pd

from utils.predictor import (
    load_model,
    predict_aqi
)
from utils.categories import get_aqi_category
from utils.health_advice import get_health_advice
from utils.pollutant_analysis import get_pollutant_status

st.set_page_config(
    page_title="AirSense - AQI Prediction & Analysis",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for styling
st.markdown("""
<style>
.main-header {
    text-align: center;
    font-size: 40px;
    font-weight: 800;
    color: #1E88E5;
    margin-bottom: 0px;
}
.sub-header {
    text-align: center;
    font-size: 16px;
    color: #9E9E9E;
    margin-bottom: 25px;
}
.card {
    background: #1B1F2A;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #2B303C;
    margin-bottom: 20px;
}
.stButton > button {
    width: 100%;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    padding: 10px 0;
    background-color: #1E88E5;
    color: white;
}
.stButton > button:hover {
    background-color: #1565C0;
    border-color: #1565C0;
}
</style>
""", unsafe_allow_html=True)

st.markdown("<div class='main-header'>🌍 AirSense</div>", unsafe_allow_html=True)
st.markdown("<div class='sub-header'>Machine Learning Powered Air Quality Index (AQI) Predictor & Health Advisory</div>", unsafe_allow_html=True)

# Load Model & City Mapping
@st.cache_data
def get_city_mapping():
    csv_path = os.path.join(os.path.dirname(__file__), "model", "city_mapping.csv")
    return pd.read_csv(csv_path)

try:
    model = load_model()
    city_mapping = get_city_mapping()
except Exception as e:
    st.error(f"Error initializing application resources: {e}")
    st.stop()

left, right = st.columns([1, 1], gap="large")

with left:
    st.markdown("### 📥 Input Panel")

    city_name = st.selectbox(
        "🏙️ Select City",
        options=city_mapping["City"].tolist(),
        index=0
    )

    city_id = city_mapping.loc[
        city_mapping["City"] == city_name,
        "City_ID"
    ].values[0]

    selected_date = st.date_input(
        "📅 Date",
        value=datetime.date(2020, 1, 1)
    )
    year = selected_date.year
    month = selected_date.month
    day = selected_date.day

    st.markdown("##### 🧪 Pollutant Concentrations")
    col1, col2 = st.columns(2)

    with col1:
        pm25 = st.number_input("PM2.5 (µg/m³)", min_value=0.0, value=60.0, step=1.0)
        no = st.number_input("NO (µg/m³)", min_value=0.0, value=15.0, step=1.0)
        nox = st.number_input("NOx (ppb)", min_value=0.0, value=25.0, step=1.0)
        co = st.number_input("CO (mg/m³)", min_value=0.0, value=1.0, step=0.1)
        o3 = st.number_input("O3 (µg/m³)", min_value=0.0, value=30.0, step=1.0)
        toluene = st.number_input("Toluene (µg/m³)", min_value=0.0, value=5.0, step=0.5)

    with col2:
        pm10 = st.number_input("PM10 (µg/m³)", min_value=0.0, value=100.0, step=1.0)
        no2 = st.number_input("NO2 (µg/m³)", min_value=0.0, value=30.0, step=1.0)
        nh3 = st.number_input("NH3 (µg/m³)", min_value=0.0, value=10.0, step=1.0)
        so2 = st.number_input("SO2 (µg/m³)", min_value=0.0, value=12.0, step=1.0)
        benzene = st.number_input("Benzene (µg/m³)", min_value=0.0, value=2.0, step=0.5)
        xylene = st.number_input("Xylene (µg/m³)", min_value=0.0, value=1.0, step=0.5)

    predict = st.button("🔮 Predict AQI", use_container_width=True)

with right:
    st.markdown("### 📊 Prediction & Health Advisory")

    if predict:
        input_data = [
            city_id,
            pm25,
            pm10,
            no,
            no2,
            nox,
            nh3,
            co,
            so2,
            o3,
            benzene,
            toluene,
            xylene,
            year,
            month,
            day
        ]

        try:
            predicted_aqi = predict_aqi(model, input_data)
            category = get_aqi_category(predicted_aqi)
            advice = get_health_advice(predicted_aqi)

            # Display AQI Metric and Category
            col_m1, col_m2 = st.columns([1, 1])
            with col_m1:
                st.metric(label="Predicted AQI Index", value=f"{predicted_aqi:.1f}")
            with col_m2:
                st.metric(label="Air Quality Category", value=category)

            # Health Advice Banner
            st.info(f"💡 **Health Advice:** {advice}")

            # Pollutants Analysis Table
            pollutants = {
                "PM2.5": pm25,
                "PM10": pm10,
                "NO": no,
                "NO2": no2,
                "NOx": nox,
                "NH3": nh3,
                "CO": co,
                "SO2": so2,
                "O3": o3,
                "Benzene": benzene,
                "Toluene": toluene,
                "Xylene": xylene
            }

            rows = []
            for pollutant, value in pollutants.items():
                status = get_pollutant_status(value, pollutant)
                rows.append({
                    "Pollutant": pollutant,
                    "Concentration": value,
                    "Status": status
                })

            st.markdown("#### 📋 Pollutant Breakdown")
            st.dataframe(
                pd.DataFrame(rows),
                use_container_width=True,
                hide_index=True
            )

        except Exception as e:
            st.error(f"Failed to generate prediction: {e}")
    else:
        st.info("👈 Set the pollutant concentrations and location on the left panel, then click **Predict AQI**.")
        st.markdown("""
        #### ℹ️ About Air Quality Index (AQI)
        The Air Quality Index is an index for reporting daily air quality. It tells you how clean or unhealthy your air is, and what associated health effects might be a concern.

        | AQI Range | Category | Health Implication |
        |---|---|---|
        | **0 – 50** | Good 🟢 | Minimal impact |
        | **51 – 100** | Satisfactory 🟡 | Minor breathing discomfort to sensitive people |
        | **101 – 200** | Moderate 🟠 | Breathing discomfort to people with lung/heart disease |
        | **201 – 300** | Poor 🔴 | Breathing discomfort on prolonged exposure |
        | **301 – 400** | Very Poor 🟣 | Respiratory illness on prolonged exposure |
        | **401 – 500** | Severe ⚫ | Affects healthy people, impacts those with diseases |
        """)
