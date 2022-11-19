import { useQuery } from 'react-query';
import axios from 'axios';


// For have ability for different components have same query data
// we can use hooks
export function usePokemons() {
  return useQuery(
    'pokemon', //first par use for add uniq query ID
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
    { //obj with query settings
      // refetchOnWindowFocus: false, //flag for automatic refetching data when window is on focus
        //to get fresh data
      // staleTime: 5000, //During this time react query doesn't fetch data between window switching
      // cacheTime: 5000, //when we remove el from page it still stay in memory during this time (5 min default)
        // after that time data removing and fetching whe it needs
        // we can use 0 or Infinity for this times settings
    }
    
    // queryInfo - this obj have a lot of info about query extras
    // like...
    // 
    // queryInfo.status === 'loading', 'success', 'error'
    // queryInfo.isError === true / false
    // queryInfo.isLoading...
  );
};

export function useSearchPokemon(pokemon) {
  // for dynamic queries we can pass specific keys
  // and params for extra requests
  return useQuery(
    pokemon, //dynamic key will bee use by react query for caching data
    () => { 
      return axios
        .get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        .then(res => res.data);
    }
  );
  // Good thing that we will have different key with different data in cache memory
};