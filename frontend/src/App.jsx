import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [health, setHealth] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setError("");

      const healthResponse = await fetch("/api/health");
      const healthData = await healthResponse.json();

      const itemsResponse = await fetch("/api/items");
      const itemsData = await itemsResponse.json();

      setHealth(healthData);
      setItems(itemsData);
    } catch (err) {
      setError("Frontend could not connect to the backend API.");
    }
  }

  async function addItem(event) {
    event.preventDefault();

    if (!newItem.trim()) {
      return;
    }

    try {
      setError("");

      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newItem
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      setNewItem("");
      await loadData();
    } catch (err) {
      setError("Failed to add item. Check the backend logs.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="page">
      <section className="card">
        <h1>Kubernetes Full-Stack Demo</h1>

        <p className="description">
          This frontend talks to a backend API. The backend stores and reads data
          from PostgreSQL.
        </p>

        <section className="statusBox">
          <h2>Backend Health</h2>

          {health ? (
            <pre>{JSON.stringify(health, null, 2)}</pre>
          ) : (
            <p>Loading backend health...</p>
          )}
        </section>

        <form onSubmit={addItem} className="form">
          <input
            value={newItem}
            onChange={(event) => setNewItem(event.target.value)}
            placeholder="Add item to PostgreSQL"
          />

          <button type="submit">Add</button>
        </form>

        {error && <p className="error">{error}</p>}

        <section className="items">
          <h2>Items from PostgreSQL</h2>

          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <span className="itemId">#{item.id}</span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
