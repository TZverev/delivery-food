import { makeAutoObservable, flow } from 'mobx';
import firebase, { db } from '../firebase';

class UserData {
    isLoading = true;
    isLogined = null;
    name = null
    email = null;
    emailVerified = null;
    uid = null;
    constructor() {
        makeAutoObservable(this);
    }

    loadingUser(user) {
        if (user) {
            this.isLoading = false;
            this.isLogined = true;
            this.name = user.displayName;
            this.email = user.email;
            this.emailVerified = user.emailVerified;
            this.uid = user.uid;
        } else {
            this.isLoading = false;
            this.isLogined = false;
            this.name = null;
            this.email = null;
            this.emailVerified = null;
            this.uid = null;
        }
    };
}

export const userData = new UserData();
firebase.auth().onAuthStateChanged(function (user) {
    userData.loadingUser(user);
})

class OrderHistory {
    ordersList = [];
    lastDoc = null;
    isLoading = false;

    constructor() {
        makeAutoObservable(this, {
            loadOrders: flow
        });
    }

    *loadOrders() {
        if (!this.isLoading) {
            this.isLoading = true;
            const orders = db.collection('users')
                .doc(userData.uid)
                .collection('orders');

            let query = orders.orderBy('time', "desc").limit(6);
            if (this.lastDoc != null) {
                query = query.startAfter(this.lastDoc);

            }
            let first = yield query.get();
            if (first.size === 0) {
                this.isLoading = false;
                return;
            }

            this.ordersList = [...this.ordersList, ...first.docs.map((doc) => new OrderData(doc.id, doc.data()))];
            this.lastDoc = first.docs[first.docs.length - 1];
            this.isLoading = false;
        }
    }

    clear() {
        this.ordersList = [];
        this.lastDoc = null;
    }
}

export const orderHistory = new OrderHistory();

class OrderData {
    id;
    isReady;
    productObjList;
    restorantId;
    restorantName;
    restorantImg;
    sum;
    time;

    constructor(
        id, {
            isReady,
            productObjList,
            restorantId,
            restorantName,
            restorantImg,
            sum,
            time,
        }) {
        this.id = id
        this.isReady = isReady
        this.productObjList = productObjList
        this.restorantId = restorantId
        this.restorantName = restorantName
        this.restorantImg = restorantImg
        this.sum = sum
        this.time = time
    }
}
