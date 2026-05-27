// Utility functions for computing basketball statistics.

/**
 * Compute field‑goal percentage for a game.
 * @param {Object} game
 * @returns {number} fraction between 0 and 1
 */
export function fieldGoalPct(game) {
  if (!game || game.fgAttempted === 0) return 0;
  return game.fgMade / game.fgAttempted;
}

/**
 * Compute three‑point percentage for a game.
 * @param {Object} game
 * @returns {number} fraction between 0 and 1
 */
export function threePointPct(game) {
  if (!game || game.threeAttempted === 0) return 0;
  return game.threeMade / game.threeAttempted;
}

/**
 * Encode location into a numeric feature. Home = 1, Neutral = 0.5, Away = 0.
 * Basketball fans know home court advantage matters; this encoding allows
 * logistic regression to capture that effect.
 * @param {Object} game
 * @returns {number}
 */
export function locationFeature(game) {
  if (!game || !game.location) return 0;
  switch (game.location) {
    case 'Home':
      return 1;
    case 'Neutral':
      return 0.5;
    case 'Away':
      return 0;
    default:
      return 0;
  }
}

/**
 * Compute a basic game feature vector from raw stats. This function
 * intentionally avoids directly using the opponent’s final score, since
 * that trivially predicts wins. Instead, it focuses on variables that
 * basketball watchers often discuss: shooting efficiency, three‑point
 * accuracy, rebounding, ball sharing (assists) and ball control
 * (turnovers), as well as whether the game was home/away/neutral.
 *
 * @param {Object} game
 * @returns {number[]} feature array
 */
export function gameFeatures(game) {
  return [
    fieldGoalPct(game),    // Shooting efficiency
    threePointPct(game),   // Three‑point accuracy
    game.rebounds || 0,    // Total rebounds
    game.assists || 0,     // Total assists
    -game.turnovers || 0,  // Negative turnovers (fewer is better)
    locationFeature(game)  // Home court effect
  ];
}

/**
 * Convert a result string ('W' or 'L') into binary 1/0.
 * @param {Object} game
 * @returns {number} 1 if win, 0 if loss
 */
export function resultLabel(game) {
  return game.result === 'W' ? 1 : 0;
}
