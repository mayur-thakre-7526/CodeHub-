import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import "./repositoryDetails.css";

const RepositoryDetails = () => {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepository = async () => {
      setIsLoading(true);
      setError("");
      setRepository(null);

      try {
        const response = await fetch(`http://localhost:3002/repo/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to fetch repository details.");
        }

        if (!data || !data._id) {
          throw new Error("Repository not found.");
        }

        setRepository(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRepository();
    } else {
      setError("Invalid repository ID.");
      setIsLoading(false);
    }
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="repository-details-page">
        <Link to="/" className="back-to-dashboard">
          ← Back to Dashboard
        </Link>

        {isLoading && (
          <p className="repository-details-status">
            Loading repository details...
          </p>
        )}

        {!isLoading && error && (
          <div className="repository-details-error" role="alert">
            <h2>Unable to load repository</h2>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && repository && (
          <article className="repository-details-card">
            <div className="repository-details-header">
              <div>
                <p className="repository-details-eyebrow">
                  CODEHUB / REPOSITORY
                </p>

                <h1>{repository.name}</h1>
              </div>

              <span className="repository-visibility">
                {repository.visibility === undefined
                  ? "Visibility unknown"
                  : repository.visibility
                    ? "Public"
                    : "Private"}
              </span>
            </div>

            <p className="repository-details-description">
              {repository.description?.trim() || "No description provided."}
            </p>

            <div className="repository-details-divider" />

            <section className="repository-information">
              <h2>About this repository</h2>

              <div className="repository-information-row">
                <span>Owner</span>
                <strong>{repository.owner?.username || "Unknown"}</strong>
              </div>

              <div className="repository-information-row">
                <span>Issues</span>
                <strong>
                  {Array.isArray(repository.issues)
                    ? repository.issues.length
                    : 0}
                </strong>
              </div>

              <div className="repository-information-row">
                <span>Repository ID</span>
                <code>{repository._id}</code>
              </div>
            </section>

            <section className="repository-issues">
              <h2>Issues</h2>

              {!Array.isArray(repository.issues) ||
              repository.issues.length === 0 ? (
                <p className="repository-details-status">
                  No issues are associated with this repository yet.
                </p>
              ) : (
                <div className="repository-issues-list">
                  {repository.issues.map((issue, index) => (
                    <article
                      className="repository-issue-item"
                      key={issue._id || index}
                    >
                      <h3>
                        {issue.title || issue.titleName || "Untitled issue"}
                      </h3>

                      <p>{issue.description || "No description provided."}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </article>
        )}
      </main>
    </>
  );
};

export default RepositoryDetails;
