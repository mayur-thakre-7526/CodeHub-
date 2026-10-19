const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
}

const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await connectClient();
    const db = client.db("devhub");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (error) {
    console.error("Error during signup : ", error.message);
    res.status(500).send("Server error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("devhub");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray(); // convert into js array because db response data can't directly convert into json
    res.json(users);
  } catch (error) {
    console.error("Error during fetching all users : ", error.message);
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("devhub");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials.." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials.." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("Error during login : ", error);
    res.status(500).send("Server error!");
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    await connectClient();
    const db = client.db("devhub");
    const usersCollection = db.collection("users");

    // convert currId into mongodb ObjectId, because in mongodb id is stored as the ObjectId
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (error) {
    console.error("Error during fetching user profile : ", error);
    res.status(500).send("Server error!");
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("devhub");
    const usersCollection = db.collection("users");

    let updateFields = { email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: updateFields,
      },
      {
        returnDocument: "after",
      },
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(result.value);
  } catch (error) {
    console.error("Error during fetching user profile : ", error);
    res.status(500).send("Server error!");
  }
};

const deleteUserProfile = (req, res) => {
  res.send("Profile deleted!");
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
