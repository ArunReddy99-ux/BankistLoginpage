'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">
          ${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);
// const user = 'Steven Thomas Williams ';
// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(function (name) {
//     return name[0];
//   })
//   .join('');
// console.log(username);
// const Createuser = function (user) {
//   const username = user
//     .toLowerCase()
//     .split(' ')
//     .map(name => name[0])
//     .join('');
//   return username;
// };
// console.log(Createuser('Steven Thomas Williams'));
const Createuser = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
Createuser(accounts);
const CalcDisplay = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
const calcSummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${intrest}€`;
};
const updateui = function (acc) {
  displayMovements(acc.movements);
  CalcDisplay(acc);
  calcSummary(acc);
};
// calcSummary(account1.movements);
///////////////////////////
// Event Listeners
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateui(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateui(currentAccount);
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    //updateui
    updateui(currentAccount);
  }
  inputLoanAmount.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements_value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// movements.forEach(function (movet) {
//   if (movet > 0) console.log(`the value is ${movet}`);
//   else console.log(`the -ve value is ${Math.abs(movet)}`);
// });
/////////////////////////////////////////////////
//map
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
// });
// //set
// const currenciesUnique = new Set(['pound', 'euro', 'euro', 'usd']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}`);
// });
////////////////////////////////////////////
/////////////////////////////////////////////////
//CODING CHALLENGE ----1
// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each). For
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
// ages from that copied array (because it's a bad practice to mutate function
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
// 🐶 ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far 😉

// const dogsjulia = [3, 5, 2, 12, 7];
// const dogskate = [4, 1, 15, 8, 3];
// const cortjulia = dogsjulia.slice();
// console.log(`the value is ${cortjulia}`);
// cortjulia.splice(0, 1);
// cortjulia.splice(-2);
// console.log(cortjulia);
// const dogs = cortjulia.concat(dogskate);
// console.log(dogs);
// const checkdogs = function (dogs) {
//   dogs.forEach(function (dgs, i) {
//     dgs > 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${dgs} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy  🐶`);
//   });
// };
// checkdogs(dogs);

// const checkdogs = function (dogsJulia, dogsKate) {
//   const cortjulia = dogsJulia.slice();
//   cortjulia.splice(0, 1);
//   cortjulia.splice(-2);
//   const dogs = cortjulia.concat(dogsKate);
//   console.log(dogs);
//   dogs.forEach(function (dgs, i) {
//     dgs: 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${dgs} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy  🐶`);
//   });
// };
// checkdogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// const eurotousd = 1.1;
// const movementsusd = movements.map(function (mov) {
//   return mov * eurotousd;
// });
// console.log(movementsusd);
// const movementsusd = movements.map(mov => mov * eurotousd);
///////////////////FILTER METHOD//////////////////////
// console.log(movements);
// const deposit = movements.filter(mov => mov > 0);
// console.log(deposit);
// const depositfor = [];
// for (const mov of movements) {
//   if (mov > 0) depositfor.push(mov);
// }
// console.log(depositfor);
// const withdrawals = [];
// for (const mov of movements) {
//   if (mov < 0) withdrawals.push(mov);
// }
// console.log(withdrawals);
// const withdrawals1 = movements.filter(mov => mov < 0);
// console.log(withdrawals1);
//////////////////////////////REDUCE METHOD///////////////
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`the iterated ${i} value is ${acc}`);
//   return acc + curr;
// }, 0);
// console.log(balance);
// const balance1 = movements.reduce((acc, curr) => acc + curr, 0);
// console.log(balance1);
// let sum = 0;
// for (const mov of movements) {
//   sum += mov;
// }
// console.log(sum);
//Maximum value

// const max = movements.reduce((acc, curr) => {
//   if (acc > curr) return acc;
//   else return curr;
// }, 0);
// console.log(max);
////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////CODING CHALLENGE2///////////
// Let's go back to Julia and Kate's study about dogs. This time, they want to convert
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know
// from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// GOOD LUCK 😀
// const dogages = [5, 2, 4, 1, 15, 8, 3];
// const humanage = [];
// const calcAverageHumanAge = function (dogs) {
//   dogs.forEach(function (dgs) {
//     if (dgs <= 2) humanage.push(2 * dgs);
//     else humanage.push(16 + dgs * 4);
//   });
// };
// calcAverageHumanAge(dogages);
// console.log(humanage);
// const newhumanage = humanage.filter(crr => crr > 18);
// console.log(newhumanage);
// const avg = newhumanage.reduce((acc, crr) => acc + crr);
// console.log(avg / newhumanage.length);
// const newhumanage = humanage
//   .filter(crr => crr > 18)
//   .reduce((acc, crr) => acc + crr);
// console.log(newhumanage / 5);
///////////////////////////////////////
///////////CODING CHALLENGES-3
// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// GOOD LUCK 😀

