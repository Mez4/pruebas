import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, ActionMultipleSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    ProductoID: number,
    ComisionesID: number,
    SucursalId?: number,
    initialValues: {
        SucursalesIds: []
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any, values: any): any,
    fnCancelar(): any,
    FnGetSucursales?(id: any): any,
    // optProductos: { value: number, label: string }[],
    // optCondiciones: { value: number, label: string }[],
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
                // ProductoID: Yup.number().required("Seleccione el producto").moreThan(0, 'Seleccione el producto'),
                // CondicionesID: Yup.number().required("Seleccione la condición").moreThan(0, 'Seleccione la condición'),
                // SucursalId: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal')
                SucursalesIds: Yup.array()
                    .min(1, 'Seleccione al menos una Sucursal')
                // .of(
                //     Yup.object().shape({                            
                //     value: Yup.number().required(),
                //     label: Yup.string().required(),
                //     })
                // ),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                // if (props.ProductoID === undefined || props.SucursalId === undefined )
                Funciones.FNAdd(props.oidc, {
                    ...values,
                    ProductoID: props.ProductoID,
                    ComisionesID: props.ComisionesID
                })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbGuardar(respuesta, values.SucursalesIds)
                        toast.success("Se guardó la relación de la sucursal con la comisión")
                    })
                    .catch((error: any) => {
                        console.log(JSON.stringify(error))
                        setLoading(false)
                        toast.error("Error al guardar la relación de la sucursal con la comisión")
                    })
                // else
                //     Funciones.FNUpdate(props.oidc, { 
                //         ...values, 
                //         ProductoID: props.ProductoID as number,
                //         SucursalId: props.SucursalId as number,
                //     })
                //         .then((respuesta: any) => {
                //             setLoading(false)
                //             props.cbActualizar(respuesta)
                //             toast.success("Se actualizó la relación de la sucursal con la condición")
                //         })
                //         .catch((error: any) => {
                //             console.log(JSON.stringify(error))
                //             setLoading(false)
                //             toast.error("Error al actualizar la relación de la sucursal con la condición")
                //         })

            }}>
            <Form>
                {/* <ActionSelect
                    disabled={props.isUpdate || loading}
                    label="Producto"
                    name="ProductoID"
                    placeholder="Seleccione el Producto"
                    options={props.optProductos}
                    addDefault={false}
                    isMulti={false}
                    valor={props.ProductoID}
                    accion={props.fnGetCondiciones}
                /> */}
                <ActionMultipleSelect
                    disabled={props.isUpdate || loading}
                    label="Sucursales"
                    name="SucursalesIds"
                    placeholder="Seleccione las Sucursales"
                    options={props.optSucursales}
                    addDefault={false}
                    valor={props.initialValues.SucursalesIds}
                />
                {/* <CustomSelect
                    disabled={loading}
                    label="Condición"
                    name="CondicionesID"
                    placeholder="Seleccione la Condición"
                    options={props.optCondiciones}
                    addDefault={false}
                    isMulti={false}
                /> */}
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
