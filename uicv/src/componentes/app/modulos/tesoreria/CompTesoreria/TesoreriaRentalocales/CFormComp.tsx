import React, { useRef, useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Card, Spinner, CustomFieldText, CustomFieldText2, CustomFieldDatePicker, ActionSelect, ActionCreatableSelect, ActionMultipleSelect, ActionFieldText, ActionFieldNumberText, ImgViewer, ActionAsyncSelect, CardItem, CustomFieldPdfUpload, CustomFieldImgUpload } from '../../../../../global'
import { BuscarDatosBancarios, Clientes, Distribuidores, Sucursales, Cuentas } from '../../../../../selectores'
import * as Funciones from './Funciones'
import * as FuncionesD from '../../../distribuidor/CompDistribuidor/Valeras/Funciones'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import CreatableSelect from 'react-select/creatable';
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaWindowClose, FaShoppingCart, FaCloudDownloadAlt, FaAddressCard, FaDownload } from 'react-icons/fa'
// import CreditoArticulos from '../CreditoArticulos'
//import * as FnPersona from '../../../administracion/CompAdministracion/CompPersona/Funciones'
import { PerfilPersona } from '../../../../../presentacion'
// import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FiRefreshCcw } from 'react-icons/fi'
import { DescripcionDistribuidor } from '../../../../../../global/variables'
import moment from 'moment'

type CFormType = {
    oidc: IOidc
    //ProductoID: number,
    InitialValues: {
        SucursalId          :       number,
        NombreSucursal      :       string,
        Monto               :       number,
        FechaInicio         :       string,
        FechaFin            :       string,
        DiasRest            :       number,
        DetSuc              :       string,
        ContratoId          :       number    
},
    optTipos: { value: number, label: string }[],
    documentoLabel: number,
    cbMuestraActual(show: boolean): any
}

export const CFormComp = (props: CFormType) => {

    const [loading, setLoading] = useState(false)

    return (
        <>
            <Formik
                initialValues={props.InitialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    file: Yup.string().required("Campo obligatorio")
                })}
                onReset={(values: any) => {
                    // clearFormByLevel(0)
                }}
                onSubmit={(values: any) => {
                    setLoading(true)
                    const formData = new FormData()
                    formData.append('ContratoID', `${props.InitialValues.ContratoId}`);
                    formData.append('identificador', `${props.documentoLabel}`);
                    formData.append('doc', values.file);
                    Funciones.FNSubirDoc(props.oidc, formData)
                          .then((respuesta: any) => {
                              if (respuesta.regresa === 1) {
                                  setLoading(false)
                                  toast.success(`Documento subido con Éxito. ${respuesta.data.path}`)
                                  props.cbMuestraActual(true)
                              }
                              else {
                                 setLoading(false)
                                  toast.error(respuesta.msj)
                              }
                          })
                          .catch((error: any) => {
                              console.log(JSON.stringify(error))
                              setLoading(false)
                              if (error.response)
                                  toast.error(`Response Error: ${error.response.data}`)
                              else if (error.request)
                                  toast.error(`Request ${error}`)
                              else
                                  toast.error(`${error}`)
                          })
                 }}>
                {({ values }) => (
                    <Form>
                        <div className="row">
                            <div className="col-12">
                                <CustomFieldPdfUpload
                                    disabled={loading}
                                    label="Documento"
                                    name="file"
                                    imageSrc={'data:image/png;base64,' + props.InitialValues.NombreSucursal}
                                />
                            </div>
                        </div>

                        {loading && <Spinner />}
                        {!loading &&
                            <div >
                                <div className="text-end">
                                    <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                        SUBIR DOCUMENTO
                                    </button>
                                </div>
                            </div>
                        }
                    </Form>
                )}
            </Formik>
        </>
    )
}
