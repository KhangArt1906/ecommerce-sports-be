const { Schema, model } = require("mongoose");

const providerCustomerSchema = new Schema(
  {
    myID: {
      type: String,
      required: true,
    },
    myFriends: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = model("provider_customers", providerCustomerSchema);
