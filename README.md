\# NBA Player DNA



NBA Player DNA is a machine-learning project that measures statistical similarity between NBA players.



The project represents each eligible NBA player using engineered basketball features and determines the nearest statistical neighbors using standardized Euclidean distance.



\## Current Status



The initial machine-learning pipeline is complete.



Current functionality includes:



\- 2025-26 NBA player data

\- minimum 500-minute eligibility filter

\- per-36 feature engineering

\- shooting and efficiency rate features

\- feature standardization

\- Euclidean-distance player comparison

\- nearest-player search

\- precomputed application-ready JSON data



\## Current Feature Set



The similarity model currently uses:



\- FGA per 36 minutes

\- 3PA rate

\- FTA rate

\- true shooting percentage

\- assists per 36

\- turnovers per 36

\- rebounds per 36

\- steals per 36

\- blocks per 36



\## Similarity Method



Player features are standardized using StandardScaler.



Similarity is measured using Euclidean distance in standardized feature space.



Lower distance means two players have more similar statistical profiles.



\## Project Structure



```text

data/

&#x20;   raw/

&#x20;   processed/



notebooks/

&#x20;   nba\_player\_similarity.ipynb



ml/

web/

