import { LoggerService } from './logger.service';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    calculator = new CalculatorService(loggerSpy);
  });

  it('should add two numbers', () => {
    // GIVEN
    // loggerSpy.log.and.returnValue('foo');

    // WHEN
    const result = calculator.add(2, 3);

    // THEN
    expect(result).toBe(5);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    // GIVEN

    // WHEN
    const result = calculator.subtract(3, 2);

    // THEN
    expect(result).toBe(1, 'unexpected subtraction result');
  });
});
