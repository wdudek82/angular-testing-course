import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

xdescribe('Async Testing Examples', () => {
  it('Asynchronous test example with Jasmine done()', () => {
    let test = false;

    setTimeout((done: DoneFn) => {
      test = true;

      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it('Asynchronous test example - setTimeout()', fakeAsync(() => {
    let test = false;

    setTimeout((done: DoneFn) => {
      console.log('running assertions setTimeout()');

      test = true;
    }, 1000);

    // wait for x milliseconds
    // tick(1000);

    // execute all timers
    flush();

    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - plain Promises', fakeAsync(() => {
    let test = false;

    console.log('Creating promise.');

    Promise.resolve()
      .then(() => {
        console.log('Promise first then() evaluated successfully.');
        test = true;
      })
      .then(() => {
        console.log('Promise second then() evaluated successfully.');
      });

    flushMicrotasks();

    console.log('Running test assertion');
    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
    let counter = 3;

    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter *= 2;
      }, 1000);
    });

    expect(counter).toBe(3);

    flushMicrotasks();
    expect(counter).toBe(13);

    flush();
    expect(counter).toBe(26);
  }));

  it('Asynchronous test example - Observables', fakeAsync(() => {
    let test = false;

    console.log('Creating Observable.');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      console.log('Changing test value');

      test = true;
    });

    tick(1000);

    console.log('Running test assertion');
    expect(test).toBe(true);
  }));
});
