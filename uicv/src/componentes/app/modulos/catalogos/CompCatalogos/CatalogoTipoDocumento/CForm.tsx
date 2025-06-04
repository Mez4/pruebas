import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { activo: boolean, claveDoc: string, documentosTipoNombre: string, ordenSistema: number, soloIMG: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}

export const CForm = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                documentosTipoNombre: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(12, "Maximo 12 caracteres"),
                claveDoc: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(12, "Maximo 12 caracteres"),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo documento" + JSON.stringify(error))
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, documentosTipoId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo documento" + JSON.stringify(error))
                            setLoading(false)
                        })

            }}>
            {/*activo: boolean, claveDoc: string, documentosTipoNombre: string, ordenSistema: number, soloIMG: boolean */}
            <Form>

                <CustomFieldText disabled={loading} label="Nombre" name="documentosTipoNombre" placeholder="Tipo de documento" />
                <CustomFieldText disabled={loading} label="Clave" name="claveDoc" placeholder="Clave Documento" />
                <CustomFieldText disabled={loading} label="Sistema" name="ordenSistema" placeholder="Sistema" />
                <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" />
                <CustomFieldCheckbox disabled={loading} label="Solo Imagen" name="soloIMG" />
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