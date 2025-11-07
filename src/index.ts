import express from 'express';
import urlRouter from './routes/url';
import mongoose from 'mongoose';
import path from 'path';
import signRouter from './routes/user';
import cookieParser from 'cookie-parser';
import { restrictLoggedInUserOnly } from './middlewares/restrict';
import URL from './models/url';
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
app.use('/url', restrictLoggedInUserOnly, urlRouter);
app.use('/auth', signRouter);
app.get('/:shortId', async (req,res)=>{
    const mainUrl = await URL.findOneAndUpdate(
      { shortID: req.params.shortId },
      {
        $push: { visitHistory: Date.now() },
      }
    );
    if(!mainUrl || !mainUrl.redirectUrl){
      res.send('no url registered for this token !');
      return;
    }
    if (
      mainUrl.redirectUrl.startsWith("http://") ||
      mainUrl.redirectUrl.startsWith("https://")
    ) {
      res.redirect(mainUrl?.redirectUrl);
    } else res.redirect("http://" + mainUrl.redirectUrl);
    return;
})

app.listen(PORT,'0.0.0.0',()=>console.log(`server started at port : ${PORT}`));
