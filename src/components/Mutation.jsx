// When we work with server (GraphQl) we dont use only read queries
// Also we need operations like post, put, delete.

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

// For this cases in RQ uses Mutation generic type

function Posts({ postsQuery }) {
  return (
    <div>
      <h2>
        Posts{postsQuery.isFetching ? '...' : null}
      </h2>

      {
        postsQuery.isLoading 
          ? <div>Loading...</div>
          : postsQuery.isError
            ? <div><strong>Is Error</strong></div>
            : <ol>
                {
                  postsQuery.data.map(post => (
                    <li
                      key={post.id}
                    >
                      <h4>{`${post.id} - ${post.title}`}</h4>
                    </li>
                  ))
                }
              </ol>
      }
    </div>
  );
};

function PostForm({
  onSubmit,
  clearOnSubmit,
  buttonText
}) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        onSubmit(e.target.elements[0].value.trim());

        if (clearOnSubmit) {
          e.target.elements[0].value = '';
        };
      }}
    >
      <label htmlFor="">
        Title
        <input type="text" placeholder="Enter"/>
      </label>
      
      <button>{buttonText}</button>
    </form>
  );
};

function MutationForm({ createPost, buttonText }) {
  return (
    <>
      <h2>Create New Post</h2>

      <PostForm
        onSubmit={createPost}
        clearOnSubmit={true}
        buttonText={buttonText}
      />
    </>
  );
};

export default function MutationPosts() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery(
    'posts',
    async () => {
      return axios
        .get('https://mockend.com/ZHe-testName/mockend/posts')
        .then(res => res.data.slice(0, 5));
    },
    {
      refetchOnWindowFocus: false,
      onError: (e) => {
        console.log('Error', e);
      },
    }
  );

  // async function createPost(value) {
  //   console.log('Create post', value);

  //   const responce = await axios
  //    .put('https://mockend.com/ZHe-testName/mockend/posts/1', {
  //     title: value,
  //    })
  // };

  //instead createPost we might to use useMutation hook
  // it returned our function and a lot of loading information
  const {
      mutate, 
      isError, 
      isLoading, 
      isSuccess
    } = useMutation((value) => {
    console.log('Create post', value);

    return axios
     .post('https://mockend.com/ZHe-testName/mockend/posts', {
        id: Date.now(),
        title: value,
     })
  },
  {
    // onSuccess: (data) => { //here we can do everything after successfully loading
    //   console.log('JJJJJJJJJJJJJj',data, postsQuery);

    //   queryClient.invalidateQueries('posts');
    //   // its for manually refreshing posts
    //   //it dont need in real life because we will have normal API
    //   postsQuery.data.find(post => post.id === data.data.id).title = data.data.title;
    // },
    onError: (error, values, rollback) => { //this callback used when mutation is broken
      console.log(error.response.data.message);
      // queryClient.setQueryData('posts', oldPosts);
      if (rollback) {
        rollback();
      };
    },
    onSettled: (data) => { //this callback similar to onSuccess onError but it be called
      console.log('settled', data);
      queryClient.invalidateQueries('posts'); //any way lice finaly in try /catch
      // its for manually refreshing posts
      //it dont need in real life because we will have normal API
      // postsQuery.data.find(post => post.id === data.data.id).title = data.data.title;
    },
    onMutate: (data) => {//{ //this callback runs when when we call mutate and takes its args\'
      //we can use it for showing some optimistic results while we wait for invalidation in onSuccess
      console.log('mutate', data);
      // also good practice is cancel queries to be shure that we dont have any
      //unexpectable results for queries request
      queryClient.cancelQueries('posts');
      //in case whe something going wrong on server(some validation errors, etc)
      // good idea to return normal state cache for user is take e snapshot before
      //change query cache
      //and if something going wrong we can return previous state
      const oldPosts = queryClient.getQueryData('posts');

      queryClient.setQueriesData('posts', oldValue => {
        return [
          ...oldValue,
          {
            title: data,
            id: Date.now(),
          }
        ];
      });
      // to make rollback we need to return something from onMutate
      // it become third argument for onError and on Settled callbacks
      // return oldPosts;
      // or
      //we can return function what will be call in prev callbacks
      return () => queryClient.setQueriesData('posts', oldPosts);
    },
  });
  
  return (
    <div>
      <Posts postsQuery={postsQuery}/>

      <br/>
      <hr/>
      <br/>

      <MutationForm 
        createPost={mutate} 
        buttonText={
          isLoading 
            ? 'Saving...' 
            : isError
              ? 'Error!'
              : isSuccess
                ? 'Saved'
                : 'Create post'
        }
      />
    </div>
  );
};