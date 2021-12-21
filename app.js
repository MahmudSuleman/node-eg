const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
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

app.listen(process.env.PORT, () => {
  console.log("running on port " + process.env.PORT);
});
