const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB Atlas
const connectToMongoDB = async () => {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
};

// Define the invoice schema and model
const invoiceSchema = new mongoose.Schema({
    userName: String,
    date: String,
    time: String,
    amount: String,
    receiptNumber: String,
    vehicleNumber: String,
    voucherName: String,
    date_time: String,
    userName2nd: String,
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

exports.handler = async (event) => {
    try {
        await connectToMongoDB();

        const invoiceData = JSON.parse(event.body);
        const newInvoice = new Invoice(invoiceData);
        const savedInvoice = await newInvoice.save();

        return {
            statusCode: 201,
            body: JSON.stringify({ id: savedInvoice._id }),
        };
    } catch (error) {
        console.error('Error saving invoice:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error saving invoice' }),
        };
    }
};
