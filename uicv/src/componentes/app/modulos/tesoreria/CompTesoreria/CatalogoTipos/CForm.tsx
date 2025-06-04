import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaCheck, FaCircle, FaLock, FaLockOpen, FaMoneyCheckAlt, FaWindowClose } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


type CFormType = {
    oidc: IOidc
    Id: any,

    initialValues: {
        Tipos: string,
    },
    fnCancelar(): any,
    // fnVerDoc(): any
    // fnMostrarCargaDeDocumento(): any
    // activador(value?: number): any
    // desactivador(value?: number): any
    // setDocumentoID(item: any): any,
    // setSolicitudGastoID(item: any): any,
    // setSolicitudDetalleID(item: any): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
}
export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)

    // const deshabilitarBoton = (revisado: boolean) => {
    //     if (props.EstatusClave == "DOCS") {
    //         return true
    //     }

    // }
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                if (props.Id === undefined) {
                    setLoading(true)
                let a = {
                    Tipos : values.Tipos
                }

                Funciones.FNAdd(props.oidc, a)
                .then((respuesta: any) => {
                props.fnCancelar()
                    props.cbGuardar(respuesta)
                    setLoading(false)
                })
                .catch(() => {
                    toast.error("Ocurrió un problema al guardar el elemento.")
                    setLoading(false)
                })
                    //Funcion de agregar elemento
                }
                else {
                    setLoading(true)
                    let a = {
                        TipoID: props.Id,
                        Tipos: values.Tipos,
                    }
                    Funciones.FNUpdate(props.oidc, a)
                    .then((respuesta: any) => {
                    props.fnCancelar()
                        props.cbActualizar(respuesta)
                        setLoading(false)
                    })
                    .catch(() => {
                        toast.error("Ocurrió un problema al replicar cuenta")
                        setLoading(false)
                    })
                }
            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Id:</strong> <span >{props.Id}</span></span>
                        </div>
                        <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                            <CustomFieldText disabled={false} label="Tipos" name="Tipos" placeholder="Tipo" />
                        </div> 
                    </div>
                </div>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {<button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button> }
                        <button disabled={false} type="submit" className="ms-2 btn btn-success waves-effect waves-light" >Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )      
}