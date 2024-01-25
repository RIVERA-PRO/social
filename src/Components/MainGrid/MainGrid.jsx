import React from 'react'
import './MainGrid.css'
import AllUsuarios from '../AllUsuarios/AllUsuarios'
import EnlacesMain from '../EnlacesMain/EnlacesMain'
import UserInfoMain from '../UserInfoMain/UserInfoMain'
export default function MainGrid() {
    return (
        <div className='MainGrid'>
            <div className='columnGridlef'>
                <UserInfoMain />
                <EnlacesMain />
            </div>

            <div className='feed'>

            </div>

            <div className='columnGridRitgh'>
                <AllUsuarios />
            </div>
        </div>
    )
}
