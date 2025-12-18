// client/src/Home.jsx
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:3001/health")
      .then((res) => res.json())
      .then((data) => console.log("API:", data))
      .catch(console.error);
  }, []);

  return <h1>Client is running ✅ (check console for API)</h1>;
}
