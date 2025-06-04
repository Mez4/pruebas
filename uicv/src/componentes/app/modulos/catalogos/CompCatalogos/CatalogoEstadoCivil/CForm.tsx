import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    EstadoCivilID?: string,
    initialValues: { EstadoCivilID: string, EstadoCivil: string },
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
                EstadoCivilID: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(1, "Maximo 1 caracter"),
                EstadoCivil: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(25, "Maximo 25 caracteres")
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.EstadoCivilID === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó el estado civil")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el estado civil")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el estado civil")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el estado civil")
                        })

            }}>
            <Form>
                <CustomFieldText disabled={loading || props.EstadoCivilID !== undefined} label="ID" name="EstadoCivilID" placeholder="Identificador" />
                <CustomFieldText disabled={loading} label="Estado Civil" name="EstadoCivil" placeholder="Estado Civil" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Aceptar
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
