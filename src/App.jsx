import { useEffect, useState } from "react";
import {
  fetchTodos,
  addTodo as apiAddTodo,
  deleteTodo as apiDeleteTodo,
  updateTodo as apiUpdateTodo,
} from "./api";
import TodoForm from "./Todo/TodoForm";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  // Nếu dùng addTodo phía dưới thì cần thêm newText state
  const [newText, setNewText] = useState("");

  // Lấy danh sách todo
  useEffect(() => {
    axios.get("http://localhost:5000/todos")
      .then((res) => {
        console.log("Todos API:", res.data); // Log dữ liệu
        setTodos(res.data);
      })
      .catch((err) => console.error("Lỗi khi lấy todo:", err));
  }, []);

  // Thêm todo
  const handleAddTodo = async (text) => {
    try {
      const res = await apiAddTodo(text);
      console.log("Add todo API:", res.data); // Thêm dòng này
      setTodos((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Lỗi add:", err.message);
    }
  };

  // Xóa todo
  const handleDeleteTodo = async (id) => {
    try {
      await apiDeleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa:", err.message);
    }
  };

  // Xóa nhiều todo
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedIds.map(apiDeleteTodo));
      setTodos((prev) => prev.filter((t) => !selectedIds.includes(t._id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Lỗi khi xóa nhiều:", err.message);
    }
  };

  // Toggle hoàn thành
  const handleToggleComplete = async (id, completed) => {
    try {
      await apiUpdateTodo(id, { completed });
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, completed } : todo
        )
      );
    } catch (err) {
      console.error("Lỗi Toggle: ", err.message);
    }
  };

  // Sửa nội dung
  const handleSaveEdit = async (id) => {
    try {
      await apiUpdateTodo(id, { text: editText });
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, text: editText } : todo
        )
      );
      setEditId(null);
      setEditText("");
    } catch (err) {
      console.error("Lỗi khi lưu sửa:", err.message);
    }
  };

  //Thêm todo mới
  const addTodo = () => {
    if (newText.trim() === "") return;
    axios.post("http://localhost:5000/todos", { text: newText })
      .then(res => {
        setTodos(prev => [...prev, res.data]);
        setNewText("");
      })
      .catch(err => console.error("Lỗi khi thêm todo:", err));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Danh sách công việc</h2>
      <TodoForm onAdd={handleAddTodo} />
      <button
        onClick={handleDeleteSelected}
        disabled={selectedIds.length === 0}
        style={{ marginBottom: "10px" }}
      >
        Xoá các mục đã chọn
      </button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: "12px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#fff"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(todo._id)}
                onChange={() =>
                  setSelectedIds((prev) =>
                    prev.includes(todo._id)
                      ? prev.filter((sid) => sid !== todo._id)
                      : [...prev, todo._id]
                  )
                }
              />
              {editId === todo._id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ padding: "4px", flex: 1, marginLeft: "8px" }}
                />
              ) : (
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    marginLeft: "8px"
                  }}
                >
                  {todo.text}
                </span>
              )}
            </div>
            <div style={{ marginTop: "8px", width: "100%" }}>
              {editId === todo._id ? (
                <>
                  <button onClick={() => handleSaveEdit(todo._id)} style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    marginRight: "6px",
                    cursor: "pointer",
                  }}>Lưu</button>
                  <button onClick={() => setEditId(null)} style={{
                    backgroundColor: "#ccc",
                    color: "#000",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    marginRight: "6px",
                    cursor: "pointer",
                  }}>Hủy</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditId(todo._id);
                      setEditText(todo.text);
                    }} style={{
                      backgroundColor: "#2196F3",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      marginRight: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button onClick={() => handleDeleteTodo(todo._id)} style={{
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginRight: "6px"
                  }}>Xóa</button>
                  <button
                    onClick={() =>
                      handleToggleComplete(todo._id, !todo.completed)
                    } style={{
                      backgroundColor: "green",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginLeft: "6px",
                    }}
                  >
                    {todo.completed ? "Bỏ hoàn thành" : "Hoàn thành"}
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
