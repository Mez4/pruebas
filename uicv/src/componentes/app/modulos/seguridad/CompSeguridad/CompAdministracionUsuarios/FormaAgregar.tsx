import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, ModalWin, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

type FormaAgregarTipo = {
    oidc: IOidc
    Id?: number,
    Item?: any,

    // Callbacks
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
}
export const FormaAgregar = (props: FormaAgregarTipo) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <ModalWin open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Editar usuario" : "Agregar usuario"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    // props.Item?.Correo
                    initialValues={{ Correo: '', Nombre: '', MasterUser: false, TodosLosCoordinadores: false }}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        Correo: Yup.string().required("Campo obligatorio").email("Se requiere un email valido"),
                        Nombre: Yup.string().required("Campo obligatorio").min(6, "Minimo 6 caracteres").max(120, "Maximo 120 caracteres")
                    })}
                    onSubmit={(values: any, actions) => {

                        // Set our form to a loading state
                        setLoading(true)

                        // If the userId is defined
                        if (props.Item === undefined)
                            Funciones.FNAgregar(props.oidc, values)
                                .then((respuesta: any) => {

                                    // reset our form
                                    actions.setSubmitting(false)
                                    actions.resetForm({})

                                    // set loadin to false
                                    setLoading(false)

                                    // send the data to the table
                                    props.cbGuardar(respuesta)
                                })
                                .catch((error: any) => {
                                    alert("Error al guardar el usuario" + JSON.stringify(error))
                                    setLoading(false)
                                })
                    }}>
                    <Form>
                        <CustomFieldText disabled={loading} label="Correo" name="Correo" placeholder="Correo electronico" />
                        <CustomFieldText disabled={loading} label="Nombre" name="Nombre" placeholder="Nombre completo" />
                        <CustomFieldCheckbox disabled={loading} label="Administrador" name="MasterUser" />
                        <CustomFieldCheckbox disabled={loading} label="Administrador de Coordinadores" name="TodosLosCoordinadores" />
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
            </ModalWin.Body>
        </ModalWin>
    )
}
