const mongoose = require("mongoose")

const Schema = mongoose.Schema


const passportLocalMongoose = require("passport-local-mongoose")


const Session = new Schema({

  refreshToken: {

    type: String,

    default: "",

  },

})


const User = new Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  authStrategy: {

    type: String,
    default: "local",

  },

  firstLogin: {
    type: Boolean,
    default: true
  },

  refreshToken: {

    type: [Session],

  },

  internalNetworks: [
    {
      ip: String,
      subnetMask: String,
    },
  ],
  externalNetworks: [
    {
      ip: String,
      subnetMask: String,
      gateway: String,
      dns_server: String,
    },
  ],

})


//Remove refreshToken from the response

User.set("toJSON", {

  transform: function (doc, ret, options) {

    delete ret.refreshToken

    return ret

  },

})


User.plugin(passportLocalMongoose)


module.exports = mongoose.model("User", User, "Users");