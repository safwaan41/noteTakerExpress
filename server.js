const express = require(`express`);
const path = require(`path`);
const db = require(`./db/db.json`);
const fs = require(`fs`);
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.static(`public`));