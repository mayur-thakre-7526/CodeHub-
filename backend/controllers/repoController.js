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
  const repoId = req.params.id;
  try {
    const repository = await Repository.findById(repoId)
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (error) {
    console.error("Error during all repository fetching : ", error.message);
    res.status(500).send("Server error");
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name: repoName } = req.params;
  try {
    const repository = await Repository.find({ name: repoName })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (error) {
    console.error("Error during all repository fetching : ", error.message);
    res.status(500).send("Server error");
  }
};

const fetchRepositoryForCurrentUser = async (req, res) => {
  const userId = req.user;

  try {
    const userRepositories = await Repository.find({ owner: userId });

    if (!userRepositories || userRepositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found" });
    }

    res.json({
      message: "User Repositories fetched successfully",
      userRepositories,
    });
  } catch (error) {
    console.error(
      "Error during fetching current user repositories",
      error.message,
    );
    res.status(500).send("Server Error");
  }
};

const updateRepositoryById = async (req, res) => {
  const id = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "User Repository not found" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully",
      repository: updatedRepository,
    });
    
  } catch (error) {
    console.error("Error during updating the repository", error.message);
    res.status(500).send("Server Error");
  }
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
