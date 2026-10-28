def get_pollutant_status(value, pollutant):

    criteria = {
        "PM2.5": [
            (30, "Good 🟢"),
            (60, "Satisfactory 🟡"),
            (90, "Moderate 🟠"),
            (120, "Poor 🔴"),
            (250, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "PM10": [
            (50, "Good 🟢"),
            (100, "Satisfactory 🟡"),
            (250, "Moderate 🟠"),
            (350, "Poor 🔴"),
            (430, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "NO": [
            (40, "Good 🟢"),
            (80, "Satisfactory 🟡"),
            (180, "Moderate 🟠"),
            (280, "Poor 🔴"),
            (400, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "NO2": [
            (40, "Good 🟢"),
            (80, "Satisfactory 🟡"),
            (180, "Moderate 🟠"),
            (280, "Poor 🔴"),
            (400, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "NOx": [
            (40, "Good 🟢"),
            (80, "Satisfactory 🟡"),
            (180, "Moderate 🟠"),
            (280, "Poor 🔴"),
            (400, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "NH3": [
            (200, "Good 🟢"),
            (400, "Satisfactory 🟡"),
            (800, "Moderate 🟠"),
            (1200, "Poor 🔴"),
            (1800, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "CO": [
            (1, "Good 🟢"),
            (2, "Satisfactory 🟡"),
            (10, "Moderate 🟠"),
            (17, "Poor 🔴"),
            (34, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "SO2": [
            (40, "Good 🟢"),
            (80, "Satisfactory 🟡"),
            (380, "Moderate 🟠"),
            (800, "Poor 🔴"),
            (1600, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "O3": [
            (50, "Good 🟢"),
            (100, "Satisfactory 🟡"),
            (168, "Moderate 🟠"),
            (208, "Poor 🔴"),
            (748, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "Benzene": [
            (5, "Good 🟢"),
            (10, "Satisfactory 🟡"),
            (20, "Moderate 🟠"),
            (30, "Poor 🔴"),
            (40, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "Toluene": [
            (10, "Good 🟢"),
            (20, "Satisfactory 🟡"),
            (40, "Moderate 🟠"),
            (60, "Poor 🔴"),
            (80, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],

        "Xylene": [
            (10, "Good 🟢"),
            (20, "Satisfactory 🟡"),
            (40, "Moderate 🟠"),
            (60, "Poor 🔴"),
            (80, "Very Poor 🟣"),
            (float("inf"), "Severe ⚫"),
        ],
    }

    for limit, category in criteria[pollutant]:
        if value <= limit:
            return category
