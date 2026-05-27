import React, { useMemo, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Trophy, Activity, TrendingUp, Users, Target, Filter, Brain, Database, Github, BarChart3, Shield, Share2, Zap, ArrowUpDown } from "lucide-react";

// Simple UI Component Shims
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200/80 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "p-5" }) => (
  <div className={className}>{children}</div>
);

// Custom Tooltip for Line Chart
const CustomLineTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
        <p className="font-semibold text-sm">{data.game}</p>
        <p className="text-sm text-blue-600">Miami: {data.points}</p>
        <p className="text-sm text-red-600">Opponent: {data.opponent}</p>
      </div>
    );
  }
  return null;
};

const playerStats = [
  { rk: 1, player: "Malik Reneau", pos: "F", g: 35, gs: 35, mp: 29.0, fg: 6.7, fga: 12.5, fgPct: .540, threeP: 0.7, threePA: 2.1, threePct: .347, ft: 4.7, fta: 5.9, ftPct: .788, orb: 2.5, drb: 4.1, trb: 6.5, ast: 2.1, stl: 1.1, blk: 0.8, tov: 2.8, pf: 2.5, pts: 18.9 },
  { rk: 2, player: "Tre Donaldson", pos: "G", g: 35, gs: 33, mp: 34.0, fg: 5.9, fga: 13.1, fgPct: .454, threeP: 1.7, threePA: 4.8, threePct: .359, ft: 2.8, fta: 3.7, ftPct: .766, orb: 0.6, drb: 3.0, trb: 3.6, ast: 5.7, stl: 1.4, blk: 0.2, tov: 2.1, pf: 1.7, pts: 16.4 },
  { rk: 3, player: "Shelton Henderson", pos: "F", g: 35, gs: 35, mp: 31.2, fg: 5.4, fga: 9.6, fgPct: .567, threeP: 0.4, threePA: 1.5, threePct: .255, ft: 2.6, fta: 4.5, ftPct: .576, orb: 1.8, drb: 3.1, trb: 4.9, ast: 2.1, stl: 1.1, blk: 0.3, tov: 1.8, pf: 2.1, pts: 13.8 },
  { rk: 4, player: "Tru Washington", pos: "G", g: 31, gs: 19, mp: 27.5, fg: 4.3, fga: 9.7, fgPct: .443, threeP: 1.2, threePA: 3.4, threePct: .352, ft: 2.2, fta: 2.9, ftPct: .744, orb: 1.3, drb: 2.7, trb: 4.0, ast: 1.8, stl: 1.8, blk: 0.0, tov: 1.4, pf: 1.7, pts: 11.9 },
  { rk: 5, player: "Ernest Udeh Jr.", pos: "C", g: 33, gs: 33, mp: 28.2, fg: 2.7, fga: 3.7, fgPct: .727, threeP: 0.0, threePA: 0.0, threePct: null, ft: 1.3, fta: 2.6, ftPct: .512, orb: 3.1, drb: 6.2, trb: 9.2, ast: 0.5, stl: 1.0, blk: 1.4, tov: 0.6, pf: 2.4, pts: 6.7 },
  { rk: 6, player: "Dante Allen", pos: "G", g: 30, gs: 18, mp: 23.9, fg: 2.4, fga: 5.6, fgPct: .431, threeP: 0.8, threePA: 2.6, threePct: .321, ft: 0.9, fta: 1.6, ftPct: .583, orb: 0.5, drb: 2.3, trb: 2.8, ast: 2.2, stl: 1.0, blk: 0.1, tov: 1.0, pf: 1.3, pts: 6.6 },
  { rk: 7, player: "Marcus Allen", pos: "G", g: 8, gs: 0, mp: 18.9, fg: 1.8, fga: 4.1, fgPct: .424, threeP: 0.6, threePA: 1.6, threePct: .385, ft: 1.1, fta: 1.6, ftPct: .692, orb: 0.9, drb: 2.3, trb: 3.1, ast: 1.6, stl: 0.3, blk: 0.0, tov: 0.3, pf: 1.8, pts: 5.3 },
  { rk: 8, player: "Timotej Malovec", pos: "F", g: 33, gs: 2, mp: 14.9, fg: 1.3, fga: 3.7, fgPct: .350, threeP: 1.1, threePA: 3.4, threePct: .333, ft: 0.5, fta: 0.6, ftPct: .714, orb: 0.1, drb: 1.2, trb: 1.3, ast: 0.9, stl: 0.3, blk: 0.2, tov: 0.6, pf: 1.8, pts: 4.2 },
  { rk: 9, player: "Noam Dovrat", pos: "G", g: 27, gs: 0, mp: 9.4, fg: 1.2, fga: 2.7, fgPct: .452, threeP: 1.0, threePA: 2.1, threePct: .466, ft: 0.3, fta: 0.3, ftPct: 1.000, orb: 0.0, drb: 0.5, trb: 0.5, ast: 1.0, stl: 0.4, blk: 0.0, tov: 0.4, pf: 0.6, pts: 3.8 },
  { rk: 10, player: "Salih Altuntas", pos: "C", g: 32, gs: 0, mp: 7.9, fg: 0.7, fga: 1.1, fgPct: .657, threeP: 0.0, threePA: 0.0, threePct: null, ft: 0.2, fta: 0.5, ftPct: .375, orb: 0.6, drb: 1.3, trb: 1.9, ast: 0.1, stl: 0.2, blk: 0.4, tov: 0.4, pf: 1.7, pts: 1.6 },
  { rk: 11, player: "John Laboy II", pos: "G", g: 6, gs: 0, mp: 4.7, fg: 0.3, fga: 1.3, fgPct: .250, threeP: 0.3, threePA: 1.0, threePct: .333, ft: 0.2, fta: 0.3, ftPct: .500, orb: 0.0, drb: 0.2, trb: 0.2, ast: 0.5, stl: 0.3, blk: 0.0, tov: 0.5, pf: 0.5, pts: 1.2 },
  { rk: 12, player: "Jordyn Kee", pos: "G", g: 8, gs: 0, mp: 3.1, fg: 0.1, fga: 0.9, fgPct: .143, threeP: 0.1, threePA: 0.5, threePct: .250, ft: 0.0, fta: 0.0, ftPct: null, orb: 0.1, drb: 0.3, trb: 0.4, ast: 0.4, stl: 0.1, blk: 0.0, tov: 0.3, pf: 0.8, pts: 0.4 },
];

