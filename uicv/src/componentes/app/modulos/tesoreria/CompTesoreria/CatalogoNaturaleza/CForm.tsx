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
        NaturalezaID: number,
        Descripcion: string,
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
                Descripcion: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
            })}
            onSubmit={(values: any) => {

                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {

                    let agregarNaturaleza: any = {
                        // clave: values.clave,
                        Descripcion: values.Descripcion,
                    }
                    values = agregarNaturaleza

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            alert("Error al guardar la naturaleza" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {

                    let actualizarNaturaleza: any = {
                        Descripcion: values.Descripcion,
                    }
                    values = actualizarNaturaleza

                    Funciones.FNUpdate(props.Seguridad, { ...values, NaturalezaID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            setLoading(false)
                            toast.error('Error al editar la naturaleza.')
                        })
                }
            }}
        >
            <Form>

                <div>
                    {/* <CustomFieldText
                        disabled={true}// props.Id=== undefined? false : true
                        label="Clave:"
                        name="clave"
                        placeholder="Agregar Clave"
                    /> */}
                    <CustomFieldText
                        disabled={false}// props.Id=== undefined? false : true
                        label="Descripcion:"
                        name="Descripcion"
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