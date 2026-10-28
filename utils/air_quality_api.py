import requests


def get_coordinates(city):
    url = "https://geocoding-api.open-meteo.com/v1/search"

    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()

    if "results" not in data or not data["results"]:
        return None

    location = data["results"][0]

    return {
        "name": location["name"],
        "latitude": location["latitude"],
        "longitude": location["longitude"],
        "country": location.get("country", "")
    }

def get_air_quality(latitude, longitude, date):
    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": date,
        "end_date": date,
        "hourly": (
            "pm2_5,"
            "pm10,"
            "carbon_monoxide,"
            "nitrogen_dioxide,"
            "sulphur_dioxide,"
            "ozone,"
            "nitrogen_monoxide"
        ),
        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=15
    )

    response.raise_for_status()

    return response.json()
def get_daily_pollutants(air_quality):

    hourly = air_quality["hourly"]

    daily_data = {
        "PM2.5": sum(hourly["pm2_5"]) / len(hourly["pm2_5"]),
        "PM10": sum(hourly["pm10"]) / len(hourly["pm10"]),
        "NO": sum(hourly["nitrogen_monoxide"]) / len(hourly["nitrogen_monoxide"]),
        "NO2": sum(hourly["nitrogen_dioxide"]) / len(hourly["nitrogen_dioxide"]),
        "CO": sum(hourly["carbon_monoxide"]) / len(hourly["carbon_monoxide"]),
        "SO2": sum(hourly["sulphur_dioxide"]) / len(hourly["sulphur_dioxide"]),
        "O3": sum(hourly["ozone"]) / len(hourly["ozone"])
    }

    return daily_data