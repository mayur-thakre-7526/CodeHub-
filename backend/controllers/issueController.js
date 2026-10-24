const mongoose = require("mongoose");
const Repository = require("../models/repo.model.js");
const User = require("../models/user.model.js");
const Issue = require("../models/issue.model.js");

const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const { id: repoId } = req.params;

  try {
    const newIssue = new Issue({
      title,
      description,
      repository: repoId,
    });

    await newIssue.save();

    res.status(201).json(newIssue);
  } catch (error) {
    console.error("Error during issue creation", error.message);
    res.status(500).send("Server Error");
  }
};

const updateIssueById = async (req, res) => {
  const { id: issueId } = req.params;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json({ message: "Issue updated successfully", Issue: issue });
  } catch (error) {
    console.error("Error during issue updation", error.message);
    res.status(500).send("Server Error");
  }
};

const deleteIssueById = async (req, res) => {
  const { id: issueId } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(issueId);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Error during issue delation", error.message);
    res.status(500).send("Server Error");
  }
};

const getAllIssue = async (req, res) => {
  const { id: repoId } = req.params;

  try {
    const issues = await Issue.find({ repository: repoId });

    if (!issues) {
      return res.status(404).json({ error: "Issues not found!" });
    }

    res.status(200).json(issues);
  } catch (error) {
    console.error("Error during issues fetching", error.message);
    res.status(500).send("Server Error");
  }
};

const getIssueById = async (req, res) => {
  const { id: issueId } = req.params;

  try {
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (error) {
    console.error("Error during issue updation", error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssue,
  getIssueById,
};
