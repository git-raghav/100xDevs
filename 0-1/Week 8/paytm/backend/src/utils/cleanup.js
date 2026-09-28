import cron from "node-cron";

import User from "../models/userModel.js";

async function deleteUnverifiedUsers() {
    try {
        const result = await User.deleteMany({
            isVerified: false,
            createdAt: {
                $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        });
        console.log(`[cleanup] Deleted ${result.deletedCount} unverified users`);
        return result.deletedCount;
    } catch (error) {
        console.error("[cleanup] Error deleting unverified users:", error);
        throw error;
    }
}

// Run every 2 min to test "*/2 * * * *"
// Run daily at 3 AM "0 3 * * *"
cron.schedule("0 3 * * *", async () => {
    console.log(`[cleanup] Job started at ${new Date().toISOString()}`);
    try {
        const usersDeleted = await deleteUnverifiedUsers();
        console.log(
            `[cleanup] Finished. Users: ${usersDeleted}`
        );
    } catch (error) {
        console.error("[cleanup] Job failed:", error);
    }
});
