import React from 'react'
import { Title } from './Title'
export const Container = (props: { children: any }) => {
    return (
        <div className="account-pages my-2 pt-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card overflow-hidden">
                            <div className="card-body pt-0">
                                <Title />
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
