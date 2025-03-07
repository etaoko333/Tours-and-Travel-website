const express = require('express');
const app = express();
app.use(express.json()); // To parse JSON request body
const { createTour, getAllTours, getTourById, updateTour, deleteTour } = require('./tourModule');

// Route to get all tours
app.get('/tours', (req, res) => {
  const tours = getAllTours();
  res.json(tours);
});

// Route to get a specific tour by ID
app.get('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id, 10);
  const tour = getTourById(tourId);
  if (!tour) {
    return res.status(404).send({ message: 'Tour not found' });
  }
  res.json(tour);
});

// Route to create a new tour
app.post('/tours', (req, res) => {
  const newTourData = req.body;
  const newTour = createTour(newTourData);
  res.status(201).json(newTour);
});

// Route to update a tour
app.put('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id, 10);
  const updatedData = req.body;
  const updatedTour = updateTour(tourId, updatedData);
  if (!updatedTour) {
    return res.status(404).send({ message: 'Tour not found' });
  }
  res.json(updatedTour);
});

// Route to delete a tour
app.delete('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id, 10);
  const wasDeleted = deleteTour(tourId);
  if (!wasDeleted) {
    return res.status(404).send({ message: 'Tour not found' });
  }
  res.status(204).send();  // No content
});

app.listen(5000, () => {
  console.log('App running on port 5000...');
});
