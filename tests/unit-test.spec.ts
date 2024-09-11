import { test, expect } from "@playwright/test";
import { Console } from "console";
import { describe } from "node:test";

function isOdd(number: number) {
  //непарне
  if (number % 2 !== 0) {
    return true;
  } else if (number === 0) {
    throw Error("The number is zero!");
  } else {
    return false;
  }
}

function determineLargerNumber(number1: number, number2: number) {
  if (number1 > number2) {
    return number1;
  } else if (number2 > number1) {
    return number2;
  } else {
    throw Error("The numbers are equal!");
  }
}

test.describe("Unit test for isOdd function", async () => {
  test("Should return false when the number is even", async () => {
    const result = isOdd(6);
    expect(result).toBeFalsy();
  });

  test("Should return true when the number is odd", async () => {
    const result = isOdd(11);
    expect(result).toBeTruthy();
  });

  test("should throw an error when the number is zero", async () => {
    expect(() => isOdd(0)).toThrowError(
      "The number is zero!"
    );
  });

  test("Should return false when the number is even and negative", async () => {
    const result = isOdd(-6);
    expect(result).toBeFalsy();
  });

  test("Should return true when the number is odd and negative", async () => {
    const result = isOdd(11);
    expect(result).toBeTruthy();
  });
});

test.describe("Unit tests for determineLargerNumber function", async () => {
  test("Should return first number when its bigger", async () => {
    expect(determineLargerNumber(10, 5)).toBe(10);
  });

  test("Should return second number when its bigger", async () => {
    expect(determineLargerNumber(3, 5)).toBe(5);
  });

  test("should throw an error when the numbers are equal", async () => {
    expect(() => determineLargerNumber(3, 3)).toThrowError(
      "The numbers are equal!"
    );
  });

  test("Check when numbers is negative", async () => {
    expect(determineLargerNumber(-3, -5)).toBe(-3);
  });

  test("Should return the larger number when one number is zero", () => {
    expect(determineLargerNumber(0, 10)).toBe(10);
    expect(determineLargerNumber(-10, 0)).toBe(0);
  });
});
