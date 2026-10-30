const mongoose = require("mongoose");
const Repository = require("../models/repo.model.js");

const authorizeRepositoryOwner = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid repository ID.",
    });
  }

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found.",
      });
    }

    const repositoryOwnerId = repository.owner.toString();
    const currentUserId = req.user.id.toString();

    if (repositoryOwnerId !== currentUserId) {
      return res.status(403).json({
        error: "You are not authorized to modify this repository.",
      });
    }

    req.repository = repository;

    next();
  } catch (error) {
    console.error("Repository authorization error:", error.message);

    return res.status(500).json({
      error: "Unable to verify repository ownership.",
    });
  }
};

module.exports = { authorizeRepositoryOwner };
