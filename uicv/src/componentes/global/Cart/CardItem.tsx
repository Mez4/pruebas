import React, { useMemo } from "react";
import { truncateDecimals } from '../../../global/functions'
import { ImgViewer } from '..'


type Type = {
    qty: number,
    price: number,
    id: number,
    sku: number,
    codigo: string,
    desc: string,
    stock: number,
    imagen: string
}

export default function CardItem({ qty, price, id, codigo, desc, stock, imagen }: Type) {

    const Imagen = useMemo(() => { return <ImgViewer imgSrc={imagen} noToolbar={true} zIndex={1500} maxWidth={350} maxHeight={500} /> }, [imagen])

    return (
        <div className="slide-holder">
            {/* <div className="columns is-desktop"> */}
            <div className="column">
                {Imagen}
            </div>
            <div className="text-container">
                <p className="title is-5">{desc}</p>
                <label className="form-label mb-0">{`Precio: $${price}`}</label><br />
                <label className="form-label mb-0">{`Cantidad: ${qty}`}</label><br />
                <label className="form-label mb-0">{`Importe: $${truncateDecimals((price * qty), 2)}`}</label><br />
                <label className="form-label mb-0">{`SKU: ${id}`}</label><br />
                <label className="form-label mb-0">{`Código Barras: ${codigo}`}</label>
            </div>
            {/* </div> */}
        </div>

        // <div className="box control mx-1">
        //     {/* <div className="card"> */}
        //     <div className="card-image">
        //         <figure className="image is-4by3">
        //             {/* <img src={imagen} style={{ maxWidth: 400, maxHeight: 500 }} alt="" /> */}
        //             {Imagen}
        //             {/* <ImgViewer imgSrc={imagen} noToolbar={true} zIndex={300} maxWidth={400} maxHeight={500} /> */}
        //         </figure>
        //     </div>
        //     <div className="card-content">
        //         <div className="media">
        //             {/* <div className="media-left">
        //                 <figure className="image is-48x48">
        //                     <img src={imagen} alt=""/>
        //                 </figure>
        //             </div> */}
        //             <div className="media-content">
        //                 <p className="title is-5">{desc}</p>
        //                 {/* <p className="subtitle is-6">{`Precio: $${price}`}</p> */}
        //                 <label className="form-label mb-0">{`Precio: $${price}`}</label><br />
        //                 {/* <label className="form-label mb-0">{`Existencia: ${stock}`}</label>              */}
        //                 <label className="form-label mb-0">{`Cantidad: ${qty}`}</label><br />
        //                 <label className="form-label mb-0">{`Importe: $${truncateDecimals((price * qty), 2)}`}</label>
        //             </div>
        //         </div>
        //         {/* <div className="content">
        //         </div> */}
        //     </div>
        // </div>
    );
}
