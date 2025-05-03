import requests
import json

# Fetch NBA Leaders based on Stat Category (e.g., Points, Rebounds, Assists)
def fetch_leaders(stat='PTS'):
    url = f'https://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2024-25&SeasonType=Regular+Season&StatCategory={stat}'
    
    headers = {
        'Accept': 'application/json',
        'x-nba-stats-origin': 'stats',
        'x-nba-stats-token': 'true',
        'Referer': 'https://www.nba.com/',
        'User-Agent': 'Mozilla/5.0'
    }
    
    try:
        response = requests.get(url, headers=headers)
        data = response.json()

        if 'resultSet' in data and 'rowSet' in data['resultSet']:
            players = data['resultSet']['rowSet']
            leaders = [{'name': player[2], 'team': player[3], 'stat': player[4]} for player in players]

            # Save the results to a JSON file
            with open('leaders.json', 'w') as outfile:
                json.dump(leaders, outfile, indent=2)
            
            print('Data saved to leaders.json')

    except Exception as e:
        print(f'Error fetching data: {e}')

# Fetch points leaders (PTS) for the season
fetch_leaders('PTS')
