const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());

//Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/todoDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Đường dẫn đến file db.json
const dbPath = path.join(__dirname, '..', 'db.json');

// Hàm đọc todos từ file
const readTodosFromFile = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      const db = JSON.parse(data);
      return db.todos || [];
    }
  } catch (error) {
    console.error('Error reading db.json:', error);
  }
  return [];
};

// Hàm ghi todos vào file
const writeTodosToFile = (todos) => {
  try {
    const db = { todos };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};

// Khởi tạo todos từ file
let todos = readTodosFromFile();

// API: Lấy danh sách todo
app.get("/todos", (req, res) => {
  // Convert 'done' to 'completed' for frontend compatibility
  const todosWithCompleted = todos.map(todo => ({
    ...todo,
    completed: todo.done || todo.completed || false
  }));
  res.json(todosWithCompleted);
});

// API: Thêm todo
app.post("/todos", (req, res) => {
  const newTodo = {
    id: Date.now().toString(), // Use string ID to match db.json
    text: req.body.text,
    done: req.body.completed || false, // Handle both 'done' and 'completed' properties
  };
  todos.push(newTodo);
  writeTodosToFile(todos); // Save to file
  
  // Return with 'completed' property for frontend
  res.status(201).json({
    ...newTodo,
    completed: newTodo.done
  });
});

// API: Cập nhật todo
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, completed, done } = req.body;
  const todo = todos.find((t) => t.id === id); // Use string comparison
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  if (text !== undefined) todo.text = text;
  if (completed !== undefined) todo.done = completed;
  if (done !== undefined) todo.done = done;
  
  writeTodosToFile(todos); // Save to file
  
  // Return with 'completed' property for frontend
  res.json({
    ...todo,
    completed: todo.done
  });
});

app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, completed, done } = req.body;
  const todo = todos.find((t) => t.id === id); // Use string comparison
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  if (text !== undefined) todo.text = text;
  if (completed !== undefined) todo.done = completed;
  if (done !== undefined) todo.done = done;
  
  writeTodosToFile(todos); // Save to file
  
  // Return with 'completed' property for frontend
  res.json({
    ...todo,
    completed: todo.done
  });
});

// API: Xóa một todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === id); // Use string comparison
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(todoIndex, 1);
  writeTodosToFile(todos); // Save to file
  res.status(200).json({ message: "Todo deleted successfully" });
});

// API: Xóa nhiều todo
app.delete("/todos/bulk", (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "ids must be an array" });
  }

  const initialLength = todos.length;
  todos = todos.filter((t) => !ids.includes(t.id)); // Use string comparison
  const deletedCount = initialLength - todos.length;
  
  writeTodosToFile(todos); // Save to file
  
  res.status(200).json({ 
    message: `Deleted ${deletedCount} todos successfully`,
    deletedCount 
  });
});

// Khởi động server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
