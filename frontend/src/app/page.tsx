"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { FaSun, FaMoon, FaTrash, FaPlus, FaCheck } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Todo {
  _id: number;
  task: string;
}

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  useEffect(() => {
    fetch(`${API_URL}/protected-route`, { credentials: 'include' })
      .then(() => getData())
  }, []);


  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getData = () => {
    setIsLoading(true);
    return axios.get(`${API_URL}/getTodo`, { withCredentials: true })
      .then((data) => setTodos(data.data.data))
      .catch((err) => {
        toast.error('Failed to fetch todos');
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const task = input.trim().toUpperCase();
      const toastId = toast.loading('Adding todo...');
      const uniqueId = Math.round(Math.random() * 9999999999);

      axios.post(`${API_URL}/addTodo`, { task, _id: uniqueId }, { withCredentials: true })
        .then(() => setTodos((prev) => [...prev, { task, _id: uniqueId }]))
        .then(() => toast.success('Todo added successfully!', { id: toastId }))
        .catch((error) => {
          toast.error(`Failed to add todo: ${error.message}`, { id: toastId });
        })
        .finally(() => setInput(''));
    }
  };

  const deleteTodo = (id: number) => {
    const toastId = toast.loading('Deleting todo...');
    axios.delete(`${API_URL}/delTodo`, { data: { _id: id } })
      .then(() => setTodos((prev) => prev.filter((todo) => todo._id !== id)))
      .then(() => toast.success('Todo deleted successfully!', { id: toastId }))
      .catch((error) => {
        toast.error(`Failed to delete todo: ${error.message}`, { id: toastId });
      });
  };

  const editTodo = (currentTodoId: number, currentTodoText: string) => {
    if (editingTodoId === currentTodoId) {
      if (editingTask.trim() === '') return;

      const toastId = toast.loading('Updating todo...');
      axios.put(`${API_URL}/editTodo`, {
        _id: currentTodoId,
        updatedTask: editingTask.toUpperCase()
      }, { withCredentials: true })
        .then(() => {
          setTodos((prev) =>
            prev.map((todo) =>
              todo._id === currentTodoId ? { ...todo, task: editingTask.toUpperCase() } : todo
            )
          );
          toast.success('Todo updated successfully!', { id: toastId });
          setEditingTodoId(null);
        })
        .catch((error) => {
          toast.error(`Failed to update todo: ${error.message}`, { id: toastId });
        });
    } else {
      setEditingTodoId(currentTodoId);
      setEditingTask(currentTodoText);
    }
  }

  const handleLogout = () => {
    axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
      .then((res) => {
        console.log(res);
        router.push('/login');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={`min-h-screen transition-all w-full bg-gradient-to-br duration-500 ${isDarkMode ? 'dark from-slate-800 to-slate-900' : 'from-blue-50 to-purple-50'}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#1e293b' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
          },
        }}
      />

      <button onClick={handleLogout} className={`p-3 px-6 rounded-sm font-semibold transition-all duration-300 absolute text-white right-10 top-4 shadow-md hover:shadow-lg ${isDarkMode
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white'
        }`}>Logout</button>

      <div className={`min-h-screen mx-auto max-w-4xl px-4 py-8`}>
        {/* Header Section */}
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Todo Magic
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isDarkMode
              ? 'bg-slate-700 hover:bg-slate-600 text-amber-300'
              : 'bg-white hover:bg-blue-50 text-blue-600'
              }`}
          >
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </header>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="group relative mb-12">
          <div className="flex gap-4 transition-all duration-300 focus-within:scale-[1.02]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className={`uppercase font-semibold flex-1 p-4 text-lg rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 ${isDarkMode
                ? 'bg-slate-700 text-white focus:ring-purple-500/50 placeholder-slate-400'
                : 'bg-white text-slate-800 focus:ring-blue-500/30 placeholder-slate-400'
                }`}
            />
            <button
              type="submit"
              className={`p-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg ${isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white'
                }`}
            >
              <FaPlus size={20} />
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className={`p-5 rounded-xl animate-pulse ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                  }`}
              >
                <div className="h-4 bg-slate-500 rounded w-3/4"></div>
              </div>
            ))
          ) : (
            <>
              {todos.map(todo => (
                <div
                  key={todo._id}
                  className={`group flex items-center justify-between p-5 rounded-xl transition-all duration-300 ${isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-650'
                    : 'bg-white hover:bg-blue-50'
                    } shadow-md hover:shadow-lg`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {editingTodoId === todo._id ? (
                      <input
                        type="text"
                        value={editingTask}
                        onChange={(e) => setEditingTask(e.target.value)}
                        className={`uppercase font-semibold flex-1 p-2 text-lg rounded-xl shadow-md transition-all duration-300 focus:outline-none ${isDarkMode
                          ? 'bg-slate-700 text-white'
                          : 'bg-white text-slate-800'
                          }`}
                      />
                    ) : (
                      <span className="text-lg font-semibold transition-all duration-300 text-slate-700 dark:text-slate-200">
                        {todo.task}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => editTodo(todo._id, todo.task)}
                    className={`p-2 rounded-lg opacity-70 hover:opacity-100 transition-all duration-300 ${isDarkMode
                      ? 'hover:bg-slate-600'
                      : 'hover:bg-green-100'
                      }`}
                  >
                    {editingTodoId === todo._id ? (
                      <FaCheck className={`text-xl ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                    ) : (
                      <BiEdit className={`text-xl ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                    )}
                  </button>

                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className={`p-2 rounded-lg opacity-70 hover:opacity-100 transition-all duration-300 ${isDarkMode
                      ? 'hover:bg-slate-600'
                      : 'hover:bg-red-100'
                      }`}
                  >
                    <FaTrash className={`text-red-500 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                  </button>                </div>
              ))}
              {todos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-slate-400 dark:text-slate-600">
                    ✨ Your todo list is sparkling clean!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}