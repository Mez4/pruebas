// import React, { useState, useRef } from "react";
// import { Formik, Form } from 'formik'
// import { Spinner, CustomFieldImgUpload, CustomFieldPdfUpload, ImgViewer } from '../../../../../global'
// import * as Funciones from './Funciones'
// import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
// import { toast } from 'react-toastify'
// import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
// import SignaturePad from 'react-signature-canvas'
// import '../../../../../../sigCanvas.css'
// import withReactContent from 'sweetalert2-react-content'
// import Swal from 'sweetalert2'
// type CFormType = {
//     oidc: IOidc
//     Id?: number,
//     AclaracionID: number,
//     initialValues: {
//         file: string
//     },
//     fnCancelarCargaEvidencia(): any
//     FNGetLocal(): any
// }
// export const CFormAgregarEvidencia = (props: CFormType) => {
//     const MySwal = withReactContent(Swal)
//     const [imageURL, setImageURL] = useState(null);
//     const sigCanvas = React.useRef<any>();
//     const [loading, setLoading] = React.useState(false)
//     let isMounted = React.useRef(true)
//     // const DocumentoID: number = props.FirmaDocID
//     const [state, setState] = React.useState({
//         Cargando: true,
//         Error: false,
//         Form: {
//             src: ''
//         }
//     })
//     return (
//         <Formik
//             initialValues={props.initialValues}
//             enableReinitialize
//             onSubmit={(values: any) => {
//                 if (sigCanvas.current.isEmpty()) {
//                     MySwal.fire(
//                         {
//                             icon: 'info',
//                             html: <div><br />
//                                 <h3 className="text-center">Aviso</h3>
//                                 <div className={`modal-body`}>
//                                     <h5 className="text-center">Es necesario que introduzcas tu evidencia para continuar</h5>
//                                 </div>
//                             </div>,
//                             confirmButtonText: `Aceptar`,
//                             confirmButtonColor: '#3085d6',
//                         }
//                     );
//                 }
//                 else {
//                     sigCanvas.current.off();
//                     setLoading(true)
//                     const urltoFile = (url: any, filename: any, mimeType: any) => {
//                         return (fetch(url)
//                             .then(function (res) { return res.arrayBuffer(); })
//                             .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
//                         );
//                     }
//                     urltoFile(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"), 'image.png', 'image/png')
//                         .then(function (file) {
//                             const formData = new FormData()
//                             formData.append('AclaracionID', props.AclaracionID.toString())
//                             // formData.append('DocumentoID', props.FirmaDocID.toString())
//                             formData.append('NombreDocumento', file.name)
//                             formData.append('doc', file)
//                             Funciones.FNSubirEvidencia(props.oidc, formData)//(props.oidc, props.FirmaDocID, props.SolicitudUniformeID, imageURL! as string)//(props.oidc, formData)
//                                 .then((respuesta: any) => {
//                                     toast.success("La evidencia se agregÓ correctamente");
//                                     setLoading(false)
//                                     props.FNGetLocal()
//                                     props.fnCancelarCargaEvidencia()
//                                     props.FNGetLocal()
//                                 })
//                                 .catch((error: any) => {
//                                     toast.error("Error al agregar la evidencia")
//                                     setLoading(false)
//                                     props.fnCancelarCargaEvidencia()
//                                 })
//                         });
//                 }
//             }}>
//             <Form>
//                 <div className="columns is-centered is-mobile is-multiline">
//                     <div className="column text-center is-full-desktop is-full-mobile">
//                         <SignaturePad penColor="blue" ref={sigCanvas} canvasProps={{ className: "signatureCanvas" }}
//                             onEnd={() => { setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")) }} />
//                     </div>
//                 </div>
//                 {loading && <Spinner />}
//                 {!loading &&
//                     <div className="text-end">
//                         <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => { sigCanvas.current.clear() }}>
//                             Limpiar
//                         </button>
//                         <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
//                     </div>
//                 }
//             </Form>
//         </Formik>
//     )
// }


import React, { useState, useRef } from "react";
import { Formik, Form } from 'formik'
import { Spinner, CustomFieldImgUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import '../../../../../../sigCanvas.css'
type CFormType = {
    oidc: IOidc
    Id?: number,
    DocumentoID: number,
    AclaracionID: number,
    initialValues: {
        file: string
    },
    fnCancelarMostrarCargaEvidencia(): any,
    FNGetLocal(): any
}
export const CFormAgregarEvidencia = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                file: Yup.string().required("")
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                const formData = new FormData()
                formData.append('AclaracionID', props.AclaracionID.toString())
                formData.append('DocumentoID', props.DocumentoID.toString())
                formData.append('NombreDocumento', values.NombreDocumento)
                formData.append('doc', values.file);
                Funciones.FNSubirEvidencia(props.oidc, formData)
                    .then((respuesta: any) => {
                        toast.success("Se agrego correctamente la evidencia");
                        setLoading(false)
                        props.FNGetLocal()
                        props.fnCancelarMostrarCargaEvidencia()
                        props.FNGetLocal()
                    })
                    .catch((error: any) => {
                        toast.error("Error al subir la evidencia")
                        setLoading(false)
                        props.fnCancelarMostrarCargaEvidencia()
                    })
            }}>
            <Form>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <CustomFieldImgUpload
                            disabled={loading}
                            label=""
                            name="file"
                            imageSrc={'data:image/png;base64,' + ''}
                        /></div>
                    <div className="col-md-2"></div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelarMostrarCargaDeDocumento}>
                            Cancelar
                        </button> */}
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Subir</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}