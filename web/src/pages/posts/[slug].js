// import axios from 'axios';

// export default function Post({ post }) {
//   return (
//     <div>
//       <h1>{post.title}</h1>
//       <p>{post.content}</p>
//     </div>
//   );
// }

// export async function getStaticPaths() {
//   const { data } = await axios.get(`${process.env.STRAPI_URL}/posts`);
//   const paths = data.map((post) => ({ params: { slug: post.slug } }));

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//   const { data } = await axios.get(`${process.env.STRAPI_URL}/posts?slug=${params.slug}`);
//   return { props: { post: data[0] } };
// }

import axios from 'axios';

export async function getStaticPaths() {
  try {
    const res = await axios.get('http://localhost:1337/api/posts'); // Adjust the URL as needed
    const posts = res.data.data; // This assumes `res.data` contains a `data` field with an array of posts

    const paths = posts.map(post => ({
      params: { slug: post.attributes.slug }, // Ensure this matches your post field
    }));

    return { paths, fallback: false };
  } catch (error) {
    console.error(error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const res = await axios.get(`http://localhost:1337/api/posts?slug=${params.slug}`);
    const post = res.data.data[0]; // Ensure it's an array, get the first element

    return {
      props: { post },
    };
  } catch (error) {
    console.error(error);
    return { props: { post: null } };
  }
}

export default function PostPage({ post }) {
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.attributes.title}</h1>
      <p>{post.attributes.content}</p>
    </div>
  );
}
