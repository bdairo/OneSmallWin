import "./Home.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import supabase from "../../client";
import CATEGORIES from "../../contants";

const Home = () => {
  const location = useLocation();
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFilteredPosts = async () => {
      try {
        const { data: allPosts, error } = await supabase.from("posts").select(`
                    *,
                    users(username),
                    comments(*)
                `);
        if (error) {
          throw error;
        }
       
        const updatedPosts = [];
        for (const post of allPosts) {
          const { data: upvotes, error: upvotesError } = await supabase
            .from("upvotes")
            .select("*")
            .eq("post_id", post.post_id);

          if (upvotesError) {
            throw upvotesError;
          }

          post.upvote_count = upvotes.length ? upvotes.length : 0;
          updatedPosts.push({
            id: post.post_id,
            title: post.title,
            content: post.content,
            category: post.category,
            date: new Date(post.created_at),
            image_url: post.image_url,
            username: post.users.username,
            upvote_count: upvotes.length ? upvotes.length : 0,
            comments: post.comments,
          });
        }

        console.log("updatedPosts", updatedPosts);
        let filteredPosts = updatedPosts.filter((post) => {
          return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      
        if (activeCategory !== "All") {
          filteredPosts = filteredPosts.filter(
            (post) =>
              post.category.toLowerCase() === activeCategory.toLowerCase()
          );
        }
       
        let sortedPosts = [...filteredPosts];
        if (sortBy === "newest") {
          sortedPosts = sortedPosts.sort((a, b) => b.date - a.date);
        } else if (sortBy === "popular") {
          sortedPosts = sortedPosts.sort(
            (a, b) => b.upvote_count - a.upvote_count
          );
        }

        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchedPosts = getFilteredPosts();
    setPosts(fetchedPosts);
  }, [activeCategory, sortBy, searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
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

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="home-container">
      <div className="feed-header">
        <div className="title-and-filters">
          <h2>Recent Wins</h2>
          <div className="feed-filters">
            <button
              className={`filter-btn ${
                activeCategory === "All" ? "active" : ""
              }`}
              onClick={() => handleCategoryChange("All")}
            >
              All
            </button>
            <button
              className={`filter-btn ${
                activeCategory === CATEGORIES[1] ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(CATEGORIES[1])}
            >
              Fitness
            </button>
            <button
              className={`filter-btn ${
                activeCategory === CATEGORIES[2] ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(CATEGORIES[2])}
            >
              Learning
            </button>
            <button
              className={`filter-btn ${
                activeCategory === CATEGORIES[3] ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(CATEGORIES[3])}
            >
              Mental Health
            </button>
          </div>
        </div>

        <div className="sort-options">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="popular">Most Upvoted</option>
          </select>
        </div>
      </div>

      <div className="posts-feed">
        {loading ? (
          <div className="loading-message">
            <p>Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Link to={`/post/${post.id}`} className="post-link" key={post.id}>
              <div className="card post-card">
                <div className="post-header">
                  <div className="post-user-info">
                    <div className="post-meta">
                      <span className="username">{post.username}</span>
                      <span className="post-date">{formatDate(post.date)}</span>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                  </div>
                  <div
                    className={`post-category ${post.category.toLowerCase()}`}
                  >
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
                    <span>👏</span> {post.upvote_count}
                  </div>
                  <div className="post-comments-count">
                    <span>💬</span> {post.comments.length}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-posts-message">
            <p>
              No wins found matching your search. Try a different search term or
              category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
