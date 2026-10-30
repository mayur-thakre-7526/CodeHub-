const express = require("express");
const repoController = require("../controllers/repoController.js");
const { authenticateToken } = require("../middleware/auth.js");
const { optionalAuth } = require("../middleware/optionalAuth.js");

const { authorizeRepositoryOwner } = require("../middleware/repositoryAuth.js");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);

repoRouter.get("/repo/:id", optionalAuth, repoController.fetchRepositoryById);

repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get(
  "/repo/user/:userId",
  repoController.fetchRepositoryForCurrentUser,
);

// Authorized Routes
// In all these routes, first check token is valide or not then check user has permission to changes to the repo or not

repoRouter.put(
  "/repo/update/:id",
  authenticateToken,
  authorizeRepositoryOwner,
  repoController.updateRepositoryById,
);

repoRouter.delete(
  "/repo/delete/:id",
  authenticateToken,
  authorizeRepositoryOwner,
  repoController.deleteRepositoryById,
);

repoRouter.patch(
  "/repo/toggle/:id",
  authenticateToken,
  authorizeRepositoryOwner,
  repoController.toggleVisibilityById,
);

module.exports = repoRouter;
