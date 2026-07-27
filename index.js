const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiDocument = require('./openapi.json');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

// Our in-memory task list
const tasks = [
  {
    id: 1,
    title: "Learn Express",
    done: false
  },
  {
    id: 2,
    title: "Learn Git",
    done: true
  },
  {
    id: 3,
    title: "Build Task API",
    done: false
  }
];


app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: "ok"
  });
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  const id = tasks[tasks.length - 1].id + 1;


  const task = {
    id,
    title,
    done: false
  };

  tasks.push(task);

  return res.status(201).json(task);

});


app.put('/tasks/:id', (req, res) => {

  const id = Number(req.params.id);

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  const { title, done } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required"
    });
  }  

  task.title = title;
  task.done = done;

  res.json(task);


});

app.delete('/tasks/:id', (req, res) => {

  const id = Number(req.params.id);

  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

  tasks.splice(index, 1);

  res.status(204).send();

});


app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${id} not found`
    });
  }

return res.json(task);

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
