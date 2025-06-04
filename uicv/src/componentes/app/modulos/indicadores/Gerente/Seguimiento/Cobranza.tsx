import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
// Interfaces
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import { FaFilter, FaList } from 'react-icons/fa'
import { Card, ModalWin } from '../../../../../global'
// Componentes con las graficas
import { Form, Formik } from 'formik'
import { Grupos, Sucursales } from '../../../../../selectores'
// Consulta al 1549
import * as FuncionReporte from '../../../creditos/CompCreditos/CreditoDistPagosVencimiento/Funciones'
import * as Funcion from '../../Funciones'
import { toast } from 'react-toastify'
import {Spinner} from '../../../../../global'
import Chart from 'react-apexcharts';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import TableSeguimientoCobranzaGerente from './Cobranza/TableSeguimientoCobranzaGerente'
import DetalleSociasPendientes from './Cobranza/DetalleSociasPendientes';
import ComparativaContraCorte from './Cobranza/ComparativoContraCorte'
import ComparativaContraQuincena from './Cobranza/ComparativoContraQuincena'
import ReactTooltip from 'react-tooltip'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import CobranzaCoordinador from '../../Coordinador/Seguimiento/Cobranza'
import Select from 'react-select'
import * as FuncionTipoUsuario from '../../../general/CompGeneral/FiltroPorUsuario/Funciones'
import * as Funciones from '../../Funciones'

/**
 * Panel para coordinadores
 * @param props Propiedades para conexion con el servidor
 * @returns {React.ReactElement} Componente de react
 */
