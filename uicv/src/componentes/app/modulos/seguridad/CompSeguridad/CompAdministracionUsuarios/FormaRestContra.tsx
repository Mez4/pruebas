import React from 'react'
import { FaEnvelope, FaKey } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldText, ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './Funciones'
import { Formik, Form } from 'formik'
import { toast } from 'react-toastify'

type FormaResContraTipo = {

    // Basic details
    oidc: IOidc,
    Id?: number,
    Item: any,

    // Callbacks
    cbActualizar(item: any): any,
    fnCancelar(): any,
    fnMostrarContra(): any
    fnMostrarContra2(): any
    FNGetLocal(): any

    // Modal controls
    mostrar: boolean,
}
export const FormaRestContra = (props: FormaResContraTipo) => {

    // Loading
    const [loading, setLoading] = React.useState(false)


    // Pasamos nuestra forma
    return (
        <ModalWin open={props.mostrar}>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    <FaKey size={20} /> Restablecer contraseña del usuario
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={{ UsuarioID: props.Item?.UsuarioID }}
                    enableReinitialize
                    onSubmit={(values: any) => {

                        setLoading(true)
                        setLoading(true)
                        let a = {
                            Contrasena: values.Contrasena,
                            UsuarioID: values.UsuarioID
                        }

                        Funciones.FNUpdate(props.oidc, a)
                            .then((respuesta: any) => {

                                /*  props.fnMostrarContra2 */
                                console.log("VALUES", a)
                                console.log("RESP", respuesta)
                                toast.success("Contraseña restablecida correctamente.")
                                props.fnCancelar()
                                props.cbActualizar(respuesta)
                                props.fnMostrarContra()
                                setLoading(false)

                            },
                            )
                            .catch(() => {
                                toast.error("Ocurrió un problema al guardar el elemento.")
                                setLoading(false)
                            })

                    }}>
                    <Form>
                        Contraseña del usuario <strong>{props.Item?.NombreCompleto}</strong> se restablecera.
                        ¿Desea continuar?
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                {/* <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>

                                    </div>
                                    <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                                        <CustomFieldText disabled={false} label="NUEVA CONTRASEÑA" name="Contrasena" placeholder="********" />
                                    </div>
                                </div> */}

                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>

                                <button disabled={false} type="submit" className="ms-2 btn btn-success waves-effect waves-light" >Ok</button>

                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}
