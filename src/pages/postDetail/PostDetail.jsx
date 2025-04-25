import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import "./PostDetail.css";
import supabase from "../../client";


const PostDetail = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const {userId} = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); 
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch post details
        const { data: post, error } = await supabase
          .from("posts")
          .select("*, users:user_id(username)")
          .eq("post_id", id)
          .single();
        
        if (error) {
          console.error("Error fetching post:", error);
          return;
        }
        
        setPost(post);
        
        // Fetch comments
        const { data: comments, error: commentsError } = await supabase
          .from("comments")
          .select("*, users:user_id(username)")
          .eq("post_id", id)
          .order('created_at', { ascending: false });
        
        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
          setComments([]);
        } else {
          setComments(comments || []);
        }
        
        // Fetch upvotes
        const { data: upvotes, error: upvotesError } = await supabase
          .from("upvotes")
          .select("*")
          .eq("post_id", id);
        
        if (upvotesError) {
          console.error("Error fetching upvotes:", upvotesError);
          setUpvoteCount(0);
        } else {
          setUpvoteCount(upvotes?.length || 0);
        }
        
      } catch (error) {
        console.error("Error in fetchPostData:", error);
      }
    };

    fetchPostData();
  }, [id]); 

  if (!post) {
    return <div className="post-detail-loading">Loading post...</div>;
  }

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) {
      if (minutes <= 0) {
        return "just now";
      }
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const handleAddUpvote = async () => {
    if (!isAuthenticated) {
      setAlert(true);
      return;
    }
     
    const { data: hasUpvoted, error: hasUpvotedError } = await supabase
        .from("upvotes")
        .select("*")
        .eq("post_id", id)
        .eq("user_id", userId);
      if (hasUpvotedError){
        throw hasUpvotedError;
      }
      
      if (hasUpvoted.length > 0){
        setAlert(true);
        return;
      }
    
    const { error } = await supabase
      .from("upvotes")
      .insert({
        user_id: userId,
        post_id: id,
      });

    if (error) {
      throw error;
    }

    setUpvoteCount(upvoteCount + 1);
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
   
    const {data, error} = await supabase
      .from("comments")
      .insert(newComment)
      .select();

    if (error) {
      throw error;
    }

    console.log("received data", data);
    setComments((prev) => [...prev, {
      id: data[0].id,
      username: data[0].username,
      content: data[0].content,
      created_at: data[0].created_at
    }]);

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
            <button className="button-upvote" onClick={handleAddUpvote}>
              <span>👏</span> {upvoteCount} Upvotes
            </button>

            {alert && (
              <Snackbar
                open={alert}
                autoHideDuration={3000}
                onClose={() => setAlert(false)}
              >
                {isAuthenticated ? <Alert severity="error">You have already upvoted this post</Alert> : <Alert severity="error">Please log in to upvote</Alert>}
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
              comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((comment) => (
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
