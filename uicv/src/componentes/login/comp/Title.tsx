import React from 'react'
import logo from '../../../theme/images/logo4.png'

export const Title = () => {
    return (
        <h3 className="text-center mt-4 mb-3">
            <span className="asstext auth-logo">
                <img src={logo} alt={"Logo de app"} className="auth-logo-dark" style={{ width: "175px" }} />
                <img src={logo} alt={"Logo de app"} className="auth-logo-light" style={{ width: "175px" }} />
            </span>
            <span>SISTEMA CV</span>
        </h3>
    )
}
