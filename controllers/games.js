const gamesRouter = require('express').Router();
const Game = require('../models/Game');
const Team = require('../models/Team');
const Player = require('../models/Player');
const userExtractor = require('../middleware/userExtractor');

gamesRouter.post('/', userExtractor, async (req, res) => {

    const { teamOneId, teamTwoId, teamOneGoals, teamTwoGoals, teamOneGoalScorers, teamTwoGoalScorers } = req.body;


    const scorers = [...JSON.parse(teamOneGoalScorers), ...JSON.parse(teamTwoGoalScorers)];


    for (let scorer of scorers) {
        const player = await Player.findById(scorer.player);
        player.goals += scorer.amount;
        player.save();
    }


    const game = new Game({
        teamOneId,
        teamTwoId,
        teamOneGoals,
        teamTwoGoals,
    });

    await game.save();


    const teamOne = await Team.findById(teamOneId);
    const teamTwo = await Team.findById(teamTwoId);

    teamOne.goalsFor += teamOneGoals;
    teamOne.goalsAgainst += teamTwoGoals;
    teamTwo.goalsFor += teamTwoGoals;
    teamTwo.goalsAgainst += teamOneGoals;


    if (teamOneGoals > teamTwoGoals) {
        teamOne.wins += 1;
        teamTwo.loses += 1;
    } else if (teamOneGoals < teamTwoGoals) {
        teamOne.loses += 1;
        teamTwo.wins += 1;
    } else {
        teamOne.ties += 1;
        teamTwo.ties += 1;
    }


    const getResult = (goalsFor, goalsAgainst) => {
        if (goalsFor > goalsAgainst) return 'WIN';
        if (goalsFor < goalsAgainst) return 'LOSS';
        return 'TIE';
    };

    teamOne.gameHistory.push({
        opponent: teamTwoId,
        goalsFor: teamOneGoals,
        goalsAgainst: teamTwoGoals,
        result: getResult(teamOneGoals, teamTwoGoals)
    });
    teamTwo.gameHistory.push({
        opponent: teamOneId,
        goalsFor: teamTwoGoals,
        goalsAgainst: teamOneGoals,
        result: getResult(teamTwoGoals, teamOneGoals)
    });

    await teamOne.save();
    await teamTwo.save();


    res.send(req.body);

});
module.exports = gamesRouter;