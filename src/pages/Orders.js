import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, TextField, Button, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Select, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Box, Tooltip
} from '@mui/material';
import axios from 'axios';
import { getToken } from '../utils/auth';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false); 
  const [editId, setEditId] = useState(null); 
  const [newOrder, setNewOrder] = useState({
    order_id: '',
    customer_name: '',
    product_ordered: '',
    quantity: '',
    order_date: '',
    order_status: 'Pending',
    total_price: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [q, status]);

  async function fetchOrders() {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (status) params.append('status', status);

    try {
      const res = await axios.get(`${API}/api/orders?` + params.toString(), {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this order?')) return;
    try {
      await axios.delete(`${API}/api/orders/${id}`, { headers: { Authorization: 'Bearer ' + getToken() } });
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  const createOrder = async () => {
    const { order_id, customer_name, product_ordered, quantity, order_date } = newOrder;
    if (!order_id || !customer_name || !product_ordered || !quantity || !order_date) {
      alert('Please fill all required fields');
      return;
    }
    try {
      await axios.post(`${API}/api/orders`, newOrder, { headers: { Authorization: 'Bearer ' + getToken() } });
      setOpen(false);
      setNewOrder({
        order_id: '',
        customer_name: '',
        product_ordered: '',
        quantity: '',
        order_date: '',
        order_status: 'Pending',
        total_price: ''
      });
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  };

  const startEdit = (order) => {
    setEditId(order.id);
    setNewOrder({
      order_id: order.order_id,
      customer_name: order.customer_name,
      product_ordered: order.product_ordered,
      quantity: order.quantity,
      order_date: order.order_date,
      order_status: order.order_status,
      total_price: order.total_price || ''
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setNewOrder({
      order_id: '',
      customer_name: '',
      product_ordered: '',
      quantity: '',
      order_date: '',
      order_status: 'Pending',
      total_price: ''
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API}/api/orders/${editId}`, newOrder, { headers: { Authorization: 'Bearer ' + getToken() } });
      setEditId(null);
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" mb={3} sx={{ fontWeight: 'bold', color: '#6b3e26' }}>Orders Management</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField label="Search" value={q} onChange={e => setQ(e.target.value)} sx={{ flex: 1 }} />
        <Select value={status} onChange={e => setStatus(e.target.value)} displayEmpty sx={{ minWidth: 180 }}>
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Create New Order</Button>
      </Box>

      {/* Modal for creating new order */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Order ID" name="order_id" value={newOrder.order_id} onChange={handleChange} fullWidth />
            <TextField label="Customer Name" name="customer_name" value={newOrder.customer_name} onChange={handleChange} fullWidth />
            <TextField label="Product Ordered" name="product_ordered" value={newOrder.product_ordered} onChange={handleChange} fullWidth />
            <TextField label="Quantity" name="quantity" type="number" value={newOrder.quantity} onChange={handleChange} fullWidth />
            <TextField label="Order Date" name="order_date" type="date" value={newOrder.order_date} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Total Price" name="total_price" type="number" value={newOrder.total_price} onChange={handleChange} fullWidth />
            <Select name="order_status" value={newOrder.order_status} onChange={handleChange} fullWidth>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={createOrder}>Save</Button>
        </DialogActions>
      </Dialog>

      <Table sx={{ mt: 2, backgroundColor: '#fff', borderRadius: 2 }}>
        <TableHead sx={{ backgroundColor: '#6b3e26', color: '#fff' }}>
          <TableRow>
            <TableCell sx={{ color: '#fff' }}>Order ID</TableCell>
            <TableCell sx={{ color: '#fff' }}>Customer</TableCell>
            <TableCell sx={{ color: '#fff' }}>Product</TableCell>
            <TableCell sx={{ color: '#fff' }}>Qty</TableCell>
            <TableCell sx={{ color: '#fff' }}>Date</TableCell>
            <TableCell sx={{ color: '#fff' }}>Status</TableCell>
            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
              {editId === order.id ? (
                <>
                  <TableCell><TextField value={newOrder.order_id} name="order_id" onChange={handleChange} size="small" /></TableCell>
                  <TableCell><TextField value={newOrder.customer_name} name="customer_name" onChange={handleChange} size="small" /></TableCell>
                  <TableCell><TextField value={newOrder.product_ordered} name="product_ordered" onChange={handleChange} size="small" /></TableCell>
                  <TableCell><TextField type="number" value={newOrder.quantity} name="quantity" onChange={handleChange} size="small" /></TableCell>
                  <TableCell><TextField type="date" value={newOrder.order_date} name="order_date" onChange={handleChange} size="small" InputLabelProps={{ shrink: true }} /></TableCell>
                  <TableCell>
                    <Select value={newOrder.order_status} name="order_status" onChange={handleChange} size="small">
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Save"><IconButton onClick={saveEdit} color="success"><SaveIcon /></IconButton></Tooltip>
                    <Tooltip title="Cancel"><IconButton onClick={cancelEdit} color="error"><CancelIcon /></IconButton></Tooltip>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.product_ordered}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.order_date}</TableCell>
                  <TableCell>{order.order_status}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit"><IconButton onClick={() => startEdit(order)} color="primary"><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton onClick={() => remove(order.id)} color="error"><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
