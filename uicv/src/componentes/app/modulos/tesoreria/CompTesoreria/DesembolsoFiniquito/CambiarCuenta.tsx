import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FaCheckSquare, FaRegSquare, FaTrash } from 'react-icons/fa'
import { Cuentas } from '../../../../../selectores'
import * as Funciones from './Funciones'

type DesembolsarType = {
    isMounted: boolean,
    cbActualizaDatos(item: any): any
    cerrarSwal(): any,
    Seguridad: IOidc,
    initialValues: {
        ProductoId: number,
        SucursalID: number,
        SolicitudID: number,
        CuentaBancoID: number
    }
}

export const CambiarCuenta = (props: DesembolsarType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            enableReinitialize
            initialValues={props.initialValues}
            validationSchema={Yup.object().shape({
                CuentaBancoID: Yup.number().required("Seleccione la cuenta").moreThan(1, 'Seleccione la cuenta')
            })}
            onSubmit={(values: any, { resetForm }) => {

                console.log('CambiarCuentas: ', values)

                if (props.isMounted == true) {
                    setLoading(true)

                    Funciones.FNCambiarCuenta(props.Seguridad, values)
                        .then((respuesta: any) => {
                            if (respuesta.res == 1) {
                                toast.success(respuesta.msj)
                                props.cbActualizaDatos(respuesta.Data)
                                props.cerrarSwal()
                            }
                            else {
                                toast.warning(respuesta.msj)
                            }
                            setLoading(false)
                        })
                        .catch((error: any) => {
                            toast.error("Error al cambiar la cuenta, vuelva a intentarlo.")
                            console.log('error: ', JSON.stringify(error))
                            setLoading(false)
                        })

                }
            }}
        >
            <Form>
                <div>
                    <div></div>
                    <div className="columns is-centered is-mobile is-multiline">
                        <div className="column is-align-items-center is-half-desktop is-full-tablet is-full-mobile">
                            <div className="mb-4">
                                <Cuentas
                                    ProductoID={0}
                                    SucursalId={0}
                                    name={'CuentaBancoID'}
                                    disabled={loading}
                                    oidc={props.Seguridad}
                                />
                            </div>
                        </div>
                    </div>
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Aceptar
                            </button>
                        </div>
                    }
                </div>
            </Form>
        </Formik >
    )
}
