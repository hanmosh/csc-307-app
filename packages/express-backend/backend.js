// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByNameAndJob = (name, job) => {
  return users.users_list.filter(
    (user) => user.name === name && user.job === job
  );
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  if (name && job) {
    const result = findUserByNameAndJob(name, job);
    res.send({ users_list: result });
  } else if (name) {
    let result = findUserByName(name);
    res.send({ users_list: result });
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const generateUserId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const addUser = (user) => {
  const exists = users.users_list.some((u) => u.id === user.id);
  if (exists) {
    throw new Error("User already exists with this ID");
  }
  users.users_list.push(user);
  return user;
};

app.post("/users", (req, res) => {
  try {
    const userToAdd = req.body;
    const newUser = { ...userToAdd, id: generateUserId() }; 
    addUser(newUser); 
    res.status(201).send(newUser); 
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE a user by ID
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const index = users.users_list.findIndex((user) => user.id === id);
  if (index === -1) {
    res.status(404).send("User not found.");
  } else {
    users.users_list.splice(index, 1);
    res.status(200).send(`User with id ${id} deleted.`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
