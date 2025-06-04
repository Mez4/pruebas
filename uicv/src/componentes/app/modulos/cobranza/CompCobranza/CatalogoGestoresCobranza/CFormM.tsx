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
    optProdMesa: { value: number, label: string }[],
    optGestores: { value: number, label: string }[],
    initialValues: { PersonaID: number, NombreCompleto: string, MesaCobranzaID: number, mesaCobranza: string, Activo: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,
    fnCerrarCformConfirmar(): any,
}


export const CFormM = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    return (
<Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                MesaCobranzaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
                PersonaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),

            })}
            onSubmit={(values: any) => {
                setLoading(true)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.fnCancelar() //cierra la forma de CForm
                            props.fnCerrarCformConfirmar() // cierra la forma CformConfirmar
                            props.cbGuardar(respuesta)
                            toast.success(respuesta.msj)
                        })
                        .catch((error: any) => {
                            if (error.response)
                                toast.error(`Response: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                            setLoading(false)
                        })

            }}>
            <Form>
                <ActionSelect
                    disabled={false}
                    label="Gestor"
                    name="PersonaID"
                    placeholder="Seleccione el tipo"
                    options={props.optGestores}
                    addDefault={false}
                    valor={props.initialValues.PersonaID}

                />
                <ActionSelect
                    disabled={false}
                    label="Mesa De Cobranza"
                    name="MesaCobranzaID"
                    placeholder="Seleccione el tipo"
                    options={props.optProdMesa}
                    addDefault={true}
                    valor={props.initialValues.MesaCobranzaID}
                />

                <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                    </div>
                }
            </Form>
        </Formik>

    )
}