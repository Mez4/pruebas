import React from 'react'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaExclamationTriangle } from 'react-icons/fa'
import { Spinner } from '../../../../../global'


type CFormConfirmarTitularType = {
    oidc: IOidc
    Id?: number,
    Item: any,
    MostrarCFormConfirmarTitular: boolean,
    fnCancelar(): any,
    //fnTitular(ProspectoID: any, NombreProspecto: any): any,
    cbActualizar(item: any): any,
    formaCFormVerificaTitular()
    ProspectoID: number
    NombreProspecto: string
}

export const CFormConfirmarTitular = (props: CFormConfirmarTitularType) => {
    // Loading
    const [loading, setLoading] = React.useState(false)
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        Item: undefined,
        DataLoaded: false,
        CFormDocumentos: false,
        CatalogoMesaCreditoIndex: false,
        Form:
        {
            Mostrar: false,
            Id: undefined,
        },
    })
    // console.log(props.NombreProspecto, 'nombre p verificaT')

    // Return the component
    const fnConfirmar = (ProspectoID: number,/* NombreProspecto: string*/) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNupdateProcesoTitular(props.oidc, ProspectoID, 4)
            .then((respuesta: any) => {
            console.log(respuesta)
                props.cbActualizar(respuesta)
                props.formaCFormVerificaTitular()
                // props.fnTitular(ProspectoID, NombreProspecto)
                props.fnCancelar()
                toast.success('SE INICIÓ EL PROCESO DE VERIFICAR TITULAR')
            })
               .catch((error: any) => {
                setState(s => ({ ...s, Cargando: false }))
                props.fnCancelar()
                if (error.response)
                    toast.error(error.response.data)
                else if
                    (error.request)
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                else
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
            })
    }
    return (

        <ModalWin open={props.MostrarCFormConfirmarTitular} center >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    CONFIRMAR
                </h5>
                <button type="button" className="delete" onClick={() => { props.fnCancelar() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <div style={{ padding: '1em' }}>
                    <span >¿Esta Seguro(a) de iniciar el proceso de Verificación de la información del Titular?</span><br /><br />
                    {/* <FaExclamationTriangle />
                    <span > Atención: El Prospecto iniciará el proceso de Verificar Titular y no habrá marcha atrás.</span> */}
                    <br />
                </div>
                <div className="text-end">
                    {state.Cargando && <Spinner/>}
                    {!state.Cargando && <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { fnConfirmar(props.ProspectoID, /*props.NombreProspecto*/) }} >INICIAR PROCESO VERIFICAR TITULAR</button>}
                </div>
            </ModalWin.Body>
        </ModalWin>
    )
}