import { observer } from 'mobx-react';
import { toJS } from "mobx";
import React, { useEffect, useState } from 'react';
import '../css/shopping-cart.css';
import { LowButtons } from '../pages/restorant-page/product-card.js';
import Modal from '../modules/modal';
import ConfirmMessage from '../modules/confirm-message.js';
import { userData } from '../store/account-data';
import { db } from '../firebase';
import { LoadingOutlined } from '@ant-design/icons';
import Address from './address-finder';
import { productsData } from '../store/shoppingCart-data';


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

    return (
        <Modal close={props.onClick}>
            <div className='shopping-cart-box'>
                <div className='shopping-cart-header'>
                    <h2>Корзина</h2>
                    <button className='closeButton' onClick={props.onClick}>
                        ╳
                        </button>
                </div>
                <ShoppingCartList data={productsData} />
                <ShoppingCartFooter data={productsData} />
            </div>
        </Modal>
    )
}

export default ShoppingCart;