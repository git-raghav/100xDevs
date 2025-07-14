//File system module
//Read file is async function that means it is not blocking the execution of the process after it.
//EX 1
// const fs = require("fs");

// const filePath = 'C:\\Users\\ajayr\\Desktop\\0-100\\Week 1\\a.txt';
// fs.readFile(filePath, "utf8", (err, data) => {
// 	console.log(err, data);
// });

// console.log("hello world 1");
// let a=0;
// for (let i = 0; i < 1000000; i++) {
//     a++;
// }

// console.log("hello world 2");

//Ex 2, to undersatnd this go to latentflip loupe website and paste this code
console.log("hello world 3");

setTimeout(() => {
    console.log("From inside setTimeout function 1");
}, 20000);

setTimeout(() => {
    console.log("From inside setTimeout function 2");
}, 10000);

let a=0;
for (let i = 0; i < 10; i++) {
    a+=i;
}
console.log(a);