import React, { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { Context } from '../types/Context';

export const TodosContext = React.createContext<Context>({
  todos: [],
  addTodo: () => { },
  deleteTodo: () => { },
  changeSelectedTodo: () => { },
  toggleSelectedTodo: () => { },
  deleteCompletedTodos: () => { },
  toggleCompletionOfAllTodos: () => { },
  todoCount: 0,
  completedTodos: false,
  filterTodos: () => [],
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: +new Date(),
      title,
      completed: false,
    };

    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleSelectedTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return;
    }

    todo.completed = !todo.completed;

    setTodos([...todos]);
  };

  const changeSelectedTodo = (id: number, newTodo: string) => {
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, title: newTodo };
        }

        return todo;
      });

      return updatedTodos;
    });
  };

  const deleteCompletedTodos = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const toggleCompletionOfAllTodos = () => {
    const allCompleted = todos.every((todo) => todo.completed);

    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
  };

  const todoCount = todos.filter(
    (todo) => !todo.completed,
  ).length;

  const completedTodos = todos.some((todo) => todo.completed);

  const filterTodos = (filter: string) => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.All:
      default:
        return todos;
    }
  };

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');

    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const functional = {
    todos,
    addTodo,
    toggleSelectedTodo,
    deleteTodo,
    changeSelectedTodo,
    deleteCompletedTodos,
    toggleCompletionOfAllTodos,
    todoCount,
    completedTodos,
    filterTodos,
  };

  return (
    <TodosContext.Provider value={functional}>
      {children}
    </TodosContext.Provider>
  );
};
