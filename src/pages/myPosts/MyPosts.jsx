import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyPosts.css";
import { useAuth } from "../../context/AuthContext";
import supabase from "../../client";

const MyPosts = () => {
  const { userId } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        
        if (!userId) {
          console.error("Cannot fetch posts: User ID is undefined");
          return;
        }

        const { data: posts, error } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        console.log("original fetched posts", posts);

        const updatedPosts = [];

        for (const post of posts) {
          if (!post.post_id) {
            console.warn("Skipping post with undefined post_id:", post);
            continue;
          }

          try {
            const { data: comments, error: commentsError } = await supabase
              .from("comments")
              .select("*")
              .eq("post_id", post.post_id);

            if (commentsError) {
              console.error(`Error fetching comments for post ${post.post_id}:`, commentsError);
              updatedPosts.push({
                ...post,
                comment_count: 0,
                upvote_count: 0,
              });
              continue;
            }

            const { data: upvotes, error: upvotesError } = await supabase
              .from("upvotes")
              .select("*")
              .eq("post_id", post.post_id);

            if (upvotesError) {
              console.error(`Error fetching upvotes for post ${post.post_id}:`, upvotesError);
              
              updatedPosts.push({
                ...post,
                comment_count: comments ? comments.length : 0,
                upvote_count: 0,
              });
              continue;
            }

            updatedPosts.push({
              ...post,
              comment_count: comments ? comments.length : 0,
              upvote_count: upvotes ? upvotes.length : 0,
            });
          } catch (error) {
            console.error(`Error processing post ${post.post_id}:`, error);
            updatedPosts.push({
              ...post,
              comment_count: 0,
              upvote_count: 0,
            });
          }
        }
        
        console.log("updated posts", updatedPosts);
        setUserPosts(updatedPosts);
      } catch (error) {
        console.error("Error in fetchUserPosts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]); // Add userId to dependency array

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

  return (
    <div className="my-wins-container">
      <div className="page-header">
        <h2>My Wins</h2>
        <p>Here are all the wins you've shared</p>
      </div>

      {loading ? (
        <div className="loading-message">Loading your wins...</div>
      ) : userPosts.length > 0 ? (
        <div className="posts-feed">
          {userPosts.map((post) => (
            <div
              className="card post-card"
              key={post.post_id}
              onClick={() => navigate(`/post/${post.post_id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="post-header">
                <div className="post-user-info">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-meta">
                    <span className="post-date">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                </div>
                <div className={`post-category ${post.category.toLowerCase()}`}>
                  {post.category}
                </div>
              </div>
              <div className="post-content-preview">
                {post.content.length > 120
                  ? post.content.substring(0, 120) + "..."
                  : post.content}
              </div>
              <div className="post-actions">
                <div className="button-upvote">
                  <span>👏</span> {post.upvote_count || 0}
                </div>
                <div className="post-comments-count">
                  <span>💬</span> {post.comment_count || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-posts-message">
          <p>You haven't shared any wins yet.</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/create-post")}
          >
            Share Your First Win
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
