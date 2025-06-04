import React from 'react'

const Indicator: React.FC<{ Title: string, SubTitle: string, bgClassName: string, textClassName: string }> = (props) => {
    return (
        <div className='col-sm-12 col-md-6 col-lg-6 col-xl-4'>
            <div className={`card mini-stat user-select-none ${props.bgClassName}`}>
                <div className="card-body mini-stat-img">
                    <div className="mini-stat-icon">
                        <i className="mdi mdi-cube-outline float-end"></i>
                    </div>
                    <div className={props.textClassName}>
                        <h4 className={`text-uppercase mb-1 text-white ${props.textClassName}`}>{props.Title}</h4>
                        <h2>{props.SubTitle}</h2>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Indicator