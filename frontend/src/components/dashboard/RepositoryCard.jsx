import React from "react";

const RepositoryCard = ({ repo, variant = "default" }) => {
  return (
    <article
      className={`repository-card ${variant === "compact" ? "repository-card-compact" : ""}`}
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
      </div>
    </article>
  );
};

export default RepositoryCard;
