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
     .put('https://mockend.com/ZHe-testName/mockend/posts/1', {
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
    onError: (error) => { //this callback used when mutation is broken
      console.log(error.response.data.message);
    },
    onSettled: (data) => { //this callback similar to onSuccess onError but it be called
      queryClient.invalidateQueries('posts'); //any way lice finaly in try /catch
      // its for manually refreshing posts
      //it dont need in real life because we will have normal API
      // postsQuery.data.find(post => post.id === data.data.id).title = data.data.title;
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