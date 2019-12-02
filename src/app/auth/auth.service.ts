import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    /** Cache to store whether or not a certain user is admin */
    private readonly adminsCache: { [uid: string]: boolean } = {};
    readonly authState$ = this.ngFireAuth.authState;
    readonly isSignedIn$ = this.authState$.pipe(map(user => user != null));
    readonly isAdmin$ = this.authState$.pipe(switchMap(user => this.isAdmin(user)));

    constructor(
        private ngFireAuth: AngularFireAuth,
        private db: AngularFirestore
    ) { }

    authenticate(): Observable<User> {
        return this.authState$.pipe(
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

    private isAdmin(user: User): Observable<boolean> {
        if (!user || !user.uid) {
            return of(false);
        }
        if (this.adminsCache[user.uid]) {
            return of(true);
        }
        return this.db.collection(environment.usersCollection).doc(user.uid).get().pipe(
            take(1),
            map((doc) => {
                const data = doc.data();
                if (!data || typeof data.isAdmin !== 'boolean') {
                    return false;
                }
                return data.isAdmin;
            }),
            tap((isAdmin) => {
                if (isAdmin) {
                    this.adminsCache[user.uid] = true;
                }
            })
        );
    }

}
