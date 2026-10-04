const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".mygit"); // hidden folder to store repository data
  const commitsPath = path.join(repoPath, "commits"); // commits folder to store commit data

  try {
    await fs.mkdir(repoPath, { recursive: true }); 
    await fs.mkdir(commitsPath, { recursive: true }); 
    await fs.writeFile(
      path.join(repoPath, "config.json"), // create a config file to store repository configuration
      JSON.stringify({ bucket: process.env.S3_BUCKET }), 
    );

    console.log("Initialized empty repository in .mygit");
  } catch (err) {
    console.error("Error initializing repository:", err);
  }
}

module.exports = { initRepo };
