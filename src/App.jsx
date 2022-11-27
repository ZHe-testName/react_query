import './App.css';

import Pokemon from './components/Pokemon';
import Count from './components/Count';
import PokemonSearch from './components/PokemonSearch';
import MyPosts from './components/MyPosts';
import ListsItems from './components/ListsItems';
import ServerTime from './components/ServerTime';
import RandomWrap from './components/Rundom';
import PrefetchingWrap from './components/Prefetching';
import MutationPosts from './components/Mutation';
import MutationPost from './components/MutationPost';

function App() {
  return (
      <div className="App">
        <h1>Hello React Query Pokemon's</h1>

        {/* <Count/> */}
         
        {/* <Pokemon/> */}

        {/* <PokemonSearch /> */}

        {/* <MyPosts/> */}

        {/* <ListsItems /> */}

        {/* <ServerTime/> */}

        {/* <RandomWrap /> */}
        
        {/* <PrefetchingWrap /> */}

        {/* <MutationPosts /> */}

        <MutationPost />
      </div>
  );
}

export default App;
