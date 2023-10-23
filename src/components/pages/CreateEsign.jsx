import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import * as FormData from "form-data";

import axios from "axios";

const CreateEsign = () => {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const url = "http://localhost:3000/pdf/upload";
      const { data } = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      data.status === "failure"
        ? enqueueSnackbar(data.message, { variant: "error" })
        : enqueueSnackbar(data.message, { variant: "success" });
    } else {
      console.error("No file selected.");
    }
  };
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
            <input type="file" onChange={handleUpload} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Upload
        </Button>
      </Grid>
      <div>
        <SnackbarProvider />
      </div>
    </Grid>
  );
};
export default CreateEsign;
