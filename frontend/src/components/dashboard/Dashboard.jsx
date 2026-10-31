import React, { useState, useEffect } from "react";
import "../navbar/navbar.css";
import Navbar from "../navbar/Navbar.jsx";
import "./dashboard.css";
import RepositoryCard from "./RepositoryCard.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]); // current user repositories
  const [searchQuery, setSearchQuery] = useState(""); // current user search-box query
  const [suggestedRepositories, setSuggestedRepositories] = useState([]); // all repositories
  const [searchResults, setSearchResults] = useState([]); // serach query

  // New states for loading and error handling
  const [isRepositoriesLoading, setIsRepositoriesLoading] = useState(true);
  const [isSuggestedLoading, setIsSuggestedLoading] = useState(true);

  const [repositoriesError, setRepositoriesError] = useState("");
  const [suggestedError, setSuggestedError] = useState("");

  useEffect(() => {
    // First take the data, which we need
    // 1. fetch repositories for the current user
    const fetchRepositories = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          throw new Error("User session not found. Please log in again.");
        }

        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`,
        );

        const data = await response.json();

        // The backend currently returns 404 when a user has no repositories.
        if (response.status === 404) {
          setRepositories([]);
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Unable to fetch your repositories.");
        }

        setRepositories(
          Array.isArray(data.userRepositories) ? data.userRepositories : [],
        );
      } catch (error) {
        console.error("Error fetching user repositories:", error);
        setRepositoriesError(error.message || "Something went wrong.");
      } finally {
        setIsRepositoriesLoading(false);
      }
    };

    // 2. fetch all the repositories
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to fetch suggested repositories.",
          );
        }

        setSuggestedRepositories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching suggested repositories:", error);
        setSuggestedError(error.message || "Something went wrong.");
      } finally {
        setIsSuggestedLoading(false);
      }
    };

    // execute, because we want to show automatic int he dashboard
    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchResults(repositories);
      return;
    }

    const filteredRepositories = repositories.filter((repo) =>
      repo.name?.toLowerCase().includes(query),
    );
    setSearchResults(filteredRepositories);
  }, [searchQuery, repositories]);

  const handleEditRepository = async (repo) => {
    const name = window.prompt("Enter repository name:", repo.name);

    if (name === null || !name.trim()) {
      return;
    }

    const description = window.prompt(
      "Enter repository description:",
      repo.description || "",
    );

    if (description === null) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3002/repo/update/${repo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update repository.");
      }

      setRepositories((previousRepositories) =>
        previousRepositories.map((item) =>
          item._id === repo._id ? data.repository : item,
        ),
      );

      alert("Repository updated successfully!");
    } catch (error) {
      console.error("Error updating repository:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  const handleDeleteRepository = async (repo) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${repo.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3002/repo/delete/${repo._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete repository.");
      }

      setRepositories((previousRepositories) =>
        previousRepositories.filter((item) => item._id !== repo._id),
      );

      alert("Repository deleted successfully!");
    } catch (error) {
      console.error("Error deleting repository:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />

      <section id="dashboard">
        {/* Left sidebar */}
        <aside>
          <h3>Suggested Repositories</h3>

          {isSuggestedLoading && (
            <p className="dashboard-status">Loading suggestions...</p>
          )}

          {!isSuggestedLoading && suggestedError && (
            <p className="dashboard-error" role="alert">
              {suggestedError}
            </p>
          )}

          {!isSuggestedLoading &&
            !suggestedError &&
            suggestedRepositories.length === 0 && (
              <p className="dashboard-status">No repositories available yet.</p>
            )}

          {!isSuggestedLoading &&
            !suggestedError &&
            suggestedRepositories.map((repo) => (
              <RepositoryCard key={repo._id} repo={repo} variant="compact" />
            ))}
        </aside>

        {/* Main content */}
        <main>
          <div className="dashboard-repositories-header">
            <h2>Your Repositories</h2>

            <Link to="/repo/create" className="dashboard-create-button">
              + Create Repository
            </Link>
          </div>

          <div id="search">
            <input
              type="search"
              value={searchQuery}
              placeholder="Search your repositories..."
              aria-label="Search your repositories"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {isRepositoriesLoading && (
            <p className="dashboard-status">Loading your repositories...</p>
          )}

          {!isRepositoriesLoading && repositoriesError && (
            <p className="dashboard-error" role="alert">
              {repositoriesError}
            </p>
          )}

          {!isRepositoriesLoading &&
            !repositoriesError &&
            repositories.length === 0 && (
              <div className="dashboard-empty">
                <h3>No repositories yet</h3>
                <p>Your repositories will appear here once you create one.</p>
              </div>
            )}

          {!isRepositoriesLoading &&
            !repositoriesError &&
            repositories.length > 0 &&
            searchResults.length === 0 && (
              <div className="dashboard-empty">
                <h3>No matching repositories</h3>
                <p>Try searching with a different repository name.</p>
              </div>
            )}

          {!isRepositoriesLoading &&
            !repositoriesError &&
            searchResults.map((repo) => (
              <RepositoryCard
                key={repo._id}
                repo={repo}
                isOwner={true}
                onEdit={handleEditRepository}
                onDelete={handleDeleteRepository}
              />
            ))}
        </main>

        {/* Right sidebar */}
        <aside>
          <h3>Upcoming Events</h3>

          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
