import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'

import { valueContainerCSS } from 'react-select/src/components/containers'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { valueEventAriaMessage } from 'react-select/src/accessibility'
import DataTable from 'react-data-table-component'
import { FaCircle } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number
    initialValues: {
        archivoDispersionID: number,
        catConciliacionID: number,
        estatusArchivoID: number


    },



    cbActualizar(item: any): any,
    fnCancelar(): any,
    optionsConciliacion: { value: number, label: string }[],
    optionsArchivo: { value: number, label: string }[],
}



export const CForm = (props: CFormType) => {






    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // estatus: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteres").max(64, "1"),
                // descripcion: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteres").max(64, "Maximo 64 caracteres"),


            })}
            onSubmit={(values: any) => {

                setLoading(true)

                // Finish the callback


                let actualizarEstatus: any = {
                    archivoDispersionID: values.archivoDispersionID,
                    catConciliacionID: values.catConciliacionID,
                    estatusArchivoID: values.estatusArchivoID

                }
                values = actualizarEstatus


                Funciones.FNUpdate(props.Seguridad, { ...values, archivoDispersionID: props.Id as number })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbActualizar(respuesta)
                    })
                    .catch((error: any) => {
                        alert("Error al actualizar el estatus" + JSON.stringify(error))
                        setLoading(false)
                    })


            }}
        >
            <Form>

                <div>


                    <CustomSelect
                        disabled={props.initialValues.catConciliacionID === 2 ? true : false}
                        label="Conciliación:"
                        name="catConciliacionID"
                        placeholder="Seleccione..."
                        options={props.optionsConciliacion}
                        addDefault={false}
                        isMulti={false}
                    />



                    <CustomSelect
                        disabled={props.initialValues.estatusArchivoID === 2 ? true : false}
                        label="Archivo:"
                        name="estatusArchivoID"
                        placeholder="Seleccione..."
                        options={props.optionsArchivo}
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
