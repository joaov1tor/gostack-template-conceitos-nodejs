const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateProjectId);

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Project ID." })
  }
  return next();
}

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title: title, url: url, techs: techs, likes: 0 };

  repositories.push(repository)

  return response.status(201).json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex >= 0) {

    repositories[repositoriesIndex].title = title;
    repositories[repositoriesIndex].url = url;
    repositories[repositoriesIndex].techs = techs;

    return response.status(201).json(repositories[repositoriesIndex]);

  } else {
    return response.status(400).json({ error: "repository not found." });
  }

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex >= 0) {

    repositories.splice(repositoriesIndex, 1);

    return response.status(204).send();

  } else {
    return response.status(400).json({ error: "repository not found." });
  }

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex >= 0) {
    repositories[repositoriesIndex].likes++;

    return response.status(201).json(repositories[repositoriesIndex])

  } else {
    return response.status(400).json({ error: "repository not found." });
  }

});

module.exports = app;
