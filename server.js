const express = require("express")
const mongoose = require("mongoose")
const User = require("./user-model")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const app = express()
    
mongoose.connect("mongodb://localhost:27017/passport", { useNewUrlParser: true });    
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret:"Is not a very big secret right now but im enjoying building",
    resave: false,
    saveUninitialized: false
}));


//Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Routes
app.get("/",function(req, res){
   res.render("home"); 
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

app.get("/register", function(req, res){
    res.render("register");
});

// Handling user sign up
app.post("/register", function(req, res){
   console.log(req.body.username);
    console.log(req.body.password); 
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

// Login Form
app.get("/login", function(req, res){
    res.render("login");
});

// Login Middleware
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    
});

// Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

// check isLoggedIn
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// No need for isNotLoggedIn


app.listen(4000, () => {
    console.log("app running on 4000")
});