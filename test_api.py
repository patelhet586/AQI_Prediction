from utils.air_quality_api import (
    get_coordinates,
    get_air_quality,
    get_daily_pollutants
)


city = "Ahmedabad"
date = "2025-01-15"


# Get coordinates
location = get_coordinates(city)

print("LOCATION")
print(location)


# Get hourly air quality
air_quality = get_air_quality(
    location["latitude"],
    location["longitude"],
    date
)


# Convert hourly → daily
daily_pollutants = get_daily_pollutants(
    air_quality
)


print("\nDAILY POLLUTANTS")

for pollutant, value in daily_pollutants.items():
    print(
        f"{pollutant:<10} : {value:.2f}"
    )