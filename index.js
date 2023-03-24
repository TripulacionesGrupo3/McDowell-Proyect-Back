const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors())
require('dotenv').config()
const port = 8080;
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/api", require("./routes"));
app.get ("/", function(req, res){
  res.sendStatus(200)
})


app.listen(port, () => {
    console.log(`Todo funcionando en el puerto http://localhost:${port}`);
  });
