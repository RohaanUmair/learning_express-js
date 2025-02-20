// app/page.tsx
"use client";
import { useState } from 'react';
import { FaSun, FaMoon, FaTrash, FaPlus } from 'react-icons/fa';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
      setInput('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className={`w-screen min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="w-screen mx-auto px-96 py-4 min-h-screen dark:bg-slate-900 dark:text-white">
        <div className="flex justify-between items-center mb-8 w-full">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </div>

        <form onSubmit={addTodo} className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 p-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </form>

        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className={`${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 dark:hover:bg-slate-700 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}