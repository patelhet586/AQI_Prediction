# 🌍 AirSense — AQI Prediction & Analysis Dashboard

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://aqianalysisproject01.streamlit.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/patelhet586/AQI_Prediction)

A Machine Learning based **Air Quality Index (AQI) Prediction Dashboard** built using **Python**, **Scikit-learn**, and **Streamlit**. This application predicts the Air Quality Index based on pollutant concentrations and provides pollutant-wise analysis along with health recommendations.

## 🔗 Live Demo

### **👉 [https://aqianalysisproject01.streamlit.app/](https://aqianalysisproject01.streamlit.app/)**

---

## 📋 Project Overview

Air pollution is one of the major environmental challenges affecting human health. This project predicts the **Air Quality Index (AQI)** using machine learning techniques and provides a user-friendly dashboard to analyze air quality.

The application allows users to:

- 🔮 Predict AQI using pollutant values
- 📊 View AQI category and color-coded status
- 💡 Get health recommendations based on AQI level
- 🔬 Analyze individual pollutant status
- 🌐 Interact through a modern Streamlit dashboard with dark theme

---

## ✨ Features

- ✅ Machine Learning Based AQI Prediction (Random Forest Regressor)
- ✅ Interactive Streamlit Dashboard
- ✅ City Selection with 26 Indian Cities
- ✅ Pollutant-wise AQI Analysis
- ✅ Health Recommendations based on AQI Category
- ✅ Responsive Dashboard Layout
- ✅ Dark Theme Support
- ✅ Live Deployment on Streamlit Community Cloud

---

## 🛠 Technologies Used

| Technology | Purpose |
|------------|---------|
| Python | Core programming language |
| Pandas | Data manipulation & analysis |
| NumPy | Numerical computations |
| Scikit-learn | Machine learning model training |
| Streamlit | Web dashboard framework |
| Joblib | Model serialization |
| Matplotlib | Data visualization |
| Seaborn | Statistical plots |
| Git LFS | Large file storage for model files |

---

## 📂 Dataset

**Air Quality Data in India (2015–2020)**

Dataset contains the following features:

| Feature | Description |
|---------|-------------|
| City | City name |
| PM2.5 | Fine particulate matter |
| PM10 | Coarse particulate matter |
| NO | Nitric oxide |
| NO₂ | Nitrogen dioxide |
| NOx | Nitrogen oxides |
| NH₃ | Ammonia |
| CO | Carbon monoxide |
| SO₂ | Sulphur dioxide |
| O₃ | Ozone |
| Benzene | Volatile organic compound |
| Toluene | Volatile organic compound |
| Xylene | Volatile organic compound |
| AQI | Air Quality Index (target) |
| AQI Bucket | AQI category label |

---

## 🤖 Machine Learning Workflow

1. Data Cleaning
2. Handling Missing Values
3. Exploratory Data Analysis (EDA)
4. Feature Selection
5. Train-Test Split
6. Model Training
7. Model Evaluation
8. Hyperparameter Tuning
9. Model Saving (`.pkl` via Joblib)
10. Streamlit Deployment

---

## 📊 Machine Learning Models Compared

| Model | R² Score |
|--------|----------|
| Linear Regression | 0.808 |
| Decision Tree | 0.829 |
| **Random Forest** | **0.911** ✅ |
| Gradient Boosting | 0.898 |

**Best Model:** Random Forest Regressor (R² = 0.911)

---

## 🏥 Health Advice Categories

| AQI Range | Category | Color |
|-----------|----------|-------|
| 0–50 | Good 🟢 | Green |
| 51–100 | Satisfactory 🟡 | Yellow |
| 101–200 | Moderate 🟠 | Orange |
| 201–300 | Poor 🔴 | Red |
| 301–400 | Very Poor 🟣 | Purple |
| 401–500 | Severe ⚫ | Maroon |

---

## 📁 Project Structure

