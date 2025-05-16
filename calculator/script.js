// Class for the calculator

class Calculator {
  constructor(num1, num2) {
    this.num1 = this.validateInput(num1);
    this.num2 = this.validateInput(num2);
  }

  // Validate input to ensure it's a number

  validateInput(value) {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new Error("Invalid number input");
    }
    return num;
  }

  // Add funtionality

  add() {
    return this.num1 + this.num2;
  }

  // Subtract functionality

  subtract() {
    return this.num1 - this.num2;
  }

  // Multiply functionality

  multiply() {
    return this.num1 * this.num2;
  }

  // Divide functionality

  divide() {
    if (this.num2 === 0) {
      throw new Error("Cannot divide by zero");
    }
    return this.num1 / this.num2;
  }
}

// Function to handle button clicks and perform calculations

function calculate(operation) {
  const num1 = document.getElementById("num1").value;
  const num2 = document.getElementById("num2").value;
  const resultEl = document.getElementById("result");

  try {
    const calc = new Calculator(num1, num2);
    let result;
    switch (operation) {
      case "add":
        result = calc.add();
        break;
      case "subtract":
        result = calc.subtract();
        break;
      case "multiply":
        result = calc.multiply();
        break;
      case "divide":
        result = calc.divide();
        break;
      default:
        result = "Unknown operation";
    }
    resultEl.textContent = `Result: ${result}`;
  } catch (err) {
    resultEl.textContent = `Error: ${err.message}`;
  }
}
