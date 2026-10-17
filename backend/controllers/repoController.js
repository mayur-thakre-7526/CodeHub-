const createRepository = (req, res) => {
  res.send("Repository created!");
};

const getAllRepositories = (req, res) => {
  res.send("All Repository Fetched!");
};

const fetchRepositoryById = (req, res) => {
  res.send("Repository details fetched!");
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
