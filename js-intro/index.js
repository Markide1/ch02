//  Create a program that prints all even numbers between 1 and 100 using a for loop.

for(let i = 0; i <= 100; i++) {
    if(i % 2 === 0){
        console.log(i);
    }
}

// Adding spacing:
console.log('-----------------------------------------------------------------');
console.log('-----------------------------------------------------------------');

// Write a function that checks if a given number is prime using a while loop.


  let i = 0;

  while (i <= 100) {
    let isPrime = true;
    if (i < 2) {
      isPrime = false;
    }

  let j = 3;
  if (i <= Math.sqrt(i)) {
    if (i % j == 0) {
      isPrime = false;
    }
  }
   else {
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
  }
  if (isPrime) {
    console.log(i);
  }
  i++;
  }

  // Adding spacing:
console.log('-----------------------------------------------------------------');
console.log('-----------------------------------------------------------------');


// Create a nested loop to print a multiplication table from 1 to 10.

for (let i = 1; i <= 10; i++) {
  let row = '';
  for (let j = 1; j <= 10; j++) {
    row += (i * j).toString().padStart(4, ' ');
  }
  console.log(row);
}

// Adding spacing:
console.log('-----------------------------------------------------------------');
console.log('-----------------------------------------------------------------');

// Write a program that iterates through an array of objects and filters based on certain properties.
const people = [
  { name: 'Kimani', age: 25, city: 'Meru' },
  { name: 'Terry', age: 32, city: 'Thika' },
  { name: 'Kevin', age: 43, city: 'Nairobi' },
  { name: 'David', age: 50, city: 'Kisumu' },
  { name: 'Eve', age: 19, city: 'Embu' },
  { name: 'Maina', age: 61, city: 'Mombasa' },
  { name: 'Grace', age: 72, city: 'Maua' }
];
const filteredPeople = people.filter(person => person.age > 36);
console.log(filteredPeople);
