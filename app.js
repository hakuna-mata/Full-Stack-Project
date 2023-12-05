if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);
const express = require("express");
const app  = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


// const wrapAsync = require("./utils/wrapAsync.js");
 const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
// const { findById } = require("./models/review.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

main().then(()=>{
    console.log("Connection successfull");
}).catch((err)=>{
    console.log(err);
})

async function main(){
//    await mongoose.connect(MONGO_URL);
      await mongoose.connect(dbUrl); 
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.listen(8080,(req,res)=>{
    console.log("App is listening on port 8080");
})

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO STORE",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

// app.get("/",(req,res)=>{
//     res.send("Root is working");
// })

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");    //Flash message
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;         //Because req.user cannot be directly accessed.
    next();
})

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Success");
// })

// const validateListing = (req,res,next)=>{
//     let result = listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//         throw new ExpressError(400,result.error);
//     }
// }

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"rohan@gmail.com",
//         username:"Rohan"
//     })
//     let newUser = await User.register(fakeUser,"rohanrohan");
//     res.send(newUser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

//Middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
})