import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: Schema.Types.ObjectId, //One who is subscribing
    ref: "User",
  },
  channel: {
    type: Schema.types.ObjectId, //One who is subscriber
    ref: "User",
  },
  
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
