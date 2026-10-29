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

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // First take the data, which we need

    // 1. fetch repositories for the current user
    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`,
        );
        const data = await response.json();
        setRepositories(data.userRepositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    // 2. fetch all the repositories
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
        console.log(data);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    // execute, because we want to show automatic int he dashboard
    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.map((repo) => (
            <RepositoryCard key={repo._id} repo={repo} variant="compact" />
          ))}
        </aside>
        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.map((repo) => (
            <RepositoryCard key={repo._id} repo={repo} />
          ))}
        </main>
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
