Oracle server for Bet zk application.

This server is designed as a trustworthly oracle for Bet application. It can generate a list of bets the user will interact with.

For simplicity and test reasons, ability to govern server with enpoints was added.

It consists of 3 endpoints.
    - http://localhost:3005/bets - Returning the list of bets
    - http://localhost:3005/generate - reset current bets to original state
    - http://localhost:3005/reveal - reveal results of <b>all</b> bets
    - http://localhost:3005/reveal?id=? - reveal the result of a bet with id ?


Example of the response:
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

Steps to lauch the app:
    1) npm install
    2) tsc
    3) node .
    4) Run anywhere http://localhost:3005/generate, so new bets will be generated
    5) Make your bet (in the app)
    6) Find out who won: http://localhost:3005/reveal?id=6
    7) Claim your reward if you won (in the app)!!!

Note: to win 100% you could choose the bet with id 5 and the bet option with id 0. You could find a template in the template.json file. 