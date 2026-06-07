const mongoose = require("mongoose");

const danceStyleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dance style name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ["classical", "western", "folk", "bollywood", "fusion", "other"],
      default: "other",
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DanceStyle", danceStyleSchema);
