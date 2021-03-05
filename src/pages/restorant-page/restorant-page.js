import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { flow, makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import firebase from '../../firebase';
import { Rating } from '../main-page/restorants';
import '../../css/restorant-page.css';
import '../../css/restorants.css';
import { ProductCard } from './product-card';
import ConfirmMessage from '../../modules/confirm-message.js';
import { productsData } from '../../modules/shopping-cart.js';
import { scrollBar } from '../../modules/shopping-cart';


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

function DescriptionInRestorantPage(props) {
    let tags = [];

    if (props.data.minPrice) {
        tags.push(`От ${props.data.minPrice} ₽`)
    }

    if (props.data.typeOfFood) {
        tags = [...tags, ...props.data.typeOfFood]
    }

    tags = tags.map((tag, index) => {
        tag = <span key={index}>{tag}</span>
        return index ? [<div key={index + 'ellipse'} className='ellipse' />, tag] : tag
    }).flat()

    if (tags.length !== 0) {
        return (
            <div className='description'>
                {tags}
            </div>
        )
    }
    return (<div />)
}


const Page = observer(({ restorant, productData }) => {

    const [isMessageShown, setIsMessageShown] = useState(false);

    function showMessage() {
        setIsMessageShown(true);
    }

    function yesFunction() {
        productData.wouldChangeRestorant.yes();
        productData.wouldChangeRestorant = null;
        setIsMessageShown(false);
    }

    function noFunction() {
        productData.wouldChangeRestorant.no();
        productData.wouldChangeRestorant = null;
        setIsMessageShown(false);
    }

    useEffect(() => {
        if (productData.wouldChangeRestorant) {
            showMessage();
        }
    }, [productData.wouldChangeRestorant]);

    if (restorant.isLoadingPage) {
        return (
            <section>
                <main>
                    <div className='animated-background restorant-page-info-holder' />
                </main>
            </section>
        )
    }

    return (
        <section>
            {isMessageShown && <ConfirmMessage
                message='Хотите очистить корзину и сменить ресторан?'
                yesClick={yesFunction}
                noClick={noFunction}
                onClose={() => { setIsMessageShown(false) }}
            />}
            <main>
                <div className='restorant-page-header'>
                    <h2 className='restorant-name'>
                        {restorant.name}
                    </h2>
                    <Rating data={restorant} />
                    <DescriptionInRestorantPage data={restorant} />
                </div>
                <ProductsArea data={restorant.productsList} />
            </main>
        </section>
    )
})

function ProductsArea(props) {
    return (
        <div className='products-area'>
            {props.data.map((doc) => {
                return (
                    <ProductCard productInfo={doc} key={doc.id} />
                )
            })}
        </div>
    )
}

function RestorantPage() {
    let { id } = useParams();

    useEffect(() => {
        restorantData.loadRestorantData(id);
        document.addEventListener('scroll', handleScroll);
        return () => {
            restorantData.clear();
            document.removeEventListener("scroll", handleScroll);
        }
    })

    function handleScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100) {
            restorantData.loadProductList(id);
        }
    }

    return (
        <Page productData={productsData} restorant={restorantData} />
    )
}

export default RestorantPage;
