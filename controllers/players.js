const playersRouter = require('express').Router();
const Player = require('../models/Player');
const Team = require('../models/Team');

const cloudinary = require('./cloudinary');
const userExtractor = require('../middleware/userExtractor');

playersRouter.get('/', userExtractor, async (req, res) => {
    Player.find({}).then(players => {
        if (players) {
            res.json(players);
        } else {
            return res.json({ message: 'Error' });
        }
    });
});


playersRouter.post('/', userExtractor, async (req, res) => {

    const file = req.files.photo;

    const image = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        folder: 'football-app'
    });

    const { name, teamId, number } = req.body;


    const player = new Player({
        name,
        imgUrl: image.url,
        team: teamId,
        goals: 0,
        number,
    });

    const playerSaved = await player.save();

    await Team.findByIdAndUpdate(
        teamId,
        { $push: { players: playerSaved._id } },
        { new: true }
    ).then(team => console.log(team));

    res.json({ playerSaved });

});


playersRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Player.findByIdAndRemove(id).then(player => {
        res.status(200);
        res.json(player);
    }).catch((err) =>
        next(err));
});


module.exports = playersRouter;