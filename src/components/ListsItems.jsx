// 'https://jsonplaceholder.typicode.com/posts'

// Realy cool that when we navigate between posts
// posts what be already visited stay in cash (during default or custom time)
// and after that we go to page with this post we dont fetch it again

import axios from "axios";
import { useState } from "react";
import { useQuery, QueryClient } from "react-query";

// init cache in component to initialize it
// const queryCache = new QueryCache({
//   onError(error) {
//     console.log('Faking Error', error);
//   },
//   onSuccess(data) {
//     console.log('return data: ', data);
//   }
// });

// single item component
function Post({ postId, setPostId }) {
  // That cool but we actualy dont need to fetch each individual post
  // couse we already have all information in our posts list
  // RQ have a powerful thing named queryCache

  // and we can set initial data for our post from cache if we need
  const postQuery = useQuery(
    ['post', postId],
    () => {
      return axios
        .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then(res => res.data);
    },
    {
      initialData: () => console.log(new QueryClient())
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

//all posts items component
function Posts({ setPostId }) {
  const postsQuery = useQuery(
    'posts',
    () => {
      return axios
        .get('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.data);
    }
  );

  return (
    <div>
      <h1>Posts 
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