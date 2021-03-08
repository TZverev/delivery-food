import React, { useState } from 'react'
import { observer } from "mobx-react-lite";
import firebase from '../../firebase';
import { restorantData } from '../../store/restorant-data';
import { productsData } from '../../store/shoppingCart-data';
import '../../css/restorant-page.css';
import '../../css/restorants.css';
import shop from '../../img/shop-white.svg';

const storage = firebase.storage();

const ButtonShoppingCart = observer((props) => {

    let quantity = props.cart.productIdList.filter(item => item === props.product.id).length;

    if (quantity) {
        return (
            <LowButtons quantity={quantity}
                product={props.product}
                restorantId={restorantData.id}
                restorantName={restorantData.name}
                restorantImg={restorantData.img} />
        )
    }

    return (
        <button className='button primary-button shopping-cart-button'
            aria-label={`Добавить ${props.product.name} в корзину`}
            onClick={() => {
                productsData.addProduct(props);
            }}>
            <span>В корзину</span>
            <img src={shop} alt='shop' />
        </button>
    )
})

export function LowButtons(props) {
    return (
        <div className='low-button-contanier'>
            <button onClick={() => {
                productsData.removeProduct(props.product.id)
            }} className='low-button'
            >
                -
                </button>
            <p>
                {props.quantity}
            </p>
            <button onClick={() => {
                productsData.addProduct(props);
            }} className='low-button'>
                +
                </button>
        </div>
    )
}

const ProductCardCost = observer((props) => {
    let cost = 0;
    if (props.data.productIdList.length) {
        cost = props.data.productIdList.filter(item =>
            item === props.product.id).length;
    }

    if (cost) {
        return (
            <div className='sum-price mr-5'>
                {`${cost * props.product.price} ₽`}
            </div>
        )
    }

    return (
        <div />
    )
})

export function ProductCard(props) {

    const [imgRef, setImgRef] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    async function loadImageOfProduct() {
        if (isLoading) {
            const ref = storage.refFromURL(prod.img);
            const imageRef = await ref.getDownloadURL();
            setImgRef(imageRef);
            setIsLoading(false);
        }
    }

    const prod = props.productInfo;

    loadImageOfProduct();

    if (isLoading) {
        return (
            <div className='product-card'>
                <div className='animated-background product-img' />
                <div className='product-card-body'>
                    <div className='product-info'>
                        <div className='animated-background name-holder' />
                        <div className=' animated-background composition-holder' />
                    </div>
                    <div className='button-holder animated-background' />
                </div>
            </div>
        )
    }

    return (
        <div className='product-card'>
            <img className='product-img' src={imgRef} alt={prod.name} />
            <div className='product-card-body'>
                <div className='product-info'>
                    <h3>
                        {prod.name}
                    </h3>
                    <div className='composition'>
                        {prod.composition}
                    </div>
                </div>
                <div className='product-card-bottom'>
                    <div className='product-card-bottom-left'>
                        <ButtonShoppingCart cart={productsData}
                            restorantName={restorantData.name}
                            restorantId={restorantData.id}
                            restorantImg={restorantData.img}
                            product={prod} />
                        <div className='price'>
                            {`${prod.price}  ₽`}
                        </div>
                    </div>
                    <ProductCardCost product={prod}
                        data={productsData} />
                </div>
            </div>
        </div>
    )
}