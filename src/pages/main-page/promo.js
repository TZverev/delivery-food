import React, { useState, useEffect } from 'react'
import '../../css/promo.css';
import '../../img/promo-first.svg';
import '../../img/promo-second.jpeg'

function PromoElement(props) {
    return (
        <div className={`${props.class} promo-element`} >
            <div>
                <h1>{props.heading}</h1>
                <p>{props.text}</p>
            </div>
        </div>
    )
}

function Button(props) {
    if (props.id === props.position) {
        return (
            <div onClick={props.click} className='switcher-button active'></div>
        )
    } else {
        return (
            <div onClick={props.click} className='switcher-button'></div>
        )
    }
}

function Ul(props) {
    return (
        <ul style={{ marginLeft: props.position * -1200 + 'px' }}>
            {props.children.map((child) => {
                return (
                    <li key={child.props.id}>
                        {child}
                    </li>
                )
            })}
        </ul>
    )
}

function Carusel(props) {

    const [position, setPosition] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition(position => (position + 1) % props.children.length);
        }, 5000);
        return () => clearInterval(interval)
    })

    return (
        <section>
            <div className='promo'>
                <div>
                    <Ul
                        position={position}
                        children={props.children}
                    />
                </div>
            </div>
            <div className='switcher'>
                {props.children.map((child) => {
                    return (
                        <Button
                            key={child.props.id}
                            click={() => setPosition(child.props.id)}
                            id={child.props.id}
                            position={position}
                        />
                    )
                })}
            </div>
        </section>
    )

}


let firstPromo = <PromoElement
    heading={'Онлайн-сервис доставки еды на дом'}
    text='Блюда из любимого ресторана привезет курьер в перчатках, маске и с антисептиком'
    class='first'
    id={0}
/>

let secondPromo = <PromoElement
    heading='Быстрая и дешевая еда'
    text='Блюда из любимого ресторана привезет курьер в перчатках, маске и с антисептиком'
    class='second'
    id={1}
/>

let thirdPromo = <PromoElement
    heading={'Онлайн-сервис доставки еды на дом'}
    text='Блюда из любимого ресторана привезет курьер в перчатках, маске и с антисептиком'
    class='first'
    id={2}
/>

let fourPromo = <PromoElement
    heading='Быстрая и дешевая еда'
    text='Блюда из любимого ресторана привезет курьер в перчатках, маске и с антисептиком'
    class='second'
    id={3}
/>

function PromoResult() {
    return (
        <Carusel>
            {firstPromo}
            {secondPromo}
            {thirdPromo}
            {fourPromo}
        </Carusel>
    )
}


export default PromoResult;