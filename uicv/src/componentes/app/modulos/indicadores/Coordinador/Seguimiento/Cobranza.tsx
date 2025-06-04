import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
// Interfaces
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import { FaFilter, FaList } from 'react-icons/fa'
import { Card } from '../../../../../global'
// Componentes con las graficas
import ResumenQuincenaVigentes from './Cobranza/ResumenQuincenaVigentes'
import ComparativaContraQuincena from './Cobranza/ComparativaContraQuincena'
import { Form, Formik } from 'formik'
import { Distribuidores, Grupos } from '../../../../../selectores'
// Consulta al 1549
import * as FuncionReporte from '../../../creditos/CompCreditos/CreditoDistPagosVencimiento/Funciones'
import * as FuncionCoordinadores from '../../Funciones'
import * as FuncionTipoUsuario from '../../../general/CompGeneral/FiltroPorUsuario/Funciones'
import { Spinner } from '../../../../../global'
import SemaforoCobranza from './Cobranza/SemaforoCobranza';
import CumpleanosSocias from './Cobranza/CumpleanosSocias'
import moment from 'moment'
import { addOneDay, addSevenDay } from '../../../../../../global/functions'

/**
 * Panel para coordinadores
 * @param props Propiedades para conexion con el servidor
 * @returns {React.ReactElement} Componente de react
 * 
 * 
 * Se hizo un cambio en el nombre de la tabla/semaforo :
 * Impuntual --> Tadia
 * Tardia -----> Final
 * 
 * 
 */
