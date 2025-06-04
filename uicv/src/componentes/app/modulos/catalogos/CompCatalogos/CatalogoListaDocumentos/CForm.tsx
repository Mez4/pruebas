import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        tipoDocumentoID: number,
        nombreDocumento: string,
        clave: string,
        descripcion: string,
        activo: boolean
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
                nombreDocumento: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                descripcion: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(200, "Maximo 200 caracteres"),
                //acumulaCuentaId: Yup.number().required("Seleccione la cuenta acumula").moreThan(0, 'Seleccione la cuenta acumula'),


            })}
            onSubmit={(values: any) => {

                setLoading(true)


                // Finish the callback
                if (props.Id === undefined) {

                    let agregarDocumento: any = {
                        nombreDocumento: values.nombreDocumento,
                        clave: values.clave,
                        descripcion: values.descripcion,
                        activo: values.activo,
                    }
                    values = agregarDocumento






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



                    let actualizarDocumento: any = {
                        tipoDocumentoID: values.tipoDocumentoID,
                        nombreDocumento: values.nombreDocumento,
                        clave: values.clave,
                        descripcion: values.descripcion,
                        activo: values.activo,


                    }
                    values = actualizarDocumento


                    Funciones.FNUpdate(props.Seguridad, { ...values, tipoDocumentoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            setLoading(false)
                            toast.error('Error al desactivar el documento')
                            // alert("Error al actualizar la cuenta" + JSON.stringify(error))

                        })
                }
            }}
        >
            <Form>

                <div>

                    <CustomFieldText
                        disabled={false}// props.Id=== undefined? false : true
                        label="Nombre del Documento:"
                        name="nombreDocumento"
                        placeholder="Agregar nombre del documento"
                    />

                    <CustomFieldText
                        disabled={false}// props.Id=== undefined? false : true
                        label="Descripción:"
                        name="descripcion"
                        placeholder="Agregar Descripción"
                    />

                    <CustomFieldCheckbox disabled={false} label="Activo" name="activo" />

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