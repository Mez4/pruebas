import React from 'react'

type CabeceraType = {
    path: string,
    title: string,
    subtitle: string,
    children?: any
}
export const Cabecera = (props: CabeceraType) => {

    // Renderizar el componente
    return (
        <div className="row">
            <div className="col-sm-6">
                <div className="page-title-box">
                    <h4>{props.title}</h4>
                    <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item"><button className="asstext">Lexa</button></li>
                        <li className="breadcrumb-item"><button className="asstext">Paginas</button></li>
                        <li className="breadcrumb-item active">{props.subtitle}</li>
                    </ol>
                </div>
            </div>
            <div className="col-sm-6">
                {props.children}
            </div>
        </div>
    )
}
