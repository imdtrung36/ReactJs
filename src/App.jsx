import { useEffect, useState } from "react";
import {
  fetchTodos,
  addTodo as apiAddTodo,
  deleteTodo as apiDeleteTodo,
  updateTodo as apiUpdateTodo,
  deleteMultipleTodos,
} from "./api";

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newText, setNewText] = useState("");

  // Lấy danh sách todo
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosData = await fetchTodos();
        setTodos(todosData);
      } catch (err) {
        console.error("Lỗi khi lấy todo:", err);
      }
    };
    loadTodos();
  }, []);

  // Thêm todo
  const handleAddTodo = async (text) => {
    try {
      const newTodo = await apiAddTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      console.error("Lỗi add:", err.message);
    }
  };

  // Xóa todo
  const handleDeleteTodo = async (id) => {
    try {
      await apiDeleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa:", err.message);
    }
  };

  // Xóa nhiều todo
  const handleDeleteSelected = async () => {
    try {
      await deleteMultipleTodos(selectedIds);
      setTodos((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
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
          todo.id === id ? { ...todo, completed } : todo
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
          todo.id === id ? { ...todo, text: editText } : todo
        )
      );
      setEditId(null);
      setEditText("");
    } catch (err) {
      console.error("Lỗi khi lưu sửa:", err.message);
    }
  };

  // Thêm todo mới (từ input)
  const addTodo = async () => {
    if (newText.trim() === "") return;
    try {
      const newTodo = await apiAddTodo(newText);
      setTodos(prev => [...prev, newTodo]);
      setNewText("");
    } catch (err) {
      console.error("Lỗi khi thêm todo:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Danh sách công việc</h2>
      
      {/* Form thêm todo */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Nhập công việc mới..."
          style={{ 
            padding: "8px", 
            marginRight: "8px", 
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button 
          onClick={addTodo}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Thêm
        </button>
      </div>

      <button
        onClick={handleDeleteSelected}
        disabled={selectedIds.length === 0}
        style={{ 
          marginBottom: "10px",
          backgroundColor: "#f44336",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
          opacity: selectedIds.length === 0 ? 0.6 : 1
        }}
      >
        Xoá các mục đã chọn ({selectedIds.length})
      </button>
      
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: "12px",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(todo.id)}
                onChange={() =>
                  setSelectedIds((prev) =>
                    prev.includes(todo.id)
                      ? prev.filter((sid) => sid !== todo.id)
                      : [...prev, todo.id]
                  )
                }
                style={{ marginRight: "8px" }}
              />
              {editId === todo.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ 
                    padding: "6px", 
                    flex: 1, 
                    marginLeft: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                />
              ) : (
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    marginLeft: "8px",
                    flex: 1,
                    color: todo.completed ? "#888" : "#000"
                  }}
                >
                  {todo.text}
                </span>
              )}
            </div>
            <div style={{ marginTop: "8px", width: "100%" }}>
              {editId === todo.id ? (
                <>
                  <button onClick={() => handleSaveEdit(todo.id)} style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    marginRight: "6px",
                    cursor: "pointer",
                  }}>Lưu</button>
                  <button onClick={() => {
                    setEditId(null);
                    setEditText("");
                  }} style={{
                    backgroundColor: "#ccc",
                    color: "#000",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    marginRight: "6px",
                    cursor: "pointer",
                  }}>Hủy</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditId(todo.id);
                      setEditText(todo.text);
                    }} style={{
                      backgroundColor: "#2196F3",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      marginRight: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button onClick={() => handleDeleteTodo(todo.id)} style={{
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "6px"
                  }}>Xóa</button>
                  <button
                    onClick={() =>
                      handleToggleComplete(todo.id, !todo.completed)
                    } style={{
                      backgroundColor: todo.completed ? "#ff9800" : "#4CAF50",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
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
