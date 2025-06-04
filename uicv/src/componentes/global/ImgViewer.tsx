import React, { useState, useEffect } from 'react'
import Viewer from 'react-viewer'
import styled from 'styled-components'

type Type = {
    imgSrc: string,
    zIndex: number,
    maxHeight?: number | string,
    maxWidth: number | string,
    // visible: boolean,
    noToolbar: boolean,
    typeByte?: boolean
    // fnCerrar(): any,
}

const Hover = styled.p`
        color: #000;
        :hover {
            color: #ed1212;
            cursor: pointer;
            opacity: .5;
        };`

const ImgViewer = (props: Type) => {

    const [openImg, setOpenImg] = useState(false)

    const [imgSrc, setimgSrc] = useState('')

    const fnCerrar = () => setOpenImg(false)

    const fnOpen = () => setOpenImg(true)

    // const bin2string = (array: []) => {
    //     var result = "";
    //     for(var i = 0; i < array.length; ++i){
    //         result+= (String.fromCharCode(array[i]));
    //     }
    //     return result;
    // }


    

    useEffect(() => {
        if (props.typeByte) {
            // let Imagen_Bin_String = bin2string(props.imgSrc);

            // console.log(Imagen_Bin_String)

            // let Imagen_Base64 = btoa(Imagen_Bin_String);  

            // let Imagen_Base64 = btoa(props.imgSrc);  

            // console.log(Imagen_Base64)

            setimgSrc('data:image/png;base64,' + props.imgSrc)

            // console.log(props.imgSrc)

        } else {
            setimgSrc(props.imgSrc)
        }
    }, [props.imgSrc])

    return (
        <div>
            <Hover>
                <img src={imgSrc} style={{ maxWidth: props.maxWidth, maxHeight: props.maxHeight, }} alt="No Disponible" onClick={fnOpen}
                />
            </Hover>
            <Viewer
                zIndex={props.zIndex}
                visible={openImg}
                onClose={fnCerrar}
                noToolbar={props.noToolbar}
                images={[{ src: imgSrc, alt: '' }]}
            />
        </div>
    )
}

export default ImgViewer