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
    optTiposDoc: { value: number, label: string }[],
    optTiposDoc2: { value: number, label: string }[],
    initialValues: { MesaCreditoID: number, PersonaID: number, Activo: boolean },
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
                MesaCreditoID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
                PersonaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
                //Order: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el tipo'),
            })}
            onSubmit={(values: any, {resetForm}) => {
                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                console.log(props.oidc)
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            console.log('RESPUESTA', respuesta)
                            props.cbGuardar(respuesta)
                            toast.success("Analista agregado correctamente")
                            resetForm()
                        })
                        .catch((error: any) => {
                            if (error.request.response == "") {
                                if (error.response)
                                    toast.error(`Response Error:${error.respose.data}`)
                                    
                                else if (error.request)
                                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                                else
                                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                            }
                            else {
                                toast.error(error.response.data)
                            }
                            setLoading(false)
                        })
                        // .catch((error: any) => {
                        //     toast.error("Error al agregar Producto")
                        //     setLoading(false)
                        // })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, ProductoMesaCreditoID: props.Id })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Analista actualizado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar Producto")
                            setLoading(false)
                        })

            }}>
            <Form>
            <ActionSelect
                    disabled={false}
                    label="Analista"
                    name="PersonaID"
                    placeholder="Seleccione el tipo"
                    options={props.optTiposDoc2}
                    addDefault={false}
                    valor={props.initialValues.PersonaID}

                />
                <ActionSelect
                    disabled={false}
                    label="Mesa De Crédito"
                    name="MesaCreditoID"
                    placeholder="Seleccione el tipo"
                    options={props.optTiposDoc}
                    addDefault={false}
                    valor={props.initialValues.MesaCreditoID = 1}

                />
           
                <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
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