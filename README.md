# Oracle server for Bet zk application.

This server is designed as a trustworthly oracle for Bet application. It generates a list of bets that the user will interact with..

For simplicity and easy testability the ability to manage the server using endpoints has been added.

It consists of 3 endpoints.
<ul>
  <li>http://localhost:3005/bets - Returning the list of bets</li>
  <li>http://localhost:3005/generate - reset current bets to original state</li>
  <li>http://localhost:3005/reveal - reveal results of <b>all</b> bets</li>
  <li>http://localhost:3005/reveal?id=? - reveal the result of a bet with id ?</li>
</ul>

## Example of the response:
```json
{
    "ongoing_bets": [
        {
            "id": 5,
            "name": "Nederland vs Argentina",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            "bet_options": [
                {
                    "id": 0,
                    "name": "Nederland win",
                    "description": "Bla bla bla"
                },
                {
                    "id": 1,
                    "name": "Argentina win",
                    "description": "Bla bla bla"
                },
                {
                    "id": 2,
                    "name": "Friendship win",
                    "description": "Bla bla bla"
                }
            ],
            "bet_start_date": 1670432339469,
            "bet_end_date": 1671641939469,
            "signature": {
                "r": "23412849819103184894354932645701167514486239495838504271261008245980765234646",
                "s": "15471975523651820969534203861385100194919597160777092194943797832419565817636"
            }
        },
        ...
    ]
}
```

## Steps to lauch the app
<ol>
  <li>npm install</li>
  <li>tsc && node .</li>
  <li>Run anywhere http://localhost:3005/generate, so new bets will be generated</li>
  <li>Make your bet (in the app)</li>
  <li>Find out who won: http://localhost:3005/reveal?id=6</li>
  <li>Claim your reward if you won (in the app)!!!</li>
</ol>

<b>Note</b>: to win 100% you could choose the bet with id 5 and the bet option with id 0. You could find a template in the template.json file. 
