var createError = require("http-errors");
var express = require("express");
var path = require("path");
var dotent = require("dotenv").config();
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expresSession = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const usermodel = require("./Models/usersModel");
const productRouter = require("./routes/productRouts");
const userRouter = require("./routes/usersRouts");
const cartRouter = require("./routes/cartRouts");
var indexRouter = require("./routes/indexRouts");
var AdminRouter = require("./routes/adminRouts");
var AuthRouter = require("./routes/authRouts");

var app = express();
// const sessionStore = new MongoStore({
//   mongoUrl: process.env.MONGO_URL2,
//   collectionName: "session",
// });
app.use(
  expresSession({
    resave: false,
    saveUninitialized: false,
    // store: sessionStore,
    secret: process.env.SESSION_SECRATE,
    cookie: {
      maxAge: 24 * 60 * 60 * 100,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/admin", AdminRouter);
app.use("/auth", AuthRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
