import React from "react";
import { Link } from "react-router-dom";

const RepositoryCard = ({
  repo,
  variant = "default",
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(repo);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(repo);
  };

  return (
    <Link to={`/repo/${repo._id}`} className="repository-card-link">
      <article
        className={`repository-card ${
          variant === "compact" ? "repository-card-compact" : ""
        }`}
      >
        <div className="repository-card-header">
          <div className="repository-icon" aria-hidden="true">
            {repo.name?.charAt(0).toUpperCase() || "R"}
          </div>

          <div className="repository-card-title">
            <h3>{repo.name}</h3>
            <span className="repository-label">Repository</span>
          </div>
        </div>

        <p className="repository-description">
          {repo.description?.trim() || "No description provided."}
        </p>

        <div className="repository-card-footer">
          <span className="repository-type">
            <span className="status-dot"></span>
            CodeHub Repository
          </span>

          {isOwner && (
            <div className="repository-actions">
              <button type="button" onClick={handleEdit}>
                Edit
              </button>

              <button
                type="button"
                className="repository-delete-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default RepositoryCard;
