# NBA Player DNA

NBA Player DNA is a machine learning project that measures statistical similarity between NBA players.

The project represents each eligible NBA player using engineered basketball features and finds the nearest statistical neighbors using standardized Euclidean distance.

## Current Status

The initial machine learning pipeline is complete.

Current functionality includes:

- 2025–26 NBA player data
- Minimum 500-minute eligibility filter
- Per-36 feature engineering
- Shooting tendency and efficiency features
- Feature standardization
- Euclidean-distance player comparison
- Nearest-player search
- Precomputed application-ready JSON data

## Similarity Features

The current model uses nine features:

- Field goal attempts per 36 minutes (`FGA_36`)
- Three-point attempt rate (`3PA_RATE`)
- Free-throw attempt rate (`FTA_RATE`)
- True shooting percentage (`TS_PCT`)
- Assists per 36 minutes (`AST_36`)
- Turnovers per 36 minutes (`TOV_36`)
- Rebounds per 36 minutes (`REB_36`)
- Steals per 36 minutes (`STL_36`)
- Blocks per 36 minutes (`BLK_36`)

## How Similarity Works

Player features are standardized using `StandardScaler`.

Each player is represented as a nine-dimensional feature vector.

Euclidean distance is then calculated between player vectors.

A lower Euclidean distance indicates that two players have more similar statistical profiles.

The model is designed to measure statistical similarity, not overall player quality.

## Project Structure

```text
nba-player-dna/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   └── nba_player_similarity.ipynb
├── ml/
├── web/
├── .gitignore
├── README.md
└── requirements.txt
```

## Development Progress

### Completed

- Data collection and cleaning
- Minimum-minute filtering
- Per-36 normalization
- Feature engineering
- Feature standardization
- Comparison of cosine similarity and Euclidean distance
- Selection of Euclidean distance as the primary metric
- Nearest-neighbor player search
- Application-ready JSON export

### Next Steps

- Convert notebook code into reusable Python modules
- Build the React frontend
- Create a player-vs-player comparison interface
- Add player archetypes using clustering
- Add similarity explanations and visualizations
- Deploy the completed application

## Tech Stack

- Python
- Pandas
- NumPy
- scikit-learn
- Jupyter / Google Colab
- React (planned)
- Git / GitHub

## Project Goal

The long-term goal is to create an interactive website where users can compare NBA players, explore statistically similar players, discover player archetypes, and better understand how different players relate within a multidimensional statistical space.