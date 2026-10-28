#  AQI Analysis Dashboard

A Machine Learning based **Air Quality Index (AQI) Prediction Dashboard** built using **Python**, **Scikit-learn**, and **Streamlit**. This application predicts the Air Quality Index based on pollutant concentrations and provides pollutant-wise analysis along with health recommendations.

---

##  Project Overview

Air pollution is one of the major environmental challenges affecting human health. This project predicts the **Air Quality Index (AQI)** using machine learning techniques and provides a user-friendly dashboard to analyze air quality.

The application allows users to:

- Predict AQI using pollutant values
- View AQI category
- Get health recommendations
- Analyze individual pollutant status
- Interact through a modern Streamlit dashboard

---

##  Features

 Machine Learning Based AQI Prediction

 Interactive Streamlit Dashboard

 City Selection

 Pollutant-wise AQI Analysis

 Health Recommendations

 Responsive Dashboard Layout

 Dark Theme Support

---

## 🛠 Technologies Used

- Python
- Pandas
- NumPy
- Scikit-learn
- Streamlit
- Joblib
- Matplotlib
- Seaborn

---

##  Dataset

Dataset Used:

**Air Quality Data in India (2015–2020)**

Dataset contains:

- City
- PM2.5
- PM10
- NO
- NO₂
- NOx
- NH₃
- CO
- SO₂
- O₃
- Benzene
- Toluene
- Xylene
- AQI
- AQI Bucket

---

##  Machine Learning Workflow

1. Data Cleaning
2. Handling Missing Values
3. Exploratory Data Analysis (EDA)
4. Feature Selection
5. Train-Test Split
6. Model Training
7. Model Evaluation
8. Hyperparameter Tuning
9. Model Saving
10. Streamlit Deployment

---

##  Machine Learning Models Compared

| Model | R² Score |
|--------|----------|
| Linear Regression | 0.808 |
| Decision Tree | 0.829 |
| Random Forest | **0.911**  |
| Gradient Boosting | 0.898 |

**Best Model:** Random Forest Regressor

---

##  Pollutants Used

- PM2.5
- PM10
- NO
- NO₂
- NOx
- NH₃
- CO
- SO₂
- O₃
- Benzene
- Toluene
- Xylene

---

##  Health Advice Categories

| AQI Range | Category |
|-----------|---------|
| 0–50 | Good  |
| 51–100 | Satisfactory |
| 101–200 | Moderate |
| 201–300 | Poor  |
| 301–400 | Very Poor |
| 401–500 | Severe  |

---

##  Project Structure

```text
AQI_Analysis/
│
├── app.py
│
├── assets/
│   └── style.css
│
├── data/
│   ├── city_day.csv
│   ├── city_hour.csv
│   ├── station_day.csv
│   ├── station_hour.csv
│   └── stations.csv
│
├── model/
│   ├── aqi_model.pkl
│   └── city_mapping.csv
│
├── notebook/
│   └── AQI_prediction.ipynb
│
├── utils/
│   ├── predictor.py
│   ├── categories.py
│   ├── pollutant_analysis.py
│   └── health_advice.py
│
├── .streamlit/
│   └── config.toml
│
├── requirements.txt
└── README.md
```

---

## ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/AQI_Analysis.git
```

Move into the project folder

```bash
cd AQI_Analysis
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
streamlit run app.py
```

---

## Dashboard Features

-  AQI Prediction
-  Pollutant Analysis
- ️ Health Advice
-  City Selection
-  Date Selection
- ️ Pollutant Inputs
-  Dark Theme Support
-  Responsive Layout

---

##  Dashboard Preview

> Add screenshots of your dashboard here after deployment.

Example:

```
images/dashboard.png
```

---

## Future Improvements

- AQI Trend Visualization
- Weather API Integration
- Live AQI Data
- PDF Report Download
- Historical AQI Analysis
- AQI Forecasting
- Interactive Charts
- User Authentication

---

## Author

**Het Patel**

Computer Engineering Student

Passionate about:

- Data Science
- Machine Learning
- Data Analytics
- Artificial Intelligence

---

##  If you like this project

Please consider giving it a ⭐ on GitHub.