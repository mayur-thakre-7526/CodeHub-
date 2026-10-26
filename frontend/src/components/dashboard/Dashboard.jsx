import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]); // current user repo
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
        setRepositories(data.repositories);
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
        console.log(suggestedRepositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    // execute, because we want to show automatic int he dashboard
    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);
};

export default Dashboard;
