// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const items = [];
const workItems = [];

app.set("view engine", "ejs");
// Need to put set and not use here
// Do not need to require("ejs")

app.get("/", function(req, res) {

    const day = date.getDay();
    const animals = ["🐶", "🐱", "🦄", "🐳", "🐸 "]
    let list = animals[Math.floor(Math.random() * animals.length)];

    res.render("list", {
        listTitle: list,
        kindOfDay: day,
        newListItems: items
    });

});

app.get("/work", function(req, res) {
    res.render("list", {
        listTitle: list,
        kindOfDay: day,
        newListItems: workItems
    });
});

app.post("/", function(req, res) {
    const item = req.body.newItem;
    if (req.body.list === "work") {
        workItems.push(item);
        res.redirect("work");
    } else {
        items.push(item);
        res.redirect("/");
    };


});

app.post("/work", function(req, res) {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});