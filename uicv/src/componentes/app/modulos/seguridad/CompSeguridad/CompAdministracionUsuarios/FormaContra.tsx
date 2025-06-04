import React from 'react'
import { FaCopy, FaEnvelope, FaPrint } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldText, ModalWin, Spinner } from '../../../../../global'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './Funciones'
import { Formik, Form, Field } from 'formik'
import { toast } from 'react-toastify'

type FormaResContraTipo = {

    // Basic details
    oidc: IOidc,
    Id?: number,
    Item: any,
    contraNueva: any,
    // Callbacks
    cbActualizar(item: any): any,
    fnCancelar(): any,
    fnMostrarContra(): any
    fnMostrarContra2(): any
    FNGetLocal(): any

    // Modal controls
    mostrar: boolean,
}
export const FormaContra = (props: FormaResContraTipo) => {

    // Loading
    const [loading, setLoading] = React.useState(false)


    // Pasamos nuestra forma
    return (
        <Formik
            initialValues={{ UsuarioID: props.Item?.UsuarioID, Contrasena: props.contraNueva }}
            enableReinitialize
            onSubmit={(values: any) => {

            }}>
            <Form>
                La nueva contraseña del usuario <strong>{props.Item?.NombreCompleto}</strong> es:

                <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                    <CustomFieldText disabled={true} label='' name='Contrasena'></CustomFieldText>
                    {/*  <Field
                        type="textarea"
                        disabled={true}
                        className="form-control"
                        rows={3}
                        id="Contrasena"
                        name="Contrasena"
                        placeholder=""
                        onChange={(val) => { ({ Contrasena: val }) }}
                        multiple={true}
                        onChangeCapture={e => (console.log(e))}
                    /> */}
                    <div>
                        <br>
                        </br>
                        <button type="button" className={"btn btn-primary waves-effect waves-light"}>
                            <span className="" onClick={() => {
                                navigator.clipboard.writeText(props.contraNueva), toast.success("Contraseñan copiada correctamente")

                            }}>Copiar</span>&nbsp;<FaCopy />
                        </button>
                    </div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <div>
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnMostrarContra2}>
                                Cancelar
                            </button>
                            {/*                             <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ver Contraseñas</button>
 */}                        </div>
                    </div>
                }
            </Form>
        </Formik >

    )
}
