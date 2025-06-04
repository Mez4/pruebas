// import React, { Component } from 'react'
// import { IEstado } from '../../../../../../interfaces/redux/IEstado'
// import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
// import { Card, CustomFieldPdfUpload, ImgViewer, Spinner } from '../../../../../global'
// import * as Funciones from './Funciones'
// import { Form, Formik } from 'formik'
// import { toast } from 'react-toastify'
// type CatalogosType = {
//     oidc: IOidc,
//     DocumentoID: number,
//     AclaracionID: number,
//     file: string,
//     fnCancelarVerEvidencia(): any
// }
// export const CFormVerEvidencia = (props: CatalogosType) => {
//     let isMounted = React.useRef(true)
//     const DocumentoID: number = props.DocumentoID
//     const [state, setState] = React.useState({
//         Cargando: true,
//         Error: false,
//         Form: {
//             src: ''
//         }
//     })
//     const FNGetLocal = () => {
//         setState(s => ({ ...s, Cargando: true }))
//         Funciones.FnGetEvidencia(props.oidc, props.AclaracionID)
//             .then((respuesta: any) => {
//                 if (isMounted.current == true) {
//                     setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src } }))
//                 }
//             })
//             .catch((error) => {
//                 toast.error("Ocurrio un problema al abrir el archivo...")
//                 if (isMounted.current === true) {
//                     setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
//                 }
//                 props.fnCancelarVerEvidencia()
//             })
//     }
//     // Use effect
//     React.useEffect(() => {
//         FNGetLocal()
//         return () => {
//             isMounted.current = false
//         }
//         // eslint-disable-next-line
//     }, [])
//     if (typeof window.orientation !== "undefined") {
//         document.getElementById('linkDownload')?.click();
//         window.close();
//     }
//     return (
//         <div>
//             {state.Cargando && <Spinner />}
//             {state.Error && <span>Error al cargar los datos...</span>}
//             {!state.Cargando && !state.Error &&
//                 <div>
//                     <object
//                         data={`data:application/pdf;base64,${state.Form.src}`}
//                         width="100%"
//                         height="400px">
//                         <br />
//                         <a href={props.file} id="linkDownload" download="Documento.pdf">
//                             Tu dispositivo no puede visualizar los archivos PDF, da click aquí para descargarlo
//                         </a>
//                     </object>
//                 </div>
//             }
//         </div>
//     )
// }


// import React, { Component } from 'react'
// import { IEstado } from '../../../../../../interfaces/redux/IEstado'
// import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
// import { Card, CustomFieldPdfUpload, ImgViewer, Spinner } from '../../../../../global'
// import * as Funciones from './Funciones'
// import { Form, Formik } from 'formik'
// import { toast } from 'react-toastify'
// type CatalogosType = {
//     oidc: IOidc,
//     DocumentoID: number,
//     AclaracionID: number,
//     fnCancelarVerEvidencia(): any
// }
// export const CFormVerEvidencia = (props: CatalogosType) => {
//     let isMounted = React.useRef(true)
//     const FormDoc: number = props.DocumentoID
//     const [state, setState] = React.useState({
//         Cargando: true,
//         Error: false,
//         Form: {
//             src: ''
//         }
//     })
//     const FNGetLocal = () => {
//         setState(s => ({ ...s, Cargando: true }))
//         Funciones.FnGetEvidencia(props.oidc, props.AclaracionID)
//             .then((respuesta: any) => {
//                 if (isMounted.current == true) {
//                     setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src } }))
//                     console.log("GetEvidencia", respuesta);
//                 }
//             })
//             .catch((error) => {
//                 toast.error("Ocurrio un problema al abrir el archivo...")
//                 if (isMounted.current === true) {
//                     setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
//                 }
//                 props.fnCancelarVerEvidencia()
//             })
//     }
//     // Use effect
//     React.useEffect(() => {
//         FNGetLocal()
//         return () => {
//             isMounted.current = false
//         }
//         // eslint-disable-next-line
//     }, [])
//     return (
//         <div>
//             {state.Cargando && <Spinner />}
//             {state.Error && <span>Error al cargar los datos...</span>}
//             {!state.Cargando && !state.Error &&
//                 <div className="columns is-centered is-mobile is-multiline">
//                     <div className="column text-center is-full-desktop is-full-mobile">
//                         {/*<ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1500} maxWidth={500} maxHeight={300}  />*/}
//                         <img src={state.Form.src}></img>
//                     </div>
//                 </div>
//             }
//         </div>
//     )
// }         

