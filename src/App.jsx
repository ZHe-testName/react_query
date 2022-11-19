import './App.css';
import { useQuery } from 'react-query';
import axios from 'axios';

// function Pokemon() {
//   <ul>
//     {queryInfo.data.map(item => {
//       return (
//         <li
//           key={item.name}
//         >{item.name}</li>
//       );
//     })}
//   </ul> 
// };

function App() {
  const queryInfo = useQuery(
    'pokemon', //use for add uniq query ID
    async () => { //second par is callback for request
      await new Promise((resolve) => {
        setInterval(() => {
          resolve();
        }, 500);
      });

      return axios
        .get('https://pokeapi.co/api/v2/pokemon')
        .then(res => res.data.results);
    },
  );

  // queryInfo - this obj have a lot of info about query extras
  // like...
  // 
  // queryInfo.status === 'loading', 'success', 'error'
  // queryInfo.isError === true / false
  // queryInfo.isLoading...

  return (
      <div className="App">
        <h1>Hello React Query Pokemon's</h1>

        <div className="main">
          {
            queryInfo.isLoading 
              ?
              <h2>
                Loading...
              </h2>
              : 
              queryInfo.isError
                  ?
                  <div>
                    {queryInfo.error.message}
                  </div>
                  :
                  <ul>
                  {queryInfo.data.map(item => {
                    return (
                      <li
                        key={item.name}
                      >{item.name}</li>
                    );
                  })}
                </ul>    
          }
        </div>
      </div>
  );
}

export default App;
