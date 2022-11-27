// 'https://jsonplaceholder.typicode.com/posts'

// Realy cool that when we navigate between posts
// posts what be already visited stay in cash (during default or custom time)
// and after that we go to page with this post we dont fetch it again

import axios from "axios";
import { useReducer } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

// single item component
function Post({ postId, setPostId }) {
  // That cool but we actualy dont need to fetch each individual post
  // couse we already have all information in our posts list
  // RQ have a powerful thing named queryCache

  // and we can set initial data for our post from cache if we need
  const queryClient = useQueryClient();

  const postQuery = useQuery(
    ['post', postId],
    () => {
      return axios
        .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then(res => res.data);
    },
    {
      // there we have data to show before we fetch each post 
      // initialData: () => queryClient
      //   .getQueryData('posts')
      //   ?.find(post => post.id === postId),
      // initialStale: true,
    }
  );

  return (
    <div>
      <button
        onClick={() => setPostId(-1)}
      >Back</button>

      <br />
      <br />

      <div>
        {
          postQuery.isLoading ? 'Loading...' : postQuery.data.title
        }
      </div>
    </div>
  );
};

async function fetchPosts() {
  const posts = await axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.data);

  return posts;
};

//all posts items component
function Posts({ setPostId }) {
  // in case when we need count successful posts fetching
  // and get function out of useQuery hook
  // we can pass callbacks in settings object to listen life cycle of query
  const [count, increment] = useReducer(d => d + 1, 0)

  // const queryClient = useQueryClient();

  const postsQuery = useQuery(
    'posts',
    // async () => {
    // also we can set query data cache
    // and when post will be fetching
    // RQ show this data as initial state and updating post on background  
    //   const posts = await axios
    //     .get('https://jsonplaceholder.typicode.com/posts')
    //     .then(res => res.data);

    //   posts.forEach(post => {
    //     queryClient.setQueryData(['post', post.id], post);
    //   });

    //   return posts;
    // }
    fetchPosts,
    {
      onSuccess(data) { //when fetching success
        // console.log(data);

        increment();
      },
      onError(error) { //when fetching failed
        console.log(error);
      },
      onSettled(data, error) { //wen caching success - error === undefined, error - data === undefined

      },
    }
  );

  return (
    <div>
      <h1>Posts {count}
        {
          postsQuery.isFetching ? '...' : null
        }
      </h1>

      <div>
        {
          postsQuery.isLoading
            ? 'Loading...'
            : <ul>
              {
                postsQuery.data.map(post => (
                  <li key={post.id}>
                    <a
                      href="#"
                      onClick={() => setPostId(post.id)} 
                    >{post.title}</a>
                  </li>
                ))
              }
            </ul>
        }
      </div>
    </div>
  );
};

export default function ListsItems() {
  const [postId, setPostId] = useState(-1);

  return (
    <div>
      {
        postId >= 0 
          ? <Post postId={postId} setPostId={setPostId}/>
          : <Posts setPostId={setPostId}/>
      }
    </div>
  );
};