import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionSelect, CustomSelect, ModalWin, Spinner } from '../../../../../../global'
import { IOidc } from '../../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../../global/ModalWin'
import axios from 'axios'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../../global/variables'
import { toast } from 'react-toastify'
import { DBConfia_Sistema } from '../../../../../../../interfaces_db/DBConfia/Sistema'

type FormaAgregarTipo = {
    oidc: IOidc
    Id?: number,
    RolID?: string,
    Permisos: DBConfia_Sistema.IPermisos_VW[],

    // Callbacks
    cbGuardar(item: any): any
    fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
}
export const FormaAgregar = (props: FormaAgregarTipo) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    console.log("Permisos modal", props.Permisos)

    // Return the component
    return (
        <ModalWin open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? "Editar usuario" : "Agregar Permisos al Rol"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={{ PermisoID: 0 }}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        PermisoID: Yup.number().required("Permiso requerido").min(1, "Permiso requerido")
                    })}
                    onSubmit={async (values: any, actions) => {

                        // Set our form to a loading state
                        setLoading(true)

                        try {

                            // Intentamos hacer el request con axios
                            const dato = (await axios.put(`${GetServerUrl()}sistema/Roles/asignar_permiso/${props.RolID}`, values, GenerarCabeceraOIDC(props.oidc))).data

                            // reset our form
                            actions.resetForm({ isSubmitting: false })
                            setLoading(false)

                            // CallBack
                            props.cbGuardar(dato)

                        }
                        catch (error) {

                            // Error while saving
                            toast.error("Error al agregar el rol")
                            setLoading(false)
                        }
                    }}>
                    <Form>  
                    {/* CustomSelect   ActionSelect*/}
                        <ActionSelect 
                        disabled={loading} 
                        label="Permiso" 
                        name='PermisoID' 
                        addDefault={true} 
                        options={props.Permisos.map((p) => ({ value: p.PermisoID, label: `${p.PermisoID} ${p.PermisoNombre}`, group: `${p.ModuloNombre}.${p.PantallaNombre}` }))}  
                        placeholder="Tipo de Rol" />
                        
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /> 
                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}
