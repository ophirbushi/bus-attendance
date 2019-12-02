// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCHvS4RKKoTOwTI4a19vjuG48ahmyyI-aA',
    authDomain: 'bus-attend.firebaseapp.com',
    databaseURL: 'https://bus-attend.firebaseio.com',
    projectId: 'bus-attend',
    storageBucket: 'bus-attend.appspot.com',
    messagingSenderId: '310085950405'
  },
  ridersCollection: 'riders',
  busGroupsCollection: 'bus-groups',
  usersCollection: 'users'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
