import React, {useState, useEffect} from 'react'
import axios from "axios"

const Diskpeeker = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
          try {
            const response = await axios.get(
              'http://localhost:8000/diskinfo/'
            );
            setData(response.data);
            setError(null);
          } catch (err) {
            setError(err.message);
            setData(null);
          } finally {
            setLoading(false);
          }
        };
        getData();
      }, []);
      
      return (
        <div className="App">
          <h1>API Posts</h1>
          {loading && <div>A moment please...</div>}
          {error && (
            <div>{'There is a problem fetching the post data - ${error}'}</div>
          )}
          <ul>
            {data &&
              data.map(({ id, device, name, hidden }) => (
                <li key={id}>
                  <h3>{id} {device} {name} {hidden}</h3>
                </li>
              ))}
          </ul>
        </div>
      );

}

export default Diskpeeker