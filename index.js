const expressEdge = require("express-edge");
const express = require("express");
const edge = require("edge.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const connectFlash = require("connect-flash");
const flash = require('express-flash');


const createPostController = require("./controllers/createPost");
const homePageController = require("./controllers/homePage");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const createUserController = require("./controllers/createUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");
const eventsController = require("./controllers/events");
const menuController = require("./controllers/menu");
const reserveController = require("./controllers/reserve");
const checkoutController = require("./controllers/checkout");
const ordersControllers = require("./controllers/orders");
const galleryController = require("./controllers/gallery");
const myordersController = require("./controllers/myorders")

const app = new express();
mongoose.connect("mongodb://localhost/ofcs");

app.use(connectFlash());

const mongoStore = connectMongo(expressSession);

app.use(
  expressSession({
    secret: "secret",
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.use(flash());

app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set("views", `${__dirname}/views`);

app.use("*", (req, res, next) => {
  edge.global("auth", req.session.userId);
  next();
});

app.use("*", (req, res, next) => {
  edge.global("admin", req.session.email === "admin@ofcs.com");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const auth = require("./middleware/auth");
const admin = require("./middleware/admin");
const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");

app.get("/", homePageController);
app.get("/posts", admin, getPostController);
app.get("/auth/logout", auth, logoutController);
app.get("/posts/new", auth, createPostController);
app.post("/posts/store", auth, storePostController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/events", eventsController);
app.get("/menu", menuController);
app.get("/reserve", reserveController);
app.post("/checkout", auth, checkoutController)
app.get("/orders", admin, ordersControllers)
app.get("/gallery", galleryController);
app.get('/myorders', myordersController)
app.use((req, res) => res.render('not-found'));


app.listen(4000, () => {
  console.log("App listening on port 4000");
});
