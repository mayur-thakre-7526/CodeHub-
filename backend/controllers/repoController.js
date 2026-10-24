const mongoose = require("mongoose");
const Repository = require("../models/repo.model.js");
const User = require("../models/user.model.js");
const Issue = require("../models/issue.model.js");

const createRepository = async (req, res) => {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Owner ID is required!" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created!",
      repositoryId: result._id,
    });
  } catch (error) {
    console.error("Error during repository creation : ", error.message);
    res.status(500).send("Server error");
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(repositories);
  } catch (error) {
    console.error("Error during all repositories fetching : ", error.message);
    res.status(500).send("Server error");
  }
};

const fetchRepositoryById = async (req, res) => {
  const { userId } = req.params.id;
  try {
    const repository = await Repository.find({ _id: userId })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (error) {
    console.error("Error during all repository fetching : ", error.message);
    res.status(500).send("Server error");
  }
};

const fetchRepositoryByName = (req, res) => {
  res.send("Repository details fetched!");
};

const fetchRepositoryForCurrentUser = (req, res) => {
  res.send("Repository for Logged In user Fetched!");
};

const updateRepositoryById = (req, res) => {
  res.send("Repository updated");
};

const deleteRepositoryById = (req, res) => {
  res.send("Repository deleted!");
};

const toggleVisibilityById = (req, res) => {
  res.send("Visibility Toggled!");
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  toggleVisibilityById,
};
