import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyBg0UijB3KG6_qW8qvgZeD6Rr155gAcMvs',
  authDomain: 'vpn-traffic-analysis.firebaseapp.com',
  databaseURL: 'https://vpn-traffic-analysis.firebaseio.com',
  projectId: 'vpn-traffic-analysis',
  storageBucket: 'vpn-traffic-analysis.appspot.com',
  messagingSenderId: '77658348269'
};

firebase.initializeApp(config);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
