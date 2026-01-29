import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SellCattle = () => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    price: "",
    description: "",
    image: "",
  });

  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/cattle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Cattle listed successfully!");
        navigate("/dashboard");
      } else {
        alert("❌ Failed to add cattle.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong while submitting.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
        🐄 Sell Your Cattle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Cattle Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="breed"
          placeholder="Breed"
          value={formData.breed}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age (in years)"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight (in kg)"
          value={formData.weight}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Expected Price (₹)"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          Add Cattle
        </button>
      </form>
    </div>
  );
};

export default SellCattle;

