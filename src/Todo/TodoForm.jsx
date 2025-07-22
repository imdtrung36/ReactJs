import { useState } from "react";

function TodoForm({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập công việc..."
        style={{ padding: "8px", width: "80%", borderRadius: '6px'}}
      />
      <button type="submit" style={{ padding: "8px 12px", marginLeft: "10px", borderRadius: '6px', background: 'green', color: 'white'}}>
        Thêm
      </button>
    </form>
  );
}

export default TodoForm;
