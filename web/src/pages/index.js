import axios from 'axios';

// export default function Home({ posts }) {
//   return (
//     <div>
//       <h1>Bem-vindo ao site</h1>
//       <ul>
//         {posts.map((post) => (
//           <li key={post.id}>
//             <a href={`/posts/${post.slug}`}>{post.title}</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export default function Home({ posts }) {
  // Check if posts are an array before trying to map
  if (!Array.isArray(posts)) {
    return <div>No posts available</div>;
  }

  return (
    <div>
      <h1>Bem-vindo ao site</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/posts/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}


export async function getStaticProps() {
  const { data } = await axios.get(`${process.env.STRAPI_URL}/posts`);

  // Check the structure of the response and log if necessary
  console.log(data);

  // Access the actual array of posts and return as props
  const posts = data.data || []; // Use data.data if the response is wrapped in a "data" object

  return { props: { posts } };
}

