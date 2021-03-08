import { autorun, makeAutoObservable } from "mobx";

export function localStorageUpload(props) {
    sessionStorage.setItem(props.prodRef.id, 1)
    sessionStorage.setItem('restorantId', props.restorant.id)
}
class ShoppingCartData {

    restorant = null;
    restorantName = null;
    restorantImg = null;
    productIdList = [];
    productObjList = [];
    sum = 0;
    wouldChangeRestorant = null;
    address = null;

    constructor() {
        makeAutoObservable(this);
        this.clearData = this.clearData.bind(this);
        this.restorant = sessionStorage.getItem('restorantId');
        this.restorantName = sessionStorage.getItem('restorantName');
        this.restorantImg = sessionStorage.getItem('restorantImg');
        if (sessionStorage.getItem('productIdList')) {
            this.productIdList = sessionStorage.getItem('productIdList').split(',');
            this.productObjList = JSON.parse(sessionStorage.getItem('productObjList').split(','));
        }
        this.setSum();
    }

    setSum() {
        this.sum = this.productObjList.map(a =>
            a = a.price
        ).reduce((sum, current) => {
            return sum + current
        }, 0)
    }

    addAddress(address) {
        this.address = address;
    }

    addProduct({ restorantImg, restorantName, restorantId, product }) {
        if (!this.restorant) {
            this.restorant = restorantId;
        }

        if (this.restorant === restorantId) {
            this.productIdList = [...this.productIdList, product.id];
            this.productObjList = [...this.productObjList, product]
            this.restorant = restorantId;
            this.restorantName = restorantName;
            this.restorantImg = restorantImg;
            this.setSum();
        } else {
            new Promise((yes, no) => {
                this.wouldChangeRestorant = { yes, no };
            }).then(() => {
                this.restorant = restorantId;
                this.restorantName = restorantName;
                this.restorantImg = restorantImg;
                this.productIdList = [product.id];
                this.productObjList = [product];
                this.setSum();
            })
        }
    }

    removeProduct(productId) {
        this.productIdList.splice(
            this.productIdList.findIndex(item => item === productId),
            1
        )

        this.productObjList.splice(
            this.productObjList.findIndex(item => item.id === productId),
            1
        )
        this.setSum();

        if (!this.productIdList.length) {
            this.restorant = null;
            sessionStorage.clear();

        }
    }

    clearData() {
        sessionStorage.clear();
        this.restorant = null;
        this.restorantName = null;
        this.restorantImg = null;
        this.productIdList = [];
        this.productObjList = [];
        this.sum = 0;
        this.address = null;
    }
}

export const productsData = new ShoppingCartData();

autorun(() => {
    if (productsData.restorant) {
        sessionStorage.setItem('restorantId', productsData.restorant);
        sessionStorage.setItem('restorantName', productsData.restorantName);
        sessionStorage.setItem('restorantImg', productsData.restorantImg);
        sessionStorage.setItem('productIdList', productsData.productIdList);
        sessionStorage.setItem('productObjList', JSON.stringify(productsData.productObjList));
    }
})