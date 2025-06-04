import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { Convenios } from '../../../../../selectores'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { valueContainerCSS } from 'react-select/src/components/containers'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        ProductoID: number,
        Descripcion: string,
        Activo: boolean,
        ConvenioID: number
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optProductos: { value: number, label: string }[],
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
                Descripcion: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(250, "Maximo 250 caracteres"),
                ConvenioID: Yup.number().required("Seleccione el convenio").moreThan(0, 'Seleccione el convenio')
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó la comisión")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar la comisión")
                        })
                else
                    Funciones.FNUpdate(props.oidc, {
                        ...values,
                        ComisionesID: props.Id as number
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la comisión")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar la comisión")
                        })

            }}>
            {({ values }) => (
                <Form>
                    <CustomSelect
                        disabled={props.isUpdate || loading}
                        label="Producto"
                        name="ProductoID"
                        placeholder="Seleccione el Producto"
                        options={props.optProductos}
                        addDefault={false}
                    />


                    <CustomFieldText
                        disabled={loading}
                        label="Descripción"
                        name="Descripcion"
                        placeholder="Descripción de la comisión" />


                    <CustomFieldCheckbox
                        disabled={loading}
                        label="Activa"
                        name="Activo" />


                    <Convenios oidc={props.oidc} unaLinea disabled={loading} name={'ConvenioID'} ProductoID={values.ProductoID} />
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
            )}
        </Formik>
    )
}
