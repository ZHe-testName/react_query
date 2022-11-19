import { useReducer } from "react";
import { usePokemons } from "../hooks/hooks";

export default function Pokemon() {
  const queryInfo = usePokemons();
  const [show, toggle] = useReducer(s => !s, true);

  return (
    <div>
      <div>
          <button
            onClick={() => toggle()}
          >{
            show ? 'Hide' : 'Show'
          }</button>
        </div>
      {
        show 
          ? 
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
                  <ul
                    className='pokemon-list'
                  >
                    {queryInfo.data.map(item => {
                      return (
                        <li
                          key={item.name}
                        >{item.name}</li>
                      );
                    })}
                  </ul> 
  
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
                :
                null  
      }
    </div>
  );
};