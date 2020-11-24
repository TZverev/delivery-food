import React, { Component } from 'react'
import logo from '../img/logo.svg';
import vk from '../img/vk-icon.svg';
import facebook from '../img/facebook-icon.svg';
import inst from '../img/instagram-icon.svg';

class Footer extends Component {
    render() {
        return (
            <footer>
                <div className='contanier'>
                    <div className='info-contanier'>
                        <img className='logo' src={logo} alt='logo' />
                        <div className='footer-info'>
                            <p>Ресторанам</p>
                            <p>Курьерам</p>
                            <p>Контакты</p>
                        </div>
                    </div>
                    <div className='social-networks'>
                        <img className='inst-icon' src={inst} alt='instagram' />
                        <img className='facebook-icon' src={facebook} alt='facebook' />
                        <img className='vk-icon' src={vk} alt='vk' />
                    </div>
                </div>
            </footer>
        )
    }
}


export default Footer