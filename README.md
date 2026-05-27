# Miami Basketball Analytics Dashboard (Enhanced)

This enhanced version of the Miami Hurricanes men's basketball dashboard refactors the
original monolithic codebase into a modular structure and introduces a
meaningful machine‑learning component. The model surfaces actionable
insights for basketball fans rather than simply reiterating that the team
loses when it scores fewer points than its opponent.

## Folder structure

```text
src/
  data/
    gamesData.js        // Sample game data. Replace with your full dataset.
  utils/
    analytics.js        // Utility functions to compute derived stats and features.
    model.js            // Logistic regression training function.
  components/
    ModelInsights.jsx   // React component to display ML results.
  SportsAnalyticsDashboard.jsx // Main dashboard view.
  main.jsx             // Entry point for Vite/React.
index.html             // App container.
tailwind.config.js     // TailwindCSS configuration.
vite.config.js         // Vite configuration with React plugin.
package.json           // Dependencies and scripts.
```

## Key enhancements

### Modular design

- Data, utilities and components are separated into folders to improve
  readability and maintainability.
- The monolithic `SportsAnalyticsDashboard.jsx` file has been broken into
  smaller pieces, making it easier to extend the dashboard with new charts
  and tables.

### Meaningful machine‑learning insights

- A lightweight **logistic regression model** estimates the probability of
  winning using features that basketball fans often discuss: field‑goal
  percentage, three‑point percentage, rebounds, assists, turnovers (as a
  negative indicator) and home‑court advantage.
- The model **intentionally excludes the opponent’s final score** so it
  doesn't simply learn the trivial fact that Miami loses when the other
  team scores more points.
- The `ModelInsights` component surfaces the most important features by
  sorting their weights by absolute value. Positive weights indicate
  characteristics correlated with wins, while negative weights indicate
  factors associated with losses.
- The model's predicted win probability for each game is displayed
  alongside the actual result to help you gauge its calibration.

### Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   This will launch the dashboard at `http://localhost:5173` (default Vite port).

3. Replace the sample data in `src/data/gamesData.js` with your full
   dataset scraped from Sports Reference or another source. Ensure each
   game object contains the fields described in that file.

4. Customize and extend the dashboard by adding new components or
   visualizations to the `src/components` folder and importing them
   into `SportsAnalyticsDashboard.jsx`.

## Understanding the model

The logistic regression model is trained using gradient descent on
standardized features. After training, the weights are de‑standardized so
they relate directly to the original metrics. Larger positive weights
indicate features associated with higher chances of winning. Negative
weights indicate areas that hurt the team's chances. You can adjust
`learningRate` and `iterations` in the call to `trainLogisticRegression`
to experiment with the training process.

If you have more games in your dataset, the model will produce more
moderate weights and predictions. The small sample in this repository
results in extreme probabilities because the training data perfectly
separates wins and losses based on the selected features.

## Future improvements

- **Increase data size**: Use the full season's games to produce a more
  nuanced model. More data will reduce over‑fitting and yield more
  realistic probability estimates.
- **Add opponent strength**: Include a proxy for opponent quality,
  such as their ranking or win percentage, to see how Miami performs
  relative to the strength of its schedule.
- **Explore other models**: Try regularized logistic regression or
  tree‑based models to capture non‑linear interactions between features.
- **Deploy**: Host the dashboard on a platform like Netlify or Vercel
  and link it in your project README so recruiters can interact with it.

---

By following this refactored architecture and the example ML model, you
can turn your basketball dashboard into a polished, professional
portfolio project that highlights both your data engineering and data
science skills.
