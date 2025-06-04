import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { string } from 'yup/lib/locale'
import { number } from '../../../../../../global/idiomaValidacion.bak'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, DistribuidorDesc: string, Capital: number, SaldoActual: number, DiasAtraso: number, Motivo: string, TipoCobranza: string, MotivoID: number, MesaCobranzaID: number, Clave: string, ProductoID: number },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    // optMesa: { value: number, label: string }[],
    optMotivo: { value: number, label: string }[],
    MesaCobranzaID: any,
    idRelMesaCredProd: number
    // optMesa: { value: number, label: string }[],
    // optTabMora: { value: number, label: string }[],
    // optPersonas: { value: number, label: string }[]
    // identificador: number
}

export const CFormAsignarDistribuidor = (props: CFormType) => {
    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // MesaCobranzaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opcion'),
                MotivoID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opcion'),

            })}

            onSubmit={(values: any) => {
                setLoading(true)
                Funciones.AsignarDistribuidor(props.oidc, values.DistribuidorID, props.MesaCobranzaID, values.MotivoID, values.DiasAtraso, values.Capital, values.SadoActual, values.ProductoID, props.idRelMesaCredProd)
                    .then((respuesta: any) => {
                        setLoading(false)
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


                <CustomFieldText disabled={true} label="SociaID" name="DistribuidorID" placeholder="Socia" />

                {/* <CustomFieldText disabled={true} label="Socia" name="DistribuidorDesc" placeholder="DistribuidorDesc" /> */}

                {/* <ActionSelect
                    disabled={false}
                    label="MesaCobranza"
                    name="MesaCobranzaID"
                    placeholder="Seleccione una Opcion"
                    options={props.optMesa}
                    addDefault={true}
                    valor={props.initialValues.MesaCobranzaID}
                /> */}

                <ActionSelect
                    disabled={false}
                    label="Motivo"
                    name="MotivoID"
                    placeholder="Seleccione una Opcion"
                    options={props.optMotivo}
                    addDefault={true}
                    valor={props.initialValues.MotivoID}
                />

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