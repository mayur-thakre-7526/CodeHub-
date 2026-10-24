const express = require("express");
const issueController = require("../controllers/issueController.js");

const issueRouter = express.Router();

issueRouter.post("/issue/:id/create", issueController.createIssue);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.get("/issue/all", issueController.getAllIssue);
issueRouter.put("/issue/:id", issueController.getIssueById);

module.exports = issueRouter;
