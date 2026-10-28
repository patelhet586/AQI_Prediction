import os
import joblib
import pandas as pd

try:
    import streamlit as st
    _cache_decorator = st.cache_resource
except ImportError:
    def _cache_decorator(func):
        return func


@_cache_decorator
def load_model(model_path="model/aqi_model.pkl"):
    """
    Load and cache the trained Random Forest AQI prediction model.
    Using st.cache_resource avoids reloading the model from disk on every rerun.
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")
    return joblib.load(model_path)


def predict_aqi(model, input_data):
    """
    Predict AQI based on input features:
    ['City', 'PM2.5', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3',
     'Benzene', 'Toluene', 'Xylene', 'Year', 'Month', 'Day']
    """
    if hasattr(model, "feature_names_in_"):
        df = pd.DataFrame([input_data], columns=model.feature_names_in_)
        prediction = model.predict(df)
    else:
        prediction = model.predict([input_data])
    return round(float(prediction[0]), 2)