const Cobranza = (props: { oidc: IOidc, ui: iUI, grupoId?: number }) => {
    let params = useParams<{ productoId: string, grupoId: string }>();

    const [state, setState] = useState({
        loading: true,
        sumSaldoActual: 0,
        Pactado: 0,
        GrupoID: 0,
        SucursalID: 0,
        tipoUsuario: 0,
        ProductoID: 0,
        GrupoPredeterminado: false,
        data: [{ DistribuidorID: 0, Distribuidor: '', SaldoActual: 0, Anticipada: 0, Pura: 0, Normal: 0, Tardia: 0, PFinal: 0, saldoVencidoTotal: 0 }],
        data2: [{ DistribuidorID: 0, Distribuidor: '', Pendiente: 0, Peso: 0 }],
        data2Liquidados: [{ DistribuidorID: 0, Distribuidor: '', Pendiente: 0, Peso: 0 }],
        data3: [{ DistribuidorID: 0, Distribuidor: '', FechaCumple: '' }],
        comparativaData: {
            arrayVigente: [{}],
            arrayPasado: [{}]
        },
        comparativaSemaforo: {
            Anticipada: [{}],
            Puntual: [{}],
            Tardia: [{}],
            Final: [{}],
            Mora: [{}],
        },
        fecha: ""
    });
    const [tipoUsuario, setTipoUsuario] = useState(0);
    const [sucursal, setSucursal] = useState(0);
    const [loading, setLoading] = useState(false)
    const fnGetFechaCortes = (SucursalID: number) => {
        FuncionReporte.FNGetFechaCorte(props.oidc, SucursalID)
            .then((respuesta: any) => {

                setState(s => ({
                    ...s,
                    fecha: respuesta.fechaCorte,
                    // Form: {
                    //     ...s.Form,
                    //     fecha: fechacortes[0].value
                    // }
                }))
            })
            .catch(() => {
                setState(s => ({ ...s, optFechasCortes: [] }))
            })
    }

    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Nombre de la socia',
                    selector: 'Distribuidor',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Distribuidor}</span>
                },
                {
                    name: 'ID',
                    selector: 'DistribuidorID',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.DistribuidorID}</span>
                },
                {
                    name: 'Pendiente',
                    selector: 'Pendiente',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Pendiente.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: 'Peso %',
                    selector: 'Peso',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{(props.Peso == 0 ? '0.0001%' : props.Peso + '%')}</span>
                }
            ]
        return colRet
    }, [state.data2])

    const ColumnsLiquidados = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Nombre de la socia',
                    selector: 'Distribuidor',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Distribuidor}</span>
                },
                {
                    name: 'ID',
                    selector: 'DistribuidorID',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.DistribuidorID}</span>
                },
                {
                    name: 'Liquidado',
                    selector: 'Pendiente',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Pendiente.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: 'Peso %',
                    selector: 'Peso',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{(props.Peso == 0 ? '0.0001%' : props.Peso + '%')}</span>
                }
            ]
        return colRet
    }, [state.data2Liquidados])

    async function getInfo(values) {
        setLoading(true)
        const GrupoIDAux = !isNaN(values.GrupoID) ? values.GrupoID as number : 0;
        const DistribuidorIDAux = !isNaN(values.DistribuidorID) ? values.DistribuidorID as number : 0;
        /*   if (!Boolean(GrupoIDAux)) {
              toast.warning("Selecciona un grupo")
              return;
          }
          setState(s => ({
              ...s,
              loading: true
          }));
   */
        // const response1549: any = await FuncionReporte.FNReporte1549(props.oidc, { DistribuidorID: DistribuidorIDAux, GrupoID: GrupoIDAux });
        const responseSociasPendientes: any = await FuncionReporte.FNReporteSociasPendientes(props.oidc, { DistribuidorID: DistribuidorIDAux, GrupoID: GrupoIDAux, SucursalID: sucursal });
        // const responseSociasLiquidadas: any = await FuncionReporte.FNReporteSociasLiquidadas(props.oidc, { DistribuidorID: DistribuidorIDAux, GrupoID: GrupoIDAux });
        const responseCumpleSocias: any = await FuncionCoordinadores.FNCumpleaniosSocias(props.oidc, { GrupoID: GrupoIDAux, SucursalID: sucursal });
        const responseComparativa: any = await FuncionCoordinadores.FNComparativoContraQuincena(props.oidc, { DistribuidorID: DistribuidorIDAux, GrupoID: GrupoIDAux, SucursalID: sucursal });
        const responseSemaforo: any = await FuncionReporte.FNReporteSemaforo(props.oidc, { DistribuidorID: DistribuidorIDAux, GrupoID: GrupoIDAux, SucursalID: sucursal });


        if (Boolean(responseComparativa) && Boolean(responseSociasPendientes) && Boolean(responseSemaforo) && Boolean(responseCumpleSocias)) {
            setState(s => ({ ...s, loading: false, comparativaData: responseComparativa, data3: responseCumpleSocias, comparativaSemaforo: responseSemaforo, GrupoPredeterminado: Boolean(values.GrupoPredeterminado), data2: responseSociasPendientes, GrupoID: GrupoIDAux }));
            setLoading(false)
            return;
        }
        setState(s => ({ ...s, loading: false, data: [], data2: [], data2Liquidados: [], GrupoID: GrupoIDAux, Pactado: 1, sumSaldoActual: 1, GrupoPredeterminado: Boolean(values.GrupoPredeterminado), comparativaData: { arrayPasado: [], arrayVigente: [] }, data3: [], comparativaSemaforo: { Anticipada: [], Puntual: [], Tardia: [], Final: [], Mora: [], } }))
        setLoading(false)
    }

    const GetRolUsuario = () => {
        FuncionTipoUsuario.FNGetTipoUsuario(props.oidc)
            .then((respuesta: any) => {
                setTipoUsuario(respuesta.tipoUsuario)
                setSucursal(respuesta.SucursalID)
                switch (respuesta.tipoUsuario) {
                    case 3:
                        state.SucursalID = respuesta.SucursalID;
                        state.ProductoID = parseInt(params.productoId);
                        break;
                    case 4:
                        state.SucursalID = respuesta.SucursalID;
                        state.ProductoID = parseInt(params.productoId);
                        state.GrupoID = respuesta.GrupoID;
                        break;
                }
                if (params.grupoId && respuesta.GrupoID) getInfo({ DistribuidorID: 0, GrupoID: params.grupoId, GrupoPredeterminado: true })
                else if (Boolean(respuesta.GrupoID)) getInfo({ DistribuidorID: 0, GrupoID: respuesta.GrupoID, GrupoPredeterminado: true })

            })
            .catch(() => { })
            .finally(() => setState(s => ({
                ...s,
                loading: false
            })))

        fnGetFechaCortes(1)
    }
    useEffect(() => {
        GetRolUsuario();
    }, [tipoUsuario, sucursal])
    /*   useEffect(() => {
          fnGetFechaCortes(0);
      }) */


    return (
        <div>
            <h4>Detalle del tablero</h4>
            <Card Title={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center', flexWrap: 'wrap' }}>
                    <FaFilter className={'mr-2 is-size-7'} />
                    <span className='is-size-7'> Filtrar datos </span>
                </div>
            }>
                <Card.Body>
                    <Formik
                        initialValues={{ GrupoID: state.GrupoID }}
                        enableReinitialize
                        onSubmit={async (values) => {
                            getInfo(values);
                        }}
                    >
                        {({ values }) => (
                            <Form>
                                <div className="columns">
                                    <div className="column is-full-mobile is-full-tablet is-full-desktop">
                                        {!state.loading &&
                                            <Grupos oidc={props.oidc} ProductoID={props.ui.Producto?.ProductoID ?? 0} disabled={state.loading || Number.isInteger(parseInt(params.grupoId)) || state.GrupoPredeterminado} SucursalID={isNaN(sucursal) ? 0 : sucursal} cargar name='GrupoID' Permiso={tipoUsuario >= 4 ? false : true} />
                                        }
                                    </div>
                                </div>
                                <button disabled={state.loading} className='btn btn-success' type="submit">Buscar</button>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>

            <Card Title={
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <FaList className={'mr-2 is-size-7'} />
                    <span className='is-size-7 has-text-weight-semibold'>Informaci&oacute;n</span>
                </div>
            }>
                {loading && <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}> <br /> <Spinner /></div>}
                {state.data2[0]?.DistribuidorID !== 0 &&
                    <Card.Body>
                        <ResumenQuincenaVigentes oidc={props.oidc} data={state.data2} loading={state.loading} Grupo={state.GrupoID} ProductoID={params.productoId} Fecha={state.fecha} SucursalID={sucursal} />
                        <DataTable
                            subHeader
                            subHeaderComponent={
                                <div style={{ width: "100%" }}>
                                    <h3 style={{ textAlign: "center" }}>Datos de socias pendientes del corte vigente {state.fecha ? moment(addOneDay(new Date(state.fecha))).format('DD-MM-YYYY') : ''}</h3>
                                </div>
                            }
                            columns={Columns}
                            data={state.data2}
                            pagination
                            key={'Coordinador'}
                            paginationComponentOptions={{
                                noRowsPerPage: false, rowsPerPageText: 'Socias por página',
                                rangeSeparatorText: 'de',
                                selectAllRowsItem: false,
                                selectAllRowsItemText: 'Todos',
                            }}
                        />
                        {/*    <DataTable
                            subHeader
                            subHeaderComponent={
                                <div style={{ width: "100%" }}>
                                    <h3 style={{ textAlign: "center" }}>Datos de socias liquidadas del corte vigente {state.fecha ? moment(addOneDay(new Date(state.fecha))).format('DD-MM-YYYY') : ''}</h3>
                                </div>
                            }
                            columns={ColumnsLiquidados}
                            data={state.data2Liquidados}
                            noDataComponent='No hay socias liquidadas'
                            pagination
                            key={'Coordinador'}
                            paginationComponentOptions={{
                                noRowsPerPage: false, rowsPerPageText: 'Socias por página',
                                rangeSeparatorText: 'de',
                                selectAllRowsItem: false,
                                selectAllRowsItemText: 'Todos',
                            }}
                        />  */}
                    </Card.Body>

                }

                {state.data2[0]?.DistribuidorID !== 0 &&
                    <Card.Body>

                        <ComparativaContraQuincena data={state.comparativaData} loading={state.loading} />
                        <SemaforoCobranza data={state.comparativaSemaforo} loading={state.loading} />
                        <CumpleanosSocias data={state.data3} />
                    </Card.Body>

                }
            </Card>
        </div >
    )
}

const mapStateToProps = (estado: IEstado) => ({
    ui: estado.UI,
    oidc: estado.oidc
})

export default connect(mapStateToProps)(Cobranza)