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
        tipoBancoID: number,
        descripcion: string,
        clave: string
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
                descripcion: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),

            })}
            onSubmit={(values: any) => {

                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {
                    let agregarTipoBanco: any = {
                        descripcion: values.descripcion,
                    }
                    values = agregarTipoBanco

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


                    let actualizarTipoBanco: any = {
                        tipoBancoID: values.tipoBancoID,
                        descripcion: values.descripcion,

                    }
                    values = actualizarTipoBanco

                    Funciones.FNUpdate(props.Seguridad, { ...values, tipoBancoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            setLoading(false)
                            toast.error('Error al actualizar el tipo de banco')
                        })
                }
            }}
        >
            <Form>
                <div>
                    <CustomFieldText
                        disabled={false}// props.Id=== undefined? false : true
                        label="Descripcion:"
                        name="descripcion"
                        placeholder="Agregar Descripcion"
                    />


                    {/* <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" />

                    <CustomSelect
                        disabled={false} //props.Id === undefined ? false : true
                        label="Tipo de Archivo de Dispersión:"
                        name="archivoDispersionID"
                        placeholder="Seleccione..."
                        options={props.OptionsArchivosDispersion}
                        addDefault={false}
                        isMulti={false}
                    />
                    <CustomFieldCheckbox disabled={loading} label="Es Banco" name="esBanco" /> */}

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