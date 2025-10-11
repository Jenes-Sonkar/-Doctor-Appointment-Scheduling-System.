


// import connectDB from "./db/index.js";
// import dotenv from "dotenv";

// dotenv.config({
//     path: "./.env"
// });

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
// connectDB()
//     .then(() => {
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });
//     })
//     .catch((error) => {
//         console.error("Error connecting to MongoDB:", error);
//         throw error;
//     });
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
