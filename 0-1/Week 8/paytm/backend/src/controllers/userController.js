import User from "../models/userModel.js";

//Change name
export async function changeName(req, res) {
	const { firstName, lastName } = req.body;

	// req.user comes from JWT (authMiddleware)
	const user = await User.findOne({ email: req.user.email });
	if (!user) return res.status(404).json({ message: "User not found" });

	await User.updateOne({ _id: user._id }, { $set: { firstName, lastName } });

	res.status(200).json({ message: "Name updated successfully" });
}

//Change username
export async function changeUsername(req, res) {
	const { username } = req.body;

	// req.user comes from JWT (authMiddleware)
	const user = await User.findOne({ email: req.user.email });
	if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await User.exists({ username, _id: { $ne: user._id } });
    if (existing) return res.status(409).json({ message: "Username already exists, please try different username" });

	await User.updateOne({ _id: user._id }, { $set: { username } });

	res.status(200).json({ message: "Username updated successfully" });
}

//get users from the backend, filterable via firstName/lastName/username
export async function getUsersBulk(req, res) {
	const filter = req.query.filter?.trim();
	//Guard against empty searches
	if (!filter) {
		return res.status(404).json({ message: "Search filter is required" });
	}
	//Escape special regex characters to stop injection errors
	const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	//only retrieve first 20 users, and desired data if found not the whole data for every matched user
	const users = await User.find({
		$or: [
			{ firstName: { $regex: `^${escapedFilter}`, $options: "i" } },
			{ lastName: { $regex: `^${escapedFilter}`, $options: "i" } },
			{ username: { $regex: `^${escapedFilter}`, $options: "i" } },
		],
	}).limit(20).select("username firstName lastName _id");
	if (users.length === 0) return res.status(404).json({ message: "No users found" });

	res.status(200).json({ users });
}
