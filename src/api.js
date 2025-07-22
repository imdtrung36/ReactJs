import axios from "axios";

const API_URL = 'http://localhost:5000/todos';

// Lấy danh sách todos
export const fetchTodos = async () => {
  const response = await axios.get(API_URL);
  return response;
};

// Thêm todo mới
export const addTodo = async (text) => {
  const response = await axios.post(API_URL, { text, completed: false });
  return response;
};

// Xóa todo
export const deleteTodo = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Cập nhật todo (sửa nội dung hoặc trạng thái hoàn thành)
export const updateTodo = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};


