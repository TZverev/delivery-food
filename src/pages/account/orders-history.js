import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { orderHistory } from './account-data';
import firebase from '../../firebase';
import star from '../../img/rating-star.svg';

const storage = firebase.storage();

const HistoryOfOrders = observer(() => {

    useEffect(() => {
        orderHistory.loadOrders();
        document.addEventListener('scroll', handleScroll);
        return () => {
            orderHistory.clear();
            document.removeEventListener("scroll", handleScroll);
        }
    })

    function handleScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100) {
            orderHistory.loadOrders();
        }
    }

    return (
        <div className='orders'>
            <h2>
                История заказов
                </h2>
            <OrderList
                orders={orderHistory} />
        </div>
    )
})

const OrderList = observer(({ orders }) => {

    if (orders.ordersList.length) {
        return (
            <div className='orders-list'>
                {orders.ordersList.map((order) => {
                    return (
                        <OrderElement
                            key={order.id}
                            order={order} />
                    )
                })}
            </div>
        )
    } else {
        return (
            <p className='message'>
                Заказов пока нет.
            </p>
        )
    }
})

function OrderElement({ order }) {
    const [img, setImg] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    async function loadImageOfRestorant() {
        setIsLoading(true);
        let imgRef = storage.refFromURL(order.restorantImg);
        let image = await imgRef.getDownloadURL();
        setImg(image);
        setIsLoading(false);
        setIsReady(true);
    }

    useEffect(() => {
        if (!isLoading && !isReady) {
            loadImageOfRestorant()
        }
    })

    if (!isReady) {
        return (
            <div className='order-box order-box-holder' >
                <div className='order-box-header'>
                    <div className='order-box-img animated-background' />
                    <div>
                        <div className='order-h3-holder animated-background' />
                        <div className='order-h3-holder animated-background' />
                    </div>
                </div>
                <div className='order-box-list'>
                    <div className='order-footer'>
                        <div className='order-box-sum-holder animated-background' />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='order-box'>
            <div className='order-box-header'>
                <img className='order-box-img'
                    src={img}
                    alt={order.restorantName} />
                <div>
                    <h3>
                        {order.restorantName}
                    </h3>
                    <OrderTime time={order.time} />
                </div>
            </div>
            <div className='order-box-list'>
                <div className='products-list'>
                    {order.productObjList.map((item) => {
                        return (
                            <ProductElement
                                key={item.name}
                                item={item} />
                        )
                    })}
                    <div className='order-footer'>
                        <div className='sum-price'>
                            {`${order.sum} ₽`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function OrderTime({ time }) {

    time = new Date(time.seconds * 1000);

    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDate();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    return (
        <p className='order-time'>
            {`${day}.${month}.${year} ${hour}:${minutes}`}
        </p>
    )
}

function ProductElement({ item }) {
    return (
        <div key={item.name}>
            <div className='order-item'>
                <p>
                    {item.name}
                </p>
                <div className='order-item-right'>
                    <div className='price'>
                        {`${item.quantity} шт.`}
                    </div>
                    <div className='price'>
                        {`${item.price} ₽`}
                    </div>
                    <div className='sum-price'>
                        {`${item.price * item.quantity} ₽`}
                    </div>
                </div>
            </div>
            <hr />
        </div>
    )
}

export default HistoryOfOrders;