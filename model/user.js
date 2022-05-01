const mongoose = require("mongoose");

const nestedClass = new mongoose.Schema(
  {
    type: String
  }
);

const semesterArray = new mongoose.Schema(
  {
    semester: [nestedClass]
  }
);

const UserSchema = new mongoose.Schema(
	{
    sName: { type: String },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		verified: { type: Boolean, required: true },
		verifCode: { type: String, requried: true },
		schedule: { type: Array },
		completedClasses: { type: Array },
    nextSemSeason: {type: String, required: true },
    nextSemYear: {type: Number, required: true },
	},
	{ collection: "Users" }
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;