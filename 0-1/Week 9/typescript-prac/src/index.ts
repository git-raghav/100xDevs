const x: number = 10;
console.log(x);


function greet(name: string) {
    console.log("Hey " + name);
}
greet("Raghav");


function sum(a: number, b: number): number {
    return a+b;
}
console.log(sum(10, 10));


//type inference- TypeScript's type inference automatically determines the return type of the sum function as number, even though you didn't explicitly specify it.
function isLegal(age: number) {
  if (age > 18) {
    return true;
  } else {
    return false;
  }
}
console.log(isLegal(2));


//callback func type
// function runAfter1S(fn: () => void) {
//   setTimeout(fn, 1000);
// }
// runAfter1S(function () {
//   console.log("hi there");
// })


//Interfaces
interface User {
  firstName: String,
  lastName: String,
  email: String,
  age: number,
  gender?: String  //optional argument ~ user can/cannot provide this, its his wish it still works in both the cases nontheless
}

function isLegal2(user: User) {
  //console.log(user);
  if (user.age > 18) {
    return true;
  }
  else {
    return false;
  }
}

const ans = isLegal2({
  firstName: "vishal",
  lastName: "singh",
  email: "madhava@gmail.com",
  age: 29
})
console.log(ans);


// Create a React component that takes todos as an input and renders them
// Todo.tsx
// interface TodoProps {
//   title: string;
//   description: string;
//   childern: React.ReactNode
// }

// function Todo({title, description, childern}: TodoProps) {
//   return (
//     <div>
//       <h1>{title}</h1>
//       <p>{description}</p>
//     </div>
//   );
// }

// App.tsx
// function App() {
//   return (
//     <div>
//       <h1>Todo List</h1>
//       <Todo title="Konkani" description="Language" />
//       <Todo title="Learn TypeScript" description="For React development" />
//     </div>
//   );
// }


//Implementing interfaces
// Define the Person interface
interface Person {
  name: string;
  age: number;
  greet(phrase: string): void;
}

// Create a class Employee that implements Person
class Employee implements Person {
  name: string;
  age: number;

  constructor(name2: string, age2: number) {
    this.name = name2;
    this.age = age2;
  }

  greet(phrase: string) {
    console.log(`${phrase} ${this.name}`);
  }
}

// Create two employees, Bittu and Monu
let employee_1 = new Employee('Bittu', 30);
let employee_2 = new Employee('Monu', 25);

// Use the greet method
employee_1.greet('Hello');  // Output: Hello Bittu
employee_2.greet('Hi');      // Output: Hi Monu

// Access employee properties
console.log(employee_1.name, employee_1.age);  // Output: Bittu 30
console.log(employee_2.name, employee_2.age);    // Output: Monu 25


//Types
//almost same as interfaces,but types gives us few extra features, most cases use type
type User3 = {
	firstName: string;
	lastName: string;
	age: number
}

//1 OR(Union)
type Greet_arg = number | string; //types let us define multiple types together, interfaces don't allow this

function greet3(id: Greet_arg){
// function greet3(id: number | string){
    console.log(id);
}
greet3(3);
greet('3');


//2 AND(Intersection)
//create a type that has every property of multiple types/ interfaces or both together
interface Employee3 {
  name: string;
  startDate: Date;
};

type Manager = {
  name: string;
  department: string;
};

type TeamLead = Employee3 & Manager;

const teamLead: TeamLead = {
  name: "vishal",
  startDate: new Date(),
  department: "Web3 developer"
};
// popular type vs interface ques- type should be used where we need to use or/and and interface where you want to use classes


//Arrays
// type chomu = number[];
//1
function maxValue(arr: number[]) {
  // function maxValue(arr: chomu) {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
          max = arr[i]
      }
  }
  return max;
}
console.log(maxValue([1, 2, 3]));

//2
type User2 = {
	firstName: string;
	lastName: string;
	age: number;
}
function filteredUsers(users: User2[]) {
    return users.filter(x => x.age >= 18);
}
console.log(filteredUsers([{
    firstName: "harkirat",
    lastName: "Singh",
    age: 21
}, {
    firstName: "Raman",
    lastName: "Singh",
    age: 16
}, ]));


//ENUMS
type keyInput = "up" | "down" | "left" | "right";

function doSomething(keyPressed: keyInput) {
  // do something
  // console.log(keyPressed);
  // console.log('did something');
}
doSomething("up");
// doSomething("upi"); //compilation error

//better way ~ more human readable
enum Direction {
  Up, //0
  Down, //1
  Left, //2
  Right //3
}
function doSomething2(keyPressed: Direction) {
  // do something
  // console.log(keyPressed);
  // console.log('did something');
}
doSomething2(Direction.Up);
// console.log(Direction.Up); //0
// console.log(typeof(Direction.Up)); //number


enum Direction2 {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right"
}
function doSomething3(keyPressed: Direction2) {
  // do something
  // console.log(keyPressed);
  // console.log('did something');
}
doSomething3(Direction2.Up);
// console.log(Direction2.Up); //"up"
// console.log(typeof(Direction2.Up)); //string

//Common usecase in express
// const app = express();
// enum ResponseStatus {
//   Success = 200,
//   NotFound = 404,
//   Error = 500
// }

// app.get("/", (req, res) => {
//   if (!req.query.userId) {
//     res.status(ResponseStatus.Error).json({})
//   }
//   // and so on...
//   res.status(ResponseStatus.Success).json({});
// })


//GENERICS
type Input = number | string; //type Input2 = number[] | string[];
function firstElement(arr: Input[]){
  return arr[0];
}
const value = firstElement(["vishal","singh", 3]); //can send different types of values in inputs, without any type errors ~ this is a problem
// console.log(value.toUpperCase()); //error as toUpperCase cannot be done in case if Input is number
// console.log(value.toString().toUpperCase()); //will work
// if (typeof value === 'string') { //will work
//   console.log(value.toUpperCase());
// }

function identity<T>(arg: T): T {
  return arg;
}
let output1 = identity<string>("myString");
let output2 = identity<number>(100);
console.log(output1.toUpperCase());

function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}
interface User99 {
  name: String
}
const e14 = getFirstElement<User99>([{name:"Vishal Singh"}, {name:"raghav"}]);
// console.log(e14.toLowerCase());
console.log(e14);
console.log(e14.name);
