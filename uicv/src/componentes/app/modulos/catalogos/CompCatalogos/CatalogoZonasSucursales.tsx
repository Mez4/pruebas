import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

import * as Funciones from './CatalogoZonasSucursales/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoZonasSucursales/CForm'
import Mensajes from './CatalogoZonasSucursales/Mensajes'
import Procesos from './CatalogoZonasSucursales/Procesos'
import Documentos from './CatalogoZonasSucursales/Documentos'
import Relacion from './CatalogoZonasSucursales/Relacion'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoZonasSucursales = (props: CatalogosType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)

    const [state, setState] = React.useState({
        ProcesoID: 0,
        ProcesoName: '',
        ProcesoActive: 0,
        MensajeID: 0,
        MensajeName: '',
        cargandoProcesos: false,
        cargandoDocs: false,
        Mostrar: false,
        MostrarR: false,
    })

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const fnSelectMensaje = async (mensajeID: number, mensajeName: string) => {
        console.log(mensajeID)
        setState(e => ({ ...e, MensajeID: 0, ProcesoID: 0, cargandoProcesos: true }))
        await timeout(100);
        setState(e => ({ ...e, MensajeID: mensajeID, MensajeName: mensajeName, ProcesoID: 0, cargandoProcesos: false }))
    }

    const fnSelectProceso = async (procesoID: number, procesoName: string) => {
        console.log(procesoID)
        setState(e => ({ ...e, ProcesoID: 0, cargandoDocs: true }))
        await timeout(100);
        setState(e => ({ ...e, ProcesoID: procesoID, ProcesoName: procesoName, cargandoDocs: false }))
    }

    const fnSelectDoc = (procesoID: number) => {
        setState(e => ({ ...e, ProcesoActive: procesoID }))
    }

    const fnCancelar = () => setState(e => ({ ...e, Mostrar: false }))

    const fnCancelarR = () => setState(e => ({ ...e, MostrarR: false }))


    return (
        <div className="row">
            <div className="col-12">
                <Card Title="RELACIÓN ZONAS SUCURSALES">
                    <Card.Body>
                        <Card.Body.Content>
                            {/* <div className='row'>
                                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4"></div>
                                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center" style={{ marginBottom: '.5em' }}>
                                    <button className="btn btn-success" style={{ textAlign: 'center' }} type="button" onClick={() => setState(e => ({ ...e, Mostrar: true }))}>AGREGAR NUEVO MENSAJE</button>
                                </div>
                                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-end" style={{ marginBottom: '.5em' }}>
                                    <button className="btn btn-outline-primary" style={{ textAlign: 'center' }} type="button" onClick={() => setState(e => ({ ...e, MostrarR: true }))}>VER RESUMEN</button>
                                </div>
                            </div> */}
                            <div className='row'>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <Mensajes fnSelectMensaje={fnSelectMensaje} Mostrar={state.Mostrar} fnCancelar={fnCancelar} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    {state.cargandoProcesos && <Spinner />}
                                    {state.MensajeID > 0 && <Procesos MensajeID={state.MensajeID} MensajeName={state.MensajeName} fnSelectProceso={fnSelectProceso} ProcesoActive={state.ProcesoActive} />}
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    {state.cargandoDocs && <Spinner />}
                                    {state.ProcesoID > 0 && <Documentos MensajeID={state.MensajeID} ProcesoName={state.ProcesoName} ProcesoID={state.ProcesoID} fnSelectDoc={fnSelectDoc} />}
                                </div>
                            </div>
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
            {state.MostrarR && <Relacion fnSelectMensaje={fnSelectMensaje} Mostrar={state.MostrarR} fnCancelar={fnCancelarR} />}
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoZonasSucursales);