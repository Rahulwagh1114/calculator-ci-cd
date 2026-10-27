import { useState, useEffect } from "react";
import "./App.css";

const API = "VITE_API_URL/api";

function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operator, setOperator] = useState("+");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const res = await fetch(`${API}/history`);
    setHistory(await res.json());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleCalculate = async () => {
    setError("");
    if (num1 === "" || num2 === "") {
      setError("Dono numbers daalo");
      return;
    }
    const res = await fetch(`${API}/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ num1, num2, operator }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setResult(null);
      return;
    }
    setResult(data.result);
    loadHistory();
  };

  const clearHistory = async () => {
    await fetch(`${API}/history`, { method: "DELETE" });
    setHistory([]);
  };

  return (
    <div className="app">
      <h1>Calculator</h1>

      <div className="row">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Number 1"
        />
        <select value={operator} onChange={(e) => setOperator(e.target.value)}>
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Number 2"
        />
      </div>

      <button className="calc-btn" onClick={handleCalculate}>
        Calculate
      </button>

      {error && <p className="error">{error}</p>}
      {result !== null && <h2 className="result">Result: {result}</h2>}

      <div className="history-head">
        <h3>History</h3>
        {history.length > 0 && (
          <button className="clear-btn" onClick={clearHistory}>
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p>Abhi koi history nahi hai.</p>
      ) : (
        <ul>
          {history.map((h) => (
            <li key={h._id}>
              {h.num1} {h.operator} {h.num2} = <b>{h.result}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;