/* eslint-disable no-undef */
// noinspection JSUnresolvedReference

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from "axios";


dotenv.config();


const app = express();
const corsOptions = {
    origin: true,
    credentials: true,
    allowedOrigins: ['http://localhost:5173', 'https://photosearch-czwn.onrender.com'],
};

const axiosInstance = axios.create({
    baseURL: 'https://api.unsplash.com'
});



// middlewares
app.use(express.json());
app.use(cors(corsOptions));


// get random posts
app.post('/get-random-photos', async (req, res) => {
    setTimeout(async ()=>{
        try {
            let count = 10; // get those results count
            let response = await axiosInstance.get(
                `/photos/random?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}&count=${count}`
            );

            // console.log(response.headers['x-ratelimit-remaining'])

            return res.status(200).json({
                response: response.data,
            });
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            // console.log(e)
            return res.status(400).json({
                response: 'An unexpected error occurred while getting the photos'
            });
        }
    }, 1000);
});


// get photos based on user input
app.post('/get-photos', async (req, res) => {
   setTimeout(async ()=>{
       try{
           let {query, page} = req.body;
           let perPage = 10;
           let response = await axiosInstance.get(
               `/search/photos/?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}&query=${query}&per_page=${perPage}&page=${page}`
           );

           // console.log(response.headers['x-ratelimit-remaining'])

           return res.status(200).json({
               response: response.data,
           });
           // eslint-disable-next-line no-unused-vars
       } catch (e) {
           return res.status(400).json({
               response: 'An unexpected error occurred while getting the photos!'
           });
       }
   }, 1000);
});


app.listen(process.env.PORT, () => {
    console.log(`Server is Listening on port ${process.env.PORT}`);
});
