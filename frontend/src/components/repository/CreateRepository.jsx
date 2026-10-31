import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import "./createRepository.css";

const CreateRepository = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3002/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          visibility,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create repository.");
      }

      // Return to the dashboard after successful creation
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="create-repository-page">
        <div className="create-repository-card">
          <Link to="/" className="back-link">
            ← Back to Dashboard
          </Link>

          <h1>Create a new repository</h1>

          <p className="form-subtitle">
            A repository stores your project's code and information.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="repo-name">Repository name *</label>

              <input
                id="repo-name"
                type="text"
                placeholder="e.g. my-awesome-project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="repo-description">Description</label>

              <textarea
                id="repo-description"
                placeholder="What is this repository about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
            </div>

            <div className="visibility-option">
              <label htmlFor="repo-visibility">Repository visibility</label>

              <select
                id="repo-visibility"
                value={visibility ? "public" : "private"}
                onChange={(e) => setVisibility(e.target.value === "public")}
              >
                <option value="public">Public — Anyone can view</option>
                <option value="private">Private — Only you can view</option>
              </select>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="create-repository-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create repository"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateRepository;
