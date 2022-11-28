import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
      <h2>Create New Title</h2>

      <PostForm
        onSubmit={createPost}
        clearOnSubmit={true}
        buttonText={buttonText}
      />
    </>
  );
};

export default function MutationPost() {
  const [postId, setPostId] = useState(1);
  const queryClient = useQueryClient();

  const postQuery = useQuery(
    ['post', postId],
    () => {
      return axios
        .get(`https://mockend.com/ZHe-testName/mockend/posts/${postId}`)
        .then(res => res.data);
    },
  );

  const {
      data, 
      mutate,
      isLoading,
      isError,
      isSuccess
    } = useMutation(values => {
    const obj = {
      title: values,
      id: 1,
    };

    return axios
      .patch(`https://mockend.com/ZHe-testName/mockend/posts/${obj.id}`, obj)
      .then(res => res.data);
  },{
    onMutate: (data) => { //with backup
      queryClient.cancelQueries(['post', 1]);

      const oldPost = queryClient.getQueryData(['post', 1]);

      queryClient.setQueryData(['post', 1], data);

      return () => queryClient.setQueryData(['post', 1], oldPost);
    },
    onError: (
      data,
      values,
      rollback
    ) => {
      if (rollback) {
        rollback();
      };
    },
    onSuccess: (
      data, //this is response object from request
      values //data what we pass in mutate callback
    ) => {
      console.log(data, values);
      //this way will be refetch or data
      //we had another way to set query
      // return queryClient.invalidateQueries(['post', String(data.id)]);
      // setQueryData its a very powerful method
      // we can use it to refresh directly query cash
      // but this method mutate cash and we cant be shure that we have fresh data
      queryClient.setQueryData(['post', 1], data);

      // we can use both methods to be shure that uer data is 
      //fresh because we invalidateQueries on background
    },
  });

  return (
    <>
      {
        postQuery.isLoading
          ? 'Loading...'
          : <div>
            <h1>{postQuery.data.title}</h1>

            <p>
              <small>
                Post ID : 
                {
                  postQuery.data.id
                }
              </small>
            </p>

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
      }    
    </>
  );
};