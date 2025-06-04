import React from 'react'

import * as Yup from 'yup'
import * as Funciones from './Funciones'

import { Spinner } from '../../../../../global'
import { Formik, Form } from 'formik'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Productos, Sucursales, TiposDesembolsos } from '../../../../../selectores'
import { iUI } from '../../../../../../interfaces/ui/iUI'

type CFormType = {
    oidc: IOidc
    ui: iUI
    initialValues: { ProductoID: number, SucursalId: number, TipoDesembolsoIds: any },
    // cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                SucursalId: Yup.number().required('Seleccione la Sucursal').moreThan(0, 'Seleccione la Sucursal'),
                ProductoID: Yup.number().required('Seleccione el Producto').moreThan(0, 'Seleccione el Producto'),
                TipoDesembolsoIds: Yup.array().min(1, 'Seleccione al menos un tipo de desembolso')
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                Funciones.FNAdd(props.oidc, values)
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbGuardar(respuesta)
                        toast.success("Se guardó la relación de sucursal con tipo desembolso")
                    })
                    .catch((error: any) => {
                        console.log(JSON.stringify(error))
                        setLoading(false)
                        toast.error("Ocurrió un error al guardar")
                    })

            }}>
            {({ values }) => (
                <Form>
                    <Productos oidc={props.oidc} ui={props.ui} unaLinea disabled={loading} name={'ProductoID'} valor={values.ProductoID} />
                    <Sucursales unaLinea disabled={loading} name={'SucursalId'} ProductoID={values.ProductoID} valor={values.SucursalId} />
                    <hr />
                    <TiposDesembolsos oidc={props.oidc} disabled={loading} TipoDesembolsoIds={props.initialValues.TipoDesembolsoIds} name={'TipoDesembolsoIds'} />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </Form>
            )}
        </Formik>
    )
}
