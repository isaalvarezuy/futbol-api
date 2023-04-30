require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

//controllers
const teamsRouter = require('./controllers/teams');
const playersRouter = require('./controllers/players');
const gamesRouter = require('./controllers/games');


//middlewares
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');

const app = express();
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 5 * 2024 * 1024 }
}));

const connectionString = `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.8eqwb.mongodb.net/futbol-app?retryWrites=true&w=majority`;

mongoose.connect(
    connectionString, { useNewUrlParser: true })
    .then(() => console.log('connected'))
    .catch(e => console.log(e));


app.use(cors());
app.use(express.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
    extended: true
}));



app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.use('/players', playersRouter);
app.use('/teams', teamsRouter);
app.use('/games', gamesRouter);



app.use(notFound);
app.use(handleErrors);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;