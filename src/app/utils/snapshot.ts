import { Observable, timer, asyncScheduler, empty } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

export const snapshot = <T>(source: Observable<T>): T => {
    let result: T;

    (source || empty()).pipe(
        takeUntil(timer(0, asyncScheduler)),
        take(1)
    ).subscribe((value) => {
        result = value;
    });

    return result;
};
