import prisma from "./config/db.js";

type User = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

type UpdateParams = {
    firstName: string;
    lastName: string;
}

async function createUser({ firstName, lastName, email, password }: User) {
	try {
		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				password,
			},
			select: {
				email: true,
			},
		});
		console.log(user);
	} catch (error) {
		console.log("error");
	}
}
// createUser({ firstName: "Raghav", lastName: "agarwal", email: "raghav@gmail.com", password: "demo123" });

// // Find all users
// const users = await prisma.user.findMany();
// console.log(users);

// Find one user
async function findUser(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: "raghav@gmail.com" },
    });
    console.log(user);
}
// findUser("raghav@gmail.com");

// Update a user
async function updateUser(email: string, { firstName, lastName }: UpdateParams) {
	const res = await prisma.user.update({
		where: { email },
		data: { firstName, lastName },
	});
    console.log(res);
}
// updateUser("raghav@gmail.com", { firstName: "Raghav", lastName: "Agarwal" });

// // Delete a user
// await prisma.user.delete({
//   where: { id: 1 },
// });

// // Find or create
// const user = await prisma.user.upsert({
//   where: { email: "raghav@gmail.com" },
//   update: {},
//   create: {
//     name: "Raghav",
//     email: "raghav@gmail.com",
//   },
// });
