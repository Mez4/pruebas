

import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner } from '../../../../../global'
import { EstatusDistribuidor, Distribuidores } from '../../../../../selectores'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

type CFormType = {
    oidc: IOidc
    initialValues: {
        DistribuidorID: number,
        DistribuidoresEstatusID: string
    },
    cbGuardar(item: any): any,
    fnCancelar(): any
}

export const EditarEstatusSocia = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                DistribuidoresEstatusID: Yup.string().required("Seleccione un estatus").min(1, 'Seleccione un estatus').notOneOf(['Seleccione un Estatus'], 'Seleccione un estatus')
            })}
            onSubmit={(values: any) => {
                // Set our form to a loading state
                setLoading(true)

                Funciones.FNEditarEstatusDist(props.oidc, {
                    ...values,
                    // DistribuidorID: props.DistribuidorID
                })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbGuardar(respuesta)
                        toast.success(`Se actualizó el estatus de la ${DescripcionDistribuidor(1)}`)
                    })
                    .catch((error: any) => {
                        console.log(error)
                        setLoading(false)
                        toast.error(`Error al actualizar el estatus de la ${DescripcionDistribuidor(1)}`)
                    })

            }}>
            {({ values }) => (
                <Form>
                    <Distribuidores
                        name="DistribuidorID"
                        label={DescripcionDistribuidor(1)}
                        disabled
                        valor={values.DistribuidorID}
                    />
                    <EstatusDistribuidor
                        disabled={loading}
                        name="DistribuidoresEstatusID"
                        valor={values.DistribuidoresEstatusID}
                    />
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
            )}
        </Formik>
    )
}
