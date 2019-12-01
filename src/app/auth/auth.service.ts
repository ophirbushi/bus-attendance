import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { first, map, switchMap } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { snapshot } from '../utils/snapshot';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    readonly user$ = this.ngFireAuth.authState;
    readonly isSignedIn$ = this.user$.pipe(map(user => user != null));
    get user() { return snapshot(this.user$); }
    get isSignedIn() { return snapshot(this.isSignedIn$); }

    constructor(private ngFireAuth: AngularFireAuth) { }

    authenticate(): Observable<User> {
        return this.ngFireAuth.authState.pipe(
            switchMap((user) => {
                if (user) {
                    return of(user);
                }
                return from(this.ngFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()))
                    .pipe(map(result => result.user));
            })
        );
    }

    signOut() {
        return from(this.ngFireAuth.auth.signOut());
    }


}
