


import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

/*const app = express();
( async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
          
        app.on("error", (error) => {
            console.error("Express error:", error);
            throw error;
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
})(); */
connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    });