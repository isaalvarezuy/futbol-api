const gamesRouter = require('express').Router();
const Game = require('../models/Game');
const Team = require('../models/Team');
const Player = require('../models/Player');

gamesRouter.post('/', async (req, res) => {


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

    /*  if (req.body.r1 > req.body.r2) {
        Equipo.findByIdAndUpdate(req.body.e1, { $inc: { pj: 1, pg: 1, gf: req.body.r1, gc: req.body.r2 }, historico: [...req.body.his1, "g"], hisGF: [...req.body.gf1, req.body.r1], hisGC: [...req.body.gc1, req.body.r2], vs: [...req.body.vs1, req.body.e2] }, { new: true }, (err, eq1) => {
            if (err) return res.json({ mensaje: "Error al modificar" });
            Equipo.findByIdAndUpdate(req.body.e2, { $inc: { pj: 1, pp: 1, gf: req.body.r2, gc: req.body.r1 }, historico: [...req.body.his2, "p"], hisGF: [...req.body.gf2, req.body.r2], hisGC: [...req.body.gc2, req.body.r1], vs: [...req.body.vs2, req.body.e1] }, { new: true }, (err, eq2) => {
                if (err) return res.json({ mensaje: "Error al modificar" });
                res.json([eq1, eq2]);
            })
        })
    } */
    res.send(req.body);

});
module.exports = gamesRouter;