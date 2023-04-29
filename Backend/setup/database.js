const mongoose = require("mongoose");

let conn = null;

async function connect(connectionString) {
  console.log("[MONGO - CONNECT] - Connecting to MongoDB...");
  try {
    conn = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return conn;
  } catch (err) {
    console.error(`[MONGO - CONNECT] - Failed to connect to MongoDB: ${err}`);
    throw err;
  }
}

module.exports = { connect };