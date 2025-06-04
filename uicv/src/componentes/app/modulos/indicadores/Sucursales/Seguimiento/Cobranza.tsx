import React, { useEffect } from 'react'
import { AiOutlineNumber } from 'react-icons/ai'
import { FaCalendar, FaFilter, FaMap, FaShare, FaStore, FaTag, FaUser, FaUsers } from 'react-icons/fa'
import { Card, ModalWin, Spinner } from '../../../../../global'

// Datepicker
import DatePicker, { registerLocale } from "react-datepicker"
import es from 'date-fns/locale/es'

import { connect } from 'react-redux'
import moment from 'moment'

import { DBConfia_Creditos } from '../../../../../../interfaces_db/DBConfia/Creditos'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import axios from 'axios'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'

// import PanelOperador from './Cobranza/PanelOperador'
// import { ResumenCartera } from './Cobranza/ResumenCartera'
// import { TIndicador } from './Cobranza/TIndicador'
// import TablaCuentas from './Cobranza/TablaCuentas'
// import TablaAtraso from './Cobranza/TablaAtraso'
// import { TablaColocacionImproductivas } from './Cobranza/TablaColocacionImproductivas'
// import TablaIncrementos from './Cobranza/TablaIncrementos'

import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import TablaResumenQuincena from './Cobranza/TablaResumenQuincena'
import { Col, Row } from 'react-grid-system'
import TablaSociasPendientes from './Cobranza/TablaSociasPendientes'
import TablaDistribuidorasPendientes from './Cobranza/TablaDistribuidorasPendientes'
import { ResumenCartera } from './Cobranza/ResumenCartera'
import GraficaSociasPendientes from './Cobranza/GraficaSociasPendientes'
import TIndicadorSP from './Cobranza/TIndicadorSP'

/**
 * Panel para coordinadores
 * @param props Propiedades para conexion con el servidor
 * @returns {React.ReactElement} Componente de react
 */
