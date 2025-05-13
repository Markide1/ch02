//  Create a program that prints all even numbers between 1 and 100 using a for loop.

for(let i = 0; i <= 100; i++) {
    if(i % 2 === 0){
        console.log(i);
    }
}

// Write a function that checks if a given number is prime using a while loop.

let i =0;
while(i <= 100){
    let isPrime = true;
    if(i < 2){
        isPrime = false;
    } else {
        for(let j = 2; j < i; j++){
            if(i % j === 0){
                isPrime = false;
                break;
            }
        }
    }
    if(isPrime){
        console.log(i);
    }
    i++;
}
// Create a nested loop to print a multiplication table from 1 to 10.
// Write a program that iterates through an array of objects and filters based on certain properties.

