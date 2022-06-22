require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rowHeaders = require('./rowHeaders');

const app = express();

const smallPlateType = {
  id: 1,
  name: '96 Well Plate',
  numRows: 8,
  numCols: 12,
};
const largePlateType = {
  id: 2,
  name: '384 Well Plate',
  numRows: 16,
  numCols: 24,
};

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('../ui/build'));

app.use('/api/atlas/_search/experiments/:searchTerm', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Demo Project',
      description: 'A project containing five empty plates',
    },
  ]);
});

app.use('/api/atlas/platetypes', (req, res) => {
  res.json([smallPlateType, largePlateType]);
});

app.use('/api/atlas/activity/:activityId', (req, res) => {
  const plates = [];
  for (i = 1; i <= 4; i++) {
    const plate = {
      id: i,
      barcode: `P000${i}`,
      name: `Plate ${i}`,
      plateType: smallPlateType,
      wells: [],
      overviewPositionTop: null,
      overviewPositionLeft: null,
    };
    const rows = rowHeaders.slice(0, 8);
    rows.forEach((row) => {
      for (let j = 1; j <= 12; j++) {
        plate.wells.push({
          id: row + j,
          row: row,
          column: j,
          components: [],
        });
      }
    });
    plates.push(plate);
  }
  const largePlate = {
    id: 5,
    name: 'Plate 5',
    barcode: `P0005`,
    plateType: largePlateType,
    wells: [],
    overviewPositionTop: null,
    overviewPositionLeft: null,
  };
  const rows = rowHeaders.slice(0, 16);
  rows.forEach((row) => {
    for (let j = 1; j <= 24; j++) {
      largePlate.wells.push({
        id: row + j,
        row: row,
        column: j,
        components: [],
      });
    }
  });
  plates.push(largePlate);
  res.json({
    id: 1,
    name: 'Demo Project',
    startDate: '2022-06-21',
    updateDate: '2022-06-21',
    plates,
  });
});

app.use('/api/atlas/components/_search/:searchTerm', (req, res) => {
  res.json([
    {
      id: 1,
      displayName: 'COMPOUND001',
      type: 'BATCH',
      units: {
        concentration: [
          { id: 1, name: 'Molarity', abbreviation: 'M' },
          { id: 2, name: 'Molality', abbreviation: 'm' },
          { id: 3, name: 'Mass percent', abbreviation: 'm/m%' },
          { id: 4, name: 'Parts per million', abbreviation: 'ppm' },
        ],
        time: [
          { id: 5, name: 'Hours', abbreviation: 'h' },
          { id: 6, name: 'Days', abbreviation: 'd' },
        ],
      },
      tooltip: [
        {
          label: 'Name',
          value: 'C001',
        },
        {
          label: 'Another Property',
          value: 'Another Value',
        },
      ],
    },
    {
      id: 2,
      displayName: 'COMMUNITY001',
      type: 'COMMUNITY',
      units: {
        concentration: [
          { id: 1, name: 'Molarity', abbreviation: 'M' },
          { id: 2, name: 'Molality', abbreviation: 'm' },
          { id: 3, name: 'Mass percent', abbreviation: 'm/m%' },
          { id: 4, name: 'Parts per million', abbreviation: 'ppm' },
        ],
        time: [
          { id: 5, name: 'Hours', abbreviation: 'h' },
          { id: 6, name: 'Days', abbreviation: 'd' },
        ],
      },
      tooltip: [
        {
          label: 'Name',
          value: 'C001',
        },
        {
          label: 'Another Property',
          value: 'Another Value',
        },
      ],
    },
    {
      id: 3,
      displayName: 'INTEGER_ATTRIBUTE',
      valueType: 'Integer',
      type: 'ATTRIBUTE',
      units: {
        value: [
          { id: 5, name: 'Hours', abbreviation: 'h' },
          { id: 6, name: 'Days', abbreviation: 'd' },
        ],
      },
      tooltip: [],
    },
    {
      id: 4,
      displayName: 'BOOLEAN_ATTRIBUTE',
      valueType: 'Boolean',
      type: 'ATTRIBUTE',
      tooltip: [],
    },
  ]);
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'ui', 'build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