//////////////////////////
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));
//////////////////////////////////////
//////////////////////////////////////////////////////////
//Array Method Practise//

const bankdepositsum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, curr) => sum + curr, 0);
console.log(bankdepositsum);
//2
const numDeposits = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
console.log(numDeposits);

//increment operator :post increment(++)
//here it returns the new value in that case we can use the preincrement operator
//3.
// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sums);
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);
// //4.
// const convertTitleCase = function (title) {
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word =>
//       exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(' ');
//   return titleCase;
// };
// console.log(convertTitleCase('this is a nice title'));

//////////////////////////////////////////////////////////
///////////////////////////////////
// The Complete JavaScript Course 25
// Coding Challenge #4
// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
// Your tasks:
// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too
// little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
// the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"
// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)
// 7. Create an array containing the dogs that are eating an okay amount of food (try
// to reuse the condition used in 6.)
// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects 😉)
// The Complete JavaScript Course 26
// Hints:
// § Use many different tools to solve these challenges, you can use the summary
// lecture to choose between them 😉
// § Being within a range 10% above and below the recommended portion means:
// current > (recommended * 0.90) && current < (recommended *
// 1.10). Basically, the current portion should be between 90% and 110% of the
// recommended portion.
// Test data:

// const js = function (year, name) {
//   const age = 2024 - year;
//   const retire = 70 - age;
//   return `${name} will be retired at ${retire}`;
// };
// console.log(js(1990, 'arjun')
// Number,string,null,undefined,bigint,boolean,symbol
// false,0,null,undefined,''
/////////////////////////

// const interested = prompt(
//   'what do u like in the below given ?choose job,friends'
// );
// console.log(arun[interested]);

// forloop
// for (let i = 0; i < years.length; i++) {
//   console.log(years[i]);
// }
// foreachloop
// yrs.forEach(function (ys) {
//   console.log(ys + 100);
// });
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//challenge 1
// Mark and John are trying to compare their BMI (Body Mass Index), which is
// calculated using the formula:
// BMI = mass / height ** 2 = mass / (height * height) (mass in kg
// and height in meter).
// Your tasks:
// 1. Store Mark's and John's mass and height in variables
// 2. Calculate both their BMIs using the formula (you can even implement both
// versions)
// 3. Create a Boolean variable 'markHigherBMI' containing information about
// whether Mark has a higher BMI than John.
// Test data:
// § Data 1: Marks weights 78 kg and is 1.69 m tall. John weights 92 kg and is 1.95
// m tall.
// § Data 2: Marks weights 95 kg and is 1.88 m tall. John weights 85 kg and is 1.76
// m tall.
// GOOD LUCK 😀
// const BMI = function (mass, height) {
//   return mass / (height * height);
// };
// BMI(95, 1.88) > BMI(85, 1.76) ? console.log(true) : console.log(false);
//coding challenge 2
// The Complete JavaScript Course 6
// Coding Challenge #2
// Use the BMI example from Challenge #1, and the code you already wrote, and
// improve it.
// Your tasks:
// 1. Print a nice output to the console, saying who has the higher BMI. The message
// is either "Mark's BMI is higher than John's!" or "John's BMI is higher than Mark's!"
// 2. Use a template literal to include the BMI values in the outputs. Example: "Mark's
// BMI (28.3) is higher than John's (23.9)!"
// Hint: Use an if/else statement 😉
// GOOD LUCK 😀
// const BMI = function (mass, height) {
//   return mass / (height * height);
// };
// if (BMI(78, 1.69) > BMI(92, 1.95)) {
//   console.log(
//     `marks BMI ${Math.round(BMI(78, 1.69))} is higher than ${Math.round(
//       BMI(92, 1.95)
//     )}johns `
//   );
// }
// if (BMI(95, 1.88) < BMI(85, 1.76));
// {
//   console.log(
//     `marks BMI ${Math.round(BMI(95, 1.88))} is higher than ${Math.round(
//       BMI(85, 1.76)
//     )}marks `
//   );
