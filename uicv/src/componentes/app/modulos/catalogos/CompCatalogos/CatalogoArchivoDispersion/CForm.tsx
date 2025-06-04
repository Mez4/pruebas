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
        archivoDispersionID: number,
        clave: string,
        descripcion: string
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
                clave: Yup.string().required("Campo obligatorio").min(3, "Debe contener 3 caracteres").max(4, "Debe contener menos de 5 caracteres"),
                descripcion: Yup.string().required("Campo obligatorio").min(3, "Debe contener 3 caracteres").max(50, "Debe contener menos de 60 caracteres"),
            })}
            onSubmit={(values: any) => {

                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {

                    let agregarArchivo: any = {
                        Clave: values.clave,
                        Descripcion: values.descripcion,
                    }
                    values = agregarArchivo

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            toast.error("La clave no se puede guardar porque ya existe.")
                            setLoading(false)
                        })
                }
                else {

                    let actualizarArchivo: any = {
                        archivoDispersionID: values.archivoDispersionID,
                        Clave: values.clave,
                        Descripcion: values.descripcion
                    }
                    values = actualizarArchivo

                    Funciones.FNUpdate(props.Seguridad, { ...values, archivoDispersionID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            setLoading(false)
                            //toast.error('Error al desactivar el banco, tiene cuentas activas')
                            alert("Error al actualizar la cuenta" + JSON.stringify(error))
                        })
                }
            }}
        >
            <Form>
                <div>
                    <CustomFieldText
                        disabled={false}
                        label="Clave:"
                        name="clave"
                        placeholder="Agregar Clave"
                    />
                    <CustomFieldText
                        disabled={false}
                        label="Descripcion:"
                        name="descripcion"
                        placeholder="Agregar Descripcion"
                    />
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