const teamTotals = {
  g: 35, mp: 200.0, fg: 29.8, fga: 59.9, fgPct: .497, threeP: 6.7, threePA: 19.1, threePct: .349,
  ft: 15.2, fta: 22.3, ftPct: .683, orb: 12.4, drb: 25.0, trb: 37.4, ast: 16.2,
  stl: 7.9, blk: 3.3, tov: 11.2, pf: 15.5, pts: 81.5
};

const majorColumns = [
  ["rk", "Rk"], ["player", "Player"], ["pos", "Pos"], ["g", "G"], ["gs", "GS"], ["mp", "MP"], ["fg", "FG"],
  ["fga", "FGA"], ["fgPct", "FG%"], ["threeP", "3P"], ["threePA", "3PA"], ["threePct", "3P%"], ["ft", "FT"],
  ["fta", "FTA"], ["ftPct", "FT%"], ["orb", "ORB"], ["drb", "DRB"], ["trb", "TRB"], ["ast", "AST"],
  ["stl", "STL"], ["blk", "BLK"], ["tov", "TOV"], ["pf", "PF"], ["pts", "PTS"]
];

// 2025-26 Season Data (All 35 games including tournament)
const gamesData2025 = [
  { gameNum: "G1", date: "2025-11-03", game: "Jacksonville", points: 86, opponent: 69, fgPct: .551, threePct: .214, rebounds: 30, assists: 18, turnovers: 15, margin: 17, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G2", date: "2025-11-06", game: "Bethune-Cookman", points: 101, opponent: 61, fgPct: .591, threePct: .471, rebounds: 44, assists: 25, turnovers: 6, margin: 40, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G3", date: "2025-11-10", game: "Stetson", points: 102, opponent: 61, fgPct: .561, threePct: .348, rebounds: 42, assists: 28, turnovers: 12, margin: 41, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G4", date: "2025-11-16", game: "Florida", points: 68, opponent: 82, fgPct: .338, threePct: .294, rebounds: 35, assists: 13, turnovers: 10, margin: -14, location: "Neutral", result: "L", type: "Regular" },
  { gameNum: "G5", date: "2025-11-20", game: "Elon", points: 99, opponent: 72, fgPct: .544, threePct: .375, rebounds: 34, assists: 18, turnovers: 9, margin: 27, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G6", date: "2025-11-23", game: "Delaware State", points: 97, opponent: 41, fgPct: .613, threePct: .435, rebounds: 42, assists: 28, turnovers: 11, margin: 56, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G7", date: "2025-11-27", game: "Brigham Young", points: 62, opponent: 72, fgPct: .379, threePct: .227, rebounds: 37, assists: 10, turnovers: 10, margin: -10, location: "Neutral", result: "L", type: "Regular" },
  { gameNum: "G8", date: "2025-11-28", game: "Georgetown", points: 78, opponent: 65, fgPct: .588, threePct: .600, rebounds: 33, assists: 14, turnovers: 15, margin: 13, location: "Neutral", result: "W", type: "Regular" },
  { gameNum: "G9", date: "2025-12-02", game: "Ole Miss", points: 75, opponent: 66, fgPct: .491, threePct: .440, rebounds: 36, assists: 15, turnovers: 18, margin: 9, location: "Away", result: "W", type: "Regular" },
  { gameNum: "G10", date: "2025-12-06", game: "Southern Mississippi", points: 88, opponent: 64, fgPct: .471, threePct: .350, rebounds: 31, assists: 20, turnovers: 12, margin: 24, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G11", date: "2025-12-13", game: "Louisiana–Monroe", points: 104, opponent: 79, fgPct: .600, threePct: .440, rebounds: 42, assists: 28, turnovers: 8, margin: 25, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G12", date: "2025-12-16", game: "Florida International", points: 98, opponent: 81, fgPct: .538, threePct: .261, rebounds: 34, assists: 22, turnovers: 11, margin: 17, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G13", date: "2025-12-21", game: "North Florida", points: 105, opponent: 67, fgPct: .567, threePct: .360, rebounds: 43, assists: 20, turnovers: 10, margin: 38, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G14", date: "2025-12-30", game: "Pittsburgh", points: 76, opponent: 69, fgPct: .448, threePct: .182, rebounds: 41, assists: 6, turnovers: 10, margin: 7, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G15", date: "2026-01-07", game: "Wake Forest", points: 81, opponent: 77, fgPct: .500, threePct: .222, rebounds: 34, assists: 15, turnovers: 13, margin: 4, location: "Away", result: "W", type: "Regular" },
  { gameNum: "G16", date: "2026-01-10", game: "Georgia Tech", points: 91, opponent: 81, fgPct: .517, threePct: .400, rebounds: 30, assists: 20, turnovers: 7, margin: 10, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G17", date: "2026-01-13", game: "Notre Dame", points: 81, opponent: 69, fgPct: .500, threePct: .273, rebounds: 25, assists: 10, turnovers: 8, margin: 12, location: "Away", result: "W", type: "Regular" },
  { gameNum: "G18", date: "2026-01-17", game: "Clemson", points: 59, opponent: 69, fgPct: .389, threePct: .250, rebounds: 32, assists: 9, turnovers: 16, margin: -10, location: "Away", result: "L", type: "Regular" },
  { gameNum: "G19", date: "2026-01-20", game: "Florida State", points: 63, opponent: 65, fgPct: .421, threePct: .250, rebounds: 28, assists: 15, turnovers: 14, margin: -2, location: "Home", result: "L", type: "Regular" },
  { gameNum: "G20", date: "2026-01-24", game: "Syracuse", points: 85, opponent: 76, fgPct: .611, threePct: .538, rebounds: 32, assists: 20, turnovers: 15, margin: 9, location: "Away", result: "W", type: "Regular" },
  { gameNum: "G21", date: "2026-01-28", game: "Stanford", points: 79, opponent: 70, fgPct: .474, threePct: .400, rebounds: 32, assists: 15, turnovers: 8, margin: 9, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G22", date: "2026-01-31", game: "California", points: 85, opponent: 86, fgPct: .569, threePct: .333, rebounds: 32, assists: 14, turnovers: 7, margin: -1, location: "Home", result: "L", type: "Regular" },
  { gameNum: "G23", date: "2026-02-07", game: "Boston College", points: 74, opponent: 68, fgPct: .519, threePct: .333, rebounds: 41, assists: 13, turnovers: 13, margin: 6, location: "Away", result: "W", type: "Regular" },
  { gameNum: "G24", date: "2026-02-10", game: "North Carolina", points: 75, opponent: 66, fgPct: .468, threePct: .231, rebounds: 35, assists: 15, turnovers: 8, margin: 9, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G25", date: "2026-02-14", game: "NC State", points: 77, opponent: 76, fgPct: .478, threePct: .176, rebounds: 37, assists: 8, turnovers: 9, margin: 1, location: "Away", result: "W", type: "Regular" },
  { gameNum: "G26", date: "2026-02-17", game: "Virginia Tech", points: 67, opponent: 66, fgPct: .443, threePct: .250, rebounds: 31, assists: 7, turnovers: 9, margin: 1, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G27", date: "2026-02-21", game: "Virginia", points: 83, opponent: 86, fgPct: .475, threePct: .500, rebounds: 25, assists: 16, turnovers: 9, margin: -3, location: "Away", result: "L", type: "Regular" },
  { gameNum: "G28", date: "2026-02-24", game: "Florida State", points: 83, opponent: 73, fgPct: .525, threePct: .429, rebounds: 41, assists: 15, turnovers: 17, margin: 10, location: "Away", result: "W", type: "Regular" },
  { gameNum: "G29", date: "2026-02-28", game: "Boston College", points: 76, opponent: 54, fgPct: .500, threePct: .350, rebounds: 31, assists: 15, turnovers: 11, margin: 22, location: "Home", result: "W", type: "Regular" },
  { gameNum: "G30", date: "2026-03-04", game: "SMU", points: 77, opponent: 69, fgPct: .474, threePct: .611, rebounds: 34, assists: 20, turnovers: 15, margin: 8, location: "Away", result: "W", type: "Regular" },
  { gameNum: "G31", date: "2026-03-07", game: "Louisville", points: 89, opponent: 92, fgPct: .564, threePct: .421, rebounds: 25, assists: 22, turnovers: 8, margin: -3, location: "Home", result: "L", type: "Regular" },
  { gameNum: "G32", date: "2026-03-12", game: "Louisville", points: 78, opponent: 73, fgPct: .466, threePct: .385, rebounds: 29, assists: 11, turnovers: 8, margin: 5, location: "Neutral", result: "W", type: "Tournament" },
  { gameNum: "G33", date: "2026-03-13", game: "Virginia", points: 62, opponent: 84, fgPct: .386, threePct: .200, rebounds: 21, assists: 6, turnovers: 7, margin: -22, location: "Neutral", result: "L", type: "Tournament" },
  { gameNum: "G34", date: "2026-03-20", game: "Missouri", points: 80, opponent: 66, fgPct: .433, threePct: .458, rebounds: 42, assists: 19, turnovers: 9, margin: 14, location: "Neutral", result: "W", type: "Tournament" },
  { gameNum: "G35", date: "2026-03-22", game: "Purdue", points: 69, opponent: 79, fgPct: .444, threePct: .263, rebounds: 30, assists: 17, turnovers: 12, margin: -10, location: "Neutral", result: "L", type: "Tournament" },
];

const metricStyles = [
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-orange-500",
  "from-violet-500 to-fuchsia-500",
];

const MetricCard = ({ icon: Icon, label, value, note }) => {
  const accent = metricStyles[label.length % metricStyles.length];
  return (
  <Card className="relative overflow-hidden rounded-2xl shadow-sm">
    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
    <CardContent className="p-5">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </CardContent>
  </Card>
  );
};

const SortHeader = ({ label, sortKey, activeSort, onSort, className = "whitespace-nowrap px-4 py-3" }) => (
  <th className={className}>
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
    >
      {label}
      <ArrowUpDown className={`h-3.5 w-3.5 ${activeSort.key === sortKey ? "text-blue-600" : "text-slate-400"}`} />
    </button>
  </th>
);

const formatStat = (value, key) => {
  if (value === null || value === undefined) return "-";
  if (key && key.toLowerCase().includes("pct")) return `${(value * 100).toFixed(1)}%`;
  if (typeof value === "number") return Number.isInteger(value) ? value : value.toFixed(1);
  return value;
};

const leaderBy = (key, minimumGames = 1) =>
  playerStats
    .filter((player) => player.g >= minimumGames && player[key] !== null && player[key] !== undefined)
    .reduce((best, player) => (player[key] > best[key] ? player : best));

const modelFeatures = [
  { key: "fgPct", label: "FG%" },
  { key: "threePct", label: "3PT%" },
  { key: "rebounds", label: "Rebounds" },
  { key: "assists", label: "Assists" },
  { key: "turnovers", label: "Turnovers" },
  { key: "locationValue", label: "Game location" },
];

const sigmoid = (value) => 1 / (1 + Math.exp(-value));

const locationValue = (location) => {
  if (location === "Home") return 1;
  if (location === "Neutral") return 0.5;
  return 0;
};

const modelValue = (game, key) => {
  if (key === "locationValue") return locationValue(game.location);
  return game[key];
};

const trainLogisticRegression = (games) => {
  const rows = games.map((game) => modelFeatures.map((feature) => modelValue(game, feature.key)));
  const labels = games.map((game) => (game.result === "W" ? 1 : 0));
  const means = modelFeatures.map((_, featureIndex) =>
    rows.reduce((sum, row) => sum + row[featureIndex], 0) / rows.length
  );
  const stds = modelFeatures.map((_, featureIndex) => {
    const variance = rows.reduce((sum, row) => sum + (row[featureIndex] - means[featureIndex]) ** 2, 0) / rows.length;
    return Math.sqrt(variance) || 1;
  });
  const scaledRows = rows.map((row) => row.map((value, featureIndex) => (value - means[featureIndex]) / stds[featureIndex]));
  let intercept = 0;
  let weights = modelFeatures.map(() => 0);
  const learningRate = 0.08;
  const l2 = 0.02;
  const iterations = 3500;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    let interceptGradient = 0;
    const weightGradients = modelFeatures.map(() => 0);

    scaledRows.forEach((row, rowIndex) => {
      const score = intercept + row.reduce((sum, value, featureIndex) => sum + value * weights[featureIndex], 0);
      const error = sigmoid(score) - labels[rowIndex];
      interceptGradient += error;
      row.forEach((value, featureIndex) => {
        weightGradients[featureIndex] += error * value;
      });
    });

    intercept -= learningRate * (interceptGradient / rows.length);
    weights = weights.map((weight, featureIndex) =>
      weight - learningRate * ((weightGradients[featureIndex] / rows.length) + l2 * weight)
    );
  }

  const predictions = scaledRows.map((row, rowIndex) => {
    const score = intercept + row.reduce((sum, value, featureIndex) => sum + value * weights[featureIndex], 0);
    const probability = sigmoid(score);
    return {
      game: games[rowIndex].game,
      actual: labels[rowIndex],
      probability,
      predicted: probability >= 0.5 ? 1 : 0,
    };
  });
  const correct = predictions.filter((prediction) => prediction.predicted === prediction.actual).length;
  const topPredictors = modelFeatures
    .map((feature, index) => ({ ...feature, weight: weights[index], strength: Math.abs(weights[index]) }))
    .sort((a, b) => b.strength - a.strength);

  return {
    accuracy: Math.round((correct / games.length) * 100),
    correct,
    total: games.length,
    topPredictors,
    weights,
    intercept,
    predict: (game) => {
      const scaled = modelFeatures.map((feature, index) => (modelValue(game, feature.key) - means[index]) / stds[index]);
      const score = intercept + scaled.reduce((sum, value, index) => sum + value * weights[index], 0);
      return sigmoid(score);
    },
  };
};

export default function SportsAnalyticsDashboardExample() {
  const [activePage, setActivePage] = useState("overview");
  const [seasonFilter, setSeasonFilter] = useState("2025-26");
  const [gameTypeFilter, setGameTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");
  const [showAllGames, setShowAllGames] = useState(false);
  const [gameSort, setGameSort] = useState({ key: "date", direction: "asc" });
  const [playerSort, setPlayerSort] = useState({ key: "pts", direction: "desc" });

  const allGames = gamesData2025;
  const logisticModel = useMemo(() => trainLogisticRegression(allGames), [allGames]);

  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      const gameTypeMatch = gameTypeFilter === "All" || game.type === gameTypeFilter;
      const locationMatch = locationFilter === "All" || game.location === locationFilter;
      const resultMatch = resultFilter === "All" || game.result === resultFilter;
      return gameTypeMatch && locationMatch && resultMatch;
    });
  }, [gameTypeFilter, locationFilter, resultFilter]);

  const updateSort = (currentSort, setSort, key) => {
    setSort({
      key,
      direction: currentSort.key === key && currentSort.direction === "asc" ? "desc" : "asc",
    });
  };

  const compareValues = (a, b, sort) => {
    const aValue = sort.key === "gameNum" ? Number(a.gameNum.replace("G", "")) : a[sort.key];
    const bValue = sort.key === "gameNum" ? Number(b.gameNum.replace("G", "")) : b[sort.key];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
    }
    return sort.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  };

  const sortedGames = useMemo(() => {
    return [...filteredGames].sort((a, b) => compareValues(a, b, gameSort));
  }, [filteredGames, gameSort]);

  const visibleGames = showAllGames ? sortedGames : sortedGames.slice(0, 10);

  const sortedPlayers = useMemo(() => {
    return [...playerStats].sort((a, b) => compareValues(a, b, playerSort));
  }, [playerSort]);

  const average = (key) => {
    if (!filteredGames.length) return "0.0";
    return (filteredGames.reduce((sum, game) => sum + game[key], 0) / filteredGames.length).toFixed(1);
  };

  const averageValue = (games, key) => {
    if (!games.length) return 0;
    return games.reduce((sum, game) => sum + game[key], 0) / games.length;
  };

  const buildWinFactors = (games) => {
    const winGames = games.filter((game) => game.result === "W");
    const lossGames = games.filter((game) => game.result === "L");
    const factorConfig = [
      { stat: "FG%", key: "fgPct", format: "pct" },
      { stat: "3PT%", key: "threePct", format: "pct" },
      { stat: "Rebounds", key: "rebounds", format: "number" },
      { stat: "Assists", key: "assists", format: "number" },
      { stat: "Turnovers", key: "turnovers", format: "number" },
    ];

    return factorConfig.map((factor) => {
      const winAverage = averageValue(winGames, factor.key);
      const lossAverage = averageValue(lossGames, factor.key);
      const winsValue = factor.format === "pct" ? winAverage * 100 : winAverage;
      const lossesValue = factor.format === "pct" ? lossAverage * 100 : lossAverage;
      const difference = winsValue - lossesValue;

      return {
        stat: factor.stat,
        wins: Number(winsValue.toFixed(1)),
        losses: Number(lossesValue.toFixed(1)),
        difference: `${difference > 0 ? "+" : ""}${difference.toFixed(1)}${factor.format === "pct" ? " pts" : ""}`,
      };
    });
  };

  const locationSplits = useMemo(() => {
    return ["Home", "Away", "Neutral"]
      .map((location) => {
        const games = filteredGames.filter((game) => game.location === location);
        const locationWins = games.filter((game) => game.result === "W").length;
        const avgFor = games.length ? games.reduce((sum, game) => sum + game.points, 0) / games.length : 0;
        const avgAgainst = games.length ? games.reduce((sum, game) => sum + game.opponent, 0) / games.length : 0;

        return {
          location,
          games: games.length,
          wins: locationWins,
          losses: games.length - locationWins,
          avgFor: Number(avgFor.toFixed(1)),
          avgAgainst: Number(avgAgainst.toFixed(1)),
          margin: Number((avgFor - avgAgainst).toFixed(1)),
        };
      })
      .filter((split) => split.games > 0);
  }, [filteredGames]);

  const wins = filteredGames.filter((game) => game.result === "W").length;
  const winPercent = filteredGames.length ? Math.round((wins / filteredGames.length) * 100) : 0;
  const winFactors = useMemo(() => buildWinFactors(filteredGames), [filteredGames]);
  const seasonWinFactors = useMemo(() => buildWinFactors(allGames), [allGames]);
  const scoringLeader = leaderBy("pts");
  const reboundLeader = leaderBy("trb");
  const assistLeader = leaderBy("ast");
  const stealLeader = leaderBy("stl");
  const blockLeader = leaderBy("blk");
  const efficiencyLeader = leaderBy("fgPct", 20);
  const topScorers = playerStats.slice(0, 8);
  const rotationPlayers = playerStats.filter((player) => player.mp >= 14);
  const avgMargin = average("margin");
  const bestLocation = locationSplits.reduce((best, split) => (!best || split.margin > best.margin ? split : best), null);
  const topThreeScoring = playerStats.slice(0, 3).reduce((sum, player) => sum + player.pts, 0);
  const topThreeScoringShare = Math.round((topThreeScoring / teamTotals.pts) * 100);
  const opponentPPG = allGames.reduce((sum, game) => sum + game.opponent, 0) / allGames.length;
  const turnoverFactor = winFactors.find((factor) => factor.stat === "Turnovers");
  const assistFactor = winFactors.find((factor) => factor.stat === "Assists");
  const fgFactor = winFactors.find((factor) => factor.stat === "FG%");
  const threeFactor = winFactors.find((factor) => factor.stat === "3PT%");
  const reboundFactor = winFactors.find((factor) => factor.stat === "Rebounds");
  const filteredProfile = {
    fgPct: averageValue(filteredGames, "fgPct"),
    threePct: averageValue(filteredGames, "threePct"),
    rebounds: averageValue(filteredGames, "rebounds"),
    assists: averageValue(filteredGames, "assists"),
    turnovers: Number(average("turnovers")),
    location: locationFilter === "All" ? "Neutral" : locationFilter,
  };
  const filteredWinProbability = filteredGames.length ? Math.round(logisticModel.predict(filteredProfile) * 100) : 0;
  const predictorSummary = logisticModel.topPredictors
    .slice(0, 3)
    .map((predictor) => `${predictor.label} ${predictor.weight > 0 ? "increases" : "decreases"} win odds`)
    .join(", ");
  const topModelPredictor = logisticModel.topPredictors[0];
  const seasonReboundFactor = seasonWinFactors.find((factor) => factor.stat === "Rebounds");
  const closeGames = allGames.filter((game) => Math.abs(game.margin) <= 5);
  const closeWins = closeGames.filter((game) => game.result === "W").length;
  const closeGameWinPct = Math.round((closeWins / closeGames.length) * 100);
  const topThreeFindings = [
    {
      label: "Model Signal",
      title: `${topModelPredictor.label} is the strongest model feature`,
      body: `The logistic regression gives ${topModelPredictor.label.toLowerCase()} the largest coefficient impact, meaning it is the clearest statistical signal in the win/loss classifier.`,
    },
    {
      label: "Game Pressure",
      title: `Close games were Miami's stress test`,
      body: `Miami played ${closeGames.length} games decided by five points or fewer and went ${closeWins}-${closeGames.length - closeWins}, a ${closeGameWinPct}% win rate that helped separate a good season from a shaky one.`,
    },
    {
      label: "Scoring Profile",
      title: `Three players supply ${topThreeScoringShare}% of the offense`,
      body: `${scoringLeader.player}, ${playerStats[1].player}, and ${playerStats[2].player} combine for ${topThreeScoring.toFixed(1)} points per game, while the team wins also show a ${seasonReboundFactor.difference} rebound edge.`,
    },
  ];

  const insightCopy = {
    overview: {
      body: `With the current filters, Miami is ${wins}-${filteredGames.length - wins} while averaging ${average("points")} points and a ${Number(avgMargin) > 0 ? "+" : ""}${avgMargin} scoring margin.`,
      takeaway: bestLocation
        ? `${bestLocation.location} games are the strongest split shown here: ${bestLocation.wins}-${bestLocation.losses} with a ${bestLocation.margin > 0 ? "+" : ""}${bestLocation.margin.toFixed(1)} average margin.`
        : "The selected filters do not contain enough games to compare location splits.",
      finding: Number(avgMargin) >= 0
        ? `The filtered sample is winning through positive scoring margin, not just high point totals.`
        : `The filtered sample is being outscored on average, which explains the weaker result profile.`,
    },
    players: {
      body: `${scoringLeader.player} leads the roster at ${scoringLeader.pts.toFixed(1)} PPG, while ${assistLeader.player} drives creation with ${assistLeader.ast.toFixed(1)} assists per game.`,
      takeaway: `The top three scorers combine for ${topThreeScoring.toFixed(1)} of the team's ${teamTotals.pts.toFixed(1)} PPG, or about ${topThreeScoringShare}% of total scoring.`,
      finding: `${reboundLeader.player} adds the clearest interior value with ${reboundLeader.trb.toFixed(1)} RPG and ${blockLeader.blk.toFixed(1)} blocks per game.`,
    },
    winning: {
      body: `The win/loss split points to efficiency and glass work more than one single box-score stat: FG% changes by ${fgFactor.difference}, 3PT% by ${threeFactor.difference}, and rebounds by ${reboundFactor.difference}.`,
      takeaway: `The model supports that read by ranking ${topModelPredictor.label.toLowerCase()} as its strongest process-stat signal, while the close-game record (${closeWins}-${closeGames.length - closeWins}) shows Miami still had trouble converting tight margins.`,
      finding: "Miami was strongest when the shot quality and rebounding profile tilted in its favor, but close-game execution remained the biggest pressure point.",
    },
  };

  const tabSummary = {
    overview: `Miami went 26-9, averaged ${teamTotals.pts.toFixed(1)} points, and outscored opponents by ${(teamTotals.pts - opponentPPG).toFixed(1)} points per game.`,
    players: `Miami's rotation has a clear structure: three primary scorers create most of the offense, while the frontcourt supplies the rebounding and rim protection.`,
    winning: `The winning factors view compares wins and losses, then uses logistic regression to test which box-score inputs most strongly classify outcomes.`,
  };

  const coefficientLabel = (weight) => {
    const strength = Math.abs(weight);
    if (strength >= 1.25) return weight >= 0 ? "Strong positive" : "Strong negative";
    if (strength >= 0.65) return weight >= 0 ? "Moderate positive" : "Moderate negative";
    return weight >= 0 ? "Small positive" : "Small negative";
  };

  const buttonClass = (page) =>
    activePage === page
      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
      : "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50";

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_48%,#fff7ed_100%)] p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <img
            src="/miami-basketball-banner.svg"
            alt="Miami Hurricanes basketball banner"
            className="h-40 w-full object-cover sm:h-48 lg:h-56"
          />
          <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Portfolio Project</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">Miami Basketball Performance Dashboard</h1>
              <p className="mt-2 max-w-3xl text-slate-600">
                An interactive analytics dashboard using all games from Miami men's basketball's 2025-26 season to study scoring trends, game margins, and the factors that separate wins from losses.
              </p>
              <p className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950">
                Research Question: What performance factors most strongly predict winning basketball games?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActivePage("overview")} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${buttonClass("overview")}`}>Overview</button>
              <button onClick={() => setActivePage("players")} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${buttonClass("players")}`}>Players</button>
              <button onClick={() => setActivePage("winning")} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${buttonClass("winning")}`}>Winning Factors</button>
            </div>
          </div>
        </div>

        <div className={`grid gap-6 ${activePage === "overview" ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-1"}`}>
          {activePage === "overview" && (
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="mb-1 font-medium text-slate-600">Season</p>
                    <div className="rounded-xl border bg-white px-3 py-2">2025–2026</div>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-slate-600">Game Type</p>
                    <select value={gameTypeFilter} onChange={(e) => setGameTypeFilter(e.target.value)} className="w-full rounded-xl border bg-white px-3 py-2">
                      <option>All</option>
                      <option>Regular</option>
                      <option>Tournament</option>
                    </select>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-slate-600">Location</p>
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full rounded-xl border bg-white px-3 py-2">
                      <option>All</option>
                      <option>Home</option>
                      <option>Away</option>
                      <option>Neutral</option>
                    </select>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-slate-600">Result</p>
                    <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value)} className="w-full rounded-xl border bg-white px-3 py-2">
                      <option>All</option>
                      <option>W</option>
                      <option>L</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-950">
                  Use the filters to compare team performance by game type, location, and result.
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">{activePage === "overview" ? "Overview" : activePage === "players" ? "Players" : "Winning Factors"}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tabSummary[activePage]}</p>
              </CardContent>
            </Card>

            {activePage !== "players" && (
              <div className="grid gap-4 md:grid-cols-5">
                <MetricCard icon={Trophy} label="Filtered Record" value={`${wins}-${filteredGames.length - wins}`} note={`${filteredGames.length} games shown`} />
                <MetricCard icon={TrendingUp} label="Win %" value={`${winPercent}%`} note={`${locationFilter} location | ${resultFilter} result`} />
                <MetricCard icon={Activity} label="Avg Points" value={average("points")} note="Updates when filters change" />
                <MetricCard icon={Target} label="Avg Turnovers" value={average("turnovers")} note="Lower is better" />
                <MetricCard icon={Users} label="Avg Margin" value={average("margin")} note="Point differential per game" />
              </div>
            )}

            {activePage === "overview" && (
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="rounded-2xl border-0 shadow-sm lg:col-span-2">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold">How Did Miami Score Across the Season?</h2>
                      <p className="text-sm text-slate-500">Miami points and opponent points for each game in the selected filter.</p>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredGames}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="gameNum" />
                          <YAxis />
                          <Tooltip content={<CustomLineTooltip />} />
                          <Legend />
                          <Line type="monotone" dataKey="points" name="Miami Points" stroke="#3b82f6" strokeWidth={3} />
                          <Line type="monotone" dataKey="opponent" name="Opponent Points" stroke="#ef4444" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold">Key Insight</h2>
                    <p className="mt-3 text-slate-600">{insightCopy[activePage].body}</p>
                    <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4">
                      <p className="text-sm font-medium text-orange-700">Data takeaway</p>
                      <p className="mt-1 font-semibold">{insightCopy[activePage].takeaway}</p>
                    </div>
                    <div className="mt-4 rounded-xl bg-emerald-950 p-4 text-white">
                      <p className="text-sm text-emerald-100">Main finding</p>
                      <p className="text-lg font-bold">{insightCopy[activePage].finding}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {activePage === "players" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-5">
              <MetricCard icon={Activity} label="PPG Leader" value={scoringLeader.player} note={`${scoringLeader.pts.toFixed(1)} PTS | ${scoringLeader.fgPct ? formatStat(scoringLeader.fgPct, "fgPct") : "-"} FG`} />
              <MetricCard icon={Shield} label="Rebound Leader" value={reboundLeader.player} note={`${reboundLeader.trb.toFixed(1)} REB | ${reboundLeader.orb.toFixed(1)} ORB`} />
              <MetricCard icon={Share2} label="Assist Leader" value={assistLeader.player} note={`${assistLeader.ast.toFixed(1)} AST | ${assistLeader.tov.toFixed(1)} TOV`} />
              <MetricCard icon={Zap} label="Steals Leader" value={stealLeader.player} note={`${stealLeader.stl.toFixed(1)} STL per game`} />
              <MetricCard icon={Target} label="FG% Leader" value={efficiencyLeader.player} note={`${formatStat(efficiencyLeader.fgPct, "fgPct")} FG | ${efficiencyLeader.fga.toFixed(1)} FGA`} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold">Who Carried the Scoring Load?</h2>
                  <p className="mb-4 text-sm text-slate-500">Points per game for the top scoring players.</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topScorers} layout="vertical" margin={{ left: 28 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="player" width={120} />
                        <Tooltip formatter={(value) => [`${value} PPG`, "Points"]} />
                        <Bar dataKey="pts" name="PPG" fill="#2563eb" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold">How Did the Rotation Contribute?</h2>
                  <p className="mb-4 text-sm text-slate-500">Points, rebounds, and assists among players averaging at least 14 minutes.</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rotationPlayers}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="player" interval={0} angle={-25} textAnchor="end" height={86} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pts" name="PTS" fill="#2563eb" />
                        <Bar dataKey="trb" name="TRB" fill="#059669" />
                        <Bar dataKey="ast" name="AST" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Major Player Statistics</h2>
                    <p className="text-sm text-slate-500">Roster box-score categories only: rank, player, position, games, starts, minutes, shooting, rebounds, assists, defense, turnovers, fouls, and points.</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    Team: {teamTotals.pts.toFixed(1)} PPG | {teamTotals.trb.toFixed(1)} RPG | {teamTotals.ast.toFixed(1)} APG
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="min-w-[1320px] w-full text-left text-xs">
                    <thead className="bg-emerald-50 text-emerald-900">
                      <tr>
                        {majorColumns.map(([, label]) => (
                          <SortHeader
                            key={label}
                            label={label}
                            sortKey={majorColumns.find(([, columnLabel]) => columnLabel === label)[0]}
                            activeSort={playerSort}
                            onSort={(key) => updateSort(playerSort, setPlayerSort, key)}
                            className="whitespace-nowrap px-3 py-3"
                          />
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y bg-white">
                      {sortedPlayers.map((row) => (
                        <tr key={row.player} className={row.rk <= 5 ? "bg-orange-50/50" : ""}>
                          {majorColumns.map(([key]) => (
                            <td key={`${row.player}-${key}`} className={`whitespace-nowrap px-3 py-3 ${key === "player" ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                              {formatStat(row[key], key)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activePage === "overview" && (
          <>
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold">Home vs. Away vs. Neutral Performance</h2>
                <p className="mb-4 text-sm text-slate-500">Average scoring, points allowed, and margin by game location.</p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationSplits}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgFor" name="Avg Points" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="avgAgainst" name="Avg Allowed" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="margin" name="Avg Margin" fill="#059669" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  {locationSplits.map((split) => (
                    <div key={split.location} className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="font-semibold">{split.location}</p>
                      <p className="text-slate-600">{split.wins}-{split.losses} record</p>
                      <p className="text-slate-600">{split.margin > 0 ? "+" : ""}{split.margin.toFixed(1)} margin</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Game Log</h2>
                    <p className="text-sm text-slate-500">Raw game-level data behind the charts, filtered by game type, location, and result.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900">
                      {filteredGames.length} games | {wins}-{filteredGames.length - wins} record
                    </div>
                    {sortedGames.length > 10 && (
                      <button
                        type="button"
                        onClick={() => setShowAllGames((value) => !value)}
                        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        {showAllGames ? "Show 10 games" : "View all games"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="min-w-[980px] w-full text-left text-sm">
                    <thead className="bg-emerald-50 text-emerald-900">
                      <tr>
                        <SortHeader label="Game" sortKey="gameNum" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="Date" sortKey="date" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="Opponent" sortKey="game" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="Loc" sortKey="location" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="Type" sortKey="type" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="Result" sortKey="result" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="Score" sortKey="points" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="Margin" sortKey="margin" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="FG%" sortKey="fgPct" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="3PT%" sortKey="threePct" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="REB" sortKey="rebounds" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="AST" sortKey="assists" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                        <SortHeader label="TOV" sortKey="turnovers" activeSort={gameSort} onSort={(key) => updateSort(gameSort, setGameSort, key)} />
                      </tr>
                    </thead>
                    <tbody className="divide-y bg-white">
                      {visibleGames.map((game) => (
                        <tr key={game.gameNum}>
                          <td className="whitespace-nowrap px-4 py-3 font-medium">{game.gameNum}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{game.date}</td>
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">{game.game}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{game.location}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{game.type}</td>
                          <td className={`whitespace-nowrap px-4 py-3 font-bold ${game.result === "W" ? "text-emerald-700" : "text-rose-700"}`}>{game.result}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{game.points}-{game.opponent}</td>
                          <td className={`whitespace-nowrap px-4 py-3 font-semibold ${game.margin >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                            {game.margin > 0 ? "+" : ""}{game.margin}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatStat(game.fgPct, "fgPct")}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatStat(game.threePct, "threePct")}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{game.rebounds}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{game.assists}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">{game.turnovers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activePage === "winning" && (
          <>
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Top Three Findings</h2>
                  <p className="text-sm text-slate-500">Season-wide takeaways combining the descriptive stats and logistic regression model.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {topThreeFindings.map((finding, index) => (
                    <div key={finding.label} className="rounded-xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">{index + 1}</span>
                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{finding.label}</p>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{finding.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{finding.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold">Key Insight</h2>
                  <p className="mt-3 text-slate-600">{insightCopy[activePage].body}</p>
                  <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <p className="text-sm font-medium text-orange-700">Data takeaway</p>
                    <p className="mt-1 font-semibold">{insightCopy[activePage].takeaway}</p>
                  </div>
                  <div className="mt-4 rounded-xl bg-emerald-950 p-4 text-white">
                    <p className="text-sm text-emerald-100">Main finding</p>
                    <p className="text-lg font-bold">{insightCopy[activePage].finding}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm lg:col-span-2">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold">Which Stats Separate Wins From Losses?</h2>
                  <p className="mb-4 text-sm text-slate-500">Average shooting, rebounding, assists, and turnovers in wins compared with losses.</p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={winFactors}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stat" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="wins" name="Wins" fill="#10b981" />
                        <Bar dataKey="losses" name="Losses" fill="#f43f5e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activePage === "winning" && (
          <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-2xl border-0 shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Win/Loss Stat Breakdown</h2>
              <p className="mb-4 text-sm text-slate-500">The same win/loss comparison in table form for quick scanning.</p>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-emerald-50 text-emerald-900">
                    <tr>
                      <th className="px-4 py-3">Factor</th>
                      <th className="px-4 py-3">Wins</th>
                      <th className="px-4 py-3">Losses</th>
                      <th className="px-4 py-3">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {winFactors.map((row) => (
                      <tr key={row.stat}>
                        <td className="px-4 py-3 font-medium">{row.stat}</td>
                        <td className="px-4 py-3">{row.stat.includes("%") ? `${row.wins}%` : row.wins}</td>
                        <td className="px-4 py-3">{row.stat.includes("%") ? `${row.losses}%` : row.losses}</td>
                        <td className="px-4 py-3 font-semibold">{row.difference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <Brain className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Can the Box Score Predict a Win?</h2>
              </div>
              <p className="text-slate-600">A logistic regression model trained on the 35 game rows predicts win/loss outcomes from shooting, rebounding, assists, turnovers, and location.</p>
              <p className="mt-2 text-sm text-slate-500">Because this is a small season sample, the model should be read as exploratory evidence, not a production-grade forecast.</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-sm text-emerald-700">Model</p><p className="font-bold">Logistic Regression</p></div>
                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-sm text-orange-700">Training Accuracy</p>
                  <p className="font-bold">{logisticModel.accuracy}%</p>
                  <p className="mt-1 text-xs text-slate-500">{logisticModel.correct} of {logisticModel.total} games classified correctly</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">Filtered Profile</p>
                  <p className="font-bold">{filteredWinProbability}% win probability</p>
                  <p className="mt-1 text-xs text-slate-500">Based on the current filter averages</p>
                </div>
                <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                  <p className="text-sm text-violet-700">Top Predictors</p>
                  <p className="font-bold">{predictorSummary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {activePage === "winning" && (
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Which Inputs Matter Most to the Model?</h2>
              <p className="mb-4 text-sm text-slate-500">Positive coefficients push the prediction toward a win. Negative coefficients push it toward a loss after the features are standardized.</p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {logisticModel.topPredictors.map((predictor) => (
                  <div key={predictor.key} className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">{predictor.label}</p>
                    <p className={`mt-1 text-xl font-bold ${predictor.weight >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {predictor.weight >= 0 ? "+" : ""}{predictor.weight.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{coefficientLabel(predictor.weight)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Technical Project Summary</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><Database className="mb-2 h-5 w-5 text-emerald-700" /><p className="font-semibold">Data Cleaning</p><p className="text-sm text-slate-600">Cleaned box-score data with Python and Pandas.</p></div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4"><BarChart3 className="mb-2 h-5 w-5 text-orange-700" /><p className="font-semibold">Visualization</p><p className="text-sm text-slate-600">Built charts for team trends and player analysis.</p></div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><Brain className="mb-2 h-5 w-5 text-blue-700" /><p className="font-semibold">Machine Learning</p><p className="text-sm text-slate-600">Predicted wins using game-level performance stats.</p></div>
              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4"><Github className="mb-2 h-5 w-5 text-violet-700" /><p className="font-semibold">GitHub Portfolio</p><p className="text-sm text-slate-600">Documented the project with README and screenshots.</p></div>
            </div>
          </CardContent>
        </Card>

        <p className="pb-4 text-center text-xs text-slate-500">
          Data source:{" "}
          <a
            href="https://www.sports-reference.com/cbb/schools/miami-fl/men/2026.html"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sports Reference College Basketball, Miami (FL) Men 2025-26
          </a>
        </p>
      </div>
    </div>
  );
}
