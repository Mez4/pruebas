import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    optProductos: { value: number, label: string }[],
    optTipos: { value: number, label: string }[],
    initialValues: { serie: string, serieDesc: string, ProductoID: number, activo: boolean, ValeraSeriesTiposID: number },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}

export const CForm = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                serie: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteres").max(3, "Maximo 3 caracteres"),
                serieDesc: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(20, "Maximo 20 caracteres"),
                ProductoID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el producto'),
                ValeraSeriesTiposID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el tipo'),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Serie agregado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al agregar serie")
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, serieId: props.Id  })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Serie actualizada correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar serie")
                            setLoading(false)
                        })

            }}>
            <Form>

                <CustomFieldText disabled={loading} label="serie" name="serie" placeholder="serie"/>
                <CustomFieldText disabled={loading} label="serieDesc" name="serieDesc" placeholder="serieDesc" />
                <ActionSelect
                    disabled={false}
                    label="Producto"
                    name="ProductoID"
                    placeholder="Seleccione el producto"
                    options={props.optProductos}
                    addDefault={false}
                    valor={props.initialValues.ProductoID}
                    
                />
                <ActionSelect
                    disabled={false}
                    label="Tipo"
                    name="ValeraSeriesTiposID"
                    placeholder="Seleccione el tipo"
                    options={props.optTipos}
                    addDefault={false}
                    valor={props.initialValues.ValeraSeriesTiposID}
                    
                />
                <CustomFieldCheckbox disabled={loading} label="activo" name="activo" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                    </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}