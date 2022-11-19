import './App.css';

import Pokemon from './components/Pokemon';
import Count from './components/Count';
import PokemonSearch from './components/PokemonSearch';

function App() {
  return (
      <div className="App">
        <h1>Hello React Query Pokemon's</h1>

        {/* <Count/> */}
         
        {/* <Pokemon/> */}

        <PokemonSearch pokemon="charizard"/>
      </div>
  );
}

export default App;
