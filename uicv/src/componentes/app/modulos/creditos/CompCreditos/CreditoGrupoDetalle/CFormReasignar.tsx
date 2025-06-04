import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Distribuidores } from '../../../../../selectores'
import { FaUserPlus } from 'react-icons/fa'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

type CFormType = {
    oidc: IOidc
    GrupoID: number,
    SucursalID: number,
    DistribuidorID: number,
    initialValues: {
        DistribuidorID: number,
        Estatus: boolean
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    // fnCancelar(): any,
}

export const CFormDetalleReasignar = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                DistribuidorID: Yup.number().required(`Seleccione la ${DescripcionDistribuidor(1)}`).moreThan(0, `Seleccione la ${DescripcionDistribuidor(1)}`)
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                // if (props.DistribuidorID === undefined)
                Funciones.FNAdd(props.oidc, { ...values, GrupoID: props.GrupoID as number })
                    .then((respuesta: any) => {
                        setLoading(false)
                        if (respuesta.res === 1) {
                            props.cbGuardar(respuesta)
                            toast.success(respuesta.msj)
                        } else {
                            toast.error(respuesta.msj)
                        }
                    })
                    .catch((error: any) => {
                        console.log(JSON.stringify(error))
                        setLoading(false)
                        toast.error("Error al guardar el Grupo")
                    })
                // else
                //     Funciones.FNUpdate(props.oidc, { ...values, GrupoID: props.GrupoID as number })
                //         .then((respuesta: any) => {
                //             setLoading(false)
                //             props.cbActualizar(respuesta)
                //             toast.success("Se actualizó el estatus del socia")
                //         })
                //         .catch((error: any) => {
                //             console.log(JSON.stringify(error))
                //             setLoading(false)
                //             toast.error("Error al actualizar el estatus del socia")
                //         })

            }}>
            <Form>
                <Distribuidores SinGrupo name="DistribuidorID" unaLinea disabled={loading} label={DescripcionDistribuidor(1)} />
                <CustomFieldCheckbox disabled={loading} label="Estatus" name="Estatus" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button> */}
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Agregar <FaUserPlus />
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
