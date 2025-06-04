import React from 'react'
import { ModalWin, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaLock } from 'react-icons/fa'
import { toast } from 'react-toastify'

type FormaBloqueoTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,

    // Callbacks
    cbActualizar(item: any): any,
    fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
}
export const FormaBloqueo = (props: FormaBloqueoTipo) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <ModalWin open={props.mostrar}>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    <FaLock size={20} /> Bloquear usuario
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <div>
                    <p>
                        Esta a punto de bloquear el usuario <strong>{props.Item?.NombreCompleto}</strong>,
                        desea continuar?
                    </p>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button onClick={() => {

                            // Set our form to a loading state
                            setLoading(true)

                            // If the userId is defined
                            Funciones.FNBloquear(props.oidc, props.Item)
                                .then(respuesta => {
                                    setLoading(false)
                                    props.cbActualizar(respuesta)
                                })
                                .catch(error => {
                                    setLoading(false)
                                    toast.error("Error al guardar el usuario")
                                })
                        }} type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                    </div>
                }
            </ModalWin.Body>
        </ModalWin>
    )
}
