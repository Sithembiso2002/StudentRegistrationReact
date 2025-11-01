import React from 'react';
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

export default function ManageOrders() {
  const orders = [
    { id: 1, customer: 'Alice', item: 'Cake', status: 'Pending' },
    { id: 2, customer: 'John', item: 'Bread', status: 'Completed' },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Orders
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.item}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>
                  Complete
                </Button>
                <Button variant="outlined" color="error" size="small">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
