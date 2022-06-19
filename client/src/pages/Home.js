import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { Grid, List, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/Graphql";
// import { client } from '../ApolloProvider';

const Home = () => {
  const context = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);

  // client
  //   .query({
  //     query: FETCH_POSTS_QUERY,
  //   })
  //   .then((result) => {
  //     console.log('Areas 1 Data: ', result.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  return (
    <>
      <Grid columns={3}>
        <Grid.Row centered className="page-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {context.user && (
            <Grid.Column style={{ marginBottom: "20px" }}>
              <PostForm />
            </Grid.Column>
          )}
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <Transition.Group duration={200}>
              {posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: "20px" }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
};

export default Home;
