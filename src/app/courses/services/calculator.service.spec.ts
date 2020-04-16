import { LoggerService } from './logger.service';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  it('should add two numbers', () => {
    // GIVEN
    const loggerService = new LoggerService();
    const calculator = new CalculatorService(loggerService);

    // WHEN
    const result = calculator.add(2, 3);

    // THEN
    expect(result).toBe(5);
  });

  it('should subtract two numbers', () => {
    // GIVEN
    const loggerService = new LoggerService();
    const calculator = new CalculatorService(loggerService);

    // WHEN
    const result = calculator.subtract(3, 2);

    // THEN
    expect(result).toBe(1);
  });
});
