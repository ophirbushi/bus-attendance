import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UIState {
    private readonly _loading = new BehaviorSubject<boolean>(false);
    readonly loading$ = this._loading.asObservable();
    get loading() {
        return this._loading.getValue();
    }

    setLoading(value: boolean) {
        this._loading.next(value);
    }
}
