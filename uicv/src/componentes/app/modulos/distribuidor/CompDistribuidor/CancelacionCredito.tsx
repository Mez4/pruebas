import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from '../../creditos/CompCreditos/CreditoCredito/Funciones'
import * as FnVales from '../../creditos/CompCreditos/CreditoVale/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as FnProductos from '../../creditos/CompCreditos/CreditoProducto/Funciones'
import * as FnBancos from '../../tesoreria/CompTesoreria/BancoTipoDesembolso/Funciones'
import * as FnPersona from '../../general/CompGeneral/Empleado/Funciones'
import * as FnSucursal from '../../general/CompGeneral/Sucursal/Funciones'

import { FaSearch, FaBan, } from 'react-icons/fa'

// Custom components 
import { Card, Spinner } from '../../../../global'
import { BuscarCreditos } from '../../creditos/CompCreditos/CreditoCredito/BuscarCreditos'
import { CForm } from '../../creditos/CompCreditos/CreditoVale/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, addOneDay } from '../../../../../global/functions'
import * as FnCajas from '../../tesoreria/CompTesoreria/CajasUsuarios/Funciones'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';
import { CreditoVale } from '../../creditos/CompCreditos'
//import { CreditoVale } from './'

import ReactTooltip from 'react-tooltip';
import moment from 'moment'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'
import { iUI } from '../../../../../interfaces/ui/iUI'
import { SeleccionarCajaSucursal } from '../../../../selectores'
import CreditoDistribuidor from '../../creditos/CompCreditos/CreditoDistribuidor'
import CreditoEmpleados from '../../creditos/CompCreditos/CreditoEmpleados'
import { DBConfia_General } from '../../../../../interfaces_db/DBConfia/General'
import { date } from 'yup'
import CreditoVale2 from '../../creditos/CompCreditos/CreditoVale2'
import CreditoDistribuidor2 from '../../creditos/CompCreditos/CreditoDistribuidor2'
import CreditoEmpleados2 from '../../creditos/CompCreditos/CreditoEmpleados2'
import { BuscarCreditosCancelacion } from '../../creditos/CompCreditos/CreditoCredito/BuscarCreditoCancelacion'

type CatalogosType = {
    oidc: IOidc,
    ui: iUI
}

type EstadoTipo = {
    Producto: {
        ProductoID: number,
        EmpresaId: number,
        Producto: string,
        Activo: boolean,
        TasaTipoId: string,
        RequiereDistribuidor: boolean,
        RequiereGrupo: boolean,
        ValidaDisponible: boolean,
        Restructura: boolean,
        GeneraDesembolso: boolean,
        SeguroFinanciado: boolean,
        Canje: boolean,
        DesglosarIVA: boolean,
        EdadMinima: number,
        EdadMaxima: number,
        CapitalAlFinal: boolean,
        CargoFinanciado: boolean,
        CargoAlInicio: boolean,
        ActivaCredito: boolean,
        CreditosLiquidadosReq: boolean,
        PermisoEspecial: boolean,
        ValidarCondiciones: boolean,
        FhRegitro: string,
        FhMoficiacion: string,
        AplicaIVAInteres: boolean,
        AplicaIVASeguro: boolean,
        AplicaIVAManejoCuenta: boolean,
        Logo: string
    },
    Datos: DBConfia_Creditos.ICreditos_VW[],
    DatosMostrar: DBConfia_Creditos.ICreditos_VW[],
    DatosMotivo: DBConfia_Creditos.ICreditos_VW[],
    DatosDetalle: DBConfia_Creditos.IPlanPagos[],
    Filtro: string,
    Cargando: boolean,
    Error: boolean
    Form:
    {
        Mostrar: boolean,
        Motivo: boolean,
        Datos?: {
            CreditoID: number,
            // ProductoId: number,
            DistribuidorId: number,
            ClienteId: number,
            SucursalId: number,
            CajaID: number,
            Folio: number,
            SerieId: number,
            Capital: number,
            Plazos: number,
            Cuenta: string,
            TipoDesembolsoID: number,
            EmpleadoId: number,
            interes: number,
            manejo: number,
            iva: number,
            Motivo: string,
            InteresVG: string,
            ManejoVG: string,
            IvaVG: string,
            datoBancario: string,
            personasDatosBancariosID: number,
            RequiereDatosBancarios: boolean,
            PrestamoPersonal: boolean,
            Principal: boolean
            EsNomina: boolean
            FechaExpedicion: Date
            MvCancelacion: string,
            TipoCancelacionID: number,
            NombreBeneficiario: string,
            ApellidoPaternoBeneficiario: string,
            ApellidoMaternoBeneficiario: string,
            ParentescoBeneficiario: string,
            FechaNacimientoBeneficiario: Date | null
        }, //DBConfia_Creditos.ICreditos
        Id?: number
    },
    Detalle: boolean,
    DistribuidorID: number,
    Distribuidor: string,
    ClienteID: number,
    Cliente: string,
    CreditoID: number,
    ShowCaja: boolean,
    CajaDefault: {
        ProductoID: number,
        SucursalID: number,
        CajaID: number
    },
    Desembolso: {
        Desembolsar: boolean,
        CreditoID: number,
        TipoDesembolsoID: number,
    },
    optSucursales: any[],
    Sucursal?: DBConfia_General.ISucursales,
    FechaInicio: Date,
    FechaFin: Date
}

