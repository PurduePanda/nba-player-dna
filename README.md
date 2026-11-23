# NBA Player DNA

NBA Player DNA is an interactive machine-learning web application for comparing NBA players based on their statistical profiles.

The project represents each player as a standardized feature vector built from 2025–26 regular-season statistics. It uses **Euclidean distance** to measure player-to-player similarity, **K-Means clustering** to identify broader statistical archetypes, and **percentile-based category scores** to make each player's statistical profile easier to interpret.

## Live Demo

**[Try NBA Player DNA][(https://nba-player-dna.vercel.app/)]**

---

## Features

### Player-to-Player Comparison

Select any two eligible NBA players and compare their statistical profiles side by side.

The application calculates the **Euclidean distance** between their standardized feature vectors.

- Lower distance = more statistically similar
- Higher distance = more statistically different
- Comparing a player with themselves produces a distance of `0.000`

The distance is intended to measure statistical similarity, not overall player quality.

### Similar Player Search

Each player has a precomputed list of their closest statistical neighbors.

This allows the application to answer questions such as:

> Which NBA players have statistical profiles most similar to Stephen Curry?

### Player Archetypes

Players are grouped using **K-Means clustering**.

Rather than relying only on traditional positions such as PG, SG, SF, PF, and C, the clustering system identifies broader groups based on how players actually produce statistically.

Each cluster is inspected using:

- standardized cluster centers
- raw feature averages
- representative players

The resulting clusters are assigned human-readable archetype names.

### Category Scores

Each player receives five category scores:

- **Scoring**
- **Playmaking**
- **Efficiency**
- **Rebounding**
- **Defensive Activity**

The scores are percentile rankings among the eligible players in the dataset.

For example:

> A Scoring score of `92` means that player's scoring composite ranks around the 92nd percentile among eligible players in the project dataset.

These scores are **not NBA 2K-style ratings** and should not be interpreted as absolute measures of player ability.

`Defensive Activity` is intentionally named this way because the available features include steals and blocks but do not fully measure overall defensive quality.

---

## Machine Learning Pipeline

The project follows this general pipeline:

```text
NBA Player Statistics
        ↓
Data Cleaning
        ↓
Minutes Eligibility Filter
        ↓
Feature Engineering
        ↓
Standardization
        ↓
9-Dimensional Player Vectors
        ↓
┌────────────────────┬────────────────────┬─────────────────────┐
│                    │                    │                     │
Euclidean Distance   K-Means Clustering   Category Composites
│                    │                    │
↓                    ↓                    ↓
Similar Players      Player Archetypes    Percentile Scores
└────────────────────┴────────────────────┴─────────────────────┘
        ↓
Application JSON
        ↓
React + TypeScript Frontend
        ↓
Vite
        ↓
Vercel
```

---

## Dataset

The project uses 2025–26 NBA regular-season player statistics.

To reduce extreme small-sample effects, players must have played at least:

```text
500 minutes
```

After filtering, the similarity system contains approximately **378 eligible players**.

The application uses preprocessed data, so the React frontend does not need to make live NBA API requests.

---

## Feature Engineering

The final model uses nine features:

| Feature | Description |
|---|---|
| `FGA_36` | Field-goal attempts per 36 minutes |
| `3PA_RATE` | Three-point attempts divided by field-goal attempts |
| `FTA_RATE` | Free-throw attempts divided by field-goal attempts |
| `TS_PCT` | True shooting percentage |
| `AST_36` | Assists per 36 minutes |
| `TOV_36` | Turnovers per 36 minutes |
| `REB_36` | Rebounds per 36 minutes |
| `STL_36` | Steals per 36 minutes |
| `BLK_36` | Blocks per 36 minutes |

Per-36 statistics help reduce the effect of differences in total playing time and allow players to be compared on a more similar playing-time basis.

---

## Standardization

Before similarity calculations and clustering, the features are standardized using scikit-learn's `StandardScaler`.

For each feature:

```text
z = (x - mean) / standard deviation
```

This gives the features comparable numerical scales.

Without standardization, a feature with naturally larger numerical values could have an unfairly large influence on Euclidean distance or K-Means clustering.

---

## Similarity Model

NBA Player DNA uses **Euclidean distance** on the standardized nine-dimensional feature vectors.

For players \(A\) and \(B\):

```text
distance(A, B) =
sqrt(
    (A1 - B1)^2 +
    (A2 - B2)^2 +
    ...
    (A9 - B9)^2
)
```

During development, both **cosine similarity** and **Euclidean distance** were evaluated.

After manually reviewing nearest-neighbor results across players with different statistical profiles, Euclidean distance produced more convincing comparisons for the final feature representation and was selected as the primary similarity metric.

The evaluation was based on basketball plausibility rather than a labeled ground-truth similarity dataset.

---

## K-Means Archetypes

K-Means clustering is applied to the same standardized feature representation used by the similarity model.

Unlike nearest-neighbor search:

```text
Euclidean nearest neighbors
→ Which individual players are most similar?

K-Means clustering
→ Which broader statistical group does this player belong to?
```

Cluster count selection considered:

- inertia
- silhouette score
- cluster sizes
- basketball interpretability

The algorithm itself only produces numerical cluster IDs. Human-readable archetype names are assigned after examining the statistical characteristics and representative players within each cluster.

---

## Category Score Methodology

Category scores are constructed from standardized features and then converted into percentile rankings.

### Scoring

Uses:

```text
FGA_36
FTA_RATE
TS_PCT
```

This represents a combination of scoring volume, free-throw pressure, and scoring efficiency.

### Playmaking

Uses:

```text
AST_36
TOV_36
```

Higher assist production increases the score while higher turnover production reduces it.

### Efficiency

Uses:

```text
TS_PCT
```

### Rebounding

Uses:

```text
REB_36
```

### Defensive Activity

Uses:

```text
STL_36
BLK_36
```

After calculating the category composites, players are ranked against the rest of the eligible dataset and converted to percentile scores from approximately `0–100`.

---

## Technology Stack

### Machine Learning / Data

- Python
- pandas
- NumPy
- scikit-learn
- Matplotlib
- Google Colab

### Frontend

- React
- TypeScript
- Vite
- CSS

### Development / Deployment

- Git
- GitHub
- Vercel

---

## Project Structure

```text
nba-player-dna/
│
├── data/
│   ├── raw/
│   │   └── nba_player_stats_2526.csv
│   │
│   └── processed/
│       ├── nba_2025_26_v2_features.csv
│       ├── nba_2025_26_v2_scaled_features.csv
│       ├── nba_2025_26_v2_features_with_clusters.csv
│       └── nba_player_similarity_data.json
│
├── notebooks/
│   └── ...
│
├── ml/
│
├── web/
│   ├── public/
│   │   └── data/
│   │       └── nba_player_similarity_data.json
│   │
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## Running the Web App Locally

### Prerequisites

Install:

- Git
- Node.js
- npm

### 1. Clone the repository

```bash
git clone https://github.com/PurduePanda/nba-player-dna.git
```

### 2. Enter the React application

```bash
cd nba-player-dna/web
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Vite will provide a local URL, typically:

```text
http://localhost:5173
```

---

## Production Build

To verify the production version locally:

```bash
npm run build
```

Then:

```bash
npm run preview
```

The generated production files are stored in:

```text
web/dist/
```

---

## Deployment

The frontend is deployed using **Vercel**.

Because the React/Vite application is located inside the `web` directory, the Vercel project uses:

```text
Root Directory: web
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

The application JSON is stored under:

```text
web/public/data/
```

and is loaded by the frontend using:

```text
/data/nba_player_similarity_data.json
```

---

## Design Decisions

### Why no backend?

The dataset contains only a few hundred eligible players, and the expensive ML preprocessing can be completed ahead of time.

The application therefore precomputes the required information and exports it to JSON.

This keeps the final architecture simple:

```text
Python preprocessing
        ↓
JSON
        ↓
React
```

No database or API server is required for the current scope.

### Why not use traditional positions?

Traditional positions can hide similarities between players who produce in comparable ways despite playing different listed positions.

The project instead focuses on statistical behavior.

### Why Euclidean distance?

The final player representation uses standardized features, making Euclidean distance a natural way to measure absolute closeness across the feature dimensions.

### Why percentile category scores?

Percentiles are easier to interpret than raw standardized values while still maintaining a clear statistical meaning relative to the dataset.

---

## Limitations

NBA Player DNA measures similarity only through the statistics included in the feature representation.

It does not directly account for factors such as:

- defensive positioning
- shot-location detail
- lineup context
- opponent quality
- role changes during the season
- injuries
- playoff performance
- tracking data
- player height or position
- qualitative basketball skills not represented in the dataset

Two players being statistically similar does **not** mean they have identical playing styles or equivalent overall ability.

The archetypes and category scores should therefore be interpreted as descriptions of the available statistical profiles rather than definitive evaluations of players.

---

## What I Learned

This project was built to practice the complete process of turning a machine-learning idea into a usable software product.

Major concepts included:

- cleaning real-world sports data
- feature engineering
- per-36 normalization
- rate statistics
- feature standardization
- multidimensional vectors
- cosine similarity
- Euclidean distance
- nearest-neighbor search
- K-Means clustering
- silhouette score and inertia
- percentile-based feature interpretation
- exporting ML results for application use
- React state and data fetching
- TypeScript data modeling
- responsive UI development
- Git/GitHub workflow
- production deployment with Vercel

The final result connects the machine-learning pipeline directly to an interactive application rather than leaving the analysis inside a notebook.

---

## Author

Patrick  
Computer Science — Purdue University

---

## License

This project is intended for educational and portfolio purposes.
