import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import Button from '@mui/material/Button';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
  const [rowData, setRowData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setRowData(response.data);
      console.log('Fetched data:', response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteRow = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/data/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columnDefs = [
    { headerName: 'Brand', field: 'Brand', sortable: true, filter: true },
    { headerName: 'Model', field: 'Model', sortable: true, filter: true },
    { headerName: 'Acceleration (Sec)', field: 'AccelSec', sortable: true, filter: true },
    { headerName: 'Top Speed (Km/h)', field: 'TopSpeed_KmH', sortable: true, filter: true },
    { headerName: 'Range (Km)', field: 'Range_Km', sortable: true, filter: true },
    { headerName: 'Efficiency (Wh/Km)', field: 'Efficiency_WhKm', sortable: true, filter: true },
    { headerName: 'Fast Charge (Km/h)', field: 'FastCharge_KmH', sortable: true, filter: true },
    { headerName: 'Rapid Charge', field: 'RapidCharge', sortable: true, filter: true },
    { headerName: 'Powertrain', field: 'PowerTrain', sortable: true, filter: true },
    { headerName: 'Plug Type', field: 'PlugType', sortable: true, filter: true },
    { headerName: 'Body Style', field: 'BodyStyle', sortable: true, filter: true },
    { headerName: 'Segment', field: 'Segment', sortable: true, filter: true },
    { headerName: 'Seats', field: 'Seats', sortable: true, filter: true },
    { headerName: 'Price (EUR)', field: 'PriceEuro', sortable: true, filter: true },
    { headerName: 'Date', field: 'Date', sortable: true, filter: true },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRendererFramework: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert(JSON.stringify(params.data))}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteRow(params.data._id)}
            style={{ marginLeft: '10px' }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  
  

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <h1>BMW DataGrid App</h1>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} pagination={true} />
    </div>
  );
};

export default App;
