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
    SurtidoID: number,
    file: string,
    fnCancelarVerDocumento(): any
}

export const CFormVerComprobante = (props: CatalogosType) => {

    let isMounted = React.useRef(true)

    const DocumentoID: number = props.DocumentoID
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: ''
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDocsByDocumentoID(props.oidc, props.DocumentoID, props.SurtidoID)
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
                props.fnCancelarVerDocumento()
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

    if (typeof window.orientation !== "undefined") {
        document.getElementById('linkDownload')?.click();
        window.close();
    }

    return (
        <div>
            {state.Cargando && <Spinner />}
            {state.Error && <span>Error al cargar los datos...</span>}
            {!state.Cargando && !state.Error &&
                <div>
                    <object
                        data={`data:application/pdf;base64,${state.Form.src}`}
                        width="100%"
                        height="400px">
                        <br />
                        <a href={props.file} id="linkDownload" download="Documento.pdf">
                            Tu dispositivo no puede visualizar los archivos PDF, da click aquí para descargarlo
                        </a>
                    </object>
                </div>
            }
        </div>
    )
}