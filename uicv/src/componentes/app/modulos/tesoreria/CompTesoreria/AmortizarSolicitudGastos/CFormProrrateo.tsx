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
    fnCerrar(): any,
    SolicitudGastoID: number,
    // datosRubros: any[],
    EstatusDescripcion?: string,
    EstatusClave?: string,
    // SolicitudDetalleID: number,
    // initialValues2: {
    //     MontoFilaModificada: number,
    //     SolicitudDetalleID: number,
    //     MontoAutorizar: number,

    // }
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
    // fnCancelar(): any,
    // fnCancelarTotal(): any
    // cbActualizar(item: any): any,
    // cbGuardar(item: any): any
    // OptionsSucursales: { value: number, label: string }[],
    // OptionsRubros: { value: number, label: string }[]


}

export const CFormProrrateo = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // const [state, setState] = React.useState({
    //     Sucursal: false,
    //     Rubro: false,
    //     Monto: false
    // })

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Meses: Yup.number().required("Campo obligatorio"),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                console.log("VALORES0", values)
                console.log("Props", props)
                let a = {
                    SolicitudGastoID: props.Id,
                    Meses: values.Meses,
                }
                Funciones.FNProrratear(props.oidc, a)
                    .then((respuesta: any) => {

                        if (a.Meses == 0) {
                            toast.warning("Atención: Debe Ingresar A Cuántos Meses Se Pagará")
                            setLoading(false)
                        }
                        else {
                            setLoading(false)
                            props.fnCerrar()
                            toast.success("La solicitud se modificó correctamente")

                        }
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
                            <CustomFieldText disabled={false} label='¿A Cuántos Meses?' name='Meses'></CustomFieldText>
                        </div>
                    </div>
                </div>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCerrar}>
                            Cancelar
                        </button> */}
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
                    </div>
                }
            </Form>
        </Formik >
    )
}