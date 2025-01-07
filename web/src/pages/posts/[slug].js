import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function getStaticPaths() {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  try {
    const res = await axios.get(`${apiUrl}/posts`);
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
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';

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
      const postRes = await axios.get(`${apiUrl}/posts/${post.documentId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const existingComments = postRes.data.data.Comments || [];

      const newCommentBlock = {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: comment,
          },
        ],
      };

      const updatedComments = [...existingComments, newCommentBlock];

      const res = await axios.put(
        `${apiUrl}/posts/${post.documentId}`,
        {
          data: {
            Comments: updatedComments,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      setComments(res.data.data.Comments || []);
      setComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error.response?.data || error.message);
      toast.error('Failed to submit comment. Please try again.');
    }
  };

  const renderContent = (content) =>
    content.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="mb-4 text-gray-200">
              {block.children.map((child, idx) => (
                <span key={idx}>{child.text}</span>
              ))}
            </p>
          );
        case 'heading':
          return (
            <h2 key={index} className="mb-4 text-lg font-bold text-gray-300">
              {block.children.map((child, idx) => (
                <span key={idx}>{child.text}</span>
              ))}
            </h2>
          );
        case 'icon':
          return (
            <span key={index} role="img" aria-label="icon" className="text-2xl">
              {block.children.map((child, idx) => (
                <span key={idx}>{child.text}</span>
              ))}
            </span>
          );
        default:
          return null;
      }
    });

  if (!post) {
    return <div className="text-center text-red-500">Post not found</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-100 mb-6">{post.Title}</h1>
        {post.Content && renderContent(post.Content)}

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-100">Comments</h2>
          <div className="mt-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800 rounded-md shadow-md border border-gray-700"
                >
                  {renderContent([comment])}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-4 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Comment
              </button>
            </form>
          ) : (
            <p className="mt-6 text-red-500">You must be logged in to comment.</p>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
}
