import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { string } from 'yup/lib/locale'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string, ProductoID: number, idRelMesaCredProd: number, Sucursal: string, MesaCobranzaID: number },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
    optGestor: { value: number, label: string }[]
}

export const CFormAsignaGestor = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                GestorId: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opcion'),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                // console.log(`values`, values)
                Funciones.FNAsignarGestor(props.oidc, values)
                    .then((respuesta: any) => {
                        setLoading(false)
                        console.log(props.cbActualizar, 'AS')
                        props.cbActualizar(respuesta)
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
                    name="GestorId"
                    placeholder="Seleccione una Opcion"
                    options={props.optGestor}
                    addDefault={true}
                    valor={props.initialValues.GestorId}
                />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}