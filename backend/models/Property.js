const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  ipfsHash: String,
  owner: String,
  contractAddress: String,
  rentEth: String,
  depositEth: String,
  duration: String,
  status: { type: String, default: 'available' }
});

module.exports = mongoose.model('Property', PropertySchema);
