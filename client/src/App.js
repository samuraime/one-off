import React, { useState } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import './App.css';

function getMids(text) {
  return text.split('\n')
    .map((string) => {
      const matched = string.match(/[?&]mid=([^?&]+)/);
      return matched ? matched[1] : false;
    })
    .filter(Boolean);
}

function getCSV(array) {
  if (!array.length) {
    return '';
  }

  const header = Object.keys(array[0]).join(',') + '\n';
  const body = array.map((row) => Object.entries(row).map((entry) => entry[1]).join(',')).join('\n');

  return header + body;
}

function saveAs(filename, data) {
  const a = document.createElement('a');
  const objectURL = URL.createObjectURL(data);
  a.href = objectURL;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectURL);
}

function App() {
  const [value, setValue] = useState('');
  const [mids, setMids] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const mids = getMids(e.target.value);
    setValue(e.target.value);
    setMids(mids);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch(`${process.env.REACT_APP_API_HOST}/kg`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ mids }),
    })
      .then(res => res.json())
      .then(body => {
        const csv = getCSV(body);
        const blob = new Blob([csv], { type : 'text/plain' });
        saveAs('kg.csv', blob);
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Typography variant="h5">Get K歌 Rank Detail</Typography>
      <TextField
        className="row"
        label="URLs"
        multiline
        fullWidth
        value={value}
        onChange={handleChange}
        placeholder="example: https://kg.qq.com/accompanydetail/index.html?mid=000IsIQC1S3E6A"
        margin="normal"
        helperText={`valid URLs: ${mids.length}`}
      />
      <Button
        className="row"
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
      >
        Submit
      </Button>
    </form>
  );
}

export default App;
