import React from 'react'
import './MainGrid.css'
import AllUsuarios from '../AllUsuarios/AllUsuarios'
import EnlacesMain from '../EnlacesMain/EnlacesMain'
import UserInfoMain from '../UserInfoMain/UserInfoMain'
import AllPublicaciones from '../AllPublicaciones/AllPublicaciones'
import NewPublicacion from '../NewPublicacion/NewPublicacion'

export default function MainGrid() {
    return (
        <div className='MainGrid'>
            {/* <div className='columnGridlef'>
                <UserInfoMain />
                <EnlacesMain />
            </div> */}

            <div className='feed'>
                <NewPublicacion />

                <AllPublicaciones />
            </div>

            {/* <div className='columnGridRitgh'>
                <AllUsuarios />
            </div> */}
        </div>
    )
}
