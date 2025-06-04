import { DBConfia_Distribuidores } from '../../../../../../interfaces_db/DBConfia/Distribuidores'
import { ActionSelect, CustomFieldText, Spinner } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React from 'react'

type InitialValues = {
    UsuarioID: number,
    Distribuidores: DBConfia_Distribuidores.IDistribuidores[]
}

type CFormType = {
    oidc: IOidc,
    state: {
        optGestores: any[]
    }
    initialValues: InitialValues,
    dgGuardar(item: any): any,
    fnCancelar(): any,
}

export const CForm = ({ state, initialValues, ...props }: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const modalStyle = { overflowY: 'unset' };

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                UsuarioID: Yup.number().required(),
            })}
            onSubmit={(values: InitialValues) => {
                if (values.Distribuidores.length == 0) {
                    toast.error("Favor de seleccionar al menos 1 socia")
                    return
                }
                if (values.UsuarioID == 0) {
                    toast.error("Favor de seleccionar un grupo")
                    return
                }
                setLoading(true)
                Funciones.FNEnlazarSociasGestor(props.oidc, values.Distribuidores, values.UsuarioID)
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.dgGuardar(respuesta)
                        toast.success(respuesta.msj)
                    })
                    .catch((error: any) => {
                        console.log(error.response)
                        setLoading(false)
                        toast.error(error.response?.data?.msj)
                    })

            }}>
            {({ values }) => (
                <Form>
                    <ActionSelect
                        disabled={false}
                        label="Gestor"
                        name="UsuarioID"
                        placeholder={'Seleccione un gestor'}
                        options={state.optGestores}
                        addDefault={false}
                        valor={0}
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
