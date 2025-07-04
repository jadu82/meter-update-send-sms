const mongoose = require('mongoose');  
const transactionPasswordSchema = new mongoose.Schema({
    uniqueid: { type: String, required: true, unique: true },
    entries: [
        {
            transactionPassword: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('TransactionPassword', transactionPasswordSchema);
