import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './ArchivosDeDispercion/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaBan, FaCashRegister, FaListAlt, FaMoneyBill, FaMoneyBillAlt, FaMoneyCheck, FaDollarSign, FaCreditCard } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { BuscarCreditosArchivo } from './ArchivosDeDispercion/BuscarCreditosArchivo'
// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';

import ReactTooltip from 'react-tooltip';
import moment from 'moment'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'
import { Button } from 'react-native'
import { DispersarTarjeta } from './CreditosDispersionH2H/DispersarTarjeta'
import { Field, Form, Formik } from 'formik'
import { iUI } from '../../../../../interfaces/ui/iUI'

type CatalogosType = {
    oidc: IOidc,
    ui: iUI,
}

type EstadoTipo = {
    Datos: DBConfia_Creditos.ICreditos_VW[],
    DatosMostrar: DBConfia_Creditos.ICreditos_VW[],
    DatosDetalle: DBConfia_Creditos.IPlanPagos[],
    DispersionesSeleccionadas: [],
    CantidadDispersionesSeleccionadas: number,
    Filtro: string,
    Cargando: boolean,
    CargandoModal: boolean,
    Error: boolean,
    TipoDesembolsoID: number,
    CheckedSTP: boolean,
    CheckedODP: boolean,
    Form:
    {
        Mostrar: boolean,
        Datos?: DBConfia_Creditos.ICreditos
        ClienteID?: number
    },
    Detalle: boolean,
    ClearSelectedRows: boolean,
}

