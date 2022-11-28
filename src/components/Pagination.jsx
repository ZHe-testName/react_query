import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Pagination() {
  const [page, setPage] = useState(0);

  const postsQuery = useQuery(
    ['posts', { page }],
    () => {
      return axios
        .get(`https://mockend.com/ZHe-testName/mockend/posts`, {
          params: {
            limit: 10,
            offset: page * 10,
          },
        })
        .then(res => res.data);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      {
        postsQuery.isLoading
          ? <span>Loading...</span>
          : <div>
              <h2>
                Posts
                {postsQuery.isFetching ? '...' : null}
              </h2>

              <br/>

              <ul>
                {
                  postsQuery.isFetched && postsQuery.data.map(post => 
                  <li
                    key={post.id}
                  >
                    <span>{post.id}</span> - <span>{post.title}</span>
                    <p>{post.createdAt}</p>
                    <hr/>
                  </li>)
                } 
              </ul>
            </div>
      }

      <div>
        <button onClick={() => setPage(old => old - 1)}>Prev</button>{'  '}
        <button onClick={() => setPage(old => old + 1)}>Next</button>
        <br/>
        <span>Current Page: {page + 1} {postsQuery.isFetching ? '...' : ''}</span>
      </div>
    </>
  );
};