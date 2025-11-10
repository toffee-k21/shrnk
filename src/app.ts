import express from 'express';
import urlRouter from './routes/url';
import path from 'path';
import signRouter from './routes/user';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middlewares/restrict';
import { handleRedirect } from './controllers/redirect';
import dotenv from "dotenv";

dotenv.config();

const app = express()
const PORT = 8000;


app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/url', verifyToken, urlRouter);
app.use('/auth', signRouter);
app.get('/:shortId', handleRedirect)

export default app;