const Cobranza = (props: { oidc: IOidc, ui: iUI }) => {

    // Locale para el datepicker
    registerLocale("es", es)

    // Definimos un nuevo estado del componente ahora con React.useReducer
    type TState = {
        fecha: Date,
        cargando: boolean,
        zonas: DBConfia_General.IZonas_VW[],
        zona?: DBConfia_General.IZonas_VW,
        sucursales: DBConfia_General.ISucursales_VW[]
        sucursal?: DBConfia_General.ISucursales_VW
        indicadorSP?: TIndicadorSP
    }

    // Estado del componente
    const [estado, definirEstado] = React.useReducer((estado__previo: TState, estado__nuevo: Partial<TState>) => ({ ...estado__previo, ...estado__nuevo }), { cargando: false, fecha: new Date(), zonas: [], sucursales: [], indicadorSP: undefined })

    // Toda las distribuidoras
    // const distribuidoras: Tsp_HiTIndicadores_sp_Historicos[] = estado.indicadorSP !== undefined
    //     ? [...estado.indicadorSP.Distribuidoras__0__Diasatraso, ...estado.indicadorSP.Distribuidoras__1_45__Diasatraso, ...estado.indicadorSP.Distribuidoras__46_90__Diasatraso]
    //     : []

    // Cargamos los socias
    useEffect(() => {

        const queryAync = async () => {

            // Mostramos el dialogo de carga de coordinadores
            definirEstado({ cargando: true, indicadorSP: undefined })

            // Hacemos una perticion al servidor para obtener nuestros coordiandores
            try {

                const rest_zonas: DBConfia_General.IZonas_VW[] = (await axios.post(`${GetServerUrl()}General/Zona/get`, {}, GenerarCabeceraOIDC(props.oidc))).data
                const rest_sucursales: DBConfia_General.ISucursales_VW[] = (await axios.post(`${GetServerUrl()}General/Sucursal/get`, {}, GenerarCabeceraOIDC(props.oidc))).data
                definirEstado({ sucursales: rest_sucursales, zonas: rest_zonas, cargando: false })
            }
            catch (Exception) {
                definirEstado({ sucursales: [], cargando: false })
            }
        }

        // Make the query
        queryAync()

    }, [])

    // Obtener indicador
    const FNIndicador = async (sucursal: DBConfia_General.ISucursales_VW, fecha: Date): Promise<void> => {

        // Hacemos una perticion al servidor para obtener nuestros coordiandores
        try {

            definirEstado({ cargando: true, fecha })

            // Obtenemos los indicadores
            const rest_indicadores_sp: TIndicadorSP = (await axios.get(`${GetServerUrl()}Indicadores/Cartera/cobranza__sucursal/${sucursal.SucursalID}/${moment(fecha).format("DD-MM-YYYY")}`, GenerarCabeceraOIDC(props.oidc))).data
            definirEstado({ cargando: false, indicadorSP: rest_indicadores_sp, sucursal })
        }
        catch {
            definirEstado({ cargando: false, indicadorSP: undefined, sucursal })
        }
    }

    // Render de nuestro selector de coordinador
    return (
        <div>

            {/** Modal de carga */}
            <ModalWin open={estado.cargando} center>
                <ModalWin.Body>
                    <div className='p-3' style={{ textAlign: 'center' }}>
                        <Spinner />
                        <p className='mt-2 mb-1'><strong>Cargando datos</strong></p>
                    </div>
                </ModalWin.Body>
            </ModalWin>


            <h4>Detalle del tablero</h4>
            <Card Title={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center', flexWrap: 'wrap' }}>
                    <FaFilter className={'mr-2 is-size-7'} />
                    <span className='is-size-7'> Filtrar datos</span>
                </div>
            }>
                <Card.Body>
                    <div className=''>
                        <div style={{ display: 'flex' }}>
                            <div>
                                <p className='my-0'>Zona</p>
                                <select onChange={async (vl) => {
                                    if (vl.target.value !== '0') {
                                        let zon = estado.zonas.find(f => f.ZonaID === parseInt(vl.target.value))
                                        definirEstado({ zona: zon, sucursal: undefined })
                                    }
                                }} value={estado.zona !== undefined ? estado.zona.ZonaID : 0} className='form-select'>
                                    <option disabled value={0}>Seleccionar</option>
                                    {(estado.zonas ?? []).map((z, zId) => <option key={zId} value={z.ZonaID}> {z.Nombre}</option>)}
                                </select>
                            </div>
                            <div className='ml-1'>
                                <p className='my-0'>Sucursal</p>
                                <select disabled={estado.zona === undefined} onChange={async (vl) => {
                                    if (vl.target.value !== '0') {
                                        let suc = estado.sucursales.find(f => f.SucursalID === parseInt(vl.target.value))
                                        if (suc !== undefined)
                                            await FNIndicador(suc, estado.fecha)
                                    }
                                }} value={estado.sucursal !== undefined ? estado.sucursal.SucursalID : 0} className='form-select'>
                                    <option disabled value={0}>Seleccionar</option>
                                    {(estado.sucursales ?? []).filter(s => s.ZonaID === estado.zona?.ZonaID ?? 0).map((c, cId) => <option key={cId} value={c.SucursalID}> {c.Nombre}</option>)}
                                </select>
                            </div>
                        </div>
                        <p className="control has-icons-left mt-2 mr-2 ml-2 my-0">


                        </p>

                    </div>
                    {estado.sucursal !== undefined &&
                        <div className='row'>
                            <div className='col-sm-12'>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <span className="panel-icon mr-2">
                                            <FaStore />
                                        </span>
                                        Coordinador: <strong>{estado.sucursal?.Nombre}</strong>
                                    </li>
                                    <li className="list-group-item">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <FaMap size={14} color='#4f4f4f' className='mr-2' />
                                            <p>Zona: <span><strong>{estado.sucursal.ZonaNombre}</strong>, {" "}</span></p>
                                        </div>
                                    </li>
                                    <li className="list-group-item border-bottom">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <FaCalendar size={14} color='#4f4f4f' className='mr-2' />
                                            <DatePicker
                                                onChange={async (stri: any, strf: any) => {

                                                    if (estado.sucursal !== undefined)
                                                        FNIndicador(estado.sucursal, new Date(stri))
                                                }}

                                                className="form-control"
                                                selected={estado.fecha}
                                                selectsEnd
                                                maxDate={new Date()}
                                                placeholderText="Fecha Reporte"
                                                locale="es"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }
                </Card.Body>
            </Card>

            {estado.sucursal !== undefined && !estado.cargando && estado.indicadorSP !== undefined &&
                <React.Fragment>
                    <TablaResumenQuincena indicador={estado.indicadorSP} />
                    <Row>
                        <Col sm={12} md={12} lg={6}>
                            <TablaSociasPendientes indicador={estado.indicadorSP} />
                            <GraficaSociasPendientes indicador={estado.indicadorSP} />
                        </Col>
                        <Col sm={12} md={12} lg={6}>
                            <TablaDistribuidorasPendientes distribuidoras={estado.indicadorSP.Distribuidoras} />
                        </Col>
                    </Row>
                    <ResumenCartera indicador={estado.indicadorSP} />
                    {/* <PanelOperador indicador={indicador} />
                    <TablaCuentas indicador={indicador} definirDistribuidorID={definirDistribuidorID} />
                    <ResumenCartera indicador={indicador} />
                    <TablaAtraso indicador={indicador} />
                    <TablaColocacionImproductivas indicador={indicador} />
                    <TablaIncrementos indicador={indicador} /> */}
                </React.Fragment>
            }
        </div>
    )
}

const mapStateToProps = (estado: IEstado) => ({
    ui: estado.UI,
    oidc: estado.oidc
})

export default connect(mapStateToProps)(Cobranza)