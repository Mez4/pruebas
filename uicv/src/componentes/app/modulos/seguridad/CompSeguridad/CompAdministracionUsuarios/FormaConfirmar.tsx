import React from 'react'
import { FaEnvelope } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './Funciones'
import { Formik, Form } from 'formik'

type FormaConfirmarTipo = {

    // Basic details
    oidc: IOidc,
    Id?: number,
    Item: any,

    // Callbacks
    cbActualizar(item: any): any,
    fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
}
export const FormaConfirmar = (props: FormaConfirmarTipo) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Pasamos nuestra forma
    return (
        <ModalWin open={props.mostrar}>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    <FaEnvelope size={20} /> Reenviar correo de confirmacion
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={{ Usuario: props.Item?.Usuario }}
                    enableReinitialize
                    onSubmit={(values: any) => {

                        // Set our form to a loading state
                        setLoading(true)

                        // If the userId is defined
                        Funciones.FNConfirmarCorreo(props.oidc, values)
                            .then(respuesta => {
                                setLoading(false)
                                props.cbActualizar(respuesta)
                            })
                            .catch(error => {
                                setLoading(false)
                                alert("Error al guardar el usuario" + JSON.stringify(error))
                            })
                    }}>
                    <Form>
                        <div>
                            <p>
                                Desea enviar el correo de confirmacion de cuenta al usuario <strong>{props.Item?.NombreCompleto}</strong>,
                                desea continuar?
                            </p>
                        </div>
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
