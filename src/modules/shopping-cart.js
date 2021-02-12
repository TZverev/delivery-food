import { observer } from 'mobx-react';
import { autorun, makeAutoObservable, toJS } from "mobx";
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../css/shopping-cart.css';
import { LowButtons } from '../pages/restorant-page/product-card.js';
import ConfirmMessage from '../modules/confirm-message.js';
import { userData } from '../pages/account/account-data';
import { db } from '../firebase';
import { LoadingOutlined } from '@ant-design/icons';
import Address from './address-finder';

export function Modal(props) {

    const modalRoot = document.getElementById('modal-root');
    const element = document.createElement('div');

    useEffect(() => {
        modalRoot.appendChild(element);
        return () => {
            modalRoot.removeChild(element);
        }
    })

    return ReactDOM.createPortal(
        props.children,
        element,
    )

}

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

const ShoppingCartList = observer((props) => {

    let list = Array.from(new Set(props.data.productIdList)).sort();
    list = list.map((prodId) => {
        return prodId = props.data.productObjList.find(item => item.id === prodId);
    })

    if (!list.length) {
        return (
            <div className='empty-shoopng-cart'>
                <p>
                    Корзина пуста
                </p>
            </div>
        )
    }

    return (
        <div className='shopping-cart-main'>
            <h3>
                {props.data.restorantName}
            </h3>
            <div className='shopping-cart-products'>
                {list.map((item) => {
                    let quantity = props.data.productIdList.filter(prodId => prodId === item.id).length;
                    let cost = item.price * quantity;
                    return (
                        <div key={item.id}>
                            <div className='shopping-cart-prod' >
                                <p >
                                    {item.name}
                                </p>
                                <div className='shopping-cart-prod-right'>
                                    <div className='price' >
                                        {`${item.price} ₽`}
                                    </div>
                                    <div className='sum-price mr-5' >
                                        {`${cost}  ₽`}
                                    </div>
                                    <LowButtons
                                        quantity={quantity}
                                        product={item}
                                        restorantId={props.data.restorant}
                                        restorantName={props.data.restorantName}
                                        restorantImg={props.data.restorantImg}
                                    />
                                </div>
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
        </div>

    )
})

export function scrollBar() {
    const documentWidth = parseInt(document.documentElement.clientWidth);
    const windowsWidth = parseInt(window.innerWidth);
    return windowsWidth - documentWidth
}

const OrderButton = observer(({ orderData, createOrder, isLoadingOrder }) => {

    const [isDisabled, setIsDisabled] = useState(true);

    function order() {
        createOrder();
        productsData.clearData();
    }

    useEffect(() => {
        if (orderData.address) {
            setIsDisabled(false)
        }
        return () => {
            setIsDisabled(true)
        }
    }, [orderData.address])

    if (isLoadingOrder) {
        return (
            <button className='primary-button load-button'>
                <LoadingOutlined />
            </button>
        )
    } else {
        return (
            <button
                disabled={isDisabled}
                onClick={order}
                className='primary-button button'>
                Оформить заказ
            </button>
        )
    }
})

const ShoppingCartFooter = observer((props) => {

    const [isMessageShown, setIsMessageShown] = useState(false);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);

    function productList() {
        let list = Array.from(new Set(props.data.productIdList)).sort();
        list = list.map((prodId) => {
            let count = props.data.productIdList.filter(id => id === prodId).length;
            prodId = toJS(props.data.productObjList.find(item => item.id === prodId));
            prodId.quantity = count;
            let { composition, img, name, price, quantity } = prodId;
            return { composition, img, name, price, quantity };
        })
        return list;
    }

    function createOrder() {
        if (userData.isLogined) {
            setIsLoadingOrder(true);
            let prodList = productList();
            db.collection('users')
                .doc(userData.uid)
                .collection('orders')
                .add({
                    isReady: false,
                    time: new Date(),
                    restorantId: props.data.restorant,
                    restorantName: props.data.restorantName,
                    restorantImg: props.data.restorantImg,
                    productObjList: prodList,
                    sum: props.data.sum,
                }).then(
                    setIsLoadingOrder(false)
                )
        } else {
            return
        }

    }

    if (props.data.sum) {
        return (
            <>
                <Address />
                <div className='shopping-cart-footer'>
                    {isMessageShown && <ConfirmMessage
                        message='Хотите очистить корзину?'
                        yesClick={props.data.clearData}
                        noClick={() => {
                            setIsMessageShown(false);
                        }}
                    />}
                    <div className='sum-price'>
                        {`${props.data.sum} ₽`}
                    </div>
                    <div className='buttons'>
                        <OrderButton
                            orderData={productsData}
                            isLoadingOrder={isLoadingOrder}
                            createOrder={createOrder} />
                        <button
                            onClick={() => {
                                setIsMessageShown(true);
                            }}
                            className='button'>
                            Очистить
                    </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
        </>
    )
})

function ShoppingCart(props) {

    useEffect(() => {
        document.body.style.marginRight = scrollBar() + 'px';
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.marginRight = -scrollBar() + 'px';
            document.body.style.overflow = '';
        }
    })

    return (
        <Modal>
            <div className='shopping-cart-background'>
                <div className='shopping-cart-box'>
                    <div className='shopping-cart-header'>
                        <h2>Корзина</h2>
                        <div className='closeButton' onClick={props.onClick}>
                            ╳
                        </div>
                    </div>
                    <ShoppingCartList data={productsData} />
                    <ShoppingCartFooter data={productsData} />
                </div>
            </div>
        </Modal>
    )
}

export default ShoppingCart;