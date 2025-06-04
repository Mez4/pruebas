import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Cajas } from '../../../../../selectores'
import { FaPlus } from 'react-icons/fa'

type CFormType = {
    oidc: IOidc
    Id: number,
    initialValues: { UsuarioID: number, CajaID: number, Activo: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar?(): any,
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                CajaID: Yup.number().required("Seleccione la caja").moreThan(0, 'Seleccione la caja')
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                // if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, { ...values, UsuarioID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se agrego el acceso a la caja")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al agregar el acceso a la caja")
                        })

            }}>
            {({ values }) => (
                <Form>
                    <Cajas oidc={props.oidc} name="CajaID" disabled={loading} IsAction />
                    <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button> */}
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Agregar <FaPlus/>
                            </button>
                        </div>
                    }
                </Form>
            )}
        </Formik>
    )
}
