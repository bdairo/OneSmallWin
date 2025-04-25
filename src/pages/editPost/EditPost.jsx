import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import supabase from "../../client";
import CATEGORIES from "../../contants";
import "./EditPost.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("post_id", id)
          .single();
          
        if (error) {
          throw error;
        }
          
        setEditFormData({
          title: data.title,
          content: data.content,
          imageUrl: data.image_url,
          category: data.category,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    
    fetchPost();
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title: editFormData.title,
          content: editFormData.content,
          image_url: editFormData.imageUrl,
          category: editFormData.category,
          updated_at: new Date()
        })
        .eq("post_id", id);
        
      if (error) {
        throw error;
      }
      
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const { error } = await supabase
          .from("posts")
          .delete()
          .eq("post_id", id);
          
        if (error) {
          throw error;
        }
        
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="edit-post-form">
      <div className="edit-post-header">
        <h2>Edit Your Win</h2>
        <button className="delete-post-btn" onClick={handleDelete}>
          Delete Post
        </button>
      </div>

      <form onSubmit={handleEditSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={editFormData.title}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Description</label>
          <textarea
            id="content"
            name="content"
            value={editFormData.content}
            onChange={handleEditChange}
            rows={4}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={editFormData.imageUrl}
            onChange={handleEditChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={editFormData.category}
            onChange={handleEditChange}
          >
            {Object.values(CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/post/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