```text
AQI_Prediction/
│
├── app.py                        # Main Streamlit application
├── test_api.py                   # API testing script
├── build_report.js               # Report generation script
│
├── model/
│   ├── aqi_model.pkl             # Trained Random Forest model (Git LFS)
│   ├── city_encoder.pkl          # Label encoder for cities (Git LFS)
│   └── city_mapping.csv          # City name mapping
│
├── notebook/
│   └── AQI_prediction.ipynb      # Jupyter notebook with EDA & training
│
├── utils/
│   ├── predictor.py              # Model loading & AQI prediction
│   ├── categories.py             # AQI category classification
│   ├── pollutant_analysis.py     # Individual pollutant analysis
│   ├── health_advice.py          # Health recommendations
│   └── air_quality_api.py        # Air quality API integration
│
├── .streamlit/
│   └── config.toml               # Streamlit theme & server config
│
├── .gitignore                    # Git ignore rules
├── .gitattributes                # Git LFS tracking rules
├── requirements.txt              # Python dependencies
├── README.md                     # Project documentation
│
├── AQI_Analysis_PDS_Report.docx  # Project report (DOCX)
└── AQI_Analysis_PM_Report.pdf    # Project report (PDF)
```

---

## ⚙ Installation & Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/patelhet586/AQI_Prediction.git
```

### 2. Move into the project folder

```bash
cd AQI_Prediction
```

### 3. Create a virtual environment (recommended)

```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # macOS/Linux
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Pull Git LFS files (model)

```bash
git lfs pull
```

### 6. Run the application

```bash
streamlit run app.py
```

The app will open at `http://localhost:8501`

---

## 🚀 Deployment

This project is deployed on **Streamlit Community Cloud**.

| Property | Value |
|----------|-------|
| **Live URL** | [https://aqianalysisproject01.streamlit.app/](https://aqianalysisproject01.streamlit.app/) |
| **Platform** | Streamlit Community Cloud |
| **Repository** | [patelhet586/AQI_Prediction](https://github.com/patelhet586/AQI_Prediction) |
| **Branch** | `main` |
| **Main File** | `app.py` |
| **Model Storage** | Git LFS (Large File Storage) |

### Deployment Notes

- Model files (`model/aqi_model.pkl`, `model/city_encoder.pkl`) are stored via **Git LFS** to handle the ~33.5 MB model binary
- Large dataset files (`Data sets/`) are excluded from the repository via `.gitignore` as they exceed GitHub's 100 MB push limit
- The `.streamlit/config.toml` pre-configures the dark theme and server settings for production

---

## 🖥 Dashboard Features

- 🔮 **AQI Prediction** — Predict air quality from pollutant values
- 🔬 **Pollutant Analysis** — Individual pollutant status breakdown
- 🏥 **Health Advice** — Category-based health recommendations
- 🏙️ **City Selection** — Choose from 26 Indian cities
- 📅 **Date Selection** — Pick a date for prediction context
- 🎛️ **Pollutant Inputs** — Slider-based pollutant value entry
- 🌙 **Dark Theme** — Built-in dark mode support
- 📱 **Responsive Layout** — Works on desktop and mobile

---

## 🔮 Future Improvements

- 📈 AQI Trend Visualization
- 🌤️ Weather API Integration
- 📡 Live AQI Data Feed
- 📄 PDF Report Download
- 📊 Historical AQI Analysis
- 🔮 AQI Forecasting (Time Series)
- 📉 Interactive Charts
- 🔐 User Authentication

---

## 👤 Author

**Het Patel**

Computer Engineering Student

Passionate about:
- 📊 Data Science
- 🤖 Machine Learning
- 📈 Data Analytics
- 🧠 Artificial Intelligence

---

## ⭐ If you like this project

Please consider giving it a ⭐ on [GitHub](https://github.com/patelhet586/AQI_Prediction)!

---

## 📜 License

This project is open source and available for educational purposes.