import React, {useState, useEffect } from 'react';
import axios from "axios";
import './style.css';


function Home() {
      const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5757/casta")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;


    return (
      <>
        <h1>Home</h1>
        <p>Home</p>
            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ ID, Nome }) => (
          <tr key={ID}>
            <td>{ID}</td>
            <td>{Nome}</td>
            <td>a</td>
          </tr>
        ))}
      </tbody>
    </table>
      </>
    )
}

export default Home;