// Backend: Express.js + MongoDB
// File: backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bmw-datagrid', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Middleware
app.use(cors());
app.use(express.json());

// Define Mongoose Schema
const DataSchema = new mongoose.Schema({
    Brand: String,
    Model: String,
    AccelSec: Number,
    TopSpeed_KmH: Number,
    Range_Km: Number,
    Efficiency_WhKm: Number,
    FastCharge_KmH: Number,
    RapidCharge: String,
    PowerTrain: String,
    PlugType: String,
    BodyStyle: String,
    Segment: String,
    Seats: Number,
    PriceEuro: Number,
    Date: String,
    
  });
const DataModel = mongoose.model('Data', DataSchema);

// Import CSV into MongoDB
if (process.env.IMPORT_CSV) {
    // Clear existing data
    DataModel.deleteMany({}).then(() => console.log('Cleared existing data.'));
  
    fs.createReadStream('./BMW_Aptitude_Test_Test_Data_ElectricCarData.csv')
  .pipe(csvParser())
  .on('data', async (row) => {
    const mappedRow = {
      Brand: row['Brand'],
      Model: row['Model'],
      AccelSec: parseFloat(row['AccelSec']),
      TopSpeed_KmH: parseInt(row['TopSpeed_KmH'], 10),
      Range_Km: parseInt(row['Range_Km'], 10),
      Efficiency_WhKm: parseInt(row['Efficiency_WhKm'], 10),
      FastCharge_KmH: parseInt(row['FastCharge_KmH'], 10),
      RapidCharge: row['RapidCharge'],
      PowerTrain: row['PowerTrain'],
      PlugType: row['PlugType'],
      BodyStyle: row['BodyStyle'],
      Segment: row['Segment'],
      Seats: parseInt(row['Seats'], 10),
      PriceEuro: parseFloat(row['PriceEuro']),
      Date: row['Date'],
    };
  
        console.log('Mapped row:', mappedRow);
  
        const data = new DataModel(mappedRow);
        try {
          await data.save();
        } catch (error) {
          console.error('Error saving row:', error.message);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed and data imported.');
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err.message);
      });
  }

// API Endpoints
app.get('/api/data', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/api/data/:id', async (req, res) => {
  try {
    await DataModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));