// import React, { Component } from 'react'
// import { IEstado } from '../../../../../../interfaces/redux/IEstado'
// import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
// import { Card, CustomFieldPdfUpload, ImgViewer, Spinner } from '../../../../../global'
// import * as Funciones from './Funciones'
// import { Form, Formik } from 'formik'
// import { toast } from 'react-toastify'
// type CatalogosType = {
//     oidc: IOidc,
//     DocumentoID: number,
//     AclaracionID: number,
//     file: string,
//     fnCancelarVerEvidencia(): any
// }
// export const CFormVerEvidencia = (props: CatalogosType) => {
//     let isMounted = React.useRef(true)
//     const DocumentoID: number = props.DocumentoID
//     const [state, setState] = React.useState({
//         Cargando: true,
//         Error: false,
//         Form: {
//             src: ''
//         }
//     })
//     const FNGetLocal = () => {
//         setState(s => ({ ...s, Cargando: true }))
//         Funciones.FnGetEvidencia(props.oidc, props.AclaracionID)
//             .then((respuesta: any) => {
//                 if (isMounted.current == true) {
//                     setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src } }))
//                 }
//             })
//             .catch((error) => {
//                 toast.error("Ocurrio un problema al abrir el archivo...")
//                 if (isMounted.current === true) {
//                     setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
//                 }
//                 props.fnCancelarVerEvidencia()
//             })
//     }
//     // Use effect
//     React.useEffect(() => {
//         FNGetLocal()
//         return () => {
//             isMounted.current = false
//         }
//         // eslint-disable-next-line
//     }, [])
//     if (typeof window.orientation !== "undefined") {
//         document.getElementById('linkDownload')?.click();
//         window.close();
//     }
//     return (
//         <div>
//             {state.Cargando && <Spinner />}
//             {state.Error && <span>Error al cargar los datos...</span>}
//             {!state.Cargando && !state.Error &&
//                 <div>
//                     <object
//                         data={`data:application/pdf;base64,${state.Form.src}`}
//                         width="100%"
//                         height="400px">
//                         <br />
//                         <a href={props.file} id="linkDownload" download="Documento.pdf">
//                             Tu dispositivo no puede visualizar los archivos PDF, da click aquí para descargarlo
//                         </a>
//                     </object>
//                 </div>
//             }
//         </div>
//     )
// }

import React, { Component } from 'react'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, CustomFieldPdfUpload, ImgViewer, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
type CatalogosType = {
    oidc: IOidc,
    DocumentoID: number,
    AclaracionID: number,
    fnCancelarVerEvidencia(): any
}
export const CFormVerEvidencia = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const FormDoc: number = props.DocumentoID
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: ''
        }
    })
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FnGetEvidencia(props.oidc, props.AclaracionID, 0)
            .then((respuesta: any) => {
                if (isMounted.current == true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src } }))
                }
            })
            .catch((error) => {
                toast.error("Ocurrio un problema al abrir el archivo...")
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
                props.fnCancelarVerEvidencia()
            })
    }
    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            {state.Cargando && <Spinner />}
            {state.Error && <span>Error al cargar los datos...</span>}
            {!state.Cargando && !state.Error &&
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-full-desktop is-full-mobile">
                        {/*<ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1500} maxWidth={500} maxHeight={300}  />*/}
                        <img src={state.Form.src}></img>
                    </div>
                </div>
            }
        </div>
    )
}