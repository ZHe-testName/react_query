import axios from "axios";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import React from "react";

function fetchPosts({pageParam = 0}) {//receive object as useQuery receive as poop
  console.log('gggggggg', pageParam);
    return axios
        .get(`https://mockend.com/ZHe-testName/mockend/posts`, {
          params: {
            limit: 100,
            offset: pageParam * 10,
          },
        })
        .then(res => res.data);
  };

export default function Pagination() {
  const [page, setPage] = useState(0);
  // const queryClient = useQueryClient();

  // also we can use InfiniteQuery for infinite pagination
  const postsQuery = useInfiniteQuery('posts', fetchPosts, {
    getNextPageParam: (lastPage, allPages) => {
      console.log('gggggggggggggg', allPages);
      return lastPage.nextCursor
    }
  });

  // const postsQuery = useQuery(
  //   ['posts', { page }],
  //   fetchPosts,
  //   {
  //     refetchOnWindowFocus: false,
  //     keepPreviousData: true,
  //   }
  // );
console.log(postsQuery);
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
                  postsQuery.isFetched && postsQuery.data?.pages?.map((page, idx) => {
                    return <React.Fragment key={idx}>
                      {page.map(post => 
                        <li 
                          key={post.id}
                        >
                          <span>{post.id}</span> - <span>{post.title}</span>
                          <p>{post.createdAt}</p>
                          <hr/>
                        </li>
                      )}
                    </React.Fragment>
                  })
                }
              </ul>

              {/* <ul>
                {
                  postsQuery.isFetched && postsQuery.data?.map(post => 
                  <li
                    key={post.id}
                  >
                    <span>{post.id}</span> - <span>{post.title}</span>
                    <p>{post.createdAt}</p>
                    <hr/>
                  </li>)
                } 
              </ul> */}
            </div>
      }

      {/* <div>
        <button 
          onClick={() => setPage(old => old - 1)}
          disabled={page <= 0}
        >Prev</button>{'  '}
        <button
           onClick={() => setPage(old => old + 1)}
           disabled={page >= 9}
        >Next</button>
        <br/>
        <span>Current Page: {page + 1} {postsQuery.isFetching ? '...' : ''}</span>
      </div> */}
      <div>
        <button

        ></button>
      </div>
    </>
  );
};