import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { string } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaExclamationTriangle, FaSearch, FaHouseUser, FaUser, FaPlusCircle, FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'



type CFormConfirmarRefTitularType = {
    oidc: IOidc
    Id?: number,
    Item: any,
    MostrarCFormConfirmarRefTitular: boolean,
    fnCancelar(): any,
    //fnVerificarRef(ProspectoID: any, NombreProspecto: any): any,
    cbActualizar(item: any): any,
    formaCFormListaTitulares(),
    ProspectoID: number
    NombreProspecto: string

}

export const CFormConfirmarRefTitular = (props: CFormConfirmarRefTitularType) => {
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

    // Return the component
    console.log(props.NombreProspecto, 'NOM prosp 2')

    const fnConfirmar = (ProspectoID: number,/* NombreProspecto: string*/) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNupdateProcesoRefTitular(props.oidc, ProspectoID, 12)
            .then((respuesta: any) => {
                props.cbActualizar(respuesta)
                // props.fnVerificarRef(ProspectoID, NombreProspecto)
                props.formaCFormListaTitulares()
                props.fnCancelar()
                toast.success('SE INICIÓ EL PROCESO DE VERIFICAR REFERENCIAS TITULAR')
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


        <ModalWin open={props.MostrarCFormConfirmarRefTitular} center >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    CONFIRMAR
                </h5>
                <button type="button" className="delete" onClick={() => { props.fnCancelar() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <div style={{ padding: '1em' }}>
                    <span >¿Esta Seguro(a) de iniciar el proceso de Verificar Ref Titular? </span><br /><br />
                    {/* <FaExclamationTriangle />
                    <span > Atención: El Prospecto iniciará el proceso de  Verificar Ref Titular y no habrá marcha atrás.</span> */}
                    <br />
                </div>
                <div className="text-end">
                    {state.Cargando && <Spinner/>}
                    {!state.Cargando && <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { fnConfirmar(props.ProspectoID,/* props.NombreProspecto)*/) }} >INICIAR PROCESO DE VERIFICAR REFERENCIAS TITULAR</button>}
                </div>
            </ModalWin.Body>
        </ModalWin>




    )
}