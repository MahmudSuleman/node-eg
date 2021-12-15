const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, () => {
    console.log("connected to database");
});

const todoSchema = new mongoose.Schema({
    title: String,
    body: String,
    isCompleted: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/todo", async (req, res) => {
    // res.send("hello world");
    const todos = await Todo.find();
    res.send(todos);
});

app.post("/todo", async (req, res) => {
    try {
        const {title, body, isCompleted} = req.body;
        const todo = new Todo();
        todo.title = title;
        todo.body = body;
        todo.isCompleted = isCompleted;

        const t = await todo.save();

        res.send(t);
    } catch (err) {
        res.send(err);
    }
});

app.listen(process.env.PORT, () => {
    console.log("running on port " + process.env.PORT);
});
