import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button } from "@mui/material";

import { FieldValues } from "react-hook-form";
import { TUser } from "@/types/User";
import UpdateUserModal from "@/components/Modal/UpdateUserModal/UpdateUserModal";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1F2544",
    color: "#fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

let users = null;
const AllReviewsPage = () => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  // edit button & set selected user data
  const handleEditClick = (user: TUser) => {
    setUpdateModalOpen(true);
  };

  // modal close
  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  // pass values to the parent component
  const handleSaveUpdatedUser = (updatedUser: FieldValues, userId: string) => {
    handleUpdate(updatedUser, userId);
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <TableContainer sx={{ minWidth: "200px" }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ tableLayout: "fixed" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">Flat Name</StyledTableCell>
                <StyledTableCell align="right">Location</StyledTableCell>
                <StyledTableCell align="right">Rating</StyledTableCell>
                <StyledTableCell align="right">Comment</StyledTableCell>
                <StyledTableCell align="right">Edit</StyledTableCell>
                <StyledTableCell align="right">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: TUser) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell component="th" scope="row">
                    {user.username}
                  </StyledTableCell>
                  <StyledTableCell align="right">{user.email}</StyledTableCell>
                  <StyledTableCell align="right">{user.role}</StyledTableCell>
                  <StyledTableCell align="right">{user.status}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button onClick={() => handleEditClick(user)}>
                      Update
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* update user modal */}
      <UpdateUserModal
        open={isUpdateModalOpen}
        user={selectedUser}
        onClose={handleCloseUpdateModal}
        onSave={handleSaveUpdatedUser}
      />
    </Paper>
  );
};

export default AllReviewsPage;
