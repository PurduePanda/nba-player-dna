import { useEffect, useState } from "react";
import "./App.css";

function euclideanDistance(
  playerA: Player,
  playerB: Player,
  features: string[]
) {
  let squaredDifferenceSum = 0;

  for (const feature of features) {
    const difference =
      playerA.scaled_features[feature] -
      playerB.scaled_features[feature];

    squaredDifferenceSum += difference ** 2;
  }

  return Math.sqrt(squaredDifferenceSum);
}

function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [playerAName, setPlayerAName] = useState("");
  const [playerBName, setPlayerBName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/nba_player_similarity_data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load NBA player data.");
        }

        return response.json();
      })
      .then((json: AppData) => {
        setData(json);

        if (json.players.length >= 2) {
          setPlayerAName(json.players[0].name);
          setPlayerBName(json.players[1].name);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Loading NBA player data...</p>;
  }

  const playerA = data.players.find(
    (player) => player.name === playerAName
  );

  const playerB = data.players.find(
    (player) => player.name === playerBName
  );

  const distance =
    playerA && playerB
      ? euclideanDistance(
        playerA,
        playerB,
        data.metadata.features
      )
      : null;

  const sortedPlayers = [...data.players].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <main className="app">
      <h1>NBA Player DNA</h1>
      <p>
        Compare NBA Players Using Standardized Statistical Profiles.
      </p>

      <div className="selectors">
        <label>
          Player A

          <select
            value={playerAName}
            onChange={(event) =>
              setPlayerAName(event.target.value)
            }
          >
            {sortedPlayers.map((player) => (
              <option key={player.name} value={player.name}>
                {player.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Player B

          <select
            value={playerBName}
            onChange={(event) =>
              setPlayerBName(event.target.value)
            }
          >
            {sortedPlayers.map((player) => (
              <option key={player.name} value={player.name}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {playerA && playerB && distance !== null && (
        <section className="distance-card">
          <h2>
            {playerA.name} vs. {playerB.name}
          </h2>
          
          <div className="archetype-comparison">
            <div>
              <h3>{playerA.name}</h3>
              <p>{playerA.team}</p>
              <p>
                <strong>Archetype:</strong> {playerA.archetype}
              </p>
            </div>

            <div>
              <h3>{playerB.name}</h3>
              <p>{playerB.team}</p>
              <p>
                <strong>Archetype:</strong> {playerB.archetype}
              </p>
            </div>
          </div>

          <p className="distance">
            {distance.toFixed(3)}
          </p>

          <p>
            Euclidean distance -- lower means more statistically similar.
          </p>

          <p>
            {playerA.archetype === playerB.archetype
              ? "These players belong to the same statistical archetype."
              : "These players belong to different statistical archetypes."}
          </p>
        </section>
      )}

      {playerA && playerB && (
        <section>
          <h2>Statistical Comparison</h2>

          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>{playerA.name}</th>
                <th>{playerB.name}</th>
              </tr>
            </thead>

            <tbody>
              {data.metadata.features.map((feature => (
                <tr key={feature}>
                  <td>{feature}</td>

                  <td>
                    {playerA.features[feature].toFixed(3)}
                  </td>

                  <td>
                    {playerB.features[feature].toFixed(3)}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </section>
      )}

      {playerA && (
        <section>
          <h2>Players Most Similar to {playerA.name}</h2>

          <ol>
            {playerA.neighbors.slice(0, 5).map((neighbor) => (
              <li key={neighbor.player}>
                {neighbor.player} - {neighbor.distance.toFixed(3)}
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}

export default App;

type Neighbor = {
  player: string;
  distance: number;
};

type Player = {
  name: string;
  team: string;
  age: number;
  minutes: number;

  cluster: number;
  archetype: string;

  features: Record<string, number>;
  scaled_features: Record<string, number>;
  neighbors: Neighbor[];
};

type Metadata = {
  season: string;
  minimum_minutes: number;
  metric: string;
  features: string[];
  number_of_players: number;
};

type AppData = {
  metadata: Metadata;
  players: Player[];
};