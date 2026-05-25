// imports
import express from "express";
import morgan from "morgan";
import cors from "cors";
import {check, validationResult } from "express-validator"
import passport from "passport";
import LocalStrategy from 'passport-local';
import session from 'express-session';

import { listCourses, getUser, listPlan } from "./dao.js";

// init express
const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
};

app.use(cors(corsOptions))

passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, cb){
  const user = await getUser(email, password);

  if (!user)
    return cb(null, false, "Incorrect username or password");

  return cb(null, user);
}));

passport.serializeUser(function (user, cb){
  cb(null, user);
});

passport.deserializeUser(function (user, cb){
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()){
    return next();
  }
  console.log(req.user)
  return res.status(401).json({error: "Not authorized"});
}

app.use(session({
  secret: "shhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate("session"));

app.post("/api/sessions", passport.authenticate("local"), function(req, res){
  return res.status(201).json(req.user);
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()){
    res.json(req.user);
  }
  else{
    res.status(401).json({error: "Not authenticated"})
  }
});

app.delete("/api/sessions/current", (req, res) => {
  req.logOut(() => {
    res.end();
  });
});

app.get("/api/courses", (req, res) => {
  listCourses().then(courses => res.json(courses)).catch(() => res.status(500).end());
});

app.get("/api/plan", isLoggedIn, (req, res) => {
  listPlan(req.user.id).then(courses => res.json(courses)).catch(() => res.status(500).end());
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});