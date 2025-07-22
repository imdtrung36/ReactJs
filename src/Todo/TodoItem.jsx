function TodoItem({ todo, onDelete, onToggle, onEdit, isSelected, onSelect }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 8, border: "1px solid #ccc", marginBottom: 6, borderRadius: 8 }}>
      <div>
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(todo.id)}
        />
        <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
          {todo.text}
        </span>
      </div>
      <div>
        <button onClick={() => onEdit(todo)}>Sửa</button>
        <button onClick={() => onDelete(todo.id)} style={{ backgroundColor: "red", color: "white", marginLeft: 5 }}>Xoá</button>
      </div>
    </div>
  );
}

export default TodoItem;
