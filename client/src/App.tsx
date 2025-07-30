import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type Item = {
  id: string;
  name: string;
  quantity: number;
  lastUpdated: Date;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string>(''); // Fix: define setError

  // For pretty delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteModalMessage, setDeleteModalMessage] = useState<string>("");

  const fetchItems = async () => {
    fetch('/items')
      .then(res => res.json())
      .then(setItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    const response = await fetch('/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity }),
    });
    if (response.ok) {
      const newItem: Item = await response.json();
      setItems([...items, newItem]);
      setName('');
      setQuantity(0);
    }
    else {
      setError('Failed to add item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const deleteItem = async (id: string) => {
    await fetch(`/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(item => item.id !== id));
  };

  // Show pretty modal for delete confirmation
  const confirmDelete = (id: string, message: string) => {
    setDeleteTargetId(id);
    setDeleteModalMessage(message);
    setShowDeleteModal(true);
  };

  const handleUpdateItem = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      confirmDelete(id, "Quantity is zero or less. Do you want to delete this item?");
      return;
    }
    const response = await fetch(`/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (response.ok) {
      fetchItems();
    }
  };

  const handleDeleteItem = async (id: string) => {
    confirmDelete(id, "Are you sure you want to delete this item?");
  };

  // Modal handlers
  const handleModalConfirm = async () => {
    if (deleteTargetId) {
      await deleteItem(deleteTargetId);
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
    setDeleteModalMessage("");
  };

  const handleModalCancel = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
    setDeleteModalMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Inventory</h1>
      {error && (
        <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>
      )}

      {/* Pretty Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 24,
              minWidth: 320,
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
              textAlign: "center"
            }}
          >
            <div style={{ marginBottom: 16, fontSize: 18 }}>{deleteModalMessage}</div>
            <button
              onClick={handleModalConfirm}
              style={{
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 20px",
                marginRight: 12,
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Delete
            </button>
            <button
              onClick={handleModalCancel}
              style={{
                background: "#eee",
                color: "#333",
                border: "none",
                borderRadius: 4,
                padding: "8px 20px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul>
        {items.map(({ id, name, quantity }) => (
          <li key={id} style={{ marginBottom: 8 }}>
            {name} — Quantity: {quantity}{" "}
            <button onClick={() => handleUpdateItem(id, quantity + 1)}>+</button>
            <button
              onClick={() => handleUpdateItem(id, quantity - 1)}
              disabled={quantity <= 0}
              style={{ marginLeft: 4 }}
            >
              –
            </button>
            <button
              onClick={() => handleDeleteItem(id)}
              style={{ marginLeft: 8, color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ marginLeft: 8 }}
        />
        <button onClick={handleAddItem} style={{ marginLeft: 8 }}>
          Add Item
        </button>
      </div>
    </div>
  );
}

export default App;