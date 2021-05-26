'use strict';

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


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

// Display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const moves = sort ? [...acc.movements].sort((a, b) => a - b) : acc.movements;
  moves.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov.toFixed(2)} €</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Balance
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

//Summary
const calcDisplaySummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = income.toFixed(2) + ' €';
  let withdrawal;
  if (acc.movements.some(mov => mov < 0)) {
    withdrawal = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, cur) => acc + cur);
  } else {
    withdrawal = 0;
  }
  labelSumOut.textContent = -withdrawal.toFixed(2) + ' €';
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = interest.toFixed(2) + ' €';
};

const display = acc => {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
//User names
const createUserNames = function (accounts) {
  accounts.forEach(
    acc =>
      (acc.username = acc.owner
        .split(' ')
        .map(str => str[0].toLowerCase())
        .join(''))
  );
};
createUserNames(accounts);

/// Login
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.trim()
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 1;
    display(currentAccount);
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    inputCloseUsername.blur();
  }
});

///Transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    transferTo &&
    currentAccount.balance >= amount &&
    currentAccount !== transferTo
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
    display(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

//Close account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc.username === currentAccount.username),
      1
    );
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
    containerApp.style.opacity = 0;
  }
});

//Loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loan = +inputLoanAmount.value;
  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    currentAccount.movements.push(loan);
    display(currentAccount);
    inputLoanAmount.value = null;
    inputLoanAmount.blur();
  }
});

//Sort
let isSorted;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  isSorted = isSorted ? 0 : 1;
  displayMovements(currentAccount, isSorted);
});


// LECTURES
// ex 1
// const sum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((a, b) => a + b);
// console.log(sum);
// //ex 2
// const oneThousand = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((a, b) => (b >= 1000 ? ++a : a), 0);
// console.log(oneThousand);
// //ex 3
// const { deposit, withdrawal } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (acc, cur) => {
//       acc[cur > 0 ? 'deposit' : 'withdrawal'] += cur;
//       return acc;
//     },
//     {
//       deposit: 0,
//       withdrawal: 0,
//     }
//   );
// console.log(deposit, withdrawal);
// // ex 4
// const convertTitle = title => {
//   const capitalize = str => str[0].toUpperCase()+str.slice(1);
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//   return capitalize(
//     title
//       .toLowerCase()
//       .split(' ')
//       .map(str => (exceptions.includes(str) ? str : capitalize(str)))
//       .join(' ')
//   );
// };
// console.log(convertTitle('aNd this iS A TiTlE'));




const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
