import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, ActionMultipleSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    ProductoID?: number,
    SucursalId?: number,
    initialValues: {
        ProductoID: number,
        SucursalId: number,
        ComisionesID: number,
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    fnGetComisiones(id: any): any,
    optProductos: { value: number, label: string }[],
    optComisiones: { value: number, label: string }[],
    optSucursales: { value: number, label: string }[],
    isUpdate: boolean
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)


    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ProductoID: Yup.number().required("Seleccione el producto").moreThan(0, 'Seleccione el producto'),
                ComisionesID: Yup.number().required("Seleccione la comisión").moreThan(0, 'Seleccione la comisión'),
                SucursalId: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal')
                })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.ProductoID === undefined || props.SucursalId === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó la relación de la sucursal con la comisión")
                        })
                        .catch((error: any) => {
                            if (error.response)
                            toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                        setLoading(false)

                        })
                else
                    Funciones.FNUpdate(props.oidc, {
                        ...values,
                        ProductoID: props.ProductoID,
                        SucursalId: props.SucursalId,
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la relación de la sucursal con la comisión")
                        })
                        .catch((error: any) => {
                            if (error.response)
                            toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                        setLoading(false)
                        })

            }}>
            <Form>
                <ActionSelect
                    disabled={props.isUpdate || loading}
                    label="Producto"
                    name="ProductoID"
                    placeholder="Seleccione el Producto"
                    options={props.optProductos}
                    addDefault={true}
                    valor={props.ProductoID}
                    accion={props.fnGetComisiones}
                />
                <CustomSelect
                    disabled={props.isUpdate || loading}
                    label="Sucursal"
                    name="SucursalId"
                    placeholder="Seleccione la Sucursal"
                    options={props.optSucursales}
                    addDefault={true}
                />
                <CustomSelect
                    disabled={loading}
                    label="Comisión"
                    name="ComisionesID"
                    placeholder="Seleccione la Comisión"
                    options={props.optComisiones}
                    addDefault={true}
                />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Aceptar
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
