import React, { useEffect, useState } from "react";
import type { Todo } from "@shared/types";

export function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedCompleted = !todo.completed;

    // Optimistic UI update: update state immediately
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id ? { ...t, completed: updatedCompleted } : t
      )
    );

    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updatedCompleted }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo: Todo = await response.json();

      // Confirm state with server response (optional)
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === id ? updatedTodo : t))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update todo. Please try again.");

      // Revert optimistic update on failure
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === id ? { ...t, completed: todo.completed } : t
        )
      );
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch todos");
        const data: Todo[] = await res.json();
        setTodos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading todos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newTitle.trim()) return;

          try {
            const res = await fetch("http://localhost:3000/todos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: newTitle }),
            });

            if (!res.ok) {
              console.error("Failed to create todo");
              return;
            }

            const created = await res.json();
            setTodos((prev) => [...prev, created]);
            setNewTitle("");
          } catch (err) {
            console.error("Request failed", err);
          }
        }}
      >
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New todo title"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              {todo.title}
            </label>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:3000/todos/${todo.id}`,
                    {
                      method: "DELETE",
                    }
                  );

                  if (!res.ok) {
                    console.error("Failed to delete todo");
                    return;
                  }

                  setTodos((prev) => prev.filter((t) => t.id !== todo.id));
                } catch (err) {
                  console.error("Delete request failed", err);
                }
              }}
              style={{ marginLeft: "1rem" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
