import axios from 'axios';

export async function getStaticPaths() {
  const apiUrl = process.env.STRAPI_URL || 'http://localhost:1337';  // Base URL without /api

  try {
    const res = await axios.get(`${apiUrl}/posts`); // Fetch posts from Strapi
    const posts = res.data.data; // Ensure the response structure is correct

    const paths = posts.map((post) => ({
      params: { slug: post.Slug }, // Corrected to access 'Slug' directly
    }));

    return { paths, fallback: false };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.STRAPI_URL || 'http://localhost:1337/api';  // Fallback URL

  try {
    const res = await axios.get(`${apiUrl}/posts?slug=${params.slug}`); // Fetch post by slug
    const post = res.data.data[0]; // Ensure it's an array, get the first element

    // Check if the post and its content exist
    if (!post || !post.Content) {
      return { props: { post: null } };
    }

    return {
      props: { post }, // Return the post data
    };
  } catch (error) {
    console.error(error);
    return { props: { post: null } }; // Return null if error occurs
  }
}


export default function PostPage({ post }) {
  if (!post) {
    return <div>Post not found</div>;
  }

  // Render the content by checking if it exists
  const content = post.Content && post.Content.map((block, index) => {
    // Assuming each block is of type "paragraph" and contains children of type "text"
    if (block.type === 'paragraph') {
      return (
        <p key={index}>
          {block.children.map((child, idx) => (
            <span key={idx}>{child.text}</span> // Render the text inside each paragraph
          ))}
        </p>
      );
    }
    return null;
  });

  console.log("Post content:", JSON.stringify(post.Content, null, 2));

  return (
    <div>
      <h1>{post.Title}</h1>
      {content}
    </div>
  );
}
