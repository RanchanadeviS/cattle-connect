import { BASE_URL } from "./api";

export async function testBackend() {
  try {
    const response = await fetch(`${BASE_URL}/api/data`);
    const data = await response.json();
    console.log("✅ Backend Response:", data);
  } catch (error) {
    console.error("❌ Error connecting to backend:", error);
  }
}
