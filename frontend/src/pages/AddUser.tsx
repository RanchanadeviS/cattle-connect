import React, { useState } from "react";
import { BASE_URL } from "../api";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fixed: Proper event type + React import
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("⏳ Adding user...");

    try {
      const response = await fetch(`${BASE_URL}/api/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ User added successfully!");
        setName("");
        setEmail("");
      } else {
        setMessage("❌ Failed to add user: " + (data.error || data.message));
      }
    } catch (error) {
      console.error("Backend error:", error);
      setMessage("❌ Error connecting to backend");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-3xl font-semibold mb-6">Add New User</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-4"
      >
        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
        >
          Save User
        </button>
      </form>

      {/* Message Output */}
      {message && (
        <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
};

export default AddUser;
