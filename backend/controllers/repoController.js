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
    const repositories = await Repository.find({
      visibility: true,
    })
      .populate("owner", "username")
      .populate("issues");

    return res.status(200).json(repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error.message);

    return res.status(500).json({
      error: "Unable to fetch repositories.",
    });
  }
};

const fetchRepositoryById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid repository ID.",
      });
    }

    const repository = await Repository.findById(id)
      .populate("owner", "username")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found.",
      });
    }

    // visibility: true means public
    const isPublic = repository.visibility === true;

    const isOwner =
      req.user &&
      repository.owner &&
      repository.owner._id.toString() === req.user.id.toString();

    if (!isPublic && !isOwner) {
      return res.status(403).json({
        error: "You are not authorized to view this private repository.",
      });
    }

    return res.status(200).json(repository);
  } catch (error) {
    console.error("Error fetching repository:", error.message);

    return res.status(500).json({
      error: "Unable to fetch repository.",
    });
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name } = req.params;
  try {
    const repositories = await Repository.find({ name })
      .populate("owner", "username")
      .populate("issues");

    const accessibleRepositories = repositories.filter((repository) => {
      const isPublic = repository.visibility === true;

      const isOwner =
        req.user &&
        repository.owner &&
        repository.owner._id.toString() === req.user.id.toString();

      return isPublic || isOwner;
    });

    return res.status(200).json(accessibleRepositories);
  } catch (error) {
    console.error("Error fetching repository by name:", error.message);

    return res.status(500).json({
      error: "Unable to fetch repository.",
    });
  }
};

const fetchRepositoryForCurrentUser = async (req, res) => {
  const userId = req.params.userId;

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
  const { content, description } = req.body;

  try {
    const repository = await req.repository;

    if (content !== undefined) {
      repository.content.push(content);
    }

    if (description !== undefined) {
      repository.description = description;
    }

    const updatedRepository = await repository.save();

    return res.status(200).json({
      message: "Repository updated successfully",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error("Error updating repository:", error.message);

    return res.status(500).json({
      error: "Unable to update repository.",
    });
  }
};

const toggleVisibilityById = async (req, res) => {
  try {
    const repository = req.repository;

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    return res.status(200).json({
      message: "Repository visibility updated successfully.",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error("Error toggling repository visibility:", error.message);

    return res.status(500).json({
      error: "Unable to update repository visibility.",
    });
  }
};

const deleteRepositoryById = async (req, res) => {
  try {
    await req.repository.deleteOne();

    return res.status(200).json({
      message: "Repository deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting repository:", error.message);

    return res.status(500).json({
      error: "Unable to delete repository.",
    });
  }
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
