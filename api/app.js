import express from 'express'
import cors from 'cors'
import postRouter from './routers/post.router.js';
const app= express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/api/v1/post', postRouter);

app.get('/',(req,res)=>{
    res.send('hello')
})

export { app };