import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Grupos } from '../../../../../selectores'
import { FaPlus } from 'react-icons/fa'

type CFormType = {
    oidc: IOidc
    Id: number,
    initialValues: { UsuarioID: number, GrupoID: number, Estatus: boolean },
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
                GrupoID: Yup.number().required("Seleccione el grupo").moreThan(0, 'Seleccione el grupo')
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
                        toast.success("Se agrego el acceso al grupo")
                    })
                    .catch((error: any) => {
                        console.log(JSON.stringify(error))
                        setLoading(false)
                        toast.error("Error al agregar el acceso al Grupo")
                    })
                // else
                //     Funciones.FNUpdate(props.oidc, { ...values, GrupoID: props.Id as number })
                //         .then((respuesta: any) => {
                //             setLoading(false)
                //             props.cbActualizar(respuesta)
                //             toast.success("Se actualizó el acceso al Grupo")
                //         })
                //         .catch((error: any) => {
                //             console.log(JSON.stringify(error))
                //             setLoading(false)
                //             toast.error("Error al actualizar el acceso al Grupo")
                //         })

            }}>
            {({ values }) => (
                <Form>
                    <Grupos oidc={props.oidc} Accion name="GrupoID" disabled={loading} label='Grupo' cargar GrupoID={values.GrupoID} />
                    <CustomFieldCheckbox disabled={loading} label="Activo" name="Estatus" />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button> */}
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Agregar <FaPlus />
                            </button>
                        </div>
                    }
                </Form>
            )}
        </Formik>
    )
}
