import axios from 'axios';
import { format } from 'date-fns';

// Function to extract and preview content text
function extractContentPreview(content) {
  if (!content || !Array.isArray(content)) return ''; // Check for empty content or invalid type

  return content
    .map((block) => {
      // Check if the block has children and extract the text from them
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((child) => child.text).join(''); // Join text from all children
      }
      return ''; // In case the block doesn't have any text
    })
    .join(' ') // Join all blocks together
    .slice(0, 200); // Limit the preview to the first 200 characters
}

export default function Home({ posts }) {
  if (!Array.isArray(posts)) {
    return <div className="text-red-500">No posts available</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Posts</h1>
      <ul className="mt-4">
        {posts.map((post) => {
          const formattedDate = format(new Date(post.createdAt), 'dd MMMM yyyy');
          const previewContent = extractContentPreview(post.Content);

          return (
            <li key={post.id} className="mb-4">
              <a href={`/posts/${post.Slug}`} className="text-blue-500 text-xl font-semibold">
                {post.Title}
              </a>
              <p className="text-sm text-gray-500">{formattedDate}</p>
              <p className="mt-2 text-gray-700">{previewContent}...</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const { data } = await axios.get(`${process.env.STRAPI_URL}/posts`);

    // Check the structure of the response
    console.log("Fetched posts data:", JSON.stringify(data, null, 2));

    const posts = data.data || [];

    return { props: { posts } };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { props: { posts: [] } }; // Return empty array on error
  }
}
