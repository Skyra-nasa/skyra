const mockProbabilities = {
  very_hot: 0.62,
  very_cold: 0.01,
  very_wet: 0.12,
  very_windy: 0.08,
  uncomfortable: 0.45,
};
export const dataCards = [
  {
    title: "Very Hot",
    probability: mockProbabilities.very_hot,
    threshold: "≥35°C (95°F)",
    description: "Based on daily maximum temperature",
    type: "hot",
    trend: "increasing",
  },
  {
    title: "Very Cold",
    probability: mockProbabilities.very_cold,
    threshold: "≤0°C (32°F)",
    description: "Based on daily minimum temperature",
    type: "cold",
    trend: "stable",
  },
  {
    title: "Very Wet",
    probability: mockProbabilities.very_wet,
    threshold: "≥20mm precipitation",
    description: "Daily total precipitation",
    type: "wet",
    trend: "stable",
  },
  {
    title: "Very Windy",
    probability: mockProbabilities.very_windy,
    threshold: "≥10 m/s (36 km/h)",
    description: "10-meter wind speed",
    type: "windy",
    trend: "increasing",
  },
  {
    title: "Uncomfortable",
    probability: mockProbabilities.uncomfortable,
    threshold: "Heat Index ≥32°C",
    description: "Combined temperature and humidity",
    type: "uncomfortable",
    trend: "increasing",
  },
];
