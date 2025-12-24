import  express from "express";
//import morgan from "morgan"
import errorMiddleware from "./middlewares/errorsMiddleware"
import auth from "./routes/auth"    
import cors from "cors"; 
import fileUpload from "express-fileupload"
import products from "./routes/product.js" 
import payment from "./routes/payment.js" 
import webhook from "./routes/webhook.js"
import order from "./routes/order.js"
import admin from "./routes/admin.js"
import user from "./routes/user.js" 
import contact from "./routes/contanct.js"




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
app.use('/api/v1/payment',payment); 
app.use('/api/v1/webhook',webhook);
app.use('/api/v1/order',order);
app.use('/api/v1/admin',admin);
app.use('/api/v1/user',user);
app.use('/api/v1',contact);



//Middleware to handle errors
app.use(errorMiddleware);

export default app;