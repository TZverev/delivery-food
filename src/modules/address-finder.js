import React, { useEffect, useState } from 'react';
import { productsData } from './shopping-cart';

export default function Address() {

    const [value, setValue] = useState('');
    const [lastRequest, setLastRequest] = useState(null);
    const [addressList, setAddressList] = useState([]);
    const [isAddrerssListHidden, setIsAddressListHidden] = useState(true);
    //const [isAddressSelected, setIsAddressSelected] = useState(false);

    useEffect(() => {
        if (value === '') {
            setAddressList([]);
            setIsAddressListHidden(true);
            //clearTimeout(lastRequest);
            productsData.addAddress(null);
        }
    }, [value]);

    function sendRequest(inputValue) {
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
        const token = "7c474ea85b764f8222ec38a9a1f6531249463769";
        const query = inputValue;

        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({ query: query })
        }
        setIsAddressListHidden(false);
        fetch(url, options)
            .then(response => response.text())
            .then(result => {
                result = JSON.parse(result);
                setAddressList(result.suggestions);
            })
            .then(setLastRequest(Date.now()))
            .catch(error => console.log("error", error));

    }

    function handleChange(e) {
        setValue(e.target.value);
        let inputValue = e.target.value;
        clearTimeout(lastRequest);
        setLastRequest(setTimeout(() => { sendRequest(inputValue) }, 1000));
        productsData.addAddress(null);
    }

    function addressSelection(e) {
        setValue(e.target.textContent);
        setIsAddressListHidden(true);
        productsData.addAddress(e.target.textContent);
    }

    function handleBlur(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsAddressListHidden(true);
        }
    }

    return (
        <div
            tabIndex={1}
            onBlur={(e) => { handleBlur(e) }}>
            <input
                value={value}
                onChange={(e) => { handleChange(e) }}
                placeholder='Введите адрес'
                className='address-input'
            />
            {!isAddrerssListHidden &&
                <ul
                    tabIndex={0}
                    className='suggestions-wrapper'>
                    <li
                        className='address-message'>
                        Выберете варинат или продолжите ввод
                        </li>
                    {addressList.map((doc) => {
                        return (
                            <li
                                onClick={(e) => { addressSelection(e) }}
                                className='suggestion'
                                key={doc.value}>
                                {doc.value}
                            </li>
                        )
                    })}
                </ul>}
        </div>
    )
}