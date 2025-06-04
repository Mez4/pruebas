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

export const CFormTotal = (props: CFormType) => {

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
            initialValues={props.initialValues2}
            enableReinitialize
            validationSchema={Yup.object().shape({
                MontoAutorizar: Yup.number().required("Campo obligatorio"),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                console.log("VALORES0", values)
                let a = {
                    SolicitudDetalleID: values.SolicitudDetalleID,
                    SolicitudGastoID: values.SolicitudGastoID,
                    Total: values.MontoAutorizar,
                    RubroGastosID: values.RubroGastosID,
                    SucursalID: values.SucursalID
                }
                Funciones.FNUpdate(props.oidc, a)
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
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Solicitud Número:</strong> <span >{props.initialValues2.SolicitudDetalleID}</span></span>
                        </div>
                    </div>

                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Monto solicitado:</strong> <span >{FormateoDinero.format(props.initialValues2.MontoFilaModificada)}</span></span>
                        </div>
                    </div>
                    {/*     <div>
                        <div className="form-check form-switch form-switch-md mb-5" dir="ltr">
                            <label className="form-check-label" >Genera gasto a otra sucursal</label>
                            <input
                                className='form-check-input text-center'
                                type="checkbox"
                                //style={{ marginTop: '0.7em' }}
                                checked={state.Sucursal}
                                onChange={e => (setState({ ...state, Sucursal: e.target.checked }))}
                            />
                        </div>
                        <div className="column text-center mb-5">
                            <CustomSelect
                                disabled={!state.Sucursal}
                                label="Sucursal"
                                name="SucursalID"
                                placeholder="Seleccione una sucursal"
                                options={props.OptionsSucursales}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>

                    </div> */}
                    <div>
                        <div className="form-check form-switch form-switch-md mb-5" dir="ltr">
                            <label className="form-check-label" >Cambiar Rubro</label>
                            <input
                                className='form-check-input text-center'
                                type="checkbox"
                                //style={{ marginTop: '0.7em' }}
                                checked={state.Rubro}
                                onChange={e => (setState({ ...state, Rubro: e.target.checked }))}
                            />
                        </div>
                        <div className="column text-center mb-5">
                            <CustomSelect
                                disabled={!state.Rubro}
                                label="Rubros"
                                name="RubroGastosID"
                                placeholder="Seleccione Rubro"
                                options={props.OptionsRubros}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>

                    </div>
                </div>
                <div className="form-check form-switch form-switch-md mb-5" dir="ltr">
                    <label className="form-check-label" >Modificar Saldo Total</label>
                    <input
                        className='form-check-input text-center'
                        type="checkbox"
                        //style={{ marginTop: '0.7em' }}
                        checked={state.Monto}
                        onChange={e => (setState({ ...state, Monto: e.target.checked }))}
                    />

                </div>
                <CustomFieldText disabled={!state.Monto} label="Monto a Autorizar" name="MontoAutorizar" placeholder="Escriba monto a autorizar" />

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