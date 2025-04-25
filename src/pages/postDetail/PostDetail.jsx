import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import "./PostDetail.css";
import supabase from "../../client";


const PostDetail = () => {
  const { isAuthenticated, userId, currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(false);

  useEffect(() => {


    const getPost = async () => {
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("post_id", id)
        .single();
      if (error) {
        throw error;
      }
      setPost(post);
    };

    const getComments = async () => {
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id);
      if (commentsError) {
        throw commentsError;
      }
      setComments(comments);
    };

    getPost();
    getComments();
  }, [id]);

  if (!post) {
    return <div className="post-detail-loading">Loading post...</div>;
  }

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const handleUpvote = () => {
    if (!isAuthenticated) {
      setAlert(true);
      return;
    }

    setPost((prev) => ({
      ...prev,
      upvotes: prev.upvotes + 1,
    }));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      if (!comment.trim()) return;

    if (!isAuthenticated) {
      setAlert(true);
      return;
    }

    const newComment = {
      user_id: userId,
      username: currentUser.username,
      post_id: id,
      content: comment
    };
   
    const {error} = await supabase
      .from("comments")
      .insert(newComment)
      .select();

    if (error) {
      throw error;
    }

    setComments((prev) => [...prev, newComment]);

    setComment("");
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="post-detail-container">
      <div className="post-content-container">
        <div className="post-header-actions">
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Back to Feed
          </button>

          {isAuthenticated && post.user_id === userId && (
            <div className="post-actions-right">
              <button
                className="btn-edit"
                onClick={() => navigate(`/edit-post/${id}`)}
              >
                Edit Post
              </button>
            </div>
          )}
        </div>

        <div className="card post-detail-card">
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span className="username">{post.username}</span>
              <span className="post-date">{formatDate(post.created_at)}</span>
              <div className={`post-category ${post.category}`}>
                {post.category}
              </div>
            </div>
          </div>

          <div className="post-content">
            <p>{post.content}</p>
          </div>

          {post.image_url && (
            <div className="post-image">
              <img src={post.image_url} alt={post.title} />
            </div>
          )}

          <div className="post-engagement">
            <button className="button-upvote" onClick={handleUpvote}>
              <span>👏</span> {post.upvotes} Upvotes
            </button>

            {alert && (
              <Snackbar
                open={alert}
                autoHideDuration={3000}
                onClose={() => setAlert(false)}
              >
                <Alert severity="error">Please log in to upvote</Alert>
              </Snackbar>
            )}
          </div>
        </div>

        <div className="card comments-section">
          <h3>Comments ({comments.length})</h3>

          {isAuthenticated && (
            <form className="comment-form" onSubmit={handleAddComment}>
              <textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                required
              />
              <button type="submit" className="btn-primary">
                Post Comment
              </button>
            </form>
          )}

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div className="comment" key={comment.id}>
                  <div className="comment-header">
                    <span className="comment-username">{comment.username}</span>
                    <span className="comment-date">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))  
            ) : (
              <div className="no-comments">
                No comments yet. {isAuthenticated ? "Be the first to comment!" : "Log in to comment!"}  
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
