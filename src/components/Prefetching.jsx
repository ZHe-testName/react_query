import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useReducer } from "react";
import { useQuery, useQueryClient } from "react-query";

// sometimes we need to prefetch some data for hidden components
//what we know will be rendered
// IF we dont want to wait for fetching when component rendered we can prefetch data

export default function PrefetchingWrap() {
  const [show, toggleShow] = useReducer(d => !d, false);
  // queryClient has method for prefetching
  // const queryClient = useQueryClient();
  const [postId, setPostId] = useState(-1);

  // we can use it in useEffect hook
  // useEffect(() => {
  //   queryClient.prefetchQuery('prefetch-posts', fetchPosts);
  // }, []);

  return (
    <div>
      <button
        onClick={toggleShow}
      >{show ? 'Hide' : 'Show'}</button>

      {
        show ? <div>
          {
            postId < 0
              ? <PrefetchingPosts setPostId={setPostId}/> 
              : <Post setPostId={setPostId} postId={postId}/>
          }
        </div>: null
      }
    </div>
  );
};

async function fetchPost(id) {
  await new Promise(res => setTimeout(res, 800));

  return  axios
      .get(`https://mockend.com/ZHe-testName/mockend/posts/${id}`)
      .then(res => res.data);
};

function PrefetchingPosts({ setPostId }) {
  const queryClient = useQueryClient();
  const queryDataArray = queryClient.getQueryData();

  const postsQuery = useQuery(
    'prefetch-posts',
    async () => {
      return axios
        .get('https://mockend.com/ZHe-testName/mockend/posts')
        .then(res => res.data.slice(0, 10));
    },
  );

  return (
    <div>
      <h2>
        Post Prefetching
        {postsQuery.isFetching ? '...' : null}
      </h2>

      <div>
        { 
          postsQuery.isLoading
            ? 'Posts loading...'
            : (
              <ul>
                {
                  postsQuery.data.map(post => (
                    <li
                      key={post.id}
                      onMouseEnter={() => {
                        queryClient.prefetchQuery(['post', post.id], () => {
                          // in this case we will go fetching new data every hover action and it make a lot of unnecessary db calls
                          //and after click to link we again update our query data
                          // to avoid this we can set staleTime in object settings  
                          return fetchPost(post.id);
                        },
                        // { 
                        //   //with this parameter we load date at once on hover and never again
                        //   staleTime: Infinity,
                        // },
                        null,
                        { //fourth object can use to force prefetching
                          // even query is not come stale
                          // force: true,
                        }) 
                      }}
                    >
                      {/* Some times we need to prefetch even single data
                      we can to track it when we hovered a link bur still not clicking it
                      we can use this time for prefetching every single post  */}
                      <a 
                        href="#"
                        onClick={() => setPostId(post.id)}
                      >{post.title}</a>
                    </li>
                  ))
                }
              </ul>
            )
        }
      </div>
    </div>
  );
};

function Post({ postId, setPostId }) {
  const postQuery = useQuery(
    ['post', postId],
    () => fetchPost(postId),
    {
      staleTime: 60 * 1000, //post query will be fresh during this time
      // also it means that we dont prefetching queries because prefetching
      // doesn't work for fresh queries
    }
  );

  return (
    <div>
      <a
        onClick={() => setPostId(-1)} 
        href="#"
      >Back</a>

      <br/>
      <br/>

      {
        postQuery.isLoading
          ? 'Post loading...'
          : (
            <div>
              <span>
                {postQuery.data.title}
              </span>

              <br/>

              <span>
                {postQuery.data.createdAt}
              </span>
              
              <br/>
              <br/>

              {postQuery.isFetching ? 'Updating...' : null}
            </div>
          )
      }
    </div>
  );
};