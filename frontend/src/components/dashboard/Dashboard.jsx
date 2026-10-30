import React, { useState, useEffect } from "react";
import "../navbar/navbar.css";
import Navbar from "../navbar/Navbar.jsx";
import "./dashboard.css";
import RepositoryCard from "./RepositoryCard.jsx";

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
          <h2>Your Repositories</h2>

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
              <RepositoryCard key={repo._id} repo={repo} />
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
