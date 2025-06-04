import React, { useState, useRef } from "react";
import { Formik, Form } from 'formik'
import { Spinner, CustomFieldImgUpload, CustomFieldPdfUpload, ModalWin, ImgViewer } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import SignaturePad from 'react-signature-canvas'
import '../../../../../../sigCanvas.css'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type CFormType = {
    oidc: IOidc
    Id?: number,
    RecepcionID: number,
    FirmaDocID: number,
    initialValues: {
        file: string
    },
    fnCancelarCargaFirma(): any
    FNGetLocal(): any
}

export const CFormAgregarFirma = (props: CFormType) => {

    console.log("RecepcionID " + props.RecepcionID)
    console.log("FrimaDocID" + props.FirmaDocID)

    const MySwal = withReactContent(Swal)
    const [imageURL, setImageURL] = useState(null);
    const sigCanvas = React.useRef<any>();
    const [loading, setLoading] = React.useState(false)
    let isMounted = React.useRef(true)

    const DocumentoID: number = props.FirmaDocID
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: ''
        }
    })

    return (

        <Formik
            initialValues={props.initialValues}
            enableReinitialize

            onSubmit={(values: any) => {

                if (sigCanvas.current.isEmpty()) {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Es necesario que introduzcas tu firma para continuar</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Aceptar`,
                            confirmButtonColor: '#3085d6',
                        }
                    );
                }
                else {

                    sigCanvas.current.off();
                    setLoading(true)

                    const urltoFile = (url: any, filename: any, mimeType: any) => {
                        return (fetch(url)
                            .then(function (res) { return res.arrayBuffer(); })
                            .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
                        );
                    }
                    urltoFile(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"), 'image.png', 'image/png')
                        .then(function (file) {
                            const formData = new FormData()
                            formData.append('RecepcionID', props.RecepcionID.toString())
                            formData.append('DocumentoID', props.FirmaDocID.toString())
                            formData.append('NombreDocumento', file.name)
                            formData.append('doc', file)

                            Funciones.FNSubirFirma(props.oidc, formData)//(props.oidc, props.FirmaDocID, props.SolicitudUniformeID, imageURL! as string)//(props.oidc, formData)
                                .then((respuesta: any) => {
                                    toast.success("La firma se agrego correctamente");
                                    setLoading(false)
                                    props.FNGetLocal()
                                    props.fnCancelarCargaFirma()
                                    props.FNGetLocal()
                                })
                                .catch((error: any) => {
                                    toast.error("Error al agregar la firma")
                                    setLoading(false)
                                    props.fnCancelarCargaFirma()
                                })
                        });
                }
            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-full-desktop is-full-mobile">
                        <SignaturePad penColor="blue" ref={sigCanvas} canvasProps={{ className: "signatureCanvas" }}
                            onEnd={() => { setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")) }} />
                    </div>
                </div>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => { sigCanvas.current.clear() }}>
                            Limpiar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}


