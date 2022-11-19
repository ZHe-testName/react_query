import { useSearchPokemon } from "../hooks/hooks";

export default function PokemonSearch({ pokemon }) {
  const queryInfo = useSearchPokemon(pokemon);

  return (
    <div>
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