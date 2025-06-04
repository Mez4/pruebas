import React, { Component } from 'react'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, CustomFieldPdfUpload, ImgViewer, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'

type CatalogosType = {
    oidc: IOidc,
    FirmaDocID: number,
    SurtidoID: number,
    fnCancelarVerFirma(): any
}

export const CFormVerFirma = (props: CatalogosType) => {

    let isMounted = React.useRef(true)

    const FormDoc: number = props.FirmaDocID

    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: ''
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FnGetFirma(props.oidc, props.FirmaDocID, props.SurtidoID)
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
                props.fnCancelarVerFirma()
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