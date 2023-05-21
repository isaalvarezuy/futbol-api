const teamsRouter = require('express').Router();
const Team = require('../models/Team');
const Player = require('../models/Player');


const cloudinary = require('./cloudinary');
const userExtractor = require('../middleware/userExtractor');

teamsRouter.get('/', async (req, res) => {
    Team.find({}).populate({
        path: 'players',
        select: '-team'
    }).populate({
        path: 'gameHistory.opponent',
        select: 'name'
    }).then(teams => {
        if (teams) {
            res.json(teams);
        } else {
            return res.json({ message: 'Error' });
        }
    });
});

teamsRouter.post('/', userExtractor, async (req, res, next) => {

    const file = req.files.crest;

    const image = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        folder: 'football-app'
    });

    const team = new Team({
        name: req.body.name,
        imgUrl: image.url,
        goalsFor: 0,
        goalsAgainst: 0,
        ties: 0,
        loses: 0,
        games: 0,
        wins: 0,
        gameHistory: [],
    });


    try {
        const savedTeam = await team.save();
        res.json(savedTeam);
    } catch (error) {
        next(error);
    }
});

teamsRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    Team.findById(id).populate({
        path: 'players',
        select: '-team'
    }).populate({
        path: 'gameHistory.opponent',
        select: 'name imgUrl'
    }).then(team => {
        if (team) {
            return res.json(team);
        } else {
            return res.status(404).end();
        }
    }).catch((err) =>
        next(err)
    );
});

teamsRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Team.findByIdAndRemove(id).then(team => {
        if (!team) {
            res.status(404).end();
        }

        Player.deleteMany({ team: id }).then(
            r => {
                console.log(r);
            }
        ).catch(err => console.log(err));
        res.json(team);
        res.status(204).end();
    }
    ).catch(err => next(err));

});


module.exports = teamsRouter;