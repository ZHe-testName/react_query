import { useQuery } from 'react-query';
import axios, { CancelToken } from 'axios';


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

  // also we have a problem
  // if query param will be incorrect
  // and we have bad request React Query will trying make the requests with some frequency
  // with the same params 
  // we can processed it with retry param
  return useQuery(
    ['pokemon', pokemon], //dynamic key will bee use by react query for caching data
      // also we can do query keys more informative if we pass an array with prefix and so on
      // in devtools we would see more informative name of request 
      // it is good if we have a lot of requests

      // also wil be very useful if we dont do requests on each typed letter in input
      // we needs debounce for that

      // three are two ways to do that
      // with axios
      //and fetch API 

      // axios debounce
    // () => { 
    //   // this method return axios source
    //   const source = CancelToken.source();
      
    //   const promise = new Promise(resolve => setTimeout(resolve, 1000)) //delay for requesting
    //     .then(() => {
    //       return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
    //           // pass source token to axios settings
    //             cancelToken: source.token,
    //           })
    //           .then(res => res.data);
    //     });
      
    //   // here we say ti react query how to close response
    //   promise.cancel = () => {
    //     source.cancel('Query was canceled with React Query');
    //   };
      
    //   return promise;
    // },

    // fetch debounce
     () => { 
      // here we used AbortController API
      const controller = new AbortController();
      const signal = controller.signal;
      
      const promise = new Promise(resolve => setTimeout(resolve, 1000)) //delay for requesting
        .then(() => {
          return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
              method: 'GET',
              // pass controller aborting signal
              signal,
            })
            .then(res => res.json());
        });
      
      // here we say how to cancel th promise
      promise.cancel = () => {
        controller.abort();
      };
      
      return promise;
    },
    //with first loading query param string is empty so that is not good for us
    // we doing unnesessary request
    // we can control that wit special setting key
    {
      enabled: !!pokemon, //it means that request will be made only if param is not falsy
      retry: 2, //there we pass amount of turns 0 or false deactivate retrying
      // retryDelay: 1000, //delay between attempts
      // retryDelay: attemptIndex => Math.min(attemptIndex * 2, 30000), //it also can be a function
    }
  );
  // Good thing that we will have different key with different data in cache memory
};