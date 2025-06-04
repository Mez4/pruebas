import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, ActionMultipleSelect, ActionSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

type CFormType = {
    oidc: IOidc
    ProteccionCabeceroID?: number,
    Id?: number,
    ProductoID: number,
    initialValues: {
        ProteccionCabeceroID: number,
        SucursalID: number,
        ProductosIDS: any
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    fnGetCondiciones(id: any): any,
    Actualizar(item: any): any,
    optProductos: { value: number, label: string }[],
    optSucursales: { value: number, label: string }[],
    isUpdate: boolean
}

export const CFormSuc = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ProductoID: Yup.number().required("Campo obligatorio"),
                ProductosIDS: Yup.number().required("Campo obligatorio"),

            })}
            onSubmit={(values: any) => {
                console.log("CABECEROID", props.ProductoID)
                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAddProducto(props.oidc, {
                        ...values,
                        ProteccionCabeceroID: props.ProteccionCabeceroID,
                        SucursalID: props.initialValues.SucursalID
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            props.Actualizar(respuesta)
                            toast.success("Se guardó la Sucursal Protección")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar la Sucursal Protección")
                        })
                else
                    Funciones.FNUpdate(props.oidc, {
                        ...values,

                        ProteccionCabeceroID: props.ProteccionCabeceroID,
                        Id: props.Id as number
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la Sucursal Protección")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar la Sucursal Protección")
                        })

            }}>
            <Form>

                <ActionSelect
                    disabled={props.isUpdate || loading}
                    label="Sucursales"
                    name="ProductoID"
                    placeholder="Selecciona Sucursal"
                    options={props.optSucursales}
                    addDefault={true}
                    valor={props.initialValues.SucursalID}
                    accion={props.fnGetCondiciones}
                />
                <ActionMultipleSelect
                    disabled={loading}
                    label="Productos"
                    name="ProductosIDS"
                    placeholder="Seleccionar Productos"
                    options={props.optProductos}
                    addDefault={false}
                    valor={props.initialValues.ProductosIDS}
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
