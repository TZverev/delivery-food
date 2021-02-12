import firebase from '../../firebase';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../../css/accaunt.css';
import { userData } from '../../pages/account/account-data';
import { observer } from "mobx-react-lite";

function Modal(props) {

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

function scrollBar() {
    const documentWidth = parseInt(document.documentElement.clientWidth);
    const windowsWidth = parseInt(window.innerWidth);
    return windowsWidth - documentWidth
}

export default function Auth(props) {

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
            <div className='auth-background'>
                <AuthBox data={userData} close={props.onClick} />
            </div>
        </Modal>
    )
}

const AuthBox = observer((props) => {
    const [condition, setCondition] = useState('login');
    useEffect(() => {
        if (props.data.emailVerified) {
            props.close();
        }
    })

    if (condition === 'login') {
        return (
            <div className='auth-box'>
                <div className='auth-header'>
                    <h2>
                        Вход
                    </h2>
                    <div className='closeButton'
                        onClick={props.close}>
                        ╳
                    </div>
                </div>
                {props.data.isLogined ?
                    <Verification close={props.close} /> :
                    <Login
                        registration={() => {
                            setCondition('registration')
                        }}
                        forgetPass={() => {
                            setCondition('forgetPass')
                        }} />}
            </div>
        )
    } else if (condition === 'registration') {
        return (
            <div className='auth-box'>
                <div className='auth-header'>
                    <h2>
                        Регистрация
                    </h2>
                    <div className='closeButton'
                        onClick={props.close}>
                        ╳
                    </div>
                </div>
                {props.data.isLogined ?
                    <Verification close={props.close} /> :
                    <Registration
                        login={() => {
                            setCondition('login')
                        }} />}
            </div>
        )
    } else if (condition === 'forgetPass') {
        return (
            <div className='auth-box'>
                <div className='auth-header'>
                    <h2>
                        Восстановление пароля
                    </h2>
                    <div className='closeButton'
                        onClick={props.close}>
                        ╳
                    </div>
                </div>
                {props.data.isLogined ?
                    <Verification close={props.close} /> :
                    <ForgetPass
                        login={() => {
                            setCondition('login')
                        }} />}
            </div>
        )
    }

})

export function Verification(props) {
    return (
        <>
            <p className='message'>
                Вам выслано письмо на электронную почту. Активируйте аккаунт по ссылке из письма.
            </p>
            <div className='centr'>
                <button
                    onClick={props.close}
                    className='primary-button'>
                    Хорошо
            </button>
            </div>
        </>
    )
}

function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);

    function login(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            if (error.code === 'auth/invalid-email') {
                setErrorEmail('Неверный формат e-mail.')
            }

            if (error.code === 'auth/wrong-password') {
                setErrorPassword('Неверный пароль.')
            }

            if (error.code === 'auth/user-not-found') {
                setErrorEmail('Пользователь с таким e-mail не зарегистрирован.')
            }
        });
    }

    return (
        <form
            onSubmit={login}
            className='form-box'>
            <div className='form-control'>
                <input
                    className='input'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorEmail('')
                    }}
                    required
                    placeholder='E-mail' />
            </div>
            <p className='error-message'>
                {errorEmail}
            </p>
            <div className='form-control'>
                <input
                    className='input'
                    value={password}
                    type='password'
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorPassword('');
                    }}
                    required
                    placeholder='Пароль' />
            </div>
            <p className='error-message'>
                {errorPassword}
            </p>
            <p
                className='forgetPass'
                onClick={props.forgetPass}>
                Забыли пароль?
            </p>
            <div className='form-control'>
                <button
                    type='submit'
                    className='primary-button' >
                    Вход
                </button>
                <button
                    onClick={props.registration}
                    type='button'>
                    Регистрация
                </button>
            </div>
        </form>
    )
}

