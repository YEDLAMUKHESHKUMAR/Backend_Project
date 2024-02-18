//                       BUG  : Fix validateListing  in update route
//                      Add new feature : Try to display listings created by curr User seperately :)   ....
//                      ans1 .) may be .. in new page...traverse through each listing and if curruser id === owner id .. then print it
//                      ans2 .) another way is to store the listing id in currUser by ref while creating new listing . And then simply traverse listings (and populate it )present in currUser  .
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //  for boiler plate

const { listingSchema } = require("./schema.js");
// const {reviewSchema} = require("./schema.js");

// utilities
// const wrapAsync =  require("./utility/wrapAsync.js");
const ExpressError = require("./utility/ExpressError.js");

// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//sessions
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const MongoStore = require("connect-mongo");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connnected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // expiry date for cookie...
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // security purposes (to prevent from cross scripting attacks )
  },
};

app.use(session(sessionOptions));
app.use(flash()); // use flash first..then routes...

// implement passport below the sessions .. it also requires sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // to keep track whether user logged in or not
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user; // curr logged in user or undefined user
  // this middle ware will be callled every time when route updates...but the success message will be stored into locals whenever the new listing is created
  // res.locals.successMsg = req.flash("error");
  next();
});

// accessing all  routes by below line
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(
    new ExpressError(
      404,
      "Sorry ,but we can't find the page you are looking for"
    )
  );
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  err.image = "/images/404error.png";
  // res.status(status).send(message);
  res.status(status).render("errors.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