const CreditoCredito = (props: CatalogosType) => {
    let isMounted = React.useRef(true)

    const MySwal = withReactContent(Swal)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const [state, setState] = React.useState<EstadoTipo>({
        Producto: {
            ProductoID: 0,
            EmpresaId: 0,
            Producto: '',
            Activo: false,
            TasaTipoId: '',
            RequiereDistribuidor: false,
            RequiereGrupo: false,
            ValidaDisponible: false,
            Restructura: false,
            GeneraDesembolso: false,
            SeguroFinanciado: false,
            Canje: false,
            DesglosarIVA: false,
            EdadMinima: 0,
            EdadMaxima: 0,
            CapitalAlFinal: false,
            CargoFinanciado: false,
            CargoAlInicio: false,
            ActivaCredito: false,
            CreditosLiquidadosReq: false,
            PermisoEspecial: false,
            ValidarCondiciones: false,
            FhRegitro: '',
            FhMoficiacion: '',
            AplicaIVAInteres: false,
            AplicaIVASeguro: false,
            AplicaIVAManejoCuenta: false,
            Logo: ''
        },
        Datos: [],
        DatosMostrar: [],
        DatosMotivo: [],
        DatosDetalle: [],
        Filtro: '',
        Cargando: false,
        Error: false,
        Form: {
            Mostrar: false,
            Motivo: false,
            Datos: {
                CreditoID: 0,
                // ProductoId: 0,
                DistribuidorId: 0,
                ClienteId: 0,
                SucursalId: 0,
                CajaID: 0,
                Folio: 0,
                SerieId: 0,
                Capital: 0,
                Plazos: 0,
                Cuenta: '',
                TipoDesembolsoID: 0,
                EmpleadoId: 0,
                interes: 0,
                manejo: 0,
                iva: 0,
                Motivo: '',
                InteresVG: '',
                ManejoVG: '',
                IvaVG: '',
                datoBancario: '',
                personasDatosBancariosID: 0,
                RequiereDatosBancarios: false,
                PrestamoPersonal: false,
                Principal: false,
                EsNomina: false,
                FechaExpedicion: new Date,
                MvCancelacion: '',
                TipoCancelacionID: 0,
                NombreBeneficiario: '',
                ApellidoPaternoBeneficiario: '',
                ApellidoMaternoBeneficiario: '',
                ParentescoBeneficiario: '',
                FechaNacimientoBeneficiario: null
            },
            Id: undefined
        },
        Detalle: false,
        DistribuidorID: 0,
        Distribuidor: '',
        ClienteID: 0,
        Cliente: '',
        CreditoID: 0,
        ShowCaja: false,
        CajaDefault: {
            ProductoID: 0,
            SucursalID: 0,
            CajaID: 0
        },
        Desembolso: {
            Desembolsar: false,
            CreditoID: 0,
            TipoDesembolsoID: 0,
        },
        optSucursales: [],
        Sucursal: undefined,
        FechaInicio: moment().add(-30, 'd').toDate(),
        FechaFin: new Date()
    })

    const FnGetProducto = () => {
        FnProductos.FNGetbyHead(props.oidc)
            .then((respuesta: any) => {

                // var productos = respuesta.map((valor: any) => {
                //     var obj = { value: valor.ProductoID, label: valor.Producto };
                //     return obj
                // });

                setState(s => ({ ...s, Producto: respuesta }))
            })
            .catch(() => {
                setState(s => ({
                    ...s,
                    Producto: {
                        ProductoID: 0,
                        EmpresaId: 0,
                        Producto: '',
                        Activo: false,
                        TasaTipoId: '',
                        RequiereDistribuidor: false,
                        RequiereGrupo: false,
                        ValidaDisponible: false,
                        Restructura: false,
                        GeneraDesembolso: false,
                        SeguroFinanciado: false,
                        Canje: false,
                        DesglosarIVA: false,
                        EdadMinima: 0,
                        EdadMaxima: 0,
                        CapitalAlFinal: false,
                        CargoFinanciado: false,
                        CargoAlInicio: false,
                        ActivaCredito: false,
                        CreditosLiquidadosReq: false,
                        PermisoEspecial: false,
                        ValidarCondiciones: false,
                        FhRegitro: '',
                        FhMoficiacion: '',
                        AplicaIVAInteres: false,
                        AplicaIVASeguro: false,
                        AplicaIVAManejoCuenta: false,
                        Logo: ''
                    }
                }))
            })
    }
    const cbCerrarMotivo = () => {
        //set false state.Form.Motivo
        setState(s => ({ ...s, Form: { ...s.Form, Motivo: false } }))
    }

    const FnGetSucursalEmpleado = () => {
        FnPersona.FNGetById(props.oidc)
            .then((res: any) => {
                if (res.length > 0)
                    FnSucursal.FNGetById(props.oidc, res[0].SucursalID)
                        .then((Sucursal: any) => {
                            console.log('Sucursal: ', Sucursal)
                            setState(s => ({ ...s, Sucursal }))
                        })
                        .catch(() => {
                            setState(s => ({ ...s, Sucursal: undefined }))
                        })
                else
                    setState(s => ({ ...s, Sucursal: undefined }))
            })
            .catch(() => {
                setState(s => ({ ...s, Sucursal: undefined }))
            })
    }

    const FNGetDetalle = (CreditoID: number, data: any) => {
        Funciones.FNGetPlanPagos(props.oidc, CreditoID)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                setState(s => ({
                    ...s, Detalle: true, DatosDetalle: respuesta,
                    DistribuidorID: data.DistribuidorID,
                    Distribuidor: data.Distribuidor,
                    ClienteID: data.ClienteID,
                    Cliente: data.NombreCompleto,
                    CreditoID,
                }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({
                    ...s, Detalle: false, DatosDetalle: [],
                    DistribuidorID: 0,
                    Distribuidor: '',
                    ClienteID: 0,
                    Cliente: '',
                    CreditoID: 0,
                }))
                // }
            })
    }

    const FNCancelar = (CreditoID: number) => {
        Funciones.FNCancelar(props.oidc, CreditoID)
            .then((respuesta: any) => {
                if (respuesta.res == 1) {
                    toast.success(respuesta.msj)
                    cbCancelar(respuesta.Data)
                }
                else {
                    toast.warning(respuesta.msj)
                }
            })
            .catch(() => {
                toast.error("Error al cancelar el crédito, vuelva a intentarlo.")
            })
    }


    const filtroStyle = (row: any) => {
        return [
            {
                when: row => row.isCred,
                style: { backgroundColor: '#7fbfff', fontWeight: 'bold' },
            },
            {
                when: row => row.SaldoAtrasado > 0,
                style: {
                    color: 'red',
                }
            }
        ]
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                //{ name: 'Producto', selector: 'Producto', sortable: false, hide: "sm" || "md", conditionalCellStyles: filtroStyle(props) },
                { name: 'N° Crédito', selector: 'CreditoID', center: true, sortable: false, conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Id Cliente', selector: 'ClienteID', sortable: false, conditionalCellStyles: filtroStyle(props) },
                // { name: 'Nombre Cliente', selector: 'NombreCompleto', sortable: true, },
                {
                    name: 'Nombre Cliente', selector: 'NombreCompleto', sortable: false,
                    cell: (props) =>
                        <>
                            <span data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>{props.NombreCompleto}</span>
                            <ReactTooltip id={`NombreCompletoTooltip${props.CreditoID}`}
                                type="dark"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                {props.NombreCompleto}
                            </ReactTooltip>
                        </>
                    , conditionalCellStyles: filtroStyle(props)
                },
                { name: 'Capital', selector: 'Capital', center: true, sortable: false, format: row => formatter.format(row.Capital), conditionalCellStyles: filtroStyle(props) },
                // { name: 'Interés', selector: 'Interes', sortable: false, format: row => formatter.format(row.Interes), conditionalCellStyles: filtroStyle(props) },
                //{ name: 'MC', selector: 'ManejoCuenta', sortable: false, format: row => formatter.format(row.ManejoCuenta), conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Seguro', selector: 'Seguro', sortable: false, format: row => formatter.format(row.Seguro), conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Cargo', selector: 'Cargo', sortable: false, format: row => formatter.format(row.Cargo), conditionalCellStyles: filtroStyle(props) },
                //{ name: 'IVA', selector: 'IVA', sortable: false, format: row => formatter.format(row.IVA), conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Total', selector: 'ImporteTotal', sortable: false, format: row => formatter.format(row.ImporteTotal), conditionalCellStyles: filtroStyle(props) },
                // {
                //     name: 'Abonos', selector: 'Abonos', sortable: false, format: row => formatter.format(row.Abonos), style: {
                //         fontWeight: 'bold',
                //     }, conditionalCellStyles: filtroStyle(props)
                // },
                // {
                //     name: 'Saldo', selector: 'SaldoActual', sortable: false, format: row => formatter.format(row.SaldoActual), style: {
                //         fontWeight: 'bold',
                //     }, conditionalCellStyles: filtroStyle(props)
                // },
                // {
                //     name: 'Atrasado', selector: 'SaldoAtrasado', sortable: false, format: row => formatter.format(row.SaldoAtrasado),
                //     conditionalCellStyles: filtroStyle(props)
                // },
                // {
                //     name: 'Días Atraso', selector: 'DiasAtraso', sortable: false, conditionalCellStyles: filtroStyle(props)

                // },
                { name: 'Fecha Registro', center: true, selector: 'FechaHoraRegistro', sortable: false, cell: (props) => <span>{moment(props.FechaHoraRegistro).format('DD/MM/YYYY')}</span>, conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Vale', selector: 'ValeCanje', sortable: false, conditionalCellStyles: filtroStyle(props) },
                { name: 'Estatus', center: true, selector: 'EstatusNombre', sortable: false, cell: (props) => <span>{props.EstatusNombre}</span>, conditionalCellStyles: filtroStyle(props) },
                { name: 'Motivo Cancelación', width: '185px', selector: 'MvCancelacion', sortable: false, center: true, conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Desembolsado', selector: 'MovimientoID', sortable: false, cell: (props) => <span>{props.MovimientoID ? "SI" : "No"}</span>, conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Tipo Desembolso', selector: 'TipoDesembolso', sortable: false, conditionalCellStyles: filtroStyle(props) },
                { name: 'Movimiento', center:true, selector: 'MovimientoID', sortable: false, conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Persona Registró', selector: 'NombreCompletoRegistra', sortable: false, center: true, conditionalCellStyles: filtroStyle(props) },
                //{ name: 'Id Venta', selector: 'VentaId', sortable: false, conditionalCellStyles: filtroStyle(props) },
                {
                    name: 'Cancelar Crédito',
                    sortable: false,
                    wrap: true,
                    center: true,
                    cell: (data) =>
                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            <button disabled={(data.MovimientoID == 0 && data.EstatusID == 'C')} data-tip="true" data-for={`CancelarTooltip${data.CreditoID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', }} type={"button"} onClick={() => {
                                FNCancelarMess(data)
                            }}>
                                <FaBan />
                            </button>
                            <ReactTooltip id={`CancelarTooltip${data.CreditoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Cancelar Crédito
                            </ReactTooltip>
                        </div>
                }
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            // FNGetLocal()
            FnGetProducto()
            FnGetSucursalEmpleado()
            fnGetSucursalesCaja()
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

    // React.useEffect(() => {
    //     if (!state.ShowCaja && state.Desembolso.Desembolsar)
    //         FNDesembolsar(state.Desembolso.CreditoID, state.Desembolso.TipoDesembolsoID)
    // }, [state.ShowCaja])

    /** funcion Callback al agregar un item */
    const cbRespuesta = (Datos: any, CreditoID: number) => {
        if (CreditoID > 0) {
            var k = 1;
            for (var i = 0; i < Datos.length; i++) {
                Datos[i].isCred = true;
                k++;
            }
            setState(s => ({ ...s, Datos: Datos }))
        } else {
            setState(s => ({ ...s, Datos: Datos }))
        }

    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.CreditoID === item.CreditoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: undefined } })

    /** funcion para cancelar la forma */
    const fnCerrar = () => {
        setState({ ...state, Form: { ...state.Form, Mostrar: false, Motivo: false } })
    }

    const FNCancelarMess = (Datos: any) => {
        console.log('Datos Mod: ', Datos)
        setState(s => ({
            ...s,
            Form: {
                ...s.Form,
                Motivo: true,
                Datos: {
                    CreditoID: Datos.CreditoID,
                    ProductoId: Datos.ProductoID,
                    DistribuidorId: Datos.DistribuidorID,
                    ClienteId: Datos.ClienteID,
                    SucursalId: Datos.SucursalID,
                    CajaID: Datos.CajaID,
                    Folio: Datos.ValeCanje,
                    SerieId: Datos.SerieId,
                    Capital: Datos.Capital,
                    Plazos: Datos.Plazos,
                    Cuenta: Datos.Cuenta,
                    TipoDesembolsoID: Datos.TipoDesembolsoID,

                    EmpleadoId: Datos.ClienteID,
                    interes: Datos.Interes,
                    manejo: Datos.ManejoCuenta,
                    iva: Datos.IVA,
                    Motivo: Datos.Observaciones,
                    InteresVG: Datos.PorcInteres,
                    ManejoVG: Datos.PorcManejoCuenta,
                    IvaVG: Datos.PorcIVA,
                    datoBancario: Datos.datoBancario,
                    personasDatosBancariosID: Datos.personasDatosBancariosID == null ? 0 : Datos.personasDatosBancariosID,
                    RequiereDatosBancarios: Datos.personasDatosBancariosID != null ? true : false,
                    PrestamoPersonal: Datos.PrestamoPersonal,
                    Principal: Datos.Principal,
                    EsNomina: Datos.EsNomina,
                    FechaExpedicion: new Date,
                    MvCancelacion: Datos.MvCancelacion,
                    TipoCancelacionID: Datos.TipoCancelacionID,
                    NombreBeneficiario: Datos.NombreBeneficiario,
                    ApellidoPaternoBeneficiario: Datos.ApellidoPaternoBeneficiario,
                    ApellidoMaternoBeneficiario: Datos.ApellidoMaternoBeneficiario,
                    ParentescoBeneficiario: Datos.ParentescoBeneficiario,
                    FechaNacimientoBeneficiario: Datos.FechaNacimientoBeneficiario
                },
                Id: Datos.CreditoID
            }
        }))
    }

    const cbCancelar = (item: any) =>
        setState({ ...state, Datos: state.Datos.filter((obj) => { return obj.CreditoID !== item.CreditoID }) })

    const fnGetSucursalesCaja = () => {
        FnCajas.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Sucursal };
                    return obj
                });

                setState(s => ({ ...s, optSucursales: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursales: [] }))
            })
    }

    const fnSetSucCaja = (Data: any) => {
        setState(s => ({
            ...s,
            CajaDefault: {
                ProductoID: Data.ProductoID,
                SucursalID: Data.SucursalID,
                CajaID: Data.CajaID
            },
            // Form: { ...state.Form, Datos: {...state.Form.Datos, SucursalId: Data.SucursalID, CajaID: Data.CajaID} }, 
            ShowCaja: false
        }))

    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Cancelación de Créditos">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    {/* {state.Sucursal &&      */}
                                    <BuscarCreditosCancelacion
                                        oidc={props.oidc}
                                        ui={props.ui}
                                        initialValues={
                                            {
                                                CreditoID: 0,
                                                ProductoID: 0,
                                                ClienteID: 0,
                                                SucursalID: 0,
                                                CajaID: 0,
                                                ZonaID: 0,
                                                EmpresaID: 0,
                                                DistribuidorID: 0,
                                                CoordinadorID: 0,
                                                ContratoID: 0,
                                                EstatusID: 'P',
                                                DistribuidorNivelID: 0,
                                                FechaInicio: state.FechaInicio,
                                                FechaFin: state.FechaFin
                                            }
                                        }
                                        cbRespuesta={cbRespuesta}
                                        Sucursal={state.Sucursal}
                                    />
                                    {/* } */}
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar crédito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/* {actionsMemo} */}
                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: undefined, Id: undefined } })}
                                                        ><FaPlus />
                                                        </button> */}
                                                        {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        // noHeader
                                        responsive
                                        keyField={"CreditoID"}
                                        defaultSortField={"CreditoID"}
                                        columns={Columns}
                                        // expandableRows
                                        // expandOnRowClicked
                                        onRowExpandToggled={(res: any) => {
                                            //HiddenData(res)
                                        }}
                                    //expandableRowsComponent={<HiddenData />}
                                    // actions={actionsMemo} 
                                    />
                                    {state.Form.Motivo &&
                                        <ModalWin open={state.Form.Motivo} large center>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>
                                                    {"Cancelación de Crédito"}
                                                </h5>
                                                <button title='Cerrar' type="button" className="delete" onClick={() => fnCerrar()} />
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                {state.Form.Datos! &&
                                                    <CreditoVale2
                                                        cbCerrarMotivo={cbCerrarMotivo}
                                                        DatosForm={state.Form.Datos}
                                                        callBack={cbActualizar}
                                                    />
                                                }
                                                {/* {state.Form.Datos!.PrestamoPersonal &&
                                                    <CreditoDistribuidor2
                                                        ProductoID={state.Producto.ProductoID}
                                                        DistribuidorID={state.Form.Datos!.DistribuidorId}
                                                        SucursalId={state.Form.Datos!.SucursalId}
                                                        CajaID={state.Form.Datos!.CajaID}
                                                        CreditoID={state.Form.Id!}
                                                        Plazos={state.Form.Datos!.Plazos}
                                                        TipoDesembolsoID={state.Form.Datos!.TipoDesembolsoID}
                                                        personasDatosBancariosID={state.Form.Datos!.personasDatosBancariosID}
                                                        RequiereDatosBancarios={state.Form.Datos!.RequiereDatosBancarios}
                                                        Capital={state.Form.Datos!.Capital}
                                                        optSucursales={state.optSucursales}
                                                        ProdPresPersonal={state.Form.Datos!.ProductoId}
                                                        fnCancelar={cbActualizar} />
                                                }
                                                {state.Form.Datos!.EsNomina &&
                                                    <CreditoEmpleados2
                                                        DatosForm={state.Form.Datos}
                                                        callBack={cbActualizar}
                                                    />
                                                } */}
                                            </ModalWin.Body>
                                        </ModalWin>
                                    }
                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoCredito)
