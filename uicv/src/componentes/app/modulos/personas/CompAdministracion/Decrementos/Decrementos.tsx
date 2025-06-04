import React, { useState, useEffect } from 'react'
import { AnyIfEmpty, connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ImgViewer, Spinner } from '../../../../../global'
import { DBConfia_Creditos } from '../../../../../../interfaces_db/DBConfia/Creditos'
import * as FnDecrementos from './Funciones'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ErrorMessage, Field } from 'formik'

// Iconos
import { FiRefreshCcw } from 'react-icons/fi'
import { FcCheckmark, FcOk } from "react-icons/fc";
import { FaPencilAlt, FaPlus, FaSearch, FaBan, FaCashRegister, FaListAlt, FaRegCheckCircle, FaRegCircle, FaCircle, FaMinus, FaEye } from 'react-icons/fa'
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";

import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify'

// SubComponentes
import * as Funciones from '../../../../../presentacion/contratos/CompListadoContratos/Funciones'
import { FormateoDinero, FormateoNumero } from '../../../../../../global/variables'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import moment from 'moment'

enum EColumnas {
    LineaCredito,
    LineaCreditoDisponible,
    SaldoActual,
    Capital,
    Interes,
    ManejoCuenta,
    Seguro,
    Cargo,
    IVA,
    Abonos,
    ImporteTotal,
    DiasAtraso,
    DiasAtrasoMaximo,
    SaldoAtrasado,
    CapitalPagado,
    NoCreditosActivos,
    PagosAtrasados,
    InteresPagado,
    IVAPagado,
    ManejoCuentaPagado,
    SeguroPagado,
    CargoPagado,
    FechaHoraUltimoPago,
    PagoPuntualUltmoPago,
    Reestructura,
    CapitalPendiente,
    InteresPendiente,
    IVAPendiente,
    ManejoCuentaPendiente,
    SeguroPendiente,
    CargoPendiente,
    Ciclo,
    convenioTipoNombre,
    convenioTipoActivo,
    DistribuidorID,
    DistribuidorNombre,
    CapitalColocadoMinimo,
    CapitalColocadoMaximo,
    Decremento
}

