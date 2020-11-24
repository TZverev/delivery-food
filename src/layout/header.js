import React, { Component, useState } from 'react';
import logo from '../img/logo.svg';
import user from '../img/user.svg';
import shop from '../img/shop-grey.svg';
import { Link, Route, Switch } from 'react-router-dom';
import ShoppingCart from '../modules/shopping-cart.js';
import Auth from '../modules/account/auth';
import firebase from '../firebase';
import { userData } from '../pages/account/account-data';
import { observer } from 'mobx-react';

export class Button extends Component {
    render() {
        return (
            <button
                className={`${this.props.class} button`}
            >
                <img src={this.props.img} alt='user' />
                <span>{this.props.value}</span>
            </button>
        );
    };
};

function exit() {
    firebase.auth().signOut().then(function () {
        console.log('Sign-out successful.')
    }).catch(function (error) {
        console.log(error.message)
    });
}

const Buttons = observer(({ data }) => {
    const [isShoppingCart, setIsShoppingCart] = useState(false);
    const [auth, setAuth] = useState(false);

    function showShoppingCart() {
        setIsShoppingCart(true);
    }

    function hideShoppingCart() {
        setIsShoppingCart(false);
    }

    function showAuth() {
        setAuth(true);
    }

    function hideAuth() {
        setAuth(false);
    }

    if (data.isLoading) {
        return (
            <div className='animated-background buttons' />
        )
    }

    if (data.isLogined) {
        return (
            <div className='buttons'>
                <Switch>
                    <Route path='/account'>
                        <button
                            className='primary-button'
                            onClick={exit}>
                            <span>Выход</span>
                        </button>
                    </Route>
                    <Route path='/'>
                        <Link to='/account'>
                            <button
                                className='primary-button'>
                                <img src={user} alt='user' />
                                <span>Кабинет</span>
                            </button>
                        </Link>
                    </Route>
                </Switch>
                <button
                    onClick={showShoppingCart}>
                    <img src={shop} alt='user' />
                    <span>Корзина</span>
                </button>

                {isShoppingCart && <ShoppingCart onClick={hideShoppingCart} />}
                {auth && <Auth onClick={hideAuth} />}
            </div>
        )
    }

    return (
        <div className='buttons'>
            <button
                className='primary-button button'
                onClick={showAuth}>
                <img src={user} alt='user' />
                <span>Войти</span>
            </button>
            <button
                className={'button'}
                onClick={showShoppingCart}>
                <img src={shop} alt='user' />
                <span>Корзина</span>
            </button>
            {isShoppingCart && <ShoppingCart onClick={hideShoppingCart} />}
            {auth && <Auth onClick={hideAuth} />}
        </div>
    )
})

function Header() {
    return (
        <header>
            <div className='header'>
                <Link to='/'>
                    <img src={logo} alt='logo' />
                </Link>
                <input className='input-search input-address' placeholder='Адрес доставки' />
                <Buttons data={userData} />
            </div >
        </header >

    );
}

export default Header