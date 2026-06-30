const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    action: {
      type: String,
    },
    reqMethod: {
      type: String,
    },
    reqBody: {
      type: Object,
    },
    userRole: {
      type: String,
    },
    reqUrl: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Log = mongoose.model("log", logSchema);

module.exports = Log;
