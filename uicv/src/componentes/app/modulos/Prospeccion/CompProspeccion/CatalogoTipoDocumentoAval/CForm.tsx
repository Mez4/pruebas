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
    initialValues: { CatalogoTipoDocumentoID: number, Orden: number, Activo: boolean },
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
                CatalogoTipoDocumentoID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el tipo'),
                Orden: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el tipo'),
            })}
            onSubmit={(values: any,{resetForm}) => {
                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Tipo Documento agregado correctamente")
                            resetForm()
                        })
                        .catch((error: any) => {
                            toast.error("Error al agregar Tipo Documento")
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, TipoDocumentoAvalID: props.Id })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Tipo Documento actualizado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar Documento")
                            setLoading(false)
                        })

            }}>
            <Form>
                <ActionSelect
                    disabled={false}
                    label="Tipo Documento"
                    name="CatalogoTipoDocumentoID"
                    placeholder="Seleccione el tipo"
                    options={props.optTiposDoc}
                    addDefault={false}
                    valor={props.initialValues.CatalogoTipoDocumentoID}

                />
                <CustomFieldText disabled={loading} label="Orden" name="Orden" placeholder="Orden" />
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