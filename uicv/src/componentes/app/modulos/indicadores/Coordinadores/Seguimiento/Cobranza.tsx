import React, { useEffect } from 'react'
import { connect } from 'react-redux'

// Icons
import { FaCalendar, FaFilter, FaStore, FaTag, FaUser } from 'react-icons/fa'

// Custom components
import { Card, ModalWin, Spinner } from '../../../../../global'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'

// Custom components > Child
import PanelOperador from './Cobranza/PanelOperador'
import { ResumenCartera } from './Cobranza/ResumenCartera'
import TablaCuentas from './Cobranza/TablaCuentas'
import TablaAtraso from './Cobranza/TablaAtraso'
import { TablaColocacionImproductivas } from './Cobranza/TablaColocacionImproductivas'
import TablaIncrementos from './Cobranza/TablaIncrementos'

// Interfaces
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import { DBConfia_Creditos } from '../../../../../../interfaces_db/DBConfia/Creditos'
import Persona from '../../../personas/CompAdministracion/Persona'

// Interfaces > Child
import TIndicadorSP from './Cobranza/TIndicadorSP'

// Datepicker
import DatePicker, { registerLocale } from "react-datepicker"
import es from 'date-fns/locale/es'

// 3rd Party
import axios from 'axios'
import moment from 'moment'
import Tsp_HiTIndicadores_sp_Historicos from '../../../../../../interfaces/sp/TIndicadores_sp_Historicos'



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
        coordinador?: DBConfia_Creditos.ICoordinadores_VW
        coordinadores: DBConfia_Creditos.ICoordinadores_VW[]
        grupos: DBConfia_Creditos.IGrupos_VW[]
        indicadorSP?: TIndicadorSP

        // Detalle de algún socia activo
        distribuidorID: number
    }

    // Estado del componente
    const [estado, definirEstado] = React.useReducer((estado__previo: TState, estado__nuevo: Partial<TState>) => ({ ...estado__previo, ...estado__nuevo }), { cargando: false, fecha: new Date(), coordinadores: [], indicadorSP: undefined, distribuidorID: 0, grupos: [] })

    // Toda las socia
    const distribuidoras: Tsp_HiTIndicadores_sp_Historicos[] = estado.indicadorSP !== undefined ? [...estado.indicadorSP.Cuentas0DiasAtraso, ...estado.indicadorSP.Distribuidoras__1_45__Diasatraso, ...estado.indicadorSP.Distribuidoras__46_90__Diasatraso] : []

    // Cargamos los socia
    useEffect(() => {

        const queryAync = async () => {

            // Definimos nuestro nuevo estado
            definirEstado({ coordinadores: [], cargando: true, indicadorSP: undefined })

            // Hacemos una perticion al servidor para obtener nuestros coordiandores
            try {

                const rest_coordinadores: DBConfia_Creditos.ICoordinadores_VW[] = (await axios.post(`${GetServerUrl()}Creditos/Coordinador/get`, {}, GenerarCabeceraOIDC(props.oidc))).data
                definirEstado({ coordinadores: rest_coordinadores, cargando: false })

            }
            catch (Exception) {
                definirEstado({ coordinadores: [], cargando: false })
            }
        }

        // Make the query
        queryAync()

    }, [])


    const FNIndicador = async (coordinador: DBConfia_Creditos.ICoordinadores_VW, fecha: Date): Promise<void> => {

        // Hacemos una perticion al servidor para obtener nuestros coordiandores
        try {

            definirEstado({ cargando: true, fecha })

            // Definimos la busqueda de grupos
            const rest_grupos: DBConfia_Creditos.IGrupos_VW[] = (await axios.get(`${GetServerUrl()}Creditos/Coordinador/grupos/${coordinador.CoordinadorID}`, GenerarCabeceraOIDC(props.oidc))).data

            const group =  rest_grupos.filter(
                    (thing, i, arr) => arr.findIndex(t => t.ProductoID === thing.ProductoID) === i
            );

            // Obtenemos los indicadores
            const rest_indicadores_sp: TIndicadorSP = (await axios.get(`${GetServerUrl()}Indicadores/Cartera/cobranza__coordinador/${coordinador.CoordinadorID}/${moment(fecha).format("DD-MM-YYYY")}`, GenerarCabeceraOIDC(props.oidc))).data

            console.log('rest_indicadores_sp: ', rest_indicadores_sp)

            definirEstado({ cargando: false, indicadorSP: rest_indicadores_sp, coordinador, grupos: group })
        }
        catch {
            definirEstado({ cargando: false, indicadorSP: undefined, coordinador, grupos: [] })
        }
    }

    // Render de nuestro selector de coordinador
    return (
        <div>

            {/** Modal para seleccionar un coordinador */}
            <ModalWin open={estado.distribuidorID !== 0} xlarge center>
                <ModalWin.Header>
                    <strong>Detalle de la Socia</strong>
                    <button className='btn btn-danger' style={{ float: 'right' }} onClick={() => { definirEstado({ distribuidorID: 0 }) }}>X</button>
                </ModalWin.Header>
                <ModalWin.Body>
                    <Persona key="com_admin_distribuidor" TipoPersona={Persona.TipoPersona.Distribuidor} IdPersona={estado.distribuidorID} />
                </ModalWin.Body>
            </ModalWin>

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
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                    <FaFilter className={'mr-2 is-size-7'} />
                    <span className='is-size-7'> Filtrar datos</span>
                </div>
            }>
                <Card.Body>
                    <div className=''>
                        <p className="control has-icons-left mt-2 mr-2 ml-2">

                            <select onChange={async (vl) => {
                                if (vl.target.value !== '0') {

                                    const coordinador = estado.coordinadores.find(c => c.CoordinadorID === parseInt(vl.target.value))
                                    if (coordinador === undefined)
                                        return

                                    // 
                                    await FNIndicador(coordinador, estado.fecha)
                                }
                            }} value={estado.coordinador !== undefined ? estado.coordinador.CoordinadorID : 0} className='form-select'>
                                <option disabled value={0}>Seleccionar</option>
                                {estado.coordinadores.map((c, cId) => <option key={cId} value={c.CoordinadorID}> {c.CoordinadorID} | {c.NombreCompleto}</option>)}
                            </select>
                            {/* <span className="icon is-left ml-2">
                                <i className="fas fa-search" aria-hidden="true"></i>
                            </span> */}
                        </p>
                    </div>
                    {estado.coordinador !== undefined &&
                        <div className='row'>
                            <div className='col-sm-6'>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <span className="panel-icon mr-2">
                                            <FaUser />
                                        </span>
                                        Coordinador: <strong>{estado.coordinador?.NombreCompleto}</strong>
                                    </li>
                                    <li className="list-group-item">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <FaTag size={14} color='#4f4f4f' className='mr-2' />
                                            <p>Productos: {estado.grupos.map((g, gId) => <span key={gId}><strong>{g.Producto}</strong>, {" "}</span>)}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className='col-sm-6'>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <span className="panel-icon mr-2">
                                            <FaStore />
                                        </span>
                                        Sucursal(es):
                                        {estado.grupos.map(m => m.Sucursal).filter((value, index, self) => self.indexOf(value) === index).map((g, gId) => <span key={gId} ><strong>{g}</strong>, </span>)}
                                    </li>
                                    <li className="list-group-item border-bottom">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <FaCalendar size={14} color='#4f4f4f' className='mr-2' />
                                            <DatePicker
                                                onChange={async (stri: any, strf: any) => {

                                                    if (estado.coordinador !== undefined)
                                                        FNIndicador(estado.coordinador, new Date(stri))
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

            {estado.coordinador !== undefined && !estado.cargando && estado.indicadorSP !== undefined &&
                <React.Fragment>
                    <PanelOperador indicador={estado.indicadorSP} distribuidoras090={distribuidoras ?? []} />
                    <TablaCuentas indicador={estado.indicadorSP} definirDistribuidorID={(distribuidorID: number) => definirEstado({ distribuidorID })} />
                    <ResumenCartera indicador={estado.indicadorSP} />
                    <TablaAtraso indicador={estado.indicadorSP} distribuidoras090={distribuidoras ?? []} />
                    <TablaColocacionImproductivas indicador={estado.indicadorSP} distribuidoras090={distribuidoras ?? []} />
                    <TablaIncrementos indicador={estado.indicadorSP} distribuidoras090={distribuidoras ?? []} />
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