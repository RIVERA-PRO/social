import React from 'react'
import './Marketpleace.css'
import AllProductos from '../../Components/AllProductos/AllProductos'
import HeaderBack from '../../Components/HeaderBack/HeaderBack';
import NewProducto from '../../Components/NewProducto/NewProducto'
export default function Marketpleace() {
    return (
        <div >
            <HeaderBack title="Marketpleace" />
            <div className='bgPage'>

            </div>
            <NewProducto />
            <AllProductos />

        </div>
    )
}
