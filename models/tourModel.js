const slugify = require('slugify');

// In-memory storage for tours
let tours = [];  // This is your in-memory "database"

// Function to create a new tour
const createTour = (tourData) => {
  const tour = {
    id: tours.length + 1,  // Generate a new ID (simple example)
    name: tourData.name,
    slug: slugify(tourData.name, { lower: true }),
    duration: tourData.duration,
    maxGroupSize: tourData.maxGroupSize,
    difficulty: tourData.difficulty,
    price: tourData.price,
    priceDiscount: tourData.priceDiscount,
    summary: tourData.summary,
    description: tourData.description,
    imageCover: tourData.imageCover,
    images: tourData.images || [],
    createdAt: new Date(),
    startDates: tourData.startDates || [],
    secretTour: tourData.secretTour || false,
    startLocation: tourData.startLocation || null,
    locations: tourData.locations || [],
    guides: tourData.guides || []
  };
  
  tours.push(tour);  // Add the tour to the "database"
  return tour;
};

// Function to get all tours
const getAllTours = () => tours.filter(tour => !tour.secretTour);

// Function to get a specific tour by ID
const getTourById = (id) => tours.find(tour => tour.id === id);

// Function to update a tour
const updateTour = (id, updatedData) => {
  const tourIndex = tours.findIndex(tour => tour.id === id);
  if (tourIndex === -1) return null;
  
  tours[tourIndex] = { ...tours[tourIndex], ...updatedData };
  return tours[tourIndex];
};

// Function to delete a tour by ID
const deleteTour = (id) => {
  const tourIndex = tours.findIndex(tour => tour.id === id);
  if (tourIndex !== -1) {
    tours.splice(tourIndex, 1);  // Remove the tour from the "database"
    return true;
  }
  return false;
};

// Example: Creating a new tour
createTour({
  name: 'Exploring the Amazon Jungle',
  duration: 10,
  maxGroupSize: 12,
  difficulty: 'medium',
  price: 1500,
  summary: 'A journey through the depths of the Amazon rainforest.',
  imageCover: 'amazon_jungle.jpg',
  startLocation: { coordinates: [3.465, -62.259], address: 'Amazon Rainforest' }
});

// Example of how to fetch all tours
console.log(getAllTours());

// Example of how to fetch a specific tour
console.log(getTourById(1));

// Example of how to update a tour
updateTour(1, { price: 1700 });

// Example of how to delete a tour
deleteTour(1);

module.exports = { createTour, getAllTours, getTourById, updateTour, deleteTour };
