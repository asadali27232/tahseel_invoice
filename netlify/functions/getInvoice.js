const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongoDB = async () => {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
};

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
    const { id } = event.queryStringParameters;

    try {
        await connectToMongoDB();

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Invoice not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(invoice),
        };
    } catch (error) {
        console.error('Error retrieving invoice:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error retrieving invoice' }),
        };
    }
};
