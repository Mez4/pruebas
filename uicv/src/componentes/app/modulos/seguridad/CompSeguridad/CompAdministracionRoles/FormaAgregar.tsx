import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, ModalWin, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'
import { DBConfia_Seguridad } from '../../../../../../interfaces_db/DBConfia/Seguridad'
import { toast } from 'react-toastify'

type FormaAgregarTipo = {
    oidc: IOidc
    Id?: number,
    Item?: DBConfia_Seguridad.IRoles,

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
                    initialValues={{
                        Nombre: props.Item ? props.Item.Nombre : '',
                        Descripcion: props.Item ? props.Item.Descripcion : '',
                        Icono: props.Item ? props.Item.Icono : '',
                        Tipo: props.Item && !props.Item.RequiereProducto ? 1 : 2
                    }}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        Nombre: Yup.string().required("Campo obligatorio").min(6, "Minimo 6 caracteres").max(120, "Maximo 120 caracteres"),
                        Descripcion: Yup.string().required("Campo obligatorio").min(6, "Minimo 6 caracteres").max(120, "Maximo 120 caracteres"),
                        Icono: Yup.string().required("Campo obligatorio").min(6, "Minimo 6 caracteres").max(25, "Maximo 120 caracteres"),
                        Tipo: Yup.number().required("Tipo de rol requerido").min(1, "Tipo de rol requerido")
                    })}
                    onSubmit={async (values: any, actions) => {

                        // Set our form to a loading state
                        setLoading(true)

                        try {

                            // Checamos si estamos agregando o actualizando
                            if (!props.Item) {

                                // Intentamos hacer el request con axios
                                const dato = (await axios.put(`${GetServerUrl()}sistema/Roles`, values, GenerarCabeceraOIDC(props.oidc))).data

                                // reset our form
                                actions.setSubmitting(false)
                                actions.resetForm({})
                                setLoading(false)

                                // CallBack
                                props.cbGuardar(dato)
                            }
                            else {
                                // Intentamos hacer el request con axios
                                const dato = (await axios.post(`${GetServerUrl()}sistema/Roles/${props.Item.RolID}`, values, GenerarCabeceraOIDC(props.oidc))).data

                                // reset our form
                                actions.setSubmitting(false)
                                actions.resetForm({})
                                setLoading(false)

                                // CallBack
                                props.cbActualizar(dato)
                            }
                        }
                        catch (error) {

                            // Error while saving
                            toast.error("Error al guardar el usuario")
                            setLoading(false)
                        }
                    }}>
                    <Form>
                        <CustomFieldText disabled={loading} label="Nombre" name="Nombre" placeholder="Nombre" />
                        <CustomFieldText disabled={loading} label="Descripcion" name="Descripcion" placeholder="Descripcion" />
                        <CustomFieldText disabled={loading} label="Icono" name="Icono" placeholder="Icono" />
                        <CustomSelect disabled={loading} label="Tipo" name='Tipo' addDefault={true} options={[{ label: 'Administrativo', value: 1 }, { label: 'Producto', value: 2 }]} isMulti={false} placeholder="Tipo de Rol" />
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}
