import express from 'express';
import urlRouter from './routes/url';
import mongoose from 'mongoose';
import path from 'path';
import signRouter from './routes/user';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middlewares/restrict';
import { handleRedirect } from './controllers/redirect';
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URL = process.env.MONGO_URI;

if (!MONGODB_URL) {
  throw new Error("MONGO_URI is not defined in .env file");
}

mongoose.connect(`${MONGODB_URL}`)
.then((r)=>console.log('mongoDB connected!'))
.catch((e)=>console.log('not connected'))

const app = express()
const PORT = 8000;


app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

// app.set('views', path.resolve('./views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.set('views', path.join(__dirname,'..', 'views'));
app.use('/url', verifyToken, urlRouter);
app.use('/auth', signRouter);
app.get('/:shortId', handleRedirect)

export default app;
