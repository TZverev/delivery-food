import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDmupzbYvXGBVQ3-fTaRPBxMOS7dqHgAQs",
    authDomain: "delivery-4fc5c.firebaseapp.com",
    databaseURL: "https://delivery-4fc5c.firebaseio.com",
    projectId: "delivery-4fc5c",
    storageBucket: "delivery-4fc5c.appspot.com",
    messagingSenderId: "774948540367",
    appId: "1:774948540367:web:e752e217fa8d43f8f7ccba",
    measurementId: "G-V3RFL0X1NP"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export default firebase;