const ArchivosDedispersionODP = (props: CatalogosType) => {
    let isMounted = React.useRef(true)

    const MySwal = withReactContent(Swal)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const [state, setState] = React.useState<EstadoTipo>({
        CheckedSTP: true,
        CheckedODP: false,
        Datos: [],
        DatosMostrar: [],
        DatosDetalle: [],
        DispersionesSeleccionadas: [],
        CantidadDispersionesSeleccionadas: 0,
        Filtro: '',
        Cargando: false,
        CargandoModal: false,
        Error: false,
        TipoDesembolsoID: 6,
        Form: {
            Mostrar: false,
            Datos: undefined,
            ClienteID: undefined
        },
        Detalle: false,
        ClearSelectedRows: false
    })

    const Columns: IDataTableColumn[] =
        [
            { name: 'Producto', selector: 'Producto', sortable: false, wrap: true, hide: "sm" || "md", center: true },
            { name: 'N° Crédito', selector: 'CreditoID', wrap: true, sortable: false, center: true },
            { name: 'Banco', center: true, selector: 'NombreBancoClabe', wrap: true, sortable: false, cell: (propss) => propss.NombreBancoClabe == null ? <span className='text-center'> Cuenta N/R</span> : <span className='text-center'>{propss.NombreBancoClabe}</span> },
            { name: 'Cuenta', center: true, selector: 'CLABE', wrap: true, sortable: false, cell: (propss) => propss.datoBancario == null ? <span className='text-center'> Cuenta N/R</span> : <span className='text-center'>{formatCardNumber(propss.datoBancario)}</span> },
            //DatoTipoDesc
            { name: 'Tipo Cuenta', selector: 'DatoTipoDesc', sortable: false, wrap: true, center: true, cell: (propss) => propss.DatoTipoDesc == null ? <span className='text-center'> Cuenta N/R</span> : <span className='text-center'>{propss.DatoTipoDesc}</span> },
            {
                name: 'Nombre Cliente', center: true, width: '110px', selector: 'NombreCompleto', sortable: false,
                cell: (props) =>
                    <>
                        <span className='text-center' style={{ whiteSpace: 'nowrap', overflow: 'hidden' }} data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>{props.NombreCompleto}</span>
                        <ReactTooltip id={`NombreCompletoTooltip${props.CreditoID}`}
                            type="dark"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            {props.NombreCompleto}
                        </ReactTooltip>
                    </>
            },
            { center: true, name: 'Total', selector: 'Capital', sortable: false, format: row => formatter.format(row.Capital) },
            { center: true, name: 'Fecha Registro', width: '110px', selector: 'FechaHoraRegistro', sortable: false, cell: (props) => <span className='text-center'>{moment(props.FechaHoraRegistro).format('DD/MM/YYYY')}</span> },
            //  { center: true, name: 'Estatus Disp.', selector: 'EstatusDisp', sortable: false, cell: (props) => <span>PENDIENTE</span> },
            {
                name: 'Acciones', sortable: false, center: true,
                cell: (propss) => <div className='text-center'>
                    <button data-tip data-for={`DetailToolTipE${propss.CreditoID}`} className="asstext mx-1" type={"button"} onClick={() => {
                        dispersarEfectivo(propss.CreditoID, propss.MovimientoID)

                    }}>
                        <FaDollarSign />
                    </button>
                    <ReactTooltip id={`DetailToolTipE${propss.CreditoID}`}
                        type="info"
                        effect="solid"
                        clickable
                        globalEventOff="click"
                    >
                        Dispersar en efectivo
                    </ReactTooltip>
                    {/*  <button disabled={propss.datoBancario == null ? false : true} data-tip data-for={`DetailToolTip${propss.CreditoID}`} className="asstext mx-1" type={"button"} onClick={() => {
                        //state Form.Mostrar = true
                        setState({
                            ...state,
                            Form: {
                                ...state.Form,
                                Mostrar: true,
                                ClienteID: propss.ClienteID,
                            }
                        })
                    }}>
                        <FaCreditCard />
                    </button>
                    <ReactTooltip id={`DetailToolTip${propss.CreditoID}`}
                        type="info"
                        effect="solid"
                        clickable
                        globalEventOff="click"
                    >
                        {propss.datoBancario == null && "Desembolsar a tarjeta de débito"}
                        {propss.datoBancario != null && "Cliente cuenta con CLABE registrada"}
                    </ReactTooltip> */}
                </div>
            },
        ]

    React.useEffect(() => {
        if (isMounted.current === true) {
            // FNGetLocal()
        }
        return () => {
            isMounted.current = false
        }
        // @eslint-disable-next-line
    }, [])




    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    const cbRespuesta = (Datos: any) =>
        setState(s => ({ ...s, Datos: Datos, Cargando: false }))

    const funcionCargando = (cargando: any) => {
        //Seteo el estado de cargando
        setState({ ...state, Cargando: cargando })
    }
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    // const [data, setData] = React.useState(tableDataItems);

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
        console.log(selectedRows)
    }, []);

    const dispersarEfectivo = (creditoId: any, movimientoId: any) => {
        MySwal.fire({
            title: '<strong>Dispersar en efectivo</strong>',
            icon: 'warning',
            html:
                <div className="text-center">
                    <br />
                    <span className='text-center'>¿Cambiar y autorizar dispersión del crédito <strong>Nro {creditoId}</strong> en efectivo?</span>
                </div>,
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            focusCancel: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
            cancelButtonAriaLabel: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        })
            .then((result) => {
                if (result.isConfirmed) {
                    let a = {
                        CreditoID: creditoId,
                        MovimientoID: movimientoId
                    }
                    Funciones.FNDispersarEfectivo(props.oidc, a)
                        .then((respuesta: any) => {
                            if (isMounted.current === true) {
                                toast.success("Crédito dispersado en efectivo")
                                let index = state.Datos.findIndex(x => x.CreditoID === creditoId);
                                if (index !== -1) {
                                    state.Datos.splice(index, 1);
                                }
                                setToggleCleared(!toggleCleared);
                                setState({ ...state, Datos: state.Datos, DatosMostrar: state.Datos })
                            }
                        })
                        .catch(() => {
                            if (isMounted.current === true) {
                                toast.error("Error al realizar la operación")
                            }
                        })
                } else {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center"><strong>Aviso</strong></h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Ok`,
                            confirmButtonAriaLabel: `Ok`,
                            confirmButtonColor: `#3085d6`,
                        }
                    );
                }
            })

    }

    const contextActions = React.useMemo(() => {

        const handleClick = () => {
            let total = 0;
            selectedRows.forEach(element => {
                total = total + 1
            });
            MySwal.fire({
                title: '<strong>Dispersión de créditos</strong>',
                icon: 'info',
                html:
                    <div className="text-center">
                        <br />
                        Se dispersarán un total de <strong>{total}</strong> créditos, ¿desea continuar?.
                    </div>,
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                focusCancel: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                confirmButtonAriaLabel: 'Aceptar',
                cancelButtonAriaLabel: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed) {
                    MySwal.fire({
                        title: '<strong>Dispersión de créditos</strong>',
                        icon: 'warning',
                        html:
                            <div className="text-center">
                                <br />
                                Total de {total} crédito/s seleccionado/s para dispersión, ¿confirmar?.
                                <br /> <br /><h5><strong style={{ color: 'red' }}>Nota: Esta acción no se puede cancelar ni revertir.</strong></h5>
                            </div>,
                        showCloseButton: false,
                        showCancelButton: true,
                        showConfirmButton: true,
                        focusCancel: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Aceptar',
                        confirmButtonAriaLabel: 'Aceptar',
                        cancelButtonAriaLabel: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Dispersando créditos en progreso...</h5>
                                        </div>
                                    </div>,
                                    timerProgressBar: true,
                                    allowEscapeKey: false,
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    showCancelButton: false,
                                    showCloseButton: false,
                                    didOpen: () => {
                                        MySwal.showLoading()
                                    },

                                }
                            );
                            let a = {
                                Dispersiones: selectedRows
                            }
                            Funciones.FNDispersar(props.oidc, a)
                                .then((respuesta: any) => {
                                    if (isMounted.current === true) {
                                        respuesta.Dispersiones.forEach(element => {
                                            let index = state.Datos.findIndex(x => x.CreditoID === element.CreditoID);
                                            if (index !== -1) {
                                                state.Datos.splice(index, 1);
                                            }
                                        })
                                        setToggleCleared(!toggleCleared);
                                        setState({ ...state, Datos: state.Datos, DatosMostrar: state.Datos })
                                        MySwal.close();
                                        MySwal.fire({
                                            icon: 'success',
                                            title: '<strong>Dispersión de créditos</strong>',
                                            html:
                                                <div className="text-center">
                                                    <br />
                                                    <h5>Se dispersaron <strong>{respuesta.DispersionesRegistradas} </strong> créditos de <strong>{respuesta.DispersioneRecibidas}</strong> solicitados.</h5>
                                                </div>,
                                            showCloseButton: false,
                                            showCancelButton: false,
                                            showConfirmButton: true,
                                            focusCancel: true,
                                            confirmButtonText: 'Aceptar',
                                            confirmButtonAriaLabel: 'Aceptar',
                                            confirmButtonColor: '#3085d6',
                                        })
                                    }
                                })
                                .catch(() => {
                                    if (isMounted.current === true) {
                                        toast.error("Error al realizar la operación")
                                        MySwal.close();
                                    }
                                })
                        } else {
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                        </div>
                                    </div>,
                                    cancelButtonText: 'Cancelar',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonAriaLabel: 'Aceptar',
                                    cancelButtonAriaLabel: ''
                                }
                            );
                        }
                    })
                } else {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#3085d6',
                            confirmButtonAriaLabel: 'Aceptar',
                            cancelButtonAriaLabel: ''
                        }
                    );
                }
            })

        }

        return (
            <button data-tip data-for="TT1_1" style={{ backgroundColor: '#28a745', color: 'white' }}
                type="button" className="ms-2 btn waves-effect waves-light" onClick={handleClick}>
                <FaDollarSign />  Dispersar créditos seleccionados
            </button>
        );
    }, [selectedRows]);

    const handleSelectDispersion = (item: any) => {
        state.CantidadDispersionesSeleccionadas = item.selectedCount
        state.DispersionesSeleccionadas = item.selectedRows
        setState({ ...state, DispersionesSeleccionadas: state.DispersionesSeleccionadas, CantidadDispersionesSeleccionadas: state.CantidadDispersionesSeleccionadas })

    }
    const disableRow = (item: any) => {
        if (item.datoBancario == null || item.DispersionID > 0 && item.EstadoID != 'A') {
            return true
        } else {
            return false
        }
    }

    //Convert sring to card number format
    const formatCardNumber = (cardNumber: string) => {
        return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Dispersar créditos por archivo de lotes ODP (Ordenes de pago)  ">
                    <Card.Body>
                        <Card.Body.Content>
                            <div>
                                <div className="conteiner">
                                    <Formik
                                        initialValues={state.Datos}
                                        enableReinitialize
                                        onSubmit={(values: any) => {
                                        }}>
                                        <Form>
                                            <div className='row'>

                                            </div>
                                        </Form>
                                    </Formik>
                                    <BuscarCreditosArchivo
                                        funcionCargando={funcionCargando}
                                        oidc={props.oidc}
                                        ui={props.ui}
                                        initialValues={
                                            {
                                                ProductoID: 0,
                                                ClienteID: 0,
                                                SucursalID: 0,
                                                ZonaID: 0,
                                                EmpresaID: 0,
                                                DistribuidorID: 0,
                                                CoordinadorID: 0,
                                                ContratoID: 0,
                                                EstatusID: 'P',
                                                DistribuidorNivelID: 0,
                                                FechaInicio: moment().add(-30, 'd').toDate(),
                                                FechaFin: new Date(),
                                                TipoDesembolsoID: state.TipoDesembolsoID
                                            }
                                        }
                                        cbRespuesta={cbRespuesta}
                                    />

                                </div>
                                {!state.Cargando && !state.Error && <DataTable
                                    subHeader

                                    contextActions={contextActions}
                                    clearSelectedRows={toggleCleared}
                                    onSelectedRowsChange={handleRowSelected}
                                    //onSelectedRowsChange={(rows: any) => handleSelectDispersion(rows)}
                                    paginationComponentOptions={{
                                        noRowsPerPage: false, rowsPerPageText: 'Créditos por página',
                                        rangeSeparatorText: 'de',
                                        selectAllRowsItem: false,
                                        selectAllRowsItemText: 'Todos',
                                    }}
                                    contextMessage={{ singular: '- Crédito seleccionado', plural: '- Créditos seleccionados', message: 'para dispersar' }}
                                    /*   selectableRowDisabled={(row: any) => disableRow(row)} */
                                    selectableRows
                                    //selectableRowsComponent={<div>ssss</div>}
                                    noDataComponent={<div>No hay datos</div>}
                                    title={<span>Lista de créditos</span>}
                                    /* customStyles={
                                        {
                                            rows: {
                                                style: {
                                                    minHeight: '72px',
                                                    height: '72px',
                                                    borderBottom: '1px solid #E1E1E1',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                    fontSize: '14px',
                                                    fontWeight: 'normal',
                                                    fontFamily: 'Open Sans',
                                                    padding: '0px',
                                                    margin: '0px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    boxSizing: 'border-box',
                                                    borderTop: '1px solid #E1E1E1',
                                                    borderLeft: '1px solid #E1E1E1',
                                                    borderRight: '1px solid #E1E1E1',
                                                    borderRadius: '0px',
                                                }
                                            },
                                        }
                                    } */
                                    subHeaderComponent=
                                    {
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="input-group mb-3">
                                                    <input type="text" className="form-control" placeholder="Buscar crédito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                    <span className="input-group-text"><FaSearch /> </span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    data={state.DatosMostrar}
                                    striped
                                    pagination
                                    dense
                                    responsive
                                    keyField={"CreditoID"}
                                    defaultSortField={"CreditoID"}
                                    columns={Columns}

                                />}
                                <ModalWin center open={state.Form.Mostrar}>
                                    <ModalWin.Header>
                                        <h5 className={MODAL_TITLE_CLASS}>
                                            {"Dispersar a tarjeta de débito"}
                                        </h5>
                                    </ModalWin.Header>
                                    <ModalWin.Body>
                                        <DispersarTarjeta
                                            CargandoModaL={state.CargandoModal}
                                            ClienteID={state.Form.ClienteID}
                                            Seguridad={props.oidc}
                                            initialValues={{}}
                                        />
                                    </ModalWin.Body>
                                </ModalWin>
                            </div>

                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    //ui: state.ui
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ArchivosDedispersionODP)