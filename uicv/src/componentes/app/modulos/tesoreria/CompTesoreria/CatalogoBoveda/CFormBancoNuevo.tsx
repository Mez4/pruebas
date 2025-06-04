import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from '../BancoBancos/Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        bancoID: number,
        nombre: string,
        activo: boolean,
        archivoDispersionID: number,
        tipoBancoID: number
    },

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    OptionsArchivosDispersion: { value: number, label: string }[]
    OptionsTipoBanco: { value: number, label: string }[]
}

export const CFormBancoNuevo = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                nombre: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                archivoDispersionID: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio"),
                tipoBancoID: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio"),


            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                // Finish the callback
                let agregarBanco: any = {
                    nombre: values.nombre,
                    activo: values.activo,
                    archivoDispersionID: values.archivoDispersionID,
                    tipoBancoID: values.tipoBancoID

                }
                values = agregarBanco

                Funciones.FNAdd(props.Seguridad, values)
                    .then((respuesta: any) => {
                        setLoading(false)
                        toast.success('El banco se agregó correctamente')
                        props.fnCancelar()
                        resetForm({ values: '' })

                    })
                    .catch((error: any) => {
                        toast.error("Error al guardar el banco, verifica")
                        setLoading(false)
                    })

            }}
        >
            <Form>
                <div>
                    <CustomFieldText
                        disabled={false}// props.Id=== undefined? false : true
                        label="Nombre:"
                        name="nombre"
                        placeholder="Agregar Banco"
                    />

                    <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" />

                    <CustomSelect
                        disabled={false} //props.Id === undefined ? false : true
                        label="Tipo de Archivo de Dispersión:"
                        name="archivoDispersionID"
                        placeholder="Seleccione..."
                        options={props.OptionsArchivosDispersion}
                        addDefault={false}
                        isMulti={false}
                    />

                    <CustomSelect
                        disabled={false} //props.Id === undefined ? false : true
                        label="Tipo de banco:"
                        name="tipoBancoID"
                        placeholder="Seleccione..."
                        options={props.OptionsTipoBanco}
                        addDefault={false}
                        isMulti={false}
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