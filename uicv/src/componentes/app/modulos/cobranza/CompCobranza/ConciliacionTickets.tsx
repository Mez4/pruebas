import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './ConciliacionTickets/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaBan, FaCashRegister, FaListAlt, FaMoneyBill, FaMoneyBillAlt, FaMoneyCheck, FaDollarSign, FaCreditCard, FaPrint } from 'react-icons/fa'

// Custom components
import { ActionSelect, Card, CustomSelect, DatePickeEnd, DatePickeStart, Spinner } from '../../../../global'

// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';
import DatePicker, { registerLocale } from "react-datepicker"
import * as Yup from 'yup'
import ReactTooltip from 'react-tooltip';
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { DBConfia_STP } from '../../../../../interfaces_db/DBConfia/STP'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { FormateoDinero } from '../../../../../global/variables'
import { iUI } from '../../../../../interfaces/ui/iUI'
import XLSX from 'xlsx';
import { toast } from 'react-toastify'
import { DBConfia_Cobranza } from '../../../../../interfaces_db/DBConfia/Cobranza'

type CatalogosType = {
    oidc: IOidc,
    ui: iUI,
    Filtro2: boolean,

    initialValues: {
        CuentaOrdenante: number,
        NombreOrdenante: string,
        Estatus: string,
        TipoCuenta: number,
        Cliente: string,
    },
    Options: { value: number, label: string }[],
    fnPrinting(loading: boolean): any,
    DatosExcel: any[],

}

type EstadoTipo = {
    Datos: DBConfia_Cobranza.IPorCobrar[],
    Datos2: DBConfia_Cobranza.ITicketsConciliacion[],
    DatosMostrar: DBConfia_Cobranza.IPorCobrar[],
    DispersionesSeleccionadas: [],
    CantidadDispersionesSeleccionadas: number,
    optEstatus,
    otpTipoCuenta,

    optCuentasOrdenantes4,
    optNombresOrdenandes,
    optDistribuidor,
    DatosTabla,
    DatosExcel: any[]
    DatosExcel2: any[]
    FiltroEncargado: number,
    Filtro2: boolean,
    DatosFormik: {
        fechaInicial: "",
        //fechaFinal = format today date to YYYY-MM-DD to string
        fechaFinal: "",
        SucursalID: 0,
        EstatusSolicitudID: 0,
        EstatusClave: ""
    },
    Filtro: string,
    Cargando: boolean,
    Error: boolean,
    Detalle: boolean,
    RespRes: boolean,
    Form:
    {
        Mostrar: boolean,
    },

}

