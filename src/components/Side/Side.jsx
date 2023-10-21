import React, { Fragment } from 'react'
import './side.css'
import { Link } from 'react-router-dom'
const Side = () => {
    return (
        <Fragment>
            <div id="mySidenav" className="sidenav">
                <Link to="/create" id="blog">Create  Esign</Link>`
                <Link to="/view" id="contact">View Esign</Link>
            </div>

        </Fragment>
    )
}

export default Side