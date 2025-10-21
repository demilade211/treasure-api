import  express from "express";
//import morgan from "morgan"
import errorMiddleware from "./middlewares/errorsMiddleware"
import auth from "./routes/auth"    
import cors from "cors"; 
import fileUpload from "express-fileupload"
import products from "./routes/product.js" 




const app = express();

app.use(cors());
//app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));//to handle url encoded data 
app.use(fileUpload({
    useTempFiles : true
}));

app.use('/api/v1',auth);   
app.use('/api/v1',products); 



//Middleware to handle errors
app.use(errorMiddleware);

export default app;