function ForgetPass(props) {
    const [errorEmail, setErrorEmail] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [isChangeDone, setIsChangeDone] = useState(false)

    function changePass(e) {
        e.preventDefault();
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
            setIsChangeDone(true)
        }).catch(function (error) {
            console.log(error.code)
            if (error.code === 'auth/user-not-found') {
                setErrorEmail('Пользователь с такой почтой не найден')
            }
            if (error.code === 'auth/invalid-email') {
                setErrorEmail('Неверный формат e-mail.')
            }
        });
    }

    return (
        (isChangeDone ?
            <>
                <div className='center'>
                    <p className='message'>
                        На вашу почту отправлено письмо для смены пароля.
                </p>
                </div>
                <div className='center'>
                    <button
                        onClick={props.login}>
                        Назад
                </button>
                </div>
            </> :
            <form
                onSubmit={(e) => {
                    changePass(e)
                }}
                className='form-box'>
                <div className='form-control'>
                    <input
                        required
                        value={emailAddress}
                        onChange={(e) => {
                            setEmailAddress(e.target.value);
                            setErrorEmail('')
                        }}
                        className='input'
                        placeholder='E-mail'
                    />
                </div>
                <p className='error-message'>
                    {errorEmail}
                </p>
                <div className='form-control'>
                    <button
                        type='submit'
                        className='primary-button'>
                        Продолжить
                </button>
                    <button
                        onClick={props.login}>
                        Назад
                </button>
                </div>
            </form>)
    )
}

function Registration(props) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const [password, setPassword] = useState('');
    const [repeate, setRepeate] = useState('');

    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);

    function passwordCheck() {
        if (password !== repeate) {
            setErrorPassword('Пароли не совпадают.');
            return false;
        } else return true
    }

    function registration(e) {
        e.preventDefault();
        if (passwordCheck()) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .catch(function (error) {
                    if (error.code === 'auth/email-already-in-use') {
                        setErrorEmail('Эта почта уже используется.')
                    }

                    if (error.code === 'auth/invalid-email') {
                        setErrorEmail('Неверный формат e-mail.')
                    }

                    if (error.code === 'auth/weak-password') {
                        setErrorPassword('Пароль должен быть больше 6 символов.')
                    }
                }).then(
                    () => {
                        let user = firebase.auth().currentUser;
                        if (user) {
                            user.updateProfile({
                                displayName: name,
                            }).then(function () {
                                console.log('Update successful.');
                            }).catch(function (error) {
                                console.log('An error happened.');
                            })
                        }
                    }
                ).then(
                    () => {
                        let user = firebase.auth().currentUser;
                        if (user) {
                            user.sendEmailVerification().then(function () {
                                console.log('Email sent.')
                            }).catch(function (error) {
                                console.log('An error happened.');
                            });
                        }
                    }
                )
        }
    }

    return (
        <form className='form-box'
            onSubmit={registration} >
            <div className='form-control'>
                <input
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    required
                    className='input'
                    placeholder='Имя'
                />
            </div>
            <div className='form-control'>
                <input
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorEmail('')
                    }}
                    required
                    className='input'
                    placeholder='E-mail'
                />
            </div>
            <p className='error-message'>
                {errorEmail}
            </p>
            <div className='form-control'>
                <input
                    value={password}
                    type='password'
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorPassword('');
                    }}
                    required
                    className='first-input-pass'
                    placeholder='Пароль'
                />
                <input
                    value={repeate}
                    type='password'
                    onChange={(e) => {
                        setRepeate(e.target.value);
                        setErrorPassword('');
                    }}
                    required
                    placeholder='Повторите пароль'
                />
            </div>
            <p className='error-message'>
                {errorPassword}
            </p>
            <div className='form-control'>
                <button
                    type='submit'
                    className='primary-button' >
                    Зарегистрироваться
                </button>
                <button
                    onClick={props.login}
                    type='button'>
                    Вход
                </button>
            </div>
        </form>
    )
}

