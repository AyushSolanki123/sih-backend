const { default: mongoose } = require("mongoose");
const ErrorBody = require("../Utils/ErrorBody");
const History = require("../Models/History").model;

function createHistory(reqBody) {
	return new Promise((resolve, reject) => {
		History.create(reqBody)
			.then((response) => {
				return History.findById(response._id)
					.populate("fish")
					.populate("user", ["firstName", "lastName", "email"]);
			})
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.log(error);
				reject(
					new ErrorBody(
						error.status || 500,
						error.message || "Internal Server Error"
					)
				);
			});
	});
}

function listHistory(userId) {
	return History.find({
		user: mongoose.Types.ObjectId(userId),
		isDeleted: false,
	})
		.populate("user", ["firstName", "lastName", "email"])
		.populate("fish");
}

function editHistory(id, reqBody) {
	return History.findByIdAndUpdate(
		mongoose.Types.ObjectId(id),
		{ $set: reqBody },
		{ new: true }
	);
}

function deleteHistory(id) {
	return History.findByIdAndUpdate(
		mongoose.Types.ObjectId(id),
		{ $set: { isDeleted: true } },
		{ new: true }
	);
}

module.exports = {
	createHistory: createHistory,
	listHistory: listHistory,
	editHistory: editHistory,
	deleteHistory: deleteHistory,
};
