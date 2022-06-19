import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://miguel:123@cluster0.znqj2.mongodb.net/nodeTestAPI"
);

let db = mongoose.connection;

export default db;
