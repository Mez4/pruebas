import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FormateoDinero } from '../../../../../../global/variables'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type CFormType = {
    oidc: IOidc
    Id?: number,
    MontoSolicitado?: number,
    Observaciones?: string,
    Solicitante?: string,
    Revisado: boolean,
    datosRubros: any[],
    EstatusDescripcion?: string,
    EstatusClave?: string,
    SolicitudDetalleID: number,
    initialValues2: {
        MontoFilaModificada: number,
        SolicitudDetalleID: number,
        MontoAutorizar: number,
    }
    initialValues3: { Total: number },
    initialValues: {
        Observaciones: string,
        SolicitudGastoID: number,
        FechaSolicitud: string,
        Autorizada: boolean,
        CajaID: number,
        NombreCaja: string,
        NombreSucursal: string,
        CuentaBancoID: number,
        NumeroCuenta: string,
        MontoSolicitado: number,
        MontoAutorizado: number,
        Solicitante: string,
        ObservacionesTesoreria: string,
        DetalleSaldos: any[]
    },
    fnCancelar(): any,
    fnCancelarTotal(): any
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    OptionsSucursales: { value: number, label: string }[],
    OptionsRubros: { value: number, label: string }[]


}

export const CFormSucursal = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    const [state, setState] = React.useState({
        Sucursal: false,
        Rubro: false,
        Monto: false
    })

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                SucursalID: Yup.number().required("Campo obligatorio"),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                console.log("VALORES0", values)
                let a = {
                    SolicitudGastoID: values.SolicitudGastoID,
                    SucursalID: values.SucursalID
                }
                Funciones.FNUpdateSucursal(props.oidc, a)
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbActualizar(respuesta)
                        const MySwal = withReactContent(Swal)
                        MySwal.fire({
                            title: 'Total actualizado',
                            html: <div className="text-center">
                                <p>La solicitud se modifico correctamente</p>


                            </div>,
                            // text: `El pago intencion debe ser mayor al 5% del saldo actual`,
                            icon: 'success',
                            showCloseButton: false,
                            showCancelButton: true,
                            showConfirmButton: false,
                            focusConfirm: false,
                            // confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#3085d6',
                            cancelButtonText: 'Cerrar',
                            confirmButtonAriaLabel: '',
                            cancelButtonAriaLabel: ''
                        })
                        props.fnCancelarTotal()
                    })
                    .catch((e) => {
                        toast.error("Ocurrió un problema al modificar la solicitud.")
                        setLoading(false)
                    })

            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">

                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">

                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <span><strong>SOLICITUD Nº </strong> <span >{props.initialValues.SolicitudGastoID}</span></span>
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>SUCURSAL ACTUAL:</strong> <span >{props.initialValues.NombreSucursal}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">

                    </div>
                    <div>

                    </div>
                    <div>
                        <div className="column text-center mb-5">
                            <CustomSelect
                                disabled={false}
                                label="SUCURSAL A LA QUE SE GENERA EL GASTO"
                                name="SucursalID"
                                placeholder="Seleccione una sucursal"
                                options={props.OptionsSucursales}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>

                    </div>

                </div>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelarTotal}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}