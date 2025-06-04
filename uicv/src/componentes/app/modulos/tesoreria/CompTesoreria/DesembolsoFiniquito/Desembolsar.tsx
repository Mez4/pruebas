import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'
import { Cajas } from '../../../../../selectores'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FaCheckSquare, FaRegSquare, FaTrash } from 'react-icons/fa'
import * as FnTiposDesmbolso from '../BancoTipoDesembolso/Funciones'
import * as Funciones from './Funciones'
import { Cuentas } from '../../../../../selectores'

type DesembolsarType = {
    isMounted: boolean,
    cbActualizaDatos(item: any): any
    cerrarSwal(): any,
    Seguridad: IOidc,
    initialValues: {
        ProductoId: number,
        SucursalID: number,
        SolicitudID: number,
        TipoDesembolsoID: number,
        CajaID: number
    }
}

export const Desembolsar = (props: DesembolsarType) => {

    const optTiposDesembolso: any[] = []
    const TiposDesembolso: any[] = []
    const [loading, setLoading] = React.useState(false)
    const [state, setState] = React.useState({
        optTiposDesembolso,
        TiposDesembolso
    })

    const fnGetTiposDesembolso = () => {
        FnTiposDesmbolso.FNGetSucursalProducto(props.Seguridad, props.initialValues.SucursalID, props.initialValues.ProductoId)
            .then((respuesta: any) => {

                var tiposDesembolso = respuesta.map((valor: any) => {
                    var obj = { value: valor.TipoDesembolsoID, label: valor.TipoDesembolso };
                    return obj
                });

                setState(s => ({ ...s, optTiposDesembolso: tiposDesembolso, TiposDesembolso: respuesta }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTiposDesembolso: [], TiposDesembolso: [] }))
            })
    }

    useEffect(() => {

        if (props.isMounted === true) {
            fnGetTiposDesembolso()
        }

    }, [props.initialValues.ProductoId, props.initialValues.SucursalID])


    return (
        <Formik
            enableReinitialize
            initialValues={props.initialValues}
            validationSchema={Yup.object().shape({
                CajaID: Yup.number().required("Seleccione la caja").moreThan(0, 'Seleccione la caja'),
                TipoDesembolsoID: Yup.number().required("Seleccione el tipo de desembolso").moreThan(0, 'Seleccione el tipo de desembolso')
            })}
            onSubmit={(values: any, { resetForm }) => {
                if (props.isMounted == true) {
                    setLoading(true)

                    Funciones.FNDesembolsar(props.Seguridad, values)
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
                            toast.error("Error al desembolsar el finiquito, vuelva a intentarlo.")
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
                                <Cajas
                                    name="CajaID"
                                    disabled={loading}
                                    ProductoID={0}
                                    SucursalId={0}
                                    oidc={props.Seguridad}
                                />
                            </div>
                        </div>
                        <div className="column is-align-items-center is-half-desktop is-full-tablet is-full-mobile">
                            <div className="mb-4">
                                <ActionSelect
                                    disabled={loading}
                                    label="Tipo de Desembolso"
                                    name="TipoDesembolsoID"
                                    placeholder="Seleccione el tipo de desembolso"
                                    options={state.optTiposDesembolso}
                                    addDefault={false}
                                    valor={props.initialValues.TipoDesembolsoID}
                                // ref={refTipoDesembolso}
                                // accion={cbTipoDesembolso}
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
