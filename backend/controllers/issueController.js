const createIssue = (req, res) => {
  res.send("Issue Created!");
};

const updateIssueById = (req, res) => {
  res.send("Issue Updated!");
};

const deleteIssueById = (req, res) => {
  res.send("Issue Deleted!");
};

const getAllIssue = (req, res) => {
  res.send("All Issues Fetched!");
};

const getIssueById = (req, res) => {
  res.send("Issue details fetched!");
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssue,
  getIssueById,
};