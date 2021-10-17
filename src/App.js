import { useState } from 'react';

function App() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState();

  const handleButtonClick = async () => {
    setStatus('pending');

    try {
      // Output:
      //  {
      //    "userId": 1,
      //    "id": 1,
      //    "title": "delectus aut autem",
      //    "completed": false
      //  }
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const json = await response.json();
      setData(json.title);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Brief example for showing that jest mock timers used with whatwg-fetch (which react-app-polyfill sets) will cause stuck pending request.
        </p>
        <button type="button" onClick={handleButtonClick}>
          Button that triggers API
        </button>
        <div>API status: {status}</div>
        <div>Todo title: {data || 'unknown'}</div>
      </header>
    </div>
  );
}

export default App;
