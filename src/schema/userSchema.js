const { Schema } = require("mongoose"),
  ObjectId = Schema.ObjectId,
  database = require("../conn/");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
  },
  {
    collection: "User",
    timestamps: true,
  }
);

// console.log('___', database)

exports.User = database.DB.model("User", UserSchema);
// const myModel = database.DB.model('MyModel', mySchema);