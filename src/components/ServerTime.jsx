// https://mockend.com/ZHe-testName/mockend/comment

import axios from "axios";
import { useQuery } from "react-query";
import { giveRandomNumber } from "../helpers/helpers";

export default function ServerTime() {
  const timeQuery = useQuery(
    'server-time',
    async () => {
      return axios
        .get('https://mockend.com/ZHe-testName/mockend/posts')
        .then(res => res.data);
    },
    // to create query with periodic interval request
    // use refetchInterval
    { 
      isError(e) {
        console.log(e);
      },
      // with this time RQ will periodic refetch
      // its no refetching in background when we on other tab
      // refetchInterval: 15000,
      // if we need background refetching this param
      // refetchIntervalInBackground: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div>
      <h2>
        Server Time
        {
          timeQuery.isFetching && '...'
        }
      </h2>
      {
        timeQuery.isError && <div>Failed</div>
      }
      <div>
        {
          timeQuery.isLoading
            ? 'Time is loading...'
            : new Date(timeQuery.data[giveRandomNumber(100)].createdAt).toLocaleString()
        }
      </div>
    </div>
  );
;}; 