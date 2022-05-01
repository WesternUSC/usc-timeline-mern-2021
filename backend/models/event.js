const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, requied: true },
  date: { type: Date, requied: true },
  description: { type: String, requied: true },
  url: { type: String },
  category: { type: String, requied: true },
  image: { type: String },
});
//eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ "$**": "text" });

module.exports = mongoose.model("Event", eventSchema);
