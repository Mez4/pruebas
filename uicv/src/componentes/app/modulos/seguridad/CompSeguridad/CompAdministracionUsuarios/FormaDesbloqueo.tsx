import React from 'react'

import { ModalWin, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'

import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaLockOpen } from 'react-icons/fa'
import { toast } from 'react-toastify'

type FormaDesbloqueoTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,

    // Callbacks
    cbActualizar(item: any): any,
    fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
}
export const FormaDesbloqueo = (props: FormaDesbloqueoTipo) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Desbloqueo
    const FNDesbloquear = () => {
        setLoading(true)
        Funciones.FNDesbloquear(props.oidc, props.Item)
            .then((respuesta) => {
                setLoading(false)
                props.cbActualizar(respuesta)
            })
            .catch(() => {
                setLoading(false)
                toast.error("Ocurrio un error al desbloquear el usuario")
            })
    }

    // Render the component
    return (
        <ModalWin open={props.mostrar}>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    <FaLockOpen size={20} /> Desbloquear usuario
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <div className="text-left">
                    <p>
                        Estas a punto de desbloquear el usuario <strong>{props.Item?.Nombre}</strong>,
                        después de realizar el proceso, el usuario tiene que confirmar nuevamente su
                        usuario utilizando su correo electrónico
                    </p>
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>Cancelar</button>
                            <button onClick={FNDesbloquear} type="button" className="ms-2 btn btn-confia waves-effect waves-light">Ok</button>
                        </div>
                    }
                </div>
            </ModalWin.Body>
        </ModalWin>
    )
}
