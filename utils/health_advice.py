def get_health_advice(aqi):

    if aqi <= 50:
        return "Air quality is good. Enjoy outdoor activities."

    elif aqi <= 100:
        return "Sensitive individuals should take minor precautions."

    elif aqi <= 200:
        return "Sensitive people should reduce prolonged outdoor activities."

    elif aqi <= 300:
        return "Children and elderly should avoid outdoor exercise."

    elif aqi <= 400:
        return "Avoid outdoor activities. Wear an N95 mask if necessary."

    else:
        return "Stay indoors. Avoid all outdoor physical activities."