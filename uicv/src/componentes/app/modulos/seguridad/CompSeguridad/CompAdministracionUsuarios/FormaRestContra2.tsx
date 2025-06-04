import React from 'react'
import { FaCopy, FaEnvelope } from 'react-icons/fa'
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
    /* cbActualizar(item: any): any, */
    fnCancelar(): any,
    /* fnMostrarContra(): any
    fnMostrarContra2(): any */
    FNGetLocal(): any

    // Modal controls
    mostrar: boolean,
}
export const FormaRestContra2 = (props: FormaResContraTipo) => {

    // Loading
    const [loading, setLoading] = React.useState(false)


    // Pasamos nuestra forma
    return (
        <Formik
            initialValues={{ UsuarioID: props.Item?.UsuarioID, Contrasena: props.Item.Contrasena }}
            enableReinitialize
            onSubmit={(values: any) => {
                let a = {
                    Contrasena: values.Contrasena,
                    UsuarioID: values.UsuarioID
                }
            }}>
            <Form>
                La contraseña del usuario <strong>{props.Item?.NombreCompleto}</strong> es: <strong>{props.Item?.Contrasena}</strong>

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
                            <span className=""/* onClick={() => {navigator.clipboard.writeText(state.)}} */>Copiar</span>&nbsp;<FaCopy />
                        </button>
                    </div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <div>
                            <button type="button" className="btn btn-danger waves-effect waves-light" /* onClick={props.fnMostrarContra2} */>
                                Cancelar
                            </button>
                        </div>
                    </div>
                }
            </Form>
        </Formik >

    )
}
