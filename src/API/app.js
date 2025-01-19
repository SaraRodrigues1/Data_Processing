const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(bodyParser.json());

//incomplete
const accountsRouter = require('./routes/accountRoutes');
const genreRouter = require('./routes/genreRoutes');
const historyRouter = require('./routes/historyRoutes');
const loginRouter = require('./routes/loginRoutes');
const profileRouter = require('./routes/profileRoutes');
const contentRouter = require('./routes/contentRoutes');
const contentWarningRouter = require('./routes/contentWarningRoutes');
const recommendationRouter = require('./routes/recommendationRoutes');
const subscriptionsRouter = require('./routes/subscriptionsRoutes');
const watchingFilmRouter = require('./routes/watchingFilmRoutes');
const watchingSeriesRouter = require('./routes/watchingSeriesRoutes');

app.use('/api/accounts', accountsRouter);  
app.use('/api/genres', genreRouter);     
app.use('/api/history', historyRouter);  
app.use('/api/login', loginRouter);        
app.use('/api/profiles', profileRouter);  
app.use('/api/content', contentRouter);  
app.use('/api/recommendation', recommendationRouter);  
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/contentWarning', contentWarningRouter);
app.use('/api/watchingFilm', watchingFilmRouter);
app.use('/api/watchingSeries', watchingSeriesRouter);

module.exports = app;
