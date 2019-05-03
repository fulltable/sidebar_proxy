require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const redis = require('redis')

const port = 3003;
const app = express();
const db = require('../database/queries');
const client = redis.createClient(6379)
// const db_generate = require('..//restaurantsGenerate').populateRestaturant;

client.on('error', (err) => {
  console.log("Error " + err)
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/restaurants/:id', express.static(path.join(__dirname, '../public')));

app.get('/loaderio-58a760e1efba29cf139cdbda92484897.txt', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../public/loaderio-58a760e1efba29cf139cdbda92484897.txt'));
})

app.get('/api/restaurants/:id/info', (req, res) => {
  const infoRedisKey = 'info' + req.params.id;
  client.get(infoRedisKey, (err, info) => {
    if (info) {
      const resultJSON = JSON.parse(info).responseJSON;
      res.status(200).json(...resultJSON);
    } else {
      db.getSidebarById(req.params.id, (data) => {
      const responseJSON = data
      client.setex(infoRedisKey, 3600, JSON.stringify({ source: 'cache', responseJSON, }));
      res.status(200).json(...responseJSON);
    });
    }
  })
});

app.post('/api/restaurants', (req, res) => {
  // data = db_generate();
  db.createSidebar(req.body, (result) => {
    res.status(200).json(result);
  });
});

app.delete('/api/restaurants/:id', (req, res)=>{
  db.deleteRestaurant(req.params.id, (result) => {
    res.status(200).send(result);
  });
})

app.get('/api/restaurants/:id/overview', (req, res) => {
    const overviewRedisKey = 'overview' + req.params.id;
  client.get(overviewRedisKey, (err, overview) => {
    if (overview) {
      const resultJSON = JSON.parse(overview).overviewJSON;
      res.status(200).json(...resultJSON);
    } else {
      db.getOverviewById(req.params.id, (data) => {
        const overviewJSON = data;
        overviewJSON[0].costRange = JSON.parse(overviewJSON[0].costRange);
        overviewJSON[0].tags = JSON.parse(overviewJSON[0].tags);
        overviewJSON[0].cuisine = overviewJSON[0].cuisine.split(',')[0];
        client.setex(overviewRedisKey, 3600, JSON.stringify({ source: 'cache', overviewJSON, }));
        res.status(200).json(...overviewJSON);
      });
    }
  });
});

const server = app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

module.exports = app;
module.exports.server = server;
