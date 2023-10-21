import React, { Fragment, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import { Button, Dialog, DialogContent, Tooltip } from "@mui/material";
// const data = [
//   {
//     "id": 9,
//     "owner_id": "50200000000028003",
//     "request_id": "50200000000031151",
//     "document_id": "50200000000031152",
//     "action_id": "50200000000031168",
//     "createdAt": "2023-10-20T15:01:00.000Z",
//     "updatedAt": "2023-10-20T15:01:00.000Z",
//   },
//   {
//     "id": 11,
//     "owner_id": "50200000000028003",
//     "request_id": "50200000000031179",
//     "document_id": "50200000000031180",
//     "action_id": "50200000000031196",
//     "createdAt": "2023-10-20T15:37:07.000Z",
//     "updatedAt": "2023-10-20T15:37:07.000Z",
//   }
// ];

const MyTable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const fetchData = async () => {
    const { data } = await axios.get("http://localhost:3000/pdf/list");
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
    // console.log(groupedArray[0].meta.requests.actions[0].recipient_email);
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
    const { data } = await axios.put(`http://localhost:3000/pdf/update/${requestId}`);
    enqueueSnackbar(data.message)
  };
  const handleSubmit = async (id) => {
    const { data } = await axios.post(`http://localhost:3000/pdf/${id}/submit`);
    enqueueSnackbar(data.message)
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
              {/* <TableCell>Owner ID</TableCell> */}
              <TableCell>Request ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email/s</TableCell>
              {/* <TableCell>Created At</TableCell> */}
              <TableCell>Preview</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Submit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data[0]?.map((row) => (
              <TableRow key={row.id}>
                {/* {console.log(row.meta.requests.document_ids[0].image_string)} */}
                <TableCell>{row.id}</TableCell>
                {/* <TableCell>{row.owner_id}</TableCell> */}
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
                    <div>{el.recipient_email} </div>
                  ))}
                </TableCell>
                {/* <TableCell>{row.createdAt}</TableCell> */}
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
        {/* <button onClick={() => enqueueSnackbar('That was easy!')}>Show snackbar</button> */}
      </div>
    </Fragment>
  );
};

export default MyTable;
