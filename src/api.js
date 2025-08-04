import axios from "axios";

const API_URL = 'http://localhost:5000/todos';

// Lấy danh sách todos
export const fetchTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Thêm todo mới
export const addTodo = async (text) => {
  const response = await axios.post(API_URL, { text, completed: false });
  return response.data;
};

// Xóa todo
export const deleteTodo = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Xóa nhiều todo
export const deleteMultipleTodos = async (ids) => {
  const response = await axios.delete(`${API_URL}/bulk`, { data: { ids } });
  return response.data;
};

// Cập nhật todo (sửa nội dung hoặc trạng thái hoàn thành)
export const updateTodo = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};


