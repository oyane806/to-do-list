// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "item1"
});

const item2 = new Item({
    name: "item2"
});

const defaultItems = [item1, item2];





// const items = [];
// const workItems = [];

app.set("view engine", "ejs");
// Need to put set and not use here
// Do not need to require("ejs")

app.get("/", function(req, res) {

    const day = date.getDay();
    const animals = ["🐶", "🐱", "🦄", "🐳", "🐸 "]
    let list = animals[Math.floor(Math.random() * animals.length)];

    Item.find(function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added");
                }
            });
            res.redirect("/");
        } else {
            if (err) {
                console.log(err);
            } else {
                res.render("list", {
                    listTitle: list,
                    kindOfDay: day,
                    newListItems: foundItems
                });
            }

        }

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
    const itemName = req.body.newItem;

    if (req.body.list === "work") {
        workItems.push(item);
        res.redirect("work");
    } else {
        const item = new Item({
            name: itemName
        });
        item.save();
        res.redirect("/");
    };


});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    console.log(checkedItemId);
    Item.findByIdAndRemove(checkedItemId, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("deleted");
            res.redirect("/");

        }
    });
    // Need to use the callback function to delete successfully
});

app.post("/work", function(req, res) {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});