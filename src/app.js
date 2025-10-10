import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials:true
    }
)) // .use used for middlewares configuration




export{app}