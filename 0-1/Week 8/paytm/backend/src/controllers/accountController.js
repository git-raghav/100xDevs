import mongoose from "mongoose";
import { sendAccountCreatedMail, sendMoneySentMail, sendMoneyReceivedMail } from "../utils/mailer.js";
import User from "../models/userModel.js";
import Account from "../models/accountModel.js";

// Create account
export async function createAccount(req, res) {
	const id = req.user.id;

	// req.user comes from JWT (authMiddleware)
	const existing = await Account.exists({ userId: id });
	if (existing) return res.status(409).json({ message: "Account already exists" });

    const account = await Account.create({
        userId: id,
        balance: Math.floor(Math.random() * 999901) + 100,
    });
    await sendAccountCreatedMail(req.user.email, account.balance);

	res.status(201).json({ message: "Account created successfully" });
}

// Get balance
export async function getBalance(req, res) {
	const id = req.user.id;

	// req.user comes from JWT (authMiddleware)
	const acc = await Account.findOne({ userId: id });
	if (!acc) return res.status(404).json({ message: "Account not found" });

	res.status(200).json({ balance: acc.balance });
}

// Transfer funds
export async function transferFunds(req, res) {
	const { to, amount } = req.body;
	const senderId = req.user.id;//from JWT

	if (to === senderId) {
		return res.status(400).json({
			message: "You cannot transfer money to yourself",
		});
	}

    const amountInPaise = Math.round(amount * 100);

    // Verify users normal acc, edgecase- account deleted but authenticated using still active access token
    const receiver = await User.findById(to);
	if (!receiver) return res.status(404).json({ message: "Receiver not found" });

	const sender = await User.findById(senderId);
	if (!sender) return res.status(404).json({ message: "Sender not found" });

	const session = await mongoose.startSession();
	try {
		session.startTransaction();

        //Sender payment acc verification
		const senderAcc = await Account.findOne({ userId: senderId }).session(session);
		if (!senderAcc) {
			await session.abortTransaction();
			return res.status(404).json({ message: "Your Account not found" });
		}

        //Receiver payment acc verification
		const receiverAcc = await Account.findOne({ userId: to }).session(session);
		if (!receiverAcc) {
			await session.abortTransaction();
			return res.status(404).json({ message: "Receiver Account not found" });
		}

		// Perform the transfer
        // Debit sender only if sufficient balance exists
		const debitResult = await Account.updateOne(
			{
				userId: senderId,
				balance: { $gte: amountInPaise },
			},
			{
				$inc: { balance: -amountInPaise },
			},
			{ session },
		);
		if (debitResult.modifiedCount !== 1) {
			await session.abortTransaction();
			return res.status(400).json({ message: "Insufficient funds" });
		}
        // Credit receiver
		const creditResult = await Account.updateOne({ userId: to }, { $inc: { balance: amountInPaise } }, { session });
        if (creditResult.modifiedCount !== 1) {
			await session.abortTransaction();
			return res.status(400).json({ message: "Cannot transfer to receiver" });
		}

		await session.commitTransaction();
	} catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
		await session.endSession();
	}

    // Financial transaction succeeded. Send mails
	await sendMoneySentMail(sender.email, `${receiver.firstName} ${receiver.lastName}`, amount);
	await sendMoneyReceivedMail(receiver.email, `${sender.firstName} ${sender.lastName}`, amount);

	res.status(200).json({ message: "Transfer successful" });
}
