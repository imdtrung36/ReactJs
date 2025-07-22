const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

//Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/todoDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


let todos = [];

// API: Lấy danh sách todo
app.get("/todos", (req, res) => {
  res.json(todos);
});

// API: Thêm todo
app.post("/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    done: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// API: Cập nhật todo
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;
  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todo.text = text;
  todo.done = done;
  res.json(todo);
});

app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;
  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  if (text !== undefined) todo.text = text;
  if (done !== undefined) todo.done = done;
  res.json(todo);
});

// API: Xóa nhiều todo
app.delete("/todos", (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "ids must be an array" });
  }

  todos = todos.filter((t) => !ids.includes(t.id));
  res.status(200).json({ message: "Deleted selected todos" });
});

// Khởi động server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
