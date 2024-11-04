// app.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection URI for local MongoDB instance
const mongoURI = 'mongodb://localhost:27017/invoiceDB';

mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define the invoice schema with all fields
const invoiceSchema = new mongoose.Schema({
    userName: String,
    date: String,
    time: String,
    amount: String,
    receiptNumber: String,
    vehicleNumber: String,
    voucherName: String,
    date_time: String, // added field
    userName2nd: String, // added field
});

// Create the invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);

// Define a route for the homepage
app.get('/reciept1122', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '6727f0836d.html'));
});

app.get('/CustomerPortal/qr/v', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verify.html'));
});

// API endpoint to save invoice data
app.post('/api/invoices', async (req, res) => {
    const invoiceData = req.body;
    try {
        const newInvoice = new Invoice(invoiceData);
        await newInvoice.save();

        // Return only the saved ID
        res.status(201).json({ id: newInvoice._id });
    } catch (error) {
        console.error('Error saving invoice:', error);
        res.status(500).send('Error saving invoice');
    }
});

// API endpoint to get an invoice by ID
app.get('/api/invoices/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    console.log('id:', id);
    try {
        const invoice = await Invoice.findById(id); // Find the invoice by ID
        console.log('invoice:', invoice);

        if (!invoice) {
            // Handle case where invoice does not exist
            console.log('Invoice not found for ID:', id);
            return res.status(404).send('Invoice not found');
        }

        res.status(200).json(invoice); // Return the invoice data
    } catch (error) {
        console.error('Error retrieving invoice:', error);
        res.status(500).send('Error retrieving invoice'); // Handle any errors that occur during the retrieval
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
