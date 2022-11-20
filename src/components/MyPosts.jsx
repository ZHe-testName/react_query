// Dependent Queries is queries what dont start work until previous
// query which is depend dont finish its work
// for example
// we loaded user at first
// email Sincere@april.biz
// https://jsonplaceholder.typicode.com/users?email=Sincere@april.biz
// and after use this object to get posts
// https://jsonplaceholder.typicode.com/posts?userId=${userId}

import axios from "axios";
import { useQuery } from "react-query"

const existingUser = {
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
};

export default function MyPosts() {
  const userInfo = useQuery(
    'user',
    () => {
      return axios
        .get(
          'https://jsonplaceholder.typicode.com/users?email=Sincere@april.biz'
        )
        .then(res => res.data[0]);
    },
    {
      initialData: existingUser, //this is mock initial data what be loaded before requesting
      initialStale: true, //say that RQ must use initial date only still we dont have real fetching data
    }
  );

  const postsInfo = useQuery(
    'posts',
    () => {
      return axios
      .get(
        `https://jsonplaceholder.typicode.com/posts?userId=${userInfo.data.id}`
      )
      .then(res => res.data);
    },
    {
      enabled: !!userInfo.data?.id, //to make shure that this request starts after our first request
    }
  );
  return (
    <div>
      {
        userInfo.isLoading 
          ? <span>Loading...</span>
          : <div>
              user name : {userInfo.data.name}
              <br />
              <br />
              {
                postsInfo.isIdle ? null : postsInfo.isLoading
                  ? <span>Posts loading...</span>
                  : <div>Posts count : {postsInfo.data.length}</div>
              }
            </div>
      }
      {
        <div>
          <pre>{JSON.stringify(userInfo)}</pre>
          <span>{userInfo.isFetching ? 'Updating...' : null}</span>
        </div>
      }
    </div>
  );
};