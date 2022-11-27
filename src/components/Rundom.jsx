import axios from "axios";
import { useReducer } from "react";
import { useQuery, useQueryClient } from "react-query";
import { giveRandomNumber } from "../helpers/helpers";

export default function RandomWrap() {
  // on query client object we can use invalidationQuery method
  // to manually invalidate existing query using a query key 
  const queryClient = useQueryClient();

  const [show, toggleShow] = useReducer(b => !b, true);

  return (
    <div>
      <button
        onClick={toggleShow}
      >Toggle Random</button>

      <button
        onClick={() => queryClient.invalidateQueries('random', {
          // with this par we can control refetching of selected query
          //whe itы component is removed from dom
          refetchInactive: true,
        })}
      >Invalidate Random</button>
      {/* Also we can invalidate each query with different buttons
      only passing uniq subKey into method call 
      
      invalidate method looks for the first key of query name and 
      we dont need any loops to interact with different queries*/}
      <button
        onClick={() => queryClient.invalidateQueries(['random', 'A'])}
      >Invalidate A</button>
      <button
        onClick={() => queryClient.invalidateQueries(['random', 'B'])}
      >Invalidate B</button>
      {/* If we need similar requests but different query we can use named composite query
      it might be the best way to do it */}
      <div>
        {
          show ? <div>
            <Random subKey="A"/>
            <Random subKey="B"/>
          </div> : null
        }
      </div>
    </div>
  );
};

function Random({ subKey }) {
  const randomQuery = useQuery(
    ['random', subKey],
    async () => {
      return axios
        .get('https://mockend.com/ZHe-testName/mockend/number')
        .then(res => res.data[giveRandomNumber(100)])
    },
    {
      // this parameter use to explain staling of a data
      // it means that query dosent fetch new data automaticly when we switch window
      // because it newer be stale
      staleTime: Infinity,
    }
  );

  
  return (
    <div>
      <h2>
        Random Number
        {
          randomQuery.isFetching ? '...' : null
        }
      </h2>
      <div>
        {
          randomQuery.isLoading 
           ? 'Loading random...'
           : randomQuery.data.random
        }
      </div>
      {/* <div>
        <button 
          onClick={() => queryClient.invalidateQueries('random', {
            // this par means that when we click it query will be refetch on background
            // but new value dont be rendered, it only put old value into stale
            refetchActive: false,
          })}
        >invalidate</button>
      </div> */}
    </div>
  );
};