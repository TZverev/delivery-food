import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Rating } from '../main-page/restorants';
import '../../css/restorant-page.css';
import '../../css/restorants.css';
import { ProductCard } from './product-card';
import ConfirmMessage from '../../modules/confirm-message.js';
import { productsData } from '../../store/shoppingCart-data';
import { restorantData } from '../../store/restorant-data';


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
