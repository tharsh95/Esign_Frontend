import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  styled,
} from "@mui/material";
import axios from "axios";

const CreateEsign = () => {
    const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  }

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const url = 'http://localhost:3000/pdf/upload'
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type
        },
      })
    } else {
      console.error('No file selected.');
    }
  }
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create E-sign
            </Typography>
            <input
              type="file"
              onChange={handleUpload}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Upload
        </Button>
      </Grid>
    </Grid>
  );
};
export default CreateEsign;
