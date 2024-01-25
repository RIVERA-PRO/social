import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Auth from '../Components/Auth/Auth';
export default function IndexLayout() {


    return (
        <div>


            <Auth />


        </div>
    );
}
