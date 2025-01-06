import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function getStaticPaths() {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'; // Base URL without /api

  try {
    const res = await axios.get(`${apiUrl}/posts`); // Fetch posts from Strapi
    const posts = res.data.data;

    const paths = posts.map((post) => ({
      params: { slug: post.Slug },
    }));

    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api'; // Fallback URL

  try {
    const res = await axios.get(`${apiUrl}/posts?slug=${params.slug}`);
    const post = res.data.data[0];

    if (!post) {
      return { props: { post: null } };
    }

    return { props: { post } };
  } catch (error) {
    console.error(error);
    return { props: { post: null } };
  }
}

export default function PostPage({ post }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setIsAuthenticated(true);
    }

    const fetchComments = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
      try {
        const res = await axios.get(`${apiUrl}/posts/${post.documentId}`);
        const postWithComments = res.data.data;
        setComments(postWithComments.comments || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      }
    };

    if (post?.documentId) fetchComments();
  }, [post?.documentId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!comment) {
      toast.error('Please enter a comment.');
      return;
    }
  
    if (!isAuthenticated) {
      toast.error('You must be logged in to comment.');
      return;
    }
  
    const jwt = localStorage.getItem('jwt');
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
  
    try {
      // Fetch existing Comments
      const postRes = await axios.get(`${apiUrl}/posts/${post.documentId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
  
      console.log('Existing comments:', postRes.data.data.Comments);
  
      // Step 2: Check if Comments exist, if not initialize it as an empty array
      const existingComments = postRes.data.data.Comments || [];
  
      // Add new comment in the correct block format for Strapi rich text
      const updatedComments = [
        ...existingComments,
        {
          content: [
            {
              type: 'text',  // This tells Strapi that it's plain text content
              text: comment, // Add your comment text here
            }
          ]
        }
      ];
  
      // Update the post with the new Comments array
      const res = await axios.put(
        `${apiUrl}/posts/${post.documentId}`,
        {
          data: {
            Comments: updatedComments, // Correctly formatted comment
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
  
      // Update local Comments state
      setComments(res.data.data.Comments || []);
      setComment(''); // Clear the input field
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error.response?.data || error.message);
      toast.error('Failed to submit comment. Please try again.');
    }
  };

  const renderContent = (content) =>
    content.map((block, index) =>
      block.type === 'paragraph' ? (
        <p key={index}>
          {block.children.map((child, idx) => (
            <span key={idx}>{child.text}</span>
          ))}
        </p>
      ) : null
    );

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.Title}</h1>
      {post.Content && renderContent(post.Content)}

      <div>
        <h2>Comments</h2>
        <div>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="mb-4">
                {renderContent([comment])}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 bg-gray-800 text-white rounded-md"
            />
            <button
              type="submit"
              className="w-full py-2 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Comment
            </button>
          </form>
        ) : (
          <p className="mt-4 text-red-500">You must be logged in to comment.</p>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
