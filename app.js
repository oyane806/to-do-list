// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
const app = express();

const mongodbId = process.env.MONGODB_ID;
const mongodbKey = process.env.MONGODB_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });
mongoose.connect(`mongodb+srv://${mongodbId}:${mongodbKey}@cluster0-ernln.mongodb.net/todolistDB`, { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://" + mongodbId + ":" + mongodbKey + "@cluster0-ernln.mongodb.net/todolistDB", { useNewUrlParser: true });

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

const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);

const day = date.getDay();
const animals = ["🐶", "🐱", "🦄", "🐳", "🐸 "]
let randomAnimal = animals[Math.floor(Math.random() * animals.length)];

app.set("view engine", "ejs");
// Need to put set and not use here
// Do not need to require("ejs")

app.get("/", function(req, res) {

    Item.find(function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added!");
                }
            });
            res.redirect("/");
        } else {
            if (err) {
                console.log(err);
            } else {
                res.render("list", {
                    listTitle: randomAnimal,
                    kindOfDay: day,
                    newListItems: foundItems
                });
            }
        }
    });
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }, function(err, foundList) {
        if (!err) {
            if (foundList) {
                res.render("list", {
                    listTitle: randomAnimal,
                    kindOfDay: customListName, // Need to put the title here,to put it in ejs
                    newListItems: foundList.items
                })
            } else {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
        }
    });

});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list; // Name and value in ejs

    const item = new Item({
        name: itemName
    });

    if (listName === day) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

});


app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {


        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted!");
                res.redirect("/");
            }
        });
        // Need to use the callback function to delete successfully

    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } },
            function(err, foundList) {
                if (!err) {
                    res.redirect("/" + listName);
                }
            });
    }

});

app.post("/work", function(req, res) {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server has started successfully.");
});