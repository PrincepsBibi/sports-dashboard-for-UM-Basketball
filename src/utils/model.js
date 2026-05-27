import { gameFeatures, resultLabel } from './analytics.js';

/**
 * Train a simple logistic regression model using gradient descent. The model
 * uses a handful of intuitive features (see analytics.js) rather than
 * opponent points to predict whether Miami wins a game. The returned
 * object includes the weight vector, intercept, predicted probabilities
 * and a sorted list of feature importances to help viewers understand
 * what matters most.
 *
 * @param {Object[]} games Array of game objects
 * @param {Object} [options] Optional settings
 * @param {number} [options.learningRate] Gradient descent learning rate
 * @param {number} [options.iterations] Number of training iterations
 * @returns {Object} {weights, intercept, featureWeights, predictions}
 */
export function trainLogisticRegression(games, options = {}) {
  const learningRate = options.learningRate ?? 0.5;
  const iterations = options.iterations ?? 500;
  // Prepare matrices
  const X = games.map(g => gameFeatures(g));
  const y = games.map(g => resultLabel(g));
  const n = X.length;
  const m = X[0].length;

  // Standardize features (zero mean, unit variance)
  const means = new Array(m).fill(0);
  const stds = new Array(m).fill(0);
  for (let j = 0; j < m; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += X[i][j];
    means[j] = sum / n;
    let variance = 0;
    for (let i = 0; i < n; i++) variance += (X[i][j] - means[j]) ** 2;
    stds[j] = Math.sqrt(variance / n) || 1; // avoid divide by zero
  }
  const Xstd = X.map(row => row.map((val, j) => (val - means[j]) / stds[j]));

  // Initialize weights and intercept
  let weights = new Array(m).fill(0);
  let intercept = 0;

  // Sigmoid function
  const sigmoid = z => 1 / (1 + Math.exp(-z));

  // Gradient descent
  for (let iter = 0; iter < iterations; iter++) {
    // Compute predictions and gradients
    const preds = new Array(n);
    const gradW = new Array(m).fill(0);
    let gradB = 0;
    for (let i = 0; i < n; i++) {
      let z = intercept;
      const xi = Xstd[i];
      for (let j = 0; j < m; j++) {
        z += weights[j] * xi[j];
      }
      const p = sigmoid(z);
      preds[i] = p;
      const error = p - y[i];
      gradB += error;
      for (let j = 0; j < m; j++) {
        gradW[j] += error * xi[j];
      }
    }
    // Update parameters (averaged gradients)
    intercept -= (learningRate / n) * gradB;
    for (let j = 0; j < m; j++) {
      weights[j] -= (learningRate / n) * gradW[j];
    }
  }

  // Reverse standardization on weights: adjust weights by original stds
  const weightsRaw = weights.map((w, j) => w / stds[j]);
  // Adjust intercept: interceptRaw = intercept - sum(weights[j]*means[j]/stds[j])
  let interceptRaw = intercept;
  for (let j = 0; j < m; j++) {
    interceptRaw -= weights[j] * (means[j] / stds[j]);
  }

  // Feature names corresponding to features from analytics.js
  const featureNames = [
    'FG% (Field‑Goal Percentage)',
    '3P% (Three‑Point Percentage)',
    'Rebounds',
    'Assists',
    'Turnovers (negative)',
    'Home Advantage'
  ];

  const featureWeights = weightsRaw.map((w, idx) => ({
    name: featureNames[idx],
    weight: w
  })).sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  // Compute predictions for each game using raw weights
  const predictions = games.map(game => {
    const feats = gameFeatures(game);
    let z = interceptRaw;
    for (let j = 0; j < m; j++) {
      z += weightsRaw[j] * feats[j];
    }
    const p = sigmoid(z);
    return p;
  });

  return {
    weights: weightsRaw,
    intercept: interceptRaw,
    featureWeights,
    predictions
  };
}
