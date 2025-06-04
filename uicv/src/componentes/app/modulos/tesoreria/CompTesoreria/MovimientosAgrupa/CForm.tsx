import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        movAgrupaId: number,
        clave: string,
        nombre: string,
        estatus: boolean
    },

    cbActualizar(item: any): any,
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
                nombre: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                clave: Yup.string().required("Campo obligatorio").max(4, "Maximo 4 caracteres"),
            })}
            onSubmit={(values: any) => {

                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {

                    let agregarMovimiento: any = {
                        clave: values.clave,
                        nombre: values.nombre,
                        estatus: values.estatus,
                    }
                    values = agregarMovimiento

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            alert("Error al guardar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {

                    let actualizarMovimiento: any = {
                        movAgrupaId: values.movAgrupaId,
                        clave: values.clave,
                        nombre: values.nombre,
                        estatus: values.estatus,
                    }
                    values = actualizarMovimiento

                    Funciones.FNUpdate(props.Seguridad, { ...values, movAgrupaId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            setLoading(false)
                            toast.error('Error al desactivar el movimiento')
                            // alert("Error al actualizar la cuenta" + JSON.stringify(error))

                        })
                }
            }}
        >
            <Form>
                <div>
                    <CustomFieldText
                        disabled={props.Id === undefined ? false : true}// props.Id=== undefined? false : true
                        label="Clave:"
                        name="clave"
                        placeholder="Agregar Clave"
                    />
                    <CustomFieldText
                        disabled={false}// props.Id=== undefined? false : true
                        label="Nombre:"
                        name="nombre"
                        placeholder="Agregar Nombre"
                    />
                    <CustomFieldCheckbox disabled={loading} label="Estatus" name="estatus" />

                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </div>


            </Form>

        </Formik>
    )
}