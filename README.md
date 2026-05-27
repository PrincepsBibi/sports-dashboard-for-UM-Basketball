# Miami Basketball Performance Dashboard

An interactive React dashboard analyzing the Miami Hurricanes men's basketball 2025-26 season. The project combines game-level box-score data, player statistics, win/loss comparisons, and a lightweight logistic regression model to explore what separated Miami's wins from losses.

## Research Question

What performance factors most strongly predict winning basketball games?

## Live Demo

Add your deployed Vercel link here after deployment.

## Features

- **Overview tab**: season summary, scoring trend, location splits, and a sortable game log.
- **Players tab**: player leader cards, scoring chart, rotation production chart, and sortable player table.
- **Winning Factors tab**: top findings, win/loss stat comparison, logistic regression model summary, and coefficient interpretation.
- **Sortable tables**: game log and player statistics can be sorted by key columns.
- **Model interpretation**: model coefficients are labeled as positive or negative signals to improve readability.

## Data Source

Data comes from Sports Reference:

https://www.sports-reference.com/cbb/schools/miami-fl/men/2026.html

The dashboard uses game-level team box-score data and season player statistics from the Miami men's basketball 2025-26 page.

## Methods

The dashboard uses descriptive analytics and a simple logistic regression model.

The model intentionally avoids using Miami final points and opponent final points because those directly reveal the game outcome. Instead, it uses process-oriented features:

- Field-goal percentage
- Three-point percentage
- Rebounds
- Assists
- Turnovers
- Game location

Because the dataset has only 35 games, the model should be treated as exploratory rather than a production-level prediction system.

## Key Findings

- The model's strongest process-stat signal helps identify which non-score box-score factor most separates wins from losses.
- Close games were a pressure point: Miami played nine games decided by five points or fewer and went 4-5.
- Miami's offense leaned heavily on its top three scorers, while frontcourt production anchored rebounding and rim protection.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- JavaScript logistic regression

## Run Locally

Clone the repository:

```bash
git clone https://github.com/PrincepsBibi/sports-dashboard-for-UM-Basketball.git
cd sports-dashboard-for-UM-Basketball
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```text
src/
  data/
    gamesData.js
  utils/
    analytics.js
    model.js
  SportsAnalyticsDashboard.jsx
  App.jsx
  main.jsx
  index.css
public/
  miami-basketball-banner.svg
```

## Future Improvements

- Add opponent strength metrics such as opponent ranking or NET rating.
- Add more seasons to increase sample size for the model.
- Add downloadable CSV exports for the game log and player table.
- Add mobile-specific chart layouts for improved small-screen readability.
