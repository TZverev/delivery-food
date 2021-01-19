import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/restorants.css';
import star from '../../img/rating-star.svg';
import firebase from '../../firebase';
import { flow, makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"

const db = firebase.firestore();
const storage = firebase.storage();

class Catalog {
    restorantsList = [];
    lastDoc = null;
    isLoading = false;

    constructor() {
        makeAutoObservable(this, {
            loadRestorants: flow
        });
    }

    *loadRestorants() {
        if (!this.isLoading) {
            this.isLoading = true;
            const restorants = db.collection('restorants');
            let query = restorants.orderBy('name').limit(6);
            if (this.lastDoc != null) {
                query = query.startAfter(this.lastDoc);

            }
            let first = yield query.get();
            if (first.size === 0) {
                this.isLoading = false;
                return;
            }

            this.restorantsList = [...this.restorantsList, ...first.docs.map((doc) => doc)];
            this.lastDoc = first.docs[first.docs.length - 1];
            this.isLoading = false;
        }
    }

    clear() {
        this.restorantsList = [];
        this.lastDoc = null;
        this.isLastDoc = false;
    }
}

const catalog = new Catalog();

const RestorantsList = observer(({ data }) => {

    return (
        <div className='restorants-area'>
            {data.restorantsList.map((doc) => {
                return (
                    <RestorantCard data={doc.data()} key={doc.id} id={doc.id} />
                )
            })}
        </div>
    )
})

function DescriptionInRestorantCard(props) {
    let tags = [];

    if (props.data.minPrice) {
        tags.push(`От ${props.data.minPrice} ₽`)
    }

    if (props.data.typeOfFood) {
        tags = [...tags, ...props.data.typeOfFood]
    }

    tags = tags.slice(0, 2).map((tag, index) => {
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

function DeliveryTime(props) {
    if (props.data.deliveryTime) {
        return (
            <div className='delivery-time'>{props.data.deliveryTime + ' мин'}</div>
        )
    }
    return (<div />)
}

export function Rating(props) {
    if (props.data.rating) {
        return (
            <div className='rating'>
                <img src={star} alt='star' />
                <span>{props.data.rating.toFixed(1)}</span>
            </div>
        )
    }
    return (
        <div className='rating-new'>
            New
        </div>
    )
}

function RestorantCard(props) {

    const [img, setImg] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    async function loadImageOfRestorant() {
        let imgRef = storage.refFromURL(props.data.img);
        let image = await imgRef.getDownloadURL();
        setImg(image);
        setIsLoading(false);
    }

    loadImageOfRestorant();

    if (isLoading) {
        return (
            <div className='restorant-card'>
                <div className='restorant-img animated-background' />
                <div className='restorant-head'>
                    <div className='h3-holder animated-background' />
                    <div className='delivery-time-holder animated-background' />
                </div>
                <div>
                    <div className='restorant-info-holder animated-background' />
                </div>
            </div>
        )
    }

    return (
        <Link to={`/restorant/${props.id}`}>
            <div className='restorant-card'>
                <img className='restorant-img'
                    src={img}
                    alt={props.data.name} />
                <div className='restorant-head'>
                    <h3>{props.data.name}</h3>
                    <DeliveryTime data={props.data} />
                </div>
                <div>
                    <div className='restorant-info'>
                        <Rating data={props.data} />
                        <DescriptionInRestorantCard data={props.data} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

function Restorants() {

    useEffect(() => {
        catalog.loadRestorants();
        document.addEventListener('scroll', handleScroll);
        return () => {
            catalog.clear();
            document.removeEventListener("scroll", handleScroll);
        }
    })

    function handleScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100) {
            catalog.loadRestorants();
        }
    }

    return (
        <section className='restorants'>
            <div className='header-restorants'>
                <h2>Рестораны</h2>
            </div>
            <RestorantsList data={catalog} />
        </section>

    )
}

export default Restorants    