//Array of objects
const allUsers = [
	{
		firstName: "x",
		gender: "male",
	},
	{
		firstName: "y",
		gender: "male",
	},
	{
		firstName: "z",
		gender: "female",
	},
];

for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].gender == "male") {
        // console.log(allUsers[i].firstName);
    }
}

//Callback
function sum(num1, num2, fnToCall) {
	let result = num1 + num2;
	fnToCall(result);
}

function displayResult(data) {
	console.log("Result of the sum is : " + data);
}

// sum(1, 5, displayResult);

//Counter from 30-0
let num = 30;
// let id = setInterval(() => {
// 	console.log(num--);
// 	if (num < 0) {
// 		clearInterval(id);
// 	}
// }, 1000);

//calculate the time it takes between a settimeout call and the innner function actually running
// const startTime = performance.now();
// setTimeout(function () {
//     const endTime = performance.now();
//     console.log(`Time elapsed: ${endTime - startTime}ms`);
// }, 1000);

//Time in HH:MM:SS
function clock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.log(`${hours}:${minutes}:${seconds}`);
}

setInterval(clock, 1000);
