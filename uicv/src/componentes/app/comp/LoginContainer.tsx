import React from 'react'
import { LoginTitle } from './LoginTitle'
export const LoginContainer = (props: { children: any }) => {
    return (
        <div className="account-pages mt-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4 col-xl-4">
                        <div className="card overflow-hidden">
                            <div className="card-body pt-0">
                                <LoginTitle />
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
