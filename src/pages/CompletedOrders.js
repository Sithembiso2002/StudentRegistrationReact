import React from 'react';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

export default function CompletedOrders() {
  const completed = [
    { id: 1, customer: 'Sarah', item: 'Cupcakes' },
    { id: 2, customer: 'Liam', item: 'Cookies' },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Completed Orders
      </Typography>
      <List>
        {completed.map((order) => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`${order.customer} - ${order.item}`}
              secondary="Status: Completed"
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