const ConciliacionTickets = (props: CatalogosType) => {
    let isMounted = React.useRef(true)


    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const [state, setState] = React.useState<EstadoTipo>({

        Datos: [],
        Datos2: [],
        DatosMostrar: [],
        optEstatus: [],
        optDistribuidor: [],
        DatosTabla: [],
        otpTipoCuenta: [],
        optCuentasOrdenantes4: [],
        optNombresOrdenandes: [],
        FiltroEncargado: 0,
        DispersionesSeleccionadas: [],
        DatosExcel: [],
        DatosExcel2: [],
        Filtro2: false,
        CantidadDispersionesSeleccionadas: 0,
        Filtro: '',
        DatosFormik: {
            fechaInicial: "",
            fechaFinal: "",
            SucursalID: 0,
            EstatusSolicitudID: 0,
            EstatusClave: ""
        },
        Form:
        {
            Mostrar: false,
        },
        Cargando: false,
        Error: false,
        Detalle: false,
        RespRes: false,


    })
    const MySwal = withReactContent(Swal)
    const [selectedRows, setSelectedRows] = React.useState([]);

    const [toggleCleared, setToggleCleared] = React.useState(false);

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
        console.log("SELECTED ROWS", selectedRows)
    }, []);

    const contextActions = React.useMemo(() => {

        const handleClick = () => {
            let total = 0;
            selectedRows.forEach(element => {
                total = total + 1
                console.log("ROWS", selectedRows)
            });
            MySwal.fire({
                title: '<strong>Conciliacion de Tickets</strong>',
                icon: 'info',
                html:
                    <div className="text-center">
                        <br />
                        Se conciliaran un total de <strong>{total}</strong> Tickets, ¿Desea continuar?.
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
                        title: '<strong>Conciliacion de tickets</strong>',
                        icon: 'warning',
                        html:
                            <div className="text-center">
                                <br />
                                Total de {total} Ticket/s seleccionado/s para conciliar, ¿confirmar?.
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
                                            <h5 className="text-center">Conciliacion de tickets en progreso...</h5>
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
                                Tickets: selectedRows
                            }
                            Funciones.FNConciliar(props.oidc, a)
                                .then((respuesta: any) => {
                                    if (isMounted.current === true) {
                                        console.log("", respuesta)
                                        respuesta.Tickets.forEach(element => {
                                            let index = state.Datos.findIndex(x => x.porCobrarId === element.porCobrarId);
                                            if (index !== -1) {
                                                state.Datos.splice(index, 1);
                                            }
                                        })

                                        setToggleCleared(!toggleCleared);
                                        setState({ ...state, Datos: state.Datos, DatosMostrar: state.Datos })
                                        MySwal.close();
                                        MySwal.fire({
                                            icon: 'success',
                                            title: '<strong>Conciliacion de Tickets</strong>',
                                            html:
                                                <div className="text-center">
                                                    <br />
                                                    <h5>Se conciliarion <strong>{respuesta.DispersionesRegistradas} </strong> tickets de <strong>{respuesta.DispersioneRecibidas}</strong> solicitados.</h5>
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
                                        toast.success("Ticket/s conciliado/s con exito")
                                        setToggleCleared(!toggleCleared);
                                        setState({ ...state, Datos: state.Datos, DatosMostrar: state.Datos })
                                        MySwal.close();
                                        MySwal.fire({
                                            icon: 'success',
                                            title: '<strong>Conciliacion de Tickets</strong>',
                                            html:
                                                <div className="text-center">
                                                    <br />
                                                </div>,
                                            showCloseButton: false,
                                            showCancelButton: false,
                                            showConfirmButton: true,
                                            focusCancel: true,
                                            confirmButtonText: 'Aceptar',
                                            confirmButtonAriaLabel: 'Aceptar',
                                            confirmButtonColor: '#3085d6',
                                        })

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
                Conciliar tickets seleccionados

            </button>
        );
    }, [selectedRows]);




    const Columns: IDataTableColumn[] =
        [
            { name: 'ID Por Cobrar', selector: 'porCobrarId', wrap: true, sortable: false, center: true },
            { name: 'ID Credito', center: true, selector: 'creditoId', wrap: true, sortable: false },
            { name: 'Producto', selector: 'productoId', wrap: true, sortable: false, center: true },
            { name: 'Sucursal', selector: 'sucursalId', wrap: true, sortable: false, center: true },
            { name: 'Cobrador Asignado', selector: 'cobradorAsignado', wrap: true, sortable: false, center: true },
            { name: 'Nombre Completo', selector: 'nombreCompleto', wrap: true, sortable: false, center: true },
            { name: 'Celular', selector: 'celular', wrap: true, sortable: false, center: true },
            { name: 'Domicilio', selector: 'domicilio', wrap: true, sortable: false, center: true },
            { name: 'Tipo de Credito', selector: 'tipoCredito', wrap: true, sortable: false, center: true },
            { name: 'Monto a Cobrar', selector: 'montoCobrar', wrap: true, sortable: false, center: true },
            { name: 'Monto Abonado', selector: 'montoAbonado', wrap: true, sortable: false, center: true },
            { name: 'Fecha Ultimo Pago', selector: 'fechaUltimoPago', wrap: true, sortable: false, center: true },
            { name: 'Estatus', selector: 'estatus', wrap: true, sortable: false, center: true },
            { name: 'Puede Realizar Quita', selector: 'puedeRealizarQuita', wrap: true, sortable: false, center: true },
            { name: 'Quita por Rango Minimo', selector: 'quitaPorcRangoMin', wrap: true, sortable: false, center: true },
            { name: 'Quita por Rango Maximo', selector: 'quitaPorcRangoMax', wrap: true, sortable: false, center: true },
            { name: 'Fecha Creacion', selector: 'creacionFecha', wrap: true, sortable: false, center: true },
            { name: 'Tipo de sistema', selector: 'TipoSistema', wrap: true, sortable: false, center: true },



        ]
    const FNget2 = (valor: any, valor2: any, valor3: any, valor4: any) => {
        let b = {
            cobradorAsignado: valor,
            FechaInicio: valor2,
            FechaFin: valor3,
            creacionFecha: valor4

        }
        Funciones.FNgetbyfiltrosCobranza(props.oidc, b)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var datt = respuesta.map((valor: any) => {
                        var obj = {
                            ID_PorCobrar: valor.porCobrarId,
                            ID_Credito: valor.creditoId,
                            Producto: valor.productoId,
                            Sucursal: valor.sucursalId,
                            Cobrador: valor.cobradorAsignado,
                            Nombre: valor.nombreCompleto,
                            Celular: valor.celular,
                            Domicilio: valor.domicilio,
                            Credito: valor.tipoCredito,
                            Monto_Cobrar: valor.montoCobrar,
                            Monto_Abonado: valor.montoAbonado,
                            UltimoPago: valor.fechaUltimoPago,
                            Estatus: valor.estatus,
                            Reaiza_Quita: valor.puedeRealizarQuita,
                            Quita_Min: valor.quitaPorcRangoMin,
                            Quita_Max: valor.quitaPorcRangoMax,
                            FechaCreacion: valor.creacionFecha
                        };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Datos: respuesta, RespRes: true, DatosExcel2: datt, Filtro2: true }))
                    setLoading(false)

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Datos: [], DatosExcel2: [], Filtro2: false }))
                    setLoading(false)
                }

            })
    }

    const FNGetCuentaOrdenanteo3 = () => {
        Funciones.FNGetPorCobrar(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.cobradorAsignado, label: valor.cobradorAsignado };
                        console.log("OBJETO ,", obj)
                        return obj
                    });
                    setState(s => ({ ...s, optCuentasOrdenantes4: Estado, Cargando: false }))


                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, optCuentasOrdenantes4: [], Cargando: false }))

                }
            })
    }

    React.useEffect(() => {
        if (isMounted.current === true) {

            FNGetCuentaOrdenanteo3();

        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    const [loading, setLoading] = React.useState(false)

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Conciliacion de Tickets Cobranza">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={
                                    {
                                        FechaInicio: moment().add(-30, 'd').toDate(),
                                        FechaFin: new Date(),
                                        porCobrarId: 0,
                                        creditoId: 0,
                                        productoId: 0,
                                        sucursalId: 0,
                                        cobradorAsignado: '',
                                        tipoCredito: '',
                                        estatus: '',
                                        puedeRealizarquita: 0

                                    }
                                }
                                validationSchema={
                                    Yup.object().shape({
                                        cobradorAsignado: Yup.string().required("Selecciona un cobrador")
                                    })}
                                onSubmit={(values: any) => {
                                    console.log("Valores ,", values)

                                    console.log("Valores actualizados ,", values)
                                    setLoading(true)
                                    setState(s => ({ ...s, Cargando: true }))
                                    console.log("VALORES", values)
                                    FNget2(values.cobradorAsignado, values.FechaInicio, values.FechaFin, values.creacionFecha)
                                }}>
                                <Form>
                                    <div className="columns is-centered is-mobile is-multiline">
                                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <ActionSelect
                                                disabled={false}
                                                label="Cobrador Asignado"
                                                name="cobradorAsignado"
                                                placeholder="Elige Cobrador"
                                                options={state.optCuentasOrdenantes4}
                                                addDefault={true}
                                            />
                                        </div>
                                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <br />
                                            <div className='text-center'>
                                                <button disabled={loading} type="submit" className="btn btn-primary waves-effect waves-light">
                                                    <span className="">Buscar</span>&nbsp;<FiRefreshCcw />
                                                </button>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center "></div>
                                    </div>
                                    <div className="columns is-centered is-mobile is-multiline">
                                        {state.Cargando && <Spinner />}
                                        {!state.Cargando && !state.Error && <DataTable
                                            subHeader
                                            contextActions={contextActions}
                                            clearSelectedRows={toggleCleared}
                                            onSelectedRowsChange={handleRowSelected}
                                            //onSelectedRowsChange={(rows: any) => handleSelectDispersion(roUnws)}
                                            paginationComponentOptions={{
                                                noRowsPerPage: false, rowsPerPageText: 'Ticket por página',
                                                rangeSeparatorText: 'de',
                                                selectAllRowsItem: false,
                                                selectAllRowsItemText: 'Todos',
                                            }}
                                            contextMessage={{ singular: '- Ticket seleccionado', plural: '- Tickets seleccionados', message: 'para conciliar' }}
                                            //selectableRowDisabled={(row: any) => disableRow(row)}
                                            selectableRows
                                            //selectableRowsComponent={<div>ssss</div>}
                                            noDataComponent={<div>No hay datos</div>}
                                            title={<span>Lista de Tickets</span>}
                                            subHeaderComponent=
                                            {
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3">
                                                            <input type="text" className="form-control" placeholder="Buscar Ticket" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                            keyField={"porCobrarId"}
                                            defaultSortField={"porCobrarId"}
                                            columns={Columns}

                                        />}

                                    </div>
                                </Form>
                            </Formik>
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ConciliacionTickets)