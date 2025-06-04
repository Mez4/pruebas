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
        msjMotivoID: number,
        mensaje:     string,
        clave:       string,
        msjError:    boolean
        activo:      boolean
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
                 mensaje: Yup.string().required("Campo obligatorio").min(4, "Debe contener 4 caracteres").max(60, "Debe contener menos de 60 caracteres"),
            })}
            onSubmit={(values: any) => {

                setLoading(true)

                // Finish the callback
                if (props.Id === undefined) {

                    let agregarMnesaje: any = {
                        mensaje:    values.mensaje,
                        msjError:   values.msjError,
                        activo:     values.activo,
                    }
                    values = agregarMnesaje

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            toast.error("La clave no se puede guardar porque ya existe o no son 4 caracteres")
                            setLoading(false)
                        })
                }
                else {

                    let actualizarMensaje: any = {
                        msjMotivoID: values.msjMotivoID,
                        mensaje:     values.mensaje,
                        clave:       values.clave,
                        msjError:    values.msjError,
                        activo:      values.activo
                    }
                    values = actualizarMensaje

                    Funciones.FNUpdate(props.Seguridad, { ...values, msjMotivoID: props.Id as number })
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
                            label="Mensaje:"
                            name="mensaje"
                            placeholder="Agregar Mensaje"
                        />
                      {/**   <CustomFieldText

                            disabled={props.Id=== undefined? false : true}
                            label="Clave:"
                            name="clave"
                            placeholder="Agregar Clave"
                        />*/}
                        <CustomFieldCheckbox disabled={props.Id=== undefined? false : true} label="Es mensaje de error" name="msjError" />

                        <CustomFieldCheckbox disabled={loading} label="Estatus" name="activo" />

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