import firebase from '../firebase';
import { flow, makeAutoObservable } from "mobx";

const db = firebase.firestore();

class RestorantData {
    id = null;
    name = null;
    deliveryTime = null;
    minPrice = null;
    rating = null;
    cover = null;
    typeOfFood = null;
    img = null;

    productsList = [];
    lastDoc = null;
    isLoadingPage = true;
    isLoadingRestorant = false;

    constructor() {
        makeAutoObservable(this, {
            loadRestorantData: flow,
            loadProductList: flow
        });
    }

    *loadRestorantData(id) {
        if (this.isLoadingPage) {
            const docRef = db.collection('restorants').doc(id);
            const doc = yield docRef.get();
            this.id = doc.id;
            this.name = doc.data().name;
            this.deliveryTime = doc.data().deliveryTime;
            this.minPrice = doc.data().minPrice;
            this.rating = doc.data().rating;
            this.cover = doc.data().cover;
            this.typeOfFood = doc.data().typeOfFood;
            this.img = doc.data().img;

            this.allowToLoad = true;
            this.isLoadingPage = false;
            yield this.loadProductList(id);
        }
    }

    *loadProductList(id) {
        if (!this.isLoadingRestorant) {
            this.isLoadingRestorant = true;
            const docRef = db.collection('restorants').doc(id);
            let products = docRef.collection('products');
            let query = products.orderBy('name').limit(6);
            if (this.lastDoc != null) {
                query = query.startAfter(this.lastDoc);
            }
            let first = yield query.get();
            if (first.size === 0) {
                return;
            }
            this.productsList = [...this.productsList, ...first.docs.map((doc) => new RestorantProduct(doc.id, doc.data()))];
            this.lastDoc = first.docs[first.docs.length - 1];
            this.isLoadingRestorant = false;
        }
    }

    clear() {
        this.id = null;
        this.name = null;
        this.deliveryTime = null;
        this.minPrice = null;
        this.rating = null;
        this.cover = null;
        this.typeOfFood = null;
        this.img = null;

        this.productsList = [];
        this.isLoadingPage = true;
        this.isLoadingRestorant = false;
        this.lastDoc = null;
    }
}

class RestorantProduct {
    id = null;
    price = null;
    name = null;
    img = null;
    composition = null;

    constructor(id, { price, name, img, composition }) {
        this.id = id;
        this.price = price;
        this.name = name;
        this.img = img;
        this.composition = composition;

    }
}

export const restorantData = new RestorantData();