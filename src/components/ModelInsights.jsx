import React from 'react';

/**
 * Component to display logistic regression insights. It expects a result
 * object from trainLogisticRegression containing featureWeights and
 * predictions. It also takes the original games array to show game
 * details alongside predicted win probabilities.
 *
 * @param {Object} props
 * @param {Object[]} props.games The array of game objects
 * @param {Object} props.modelResult The result returned from trainLogisticRegression
 */
export default function ModelInsights({ games, modelResult }) {
  if (!modelResult) return null;
  const { featureWeights, predictions } = modelResult;
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">ML Insights</h2>
      <p className="mb-4">
        This logistic regression model uses field‑goal percentage, three‑point percentage,
        rebounds, assists, turnovers and home‑court advantage to estimate the probability
        of winning. Larger positive weights indicate features associated with wins.
      </p>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Feature Importance</h3>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-1 text-left text-sm font-medium">Feature</th>
              <th className="px-3 py-1 text-right text-sm font-medium">Weight</th>
            </tr>
          </thead>
          <tbody>
            {featureWeights.map(({ name, weight }, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-1 text-sm">{name}</td>
                <td className="px-3 py-1 text-sm text-right">{weight.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Game Predictions</h3>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 text-left text-sm font-medium">Date</th>
              <th className="px-2 py-1 text-left text-sm font-medium">Opponent</th>
              <th className="px-2 py-1 text-center text-sm font-medium">Location</th>
              <th className="px-2 py-1 text-center text-sm font-medium">Result</th>
              <th className="px-2 py-1 text-right text-sm font-medium">Pred. Win Prob.</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, idx) => (
              <tr key={game.date} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-1 text-sm">{game.date}</td>
                <td className="px-2 py-1 text-sm">{game.opponent}</td>
                <td className="px-2 py-1 text-sm text-center">{game.location}</td>
                <td className="px-2 py-1 text-sm text-center">{game.result}</td>
                <td className="px-2 py-1 text-sm text-right">
                  {(predictions[idx] * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
