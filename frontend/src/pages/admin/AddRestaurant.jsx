// src/pages/admin/AddRestaurant.jsx

import { useState } from "react";
import { addRestaurant } from "../../api/api.js"; 
import './AddRestaurant.css'; 

export default function AddRestaurant() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    delivery_time: 30,
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await addRestaurant(form);

      if (response.error) {
        setError("Ocorreu um erro: " + JSON.stringify(response.error));
      } else {
        alert("Restaurante adicionado com sucesso!");
        setForm({ name: "", description: "", address: "", delivery_time: 30, image: "" });
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao adicionar restaurante. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-restaurant-container">
      <form onSubmit={handleSubmit} className="add-restaurant-form">
        <h2>Adicionar Restaurante</h2>

        
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Endereço"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="delivery_time"
          placeholder="Tempo de entrega"
          value={form.delivery_time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="URL da Imagem"
          value={form.image}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}