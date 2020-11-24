import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import firebase from '../../firebase';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { userData } from './account-data';
import HistoryOfOrders from './orders-history';
import '../../css/shopping-cart.css';



const AccountPage = observer(({ user }) => {

    if (user.isLoading) {
        return (
            <main>
                <div className='animated-background account-holder' />
            </main>
        )
    } else if (user.isLogined && user.emailVerified) {
        return (
            <main>
                <AccountName name={user.name} />
                <div className='account-page-main'>
                    <HistoryOfOrders />
                </div>
            </main>

        )
    } else if (user.isLogined) {
        return (
            <main>
                <div className='centr'>
                    <p className='message'>
                        Вам выслано письмо на электронную почту. Активируйте аккаунт по ссылке из письма.
                    </p>
                </div>
            </main>
        )
    } else {
        return (
            <main>
                <div className='centr'>
                    <p className='message'>
                        Создайте аккаунт или войдите в него.
                    </p>
                </div>
            </main>
        )
    }

})

export default function Account() {
    return (
        <AccountPage user={userData} />
    )
}

function AccountName({ name }) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(name);

    function handleEdit() {
        setIsEditing(false);
        firebase.auth().currentUser.updateProfile({
            displayName: value
        }).catch(function (error) {
            console.log(error.message)
        })
    }

    if (isEditing) {
        return (
            <div className='edit'>
                <input
                    className='name-input-edit'
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    value={value} >
                </input>
                <CheckOutlined
                    onClick={handleEdit}
                    className='edit-icon'
                />
            </div >

        )
    }

    return (
        <div className='edit'>
            <div
                className='name-input'>
                {value}
            </div>
            <EditOutlined
                className='edit-icon'
                onClick={() => {
                    setIsEditing(true);
                }} />
        </div>

    )
}