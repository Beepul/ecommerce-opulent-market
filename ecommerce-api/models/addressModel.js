const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
},{
  timestamps: true
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
