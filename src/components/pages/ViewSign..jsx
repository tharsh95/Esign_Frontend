import React, { Fragment, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import moment from "moment";
import { Button, Dialog, DialogContent, Tooltip } from "@mui/material";

const ViewEsign = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [flag,setFlag]=useState(false)

  const fetchData = async () => {
    const {
      data: { data, message,status },
    } = await axios.get("http://localhost:3000/pdf/list");
    status==='success'?
    enqueueSnackbar(message, { variant: "info" }):
    enqueueSnackbar(message, { variant: "error" })
    const groupedArray = data.reduce((acc, curr) => {
      const existingGroup = acc.find(
        (item) =>
          item.owner_id === curr.owner_id &&
          item.request_id === curr.request_id &&
          item.document_id === curr.document_id
      );

      if (existingGroup) {
        existingGroup.action_id.push({ action_id: curr.action_id });
      } else {
        acc.push({
          ...curr,
          action_id: [{ action_id: curr.action_id }],
        });
      }

      return acc;
    }, []);
    setData([groupedArray]);
  };

  const handlePreviewClick = (rowData) => {
    setPreviewData(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async (requestId) => {
    const { data } = await axios.put(
      `http://localhost:3000/pdf/update/${requestId}`
    );
    setFlag(!flag)
    data.status === "success"
      ? enqueueSnackbar(data.message, { variant: "success" })
      : enqueueSnackbar(data.message, { variant: "error" });
  };
  const handleSubmit = async (id) => {
    const { data } = await axios.post(`http://localhost:3000/pdf/${id}/submit`);
    data.status === "success"
      ? enqueueSnackbar(data.message, { variant: "success" })
      : enqueueSnackbar(data.message, { variant: "warning" });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Fragment>
      <TableContainer
        component={Paper}
        style={{ width: "80%", margin: "0 auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Request ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email/s</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Submit</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data[0]?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.request_id}</TableCell>
                <TableCell>
                  {row.status !== "completed" ? (
                    <Tooltip title={`Message: ${row.message}`} arrow>
                      <span>{row.status.toUpperCase()}</span>
                    </Tooltip>
                  ) : (
                    <span>{row.status.toUpperCase()}</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.meta?.requests.actions.map((el) => (
                    <div key={el.recipient_email}>{el.recipient_email} </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handlePreviewClick(
                        row.meta.requests.document_ids[0].image_string
                      )
                    }
                    variant="contained"
                    color="primary"
                  >
                    Preview
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleUpdate(row.request_id)}
                    variant="contained"
                    color="primary"
                    disabled={row.status==='inprogress'||row.status==='completed'}
                  >
                    Update
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSubmit(row.request_id)}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </TableCell>
                <TableCell>{moment(row.createdAt).format("llll")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ overflowY: "hidden" }}>
          {previewData && (
            <div>
              <img src={`data:image/png;base64,${previewData}`} alt="preview" />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div>
        <SnackbarProvider />
      </div>
    </Fragment>
  );
};

export default ViewEsign;
