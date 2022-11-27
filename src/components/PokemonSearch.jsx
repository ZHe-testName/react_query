import { useState } from "react";
import { useSearchPokemon } from "../hooks/hooks";

export default function PokemonSearch() {
  const [pokemon, setPokeName] = useState('');

  const queryInfo = useSearchPokemon(pokemon);
  
  return (
    <div>
      <label htmlFor="">
        Type name :
        <input type="text" onChange={e => setPokeName(e.target.value)}/>
      </label>

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
              <div>
                {
                  queryInfo.data?.sprites?.front_default
                    ?
                    <div>
                      <img src={queryInfo.data.sprites.front_default} alt="pokemon"/>
                      <span>{queryInfo.data?.name}</span>
                    </div>
                    :
                    'Pokemon not founded.'
                }
                <br/>

                <div>
                  {
                    queryInfo.isFetching
                      ?
                      'Updating...'
                      :
                      null
                  }
                </div>
              </div>   
        }
    </div>
  );
};