const Cobranza = (props: { oidc: IOidc, ui: iUI }) => {
    let params = useParams<{ productoId: string, grupoId: string, sucursalId: string, }>();

    const [state, setState] = useState({
        loading: true,
        data: [{ CoordinadorID: 0, Coordinador: '', Pactado: 0, Anticipada: 0, Puntual: 0, Tardia: 0, Final: 0}],
        dataSociasPendientes: [{ CoordinadorID: 0, Coordinador: '', DistribuidorID: 0, Distribuidor: '', Pendiente: 0, Porcentaje: 0}],
        dataDetalleSociasPendientes: [{}],
        dataSumaTotal: { Pactado: 0, Anticipada: 0, Puntual: 0, Tardia: 0, Final: 0},
        sociasPendientes: 0,
        dataComparativo: {
            arrayVigente: [{}],
            arrayPasado: [{}],
        },
        SucursalID: 0,
        GrupoID: 0,
        SucursalID2: 0,
        ProductoID:0,
        tipoUsuario: 0,
        showModal: false,
        GrupoPredeterminado: false,
    });
    const [tipoUsuario, setTipoUsuario] = useState(0);
    const [loading, setLoading] = useState(false)

    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Coordinador',
                    selector: "Coordinador",
                    sortable: true,
                    center: true,
                    cell: (props) =>
                        <>
                            <button
                                onClick={() => {
                                    setState(s => ({ ...s, GrupoID: props.GrupoID, showModal: true }));
                                }}
                                className='btn btn-text' data-tip data-for={'tooltip'} style={{ color: "#000000" }}>
                                {props.Coordinador} - Grupo ID {props.GrupoID}
                            </button>
                            <ReactTooltip
                                id='tooltip'
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Ir al detalle del coordinador
                            </ReactTooltip>
                        </>
                },
                {
                    name: 'Socias pendientes',
                    selector: "SociasPendientes",
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.SociasPendientes}</span>
                },
                {
                    name: 'Saldo Pendiente',
                    selector: "Pendiente",
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{(props.Pendiente)?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: '% Pendiente',
                    selector: "Porcentaje",
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{(props.Porcentaje)?.toLocaleString('en-US')}%</span>
                }
            ]
        return colRet
    }, [state.data])

    async function getInfo(values) {
        setLoading(true)
        const GrupoIDAux = !isNaN(values.GrupoID) ? values.GrupoID as number : 0;
        const SucursalIDAux = !isNaN(values.SucursalID) ? values.SucursalID as number : 0;
        /*setState(s => ({
            ...s,
            loading: true
        }));*/
        console.log('sucursalIDAux',SucursalIDAux)
        state.GrupoID = GrupoIDAux;
        SucursalIDAux == 0 ? state.SucursalID = state.SucursalID2 : state.SucursalID = SucursalIDAux;

        const response1549: any = await Funcion.FNResumenQuincenaVigentesGerente(props.oidc, { ProductoID: props.ui.Producto?.ProductoID ?? 0, GrupoID: GrupoIDAux, SucursalID: state.SucursalID });
        const responseSociasPendientes: any = await Funcion.FNSociasPendientesGerente(props.oidc, { ProductoID: props.ui.Producto?.ProductoID ?? 0, GrupoID: GrupoIDAux, SucursalID: state.SucursalID });
        const responseDetalleSociasPendientes: any = await FuncionReporte.FNDetalleSociasPendientes(props.oidc, { ProductoID: props.ui.Producto?.ProductoID ?? 0, SucursalID: state.SucursalID, GrupoID: GrupoIDAux })
        const responseComparativo: any = await Funciones.FNComparativoContraQuincenaGerente(props.oidc, { SucursalID: state.SucursalID, GrupoID: GrupoIDAux, ProductoID: props.ui.Producto?.ProductoID ?? 0});

        if (Boolean(response1549) && Boolean(responseSociasPendientes) && Boolean(responseDetalleSociasPendientes) && Boolean(responseComparativo)) {
            const obj = { Pactado: 0, Anticipada: 0, Puntual: 0, Tardia: 0, Final: 0};

            response1549.map((element) => {
                obj.Pactado += element.Pactado;
                obj.Anticipada += element.Anticipada;
                obj.Puntual += element.Puntual;
                obj.Tardia += element.Tardia;
                obj.Final += element.Final;
            })
            obj.Pactado = obj.Pactado == 0 ? 1 : obj.Pactado;

            setState(s => ({ ...s, loading: false,dataComparativo:responseComparativo, dataDetalleSociasPendientes:responseDetalleSociasPendientes, data: response1549,dataSociasPendientes:responseSociasPendientes, dataSumaTotal: obj, SucursalID: SucursalIDAux, GrupoID: GrupoIDAux, GrupoPredeterminado: Boolean(values.GrupoDeterminado), }));
            setLoading(false)
            return;
        }

        setState(s => ({ ...s, loading: false,dataComparativo:{ arrayVigente: [], arrayPasado: [] }, DetalleSociasPendientes:[], data: [],dataSociasPendientes:[], sumSaldoActual: 1,GrupoPredeterminado: Boolean(values.GrupoPredeterminado),  SucursalID: SucursalIDAux, GrupoID: GrupoIDAux }))

        setLoading(false)
    }

    //useEffect(() => { setState(s => ({ ...s, loading: false })) }, [])
    const GetRolUsuario = () => {
        FuncionTipoUsuario.FNGetTipoUsuario(props.oidc)
            .then((respuesta: any) => {
                setTipoUsuario(respuesta.tipoUsuario)
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
                if (params.grupoId && respuesta.GrupoID) getInfo({ SucursalID: params.sucursalId, GrupoID: params.grupoId, GrupoPredeterminado: true })
                else if (Boolean(respuesta.GrupoID)) getInfo({ SucursalID: respuesta.SucursalID, GrupoID: respuesta.GrupoID, GrupoPredeterminado: true })
            })
            .catch(() => { })
            .finally(() => setState(s => ({
                ...s,
                loading: false
            })))

    }

    useEffect(() => {
        GetRolUsuario();
    }, [tipoUsuario])

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
                        initialValues={{ SucursalID: state.SucursalID, GrupoID: state.GrupoID }} 
                        enableReinitialize
                        onSubmit={async (values) => {
                            getInfo(values)
                        }}
                    >
                        {({ values }) => (
                            <Form>
                                <div className="columns">
                                    <div className="column is-full-mobile is-6-tablet is-6-desktop">
                                        {!state.loading && <Sucursales name='SucursalID' valor={values.SucursalID} ProductoID={props.ui.Producto?.ProductoID ?? 0} disabled={state.loading || Number.isInteger(params.sucursalId) || tipoUsuario>=3} />}
                                    </div>
                                    <div className="column is-full-mobile is-6-tablet is-6-desktop">
                                       {!state.loading && <Grupos oidc={props.oidc} ProductoID={props.ui.Producto?.ProductoID ?? 0} disabled={state.loading || Number.isInteger(parseInt(params.grupoId)) || state.GrupoPredeterminado || tipoUsuario>=4} SucursalID={isNaN(state.SucursalID) ? 0 : state.SucursalID} cargar name='GrupoID' Permiso={tipoUsuario>= 4 ? false : true} />
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
                    <span className='is-size-7 has-text-weight-semibold'>Seguimiento de cobranza quincenal, detalle a nivel coordinador</span>
                </div>
            }>
                 {loading &&  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                 }}> <br /> <Spinner/></div> }
            <ModalWin open={state.showModal} full={true}>
                <ModalWin.Header>
                    <h2 className={MODAL_TITLE_CLASS}>
                        Detalles del coordinador
                    </h2>
                    <button type="button" style={{ marginRight: 15 }} className="delete" onClick={() => { setState(s => ({ ...s, showModal: false })) }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div className="row">
                        <div className="col-12">
                            {!state.loading && <CobranzaCoordinador grupoId={state.GrupoID} />}
                        </div>
                    </div>
                </ModalWin.Body>
            </ModalWin>

                {state.data[0]?.CoordinadorID !== 0 &&
                <Card.Body>
                    {/* TABLA DE SEGUIMIENTO DE COBRANZA */}
                    <TableSeguimientoCobranzaGerente data={state.data} />
                    {/* GRAFICAS Y TABLA */}
                    <div className='columns is-centered'>
                        <div className='column is-full-mobile is-6-tablet is-5-desktop'>
                            <Chart
                                options={{
                                    title: {
                                        text: "Gráfica de seguimiento de cobranza"
                                    },
                                    chart: {
                                        width: '50%',
                                        type: 'pie',
                                    },
                                    colors: ['#2E93fA', '#66DA26', '#546E7A', '#FF9800', '#FF0000'],
                                    labels: ['Anticipada', 'Puntual', 'Tardia', 'Final', 'Pendiente'],
                                    responsive: [{
                                        breakpoint: 480,
                                        options: {
                                            chart: {
                                                width: '100%',
                                            },
                                            legend: {
                                                position: 'bottom'
                                            },
                                        }
                                    }],
                                    dataLabels: {
                                        formatter: function (val: number) {
                                            return val.toFixed(2) + '%'
                                        }
                                    },
                                }}
                                series={[
                                    state.dataSumaTotal.Anticipada,
                                    state.dataSumaTotal.Puntual,
                                    state.dataSumaTotal.Tardia,
                                    state.dataSumaTotal.Final,
                                    ((state.dataSumaTotal.Pactado - (state.dataSumaTotal.Anticipada + state.dataSumaTotal.Puntual + state.dataSumaTotal.Tardia + state.dataSumaTotal.Final)) < 0
                                    ? 0 : (state.dataSumaTotal.Pactado - (state.dataSumaTotal.Anticipada + state.dataSumaTotal.Puntual + state.dataSumaTotal.Tardia + state.dataSumaTotal.Final)))
                                ]}
                                type="pie"
                                width="380"
                                height="380"
                            />
                        </div>
                        {state.dataSociasPendientes && <div className='column is-narrow is-full-mobile is-6-tablet is-7-desktop'>
                            <DataTable
                                subHeader
                                subHeaderComponent={
                                    <div style={{ width: "100%" }}>
                                        <h3 style={{ textAlign: "center", marginTop: 5 }}>Resumen de socias pendientes de cobro por coordinador</h3>
                                    </div>
                                }
                                noDataComponent={<h6>No hay socias pendientes</h6>}
                                columns={Columns}
                                data={state.dataSociasPendientes}
                                pagination
                                striped
                                key={'GrupoID'}
                                paginationComponentOptions={{
                                    noRowsPerPage: false, rowsPerPageText: 'Socias por página',
                                    rangeSeparatorText: 'de',
                                    selectAllRowsItem: false,
                                    selectAllRowsItemText: 'Todos',
                                }}
                            />
                            
                        </div>}
                        
                    </div>
                    
                    {/* Tabla de resumen de socias pendientes de cobro por coordinador */}
                    {state.data[0]?.Coordinador && <DetalleSociasPendientes oidc={props.oidc} ProductoID={parseInt(params.productoId)} GrupoID={state.GrupoID} SucursalID={state.SucursalID} loading={state.loading} data={state.dataDetalleSociasPendientes} />}
                    {state.data[0]?.Coordinador && <ComparativaContraCorte oidc={props.oidc} ProductoID={parseInt(params.productoId)} GrupoID={state.GrupoID} loading={state.loading} data={state.dataComparativo} />}
                    {/* {state.data[0]?.Coordinador && <ComparativaContraQuincena oidc={props.oidc} ProductoID={parseInt(params.productoId)} GrupoID={state.GrupoID} loading={state.loading} />} */}
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