const GenerarColumna = (Columna: EColumnas): IDataTableColumn => {
    switch (Columna) {
        case EColumnas.LineaCredito:
            return ({ name: 'L.Crédito', selector: 'LineaCredito', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.LineaCredito)}</span> })
        case EColumnas.LineaCreditoDisponible:
            return ({ name: 'L.C.Disponible', selector: 'LineaCreditoDisponible', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.LineaCreditoDisponible)}</span> })
        case EColumnas.SaldoActual:
            return ({ name: 'Saldo Actual', selector: 'SaldoActual', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SaldoActual)}</span> })
        case EColumnas.Capital:
            return ({ name: 'Capital', selector: 'Capital', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Capital)}</span> })
        case EColumnas.Interes:
            return ({ name: 'Capital', selector: 'Capital', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Interes)}</span> })
        case EColumnas.ManejoCuenta:
            return ({ name: 'Manejo Cuenta', selector: 'ManejoCuenta', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ManejoCuenta)}</span> })
        case EColumnas.Seguro:
            return ({ name: 'Seguro', selector: 'Seguro', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Seguro)}</span> })
        case EColumnas.Cargo:
            return ({ name: 'Cargo', selector: 'Cargo', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Cargo)}</span> })
        case EColumnas.IVA:
            return ({ name: 'IVA', selector: 'IVA', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.IVA)}</span> })
        case EColumnas.Abonos:
            return ({ name: 'Abonos', selector: 'Abonos', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Abonos)}</span> })
        case EColumnas.ImporteTotal:
            return ({ name: 'Importe Total', selector: 'ImporteTotal', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ImporteTotal)}</span> })
        case EColumnas.DiasAtraso:
            return ({ name: 'Dias Atraso', selector: 'DiasAtraso', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.DiasAtraso)}</span> })
        case EColumnas.DiasAtrasoMaximo:
            return ({ name: 'D.Atraso Maximo', selector: 'DiasAtrasoMaximo', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.DiasAtrasoMaximo)}</span> })
        case EColumnas.SaldoAtrasado:
            return ({ name: 'Saldo Atrasado', selector: 'SaldoAtrasado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SaldoAtrasado)}</span> })
        case EColumnas.CapitalPagado:
            return ({ name: 'Capital Pagado', selector: 'CapitalPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CapitalPagado)}</span> })
        case EColumnas.NoCreditosActivos:
            return ({ name: 'No Creditos Activos', selector: 'NoCreditosActivos', sortable: true, cell: (cprops) => <span>{FormateoNumero.format(cprops.NoCreditosActivos)}</span> })
        case EColumnas.PagosAtrasados:
            return ({ name: 'Pagos Atrasados', selector: 'PagosAtrasados', sortable: true, cell: (cprops) => <span>{FormateoNumero.format(cprops.PagosAtrasados)}</span> })
        case EColumnas.InteresPagado:
            return ({ name: 'Interes Pagado', selector: 'InteresPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.InteresPagado)}</span> })
        case EColumnas.IVAPagado:
            return ({ name: 'IVA Pagado', selector: 'IVAPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.IVAPagado)}</span> })
        case EColumnas.ManejoCuentaPagado:
            return ({ name: 'Manejo Cuenta Pagado', selector: 'ManejoCuentaPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ManejoCuentaPagado)}</span> })
        case EColumnas.SeguroPagado:
            return ({ name: 'Seguro Pagado', selector: 'SeguroPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SeguroPagado)}</span> })
        case EColumnas.CargoPagado:
            return ({ name: 'Cargo Pagado', selector: 'CargoPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CargoPagado)}</span> })
        case EColumnas.FechaHoraUltimoPago:
            return ({ name: 'F.Ultimo Pago', selector: 'FechaHoraUltimoPago', sortable: true, cell: (cprops) => <span>{moment(cprops.FechaHoraUltimoPago).format('DD/MM/YYYY')}</span> })
        case EColumnas.PagoPuntualUltmoPago:
            return ({ name: 'P.Puntual Ultmo Pago', selector: 'PagoPuntualUltmoPago', sortable: true, cell: (cprops) => <span>{cprops.PagoPuntualUltmoPago}</span> })
        case EColumnas.Reestructura:
            return ({ name: 'Reestructura', selector: 'Reestructura', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Reestructura)}</span> })
        case EColumnas.CapitalPendiente:
            return ({ name: 'Capital Pendiente', selector: 'CapitalPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CapitalPendiente)}</span> })
        case EColumnas.InteresPendiente:
            return ({ name: 'Interes Pendiente', selector: 'InteresPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.InteresPendiente)}</span> })
        case EColumnas.IVAPendiente:
            return ({ name: 'IVA Pendiente', selector: 'IVAPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.IVAPendiente)}</span> })
        case EColumnas.ManejoCuentaPendiente:
            return ({ name: 'Manejo Cuenta Pendiente', selector: 'ManejoCuentaPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ManejoCuentaPendiente)}</span> })
        case EColumnas.SeguroPendiente:
            return ({ name: 'Seguro Pendiente', selector: 'SeguroPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SeguroPendiente)}</span> })
        case EColumnas.CargoPendiente:
            return ({ name: 'Cargo Pendiente', selector: 'CargoPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CargoPendiente)}</span> })
        case EColumnas.Ciclo:
            return ({ name: 'Ciclo', selector: 'Ciclo', sortable: true, cell: (cprops) => <span>{cprops.Ciclo}</span> })
        case EColumnas.convenioTipoNombre:
            return ({ name: 'Convenio', selector: 'convenioTipoNombre', sortable: true })
        case EColumnas.convenioTipoActivo:
            return ({ name: 'Convenio Activo', selector: 'convenioTipoActivo', sortable: true, cell: (cprops) => <span>{cprops.convenioTipoActivo ? "Si" : "No"}</span> })
        case EColumnas.DistribuidorID:
            return ({ name: 'ID Socia', selector: 'DistribuidorID', sortable: true })
        case EColumnas.DistribuidorNombre:
            return ({ name: 'Socia Nombre', selector: 'DistribuidorNombre', sortable: true })
        case EColumnas.CapitalColocadoMinimo:
            return ({ name: 'Mínimo', selector: 'CapitalColocadoMinimo', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CapitalColocadoMinimo)}</span> })
        case EColumnas.CapitalColocadoMaximo:
            return ({ name: 'Máximo', selector: 'CapitalColocadoMaximo', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CapitalColocadoMaximo)}</span> })
        case EColumnas.Decremento:
            return ({ name: 'Decremento', selector: 'Decremento', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(0)}</span> })
    }
}

type FuncionesTabla = {
    Control(props: any): React.ReactElement,
    Funcion(Contrato: DBConfia_Creditos.IContratos_VW): any
}

type DecrementosTipo = {

    oidc: IOidc

    Columnas: EColumnas[]

    Funciones: FuncionesTabla[]

    DatosConsulta: {
        DistribuidorID?: number
        ProductoID?: number
        PersonaIDRegistro?: number
        UsuarioIDRegistro?: string
        FechaInicio?: Date
        FechaFin?: Date
    }

    Refresh: number
}

type DecrementosEstadoTipo = {
    Contratos: DBConfia_Creditos.IContratos_VW[],
    Cargando: boolean,
    Error: boolean,
    // Type: number,
}

const Decrementos = (props: DecrementosTipo) => {

    const [Estado, definirEstado] = useState<DecrementosEstadoTipo>({
        Contratos: [],
        Cargando: true,
        Error: false,
        // Type: 1,
    })

    const [loading, setLoading] = useState(false)

    const ConsultarDatos = async () => {

        definirEstado({ Cargando: true, Error: false, Contratos: [] })

        try {
            var res = await Funciones.BuscarContratos(props.oidc, { ...props.DatosConsulta })

            var Contratos = res.map(c => {
                return {
                    ContratoID: c.ContratoID,
                    ProductoID: c.ProductoID,
                    Activo: c.Activo,
                    ProductoNombre: c.ProductoNombre,
                    productoActivo: c.productoActivo,
                    LineaCredito: c.LineaCredito,
                    LineaCreditoDisponible: c.LineaCreditoDisponible,
                    SaldoActual: c.SaldoActual,
                    Capital: c.Capital,
                    Interes: c.Interes,
                    ManejoCuenta: c.ManejoCuenta,
                    Seguro: c.Seguro,
                    Cargo: c.Cargo,
                    IVA: c.IVA,
                    Abonos: c.Abonos,
                    ImporteTotal: c.ImporteTotal,
                    DiasAtraso: c.DiasAtraso,
                    DiasAtrasoMaximo: c.DiasAtrasoMaximo,
                    SaldoAtrasado: c.SaldoAtrasado,
                    CapitalPagado: c.CapitalPagado,
                    NoCreditosActivos: c.NoCreditosActivos,
                    PagosAtrasados: c.PagosAtrasados,
                    InteresPagado: c.InteresPagado,
                    IVAPagado: c.IVAPagado,
                    ManejoCuentaPagado: c.ManejoCuentaPagado,
                    SeguroPagado: c.SeguroPagado,
                    CargoPagado: c.CargoPagado,
                    FechaHoraUltimoPago: c.FechaHoraUltimoPago,
                    PagoPuntualUltmoPago: c.PagoPuntualUltmoPago,
                    Reestructura: c.Reestructura,
                    CapitalPendiente: c.CapitalPendiente,
                    InteresPendiente: c.InteresPendiente,
                    IVAPendiente: c.IVAPendiente,
                    ManejoCuentaPendiente: c.ManejoCuentaPendiente,
                    SeguroPendiente: c.SeguroPendiente,
                    CargoPendiente: c.CargoPendiente,
                    Ciclo: c.Ciclo,
                    convenioTipoID: c.convenioTipoID,
                    convenioTipoNombre: c.convenioTipoNombre,
                    convenioTipoActivo: c.convenioTipoActivo,
                    DistribuidorID: c.DistribuidorID,
                    DistribuidorNombre: c.DistribuidorNombre,
                    FechaHoraRegistro: c.FechaHoraRegistro,
                    PersonaIDRegistro: c.PersonaIDRegistro,
                    CapitalColocadoMinimo: c.CapitalColocadoMinimo,
                    CapitalColocadoMaximo: c.CapitalColocadoMaximo,
                    Decremento: 0,
                    Type: 1,
                }
            })

            definirEstado({ Cargando: false, Error: false, Contratos })
        }
        catch (e) {
            definirEstado({ Cargando: false, Error: true, Contratos: [] })
        }
    }

    useEffect(() => {

        ConsultarDatos()

        // eslint-disable-next-line
    }, [props.DatosConsulta.DistribuidorID, props.Refresh])

    // Define the columns
    const Columns = //React.useMemo(
        () => {

            // Columnas basicas a incluir en la tabla
            const Columnas: IDataTableColumn[] =
                [
                    { name: 'Producto', selector: 'ProductoNombre', sortable: true },
                    {
                        name: 'Activo', selector: 'Activo', sortable: true, maxWidth: "90px", cell: (props) => <><span data-tip data-for={`EsttContTooltip${props.ContratoID}`} ><FaCircle color={props.Activo ? "green" : "red"} /></span>
                            <ReactTooltip id={`EsttContTooltip${props.ContratoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                {props.Activo ? "SI" : "NO"}
                            </ReactTooltip></>
                    },
                ]

            // Iteramos las columnas
            for (let c: number = 0; c < props.Columnas.length; c++)
                Columnas.push(GenerarColumna(props.Columnas[c]))

            // Generamos las acciones del componente
            if (props.Funciones.length > 0)
                Columnas.push({
                    name: 'Decrementar', selector: 'LineaCredito', sortable: false, minWidth: `${props.Funciones.length * 50}px`,
                    cell: (cprops) =>
                        <div>
                            {props.Funciones.map((Fn, FnId) =>
                                <Formik
                                    // initialValues={props.DatosConsulta}
                                    initialValues={cprops}
                                    enableReinitialize
                                    validationSchema={Yup.object().shape({
                                        // LineaCredito: Yup.array()
                                        //     .of(
                                        //         Yup.object().shape({
                                        //             LineaCredito: Yup.number(),
                                        //             // checked: Yup.boolean(),
                                        //         })
                                        //     )
                                        //     .required('Ingrese el montos de la linea de credito'),
                                        Decremento: Yup.number().required('Ingrese un monto mayor a 0').moreThan(0, 'El monto debe ser mayor a 0').max((cprops.LineaCredito - cprops.CapitalColocadoMinimo), `El monto maximo a decrementar debe ser menor o igual a ${FormateoDinero.format(cprops.LineaCredito - cprops.CapitalColocadoMinimo)}`),
                                        // LineaCredito: Yup.number().required('Ingrese un monto mayor a 0').min(cprops.CapitalColocadoMinimo, `El monto minimo debe ser mayor o igual a ${FormateoDinero.format(cprops.CapitalColocadoMinimo)}`).max(cprops.CapitalColocadoMaximo, `El monto maximo debe ser menor o igual a ${FormateoDinero.format(cprops.CapitalColocadoMaximo)}`),
                                        // Observaciones: Yup.string().required('Ingrese una observación').min(5, 'Ingresa mínimo 5 carácteres').max(500, 'Máximo 500 carácteres'),
                                        // SucursalID: Yup.number().when("GeneraGastoSucursal", { is: !state.GeneraGasto ? true : false, then: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'), })
                                    })}
                                    onSubmit={async (values: any, { resetForm }) => {
                                        console.log("Values", values)
                                        try {
                                            setLoading(true)

                                            var res: any = await FnDecrementos.FNDecrease(props.oidc, { ...values, msj: '', regresa: 0 })

                                            console.log("res", res)

                                            if (res.regresa == 1) {
                                                definirEstado({ ...Estado, Contratos: Estado.Contratos.map(Dato => Dato.ContratoID === res.ContratoID ? res : Dato) })

                                                toast.success(`Se decrementó la linea del crédito a ${res.LineaCredito}`)

                                                Fn.Funcion(cprops)
                                            }
                                            else {
                                                toast.error(res.msj)
                                            }

                                            setLoading(false)
                                        }
                                        catch (e) {
                                            console.log(JSON.stringify(e))
                                            toast.error("Error al incrementar el contrato, intente nuevamente")
                                            setLoading(false)
                                        }
                                    }}>
                                    <Form>
                                        {/* {props.Funciones.map((Fn, FnId) => */}
                                        <div className="btn-group">
                                            <span style={(loading || !cprops.Activo) ? { pointerEvents: "none", opacity: "0.4" } : {}} key={`fn_${cprops.DistribuidorID}_${FnId}`} >
                                                {cprops.Type == 1 && <>
                                                    <button className="btn btn-sm" data-tip data-for={`btnIncremento_${cprops.ContratoID}`} onClick={(event) => {
                                                        // console.log('cprops: ', cprops)
                                                        if (cprops.Type == 1) {
                                                            // console.log('Contratos: ', Estado.Contratos)
                                                            // Estado.Contratos.map(Dato => { console.log('Dato: ', Dato) })
                                                            definirEstado(s => ({
                                                                ...s, Contratos: Estado.Contratos.map(Dato => Dato.ContratoID == cprops.ContratoID ? { ...Dato, Type: 2 } : { ...Dato, Type: 1 }),
                                                            }))
                                                            // console.log('Contratos: ', Estado.Contratos)
                                                        }
                                                        else {
                                                            event.preventDefault();
                                                        }
                                                    }}><IoRemoveSharp color={cprops.Activo ? 'red' : 'gray'} size={20} /></button>
                                                    <ReactTooltip id={`btnIncremento_${cprops.ContratoID}`}
                                                        type="info"
                                                        effect="solid"
                                                        clickable
                                                        globalEventOff="click"
                                                    >
                                                        Decrementar
                                                    </ReactTooltip>
                                                </>}
                                                {cprops.Type == 2 &&
                                                    Fn.Control({ ...cprops })
                                                }
                                            </span>
                                        </div>
                                        {/* )} */}
                                        {/* {Estado.Cargando && <Spinner />}
                                {!Estado.Cargando &&
                                    <div className="text-end">
                                        <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                            Cancelar
                                        </button>
                                        <button disabled={false} type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                            +
                                        </button>
                                    </div>
                                } */}
                                    </Form>
                                </Formik >
                            )}
                        </div>
                })

            return Columnas
            //eslint-disable-next-line
        }//, [])

    // Si el componente esta cargando lo mostramos
    if (Estado.Cargando && !Estado.Error)
        return (
            <div className="text-center">
                <Spinner />
                <br />
                <span>Obteniendo contratos</span>
            </div>
        )

    // Regresamos un mensaje de error y la posibilidad de actualizar el componente
    else if (!Estado.Cargando && Estado.Error)
        return (
            <div className="text-center">
                <span>Ocurrio un error al obtener los contratos</span>
                <br />
                <button onClick={ConsultarDatos} className="btn btn-sm btn-confia text-white"><FiRefreshCcw /> </button>
            </div>
        )

    // Si no se tuvo un error al consultar los datos
    else if (!Estado.Cargando && !Estado.Error)
        return (
            <DataTable
                data={Estado.Contratos}
                striped
                pagination
                dense
                noHeader
                responsive
                keyField={"ContratoID"}
                columns={Columns()}
            />
        )

    return null
}

Decrementos.EColumnas = EColumnas

export default Decrementos