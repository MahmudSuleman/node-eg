const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cors());

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, () => {
  console.log("connected to database");
});

const todoSchema = new mongoose.Schema({
  title: String,
  body: String,

  isCompleted: { type: Boolean, default: false },
});

const Todo = mongoose.model("todo", todoSchema);

app.get("/todo", async (req, res) => {
  // res.send("hello world");
  const todos = await Todo.find();
  res.send(todos);
});

app.post("/todo", async (req, res) => {
  try {
    const { title, body, isCompleted } = req.body;
    const todo = await Todo.create({
      title: title,
      body: body,
      isCompleted: isCompleted,
    });
    res.send(todo);
  } catch (err) {
    res.send(err);
  }
});

// find one todo
app.get("/todo/:id", async (req, res) => {
  const todo = await Todo.find({
    _id: req.params.id,
  });

  res.send(todo);
});

// update a todo
app.put("/todo/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
    });

    res.send(todo);
  } catch (err) {
    res.send(err);
  }
});

// delete a todo
app.delete("/todo/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      await todo.delete();
      res.send("todo deleted");
    } else {
      res.status(404).send("todo not found, can't delete");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log("running on port " + process.env.PORT);
});
