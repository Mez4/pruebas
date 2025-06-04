import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Balances/Funciones'
import DataTable, { createTheme, IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../global/variables'
import ReactTooltip from 'react-tooltip';

// Icons
import { FaEye, FaFilePdf, FaLongArrowAltDown } from 'react-icons/fa'
// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './Balances/CForm'
import { ErrorMessage, Field, Formik } from 'formik'
import { Form } from 'usetheform'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

import axios from 'axios'
import download from 'downloadjs'
import { toast } from 'react-toastify'
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash, FaPrint } from 'react-icons/fa'
import { array } from 'yargs'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Swal2 from 'sweetalert2'
import withReactContent2 from 'sweetalert2-react-content'

type CatalogosType = {
    oidc: IOidc
}

const Balance = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)
    const opPeriodos: any[] = []

    const Datos: any[] = []
    const DatosCopy: any[] = []
    const Datos2: any[] = []
    const Datos3: any[] = []
    const Datos4: any[] = []
    const CuentasSeleccionadas: any[] = []
    const ProductosSeleccionados: any[] = []
    const DatosSeleccionados2: any[] = []
    const DatosSaldoBoveda = {
        billetes: "",
        monedas: "",
        total: "",
        fecha: new Date()
    }
    const styles = {
        h3Cerrado: {
            color: 'red'
        },
        h3Abierto: {
            color: 'green'
        },
        div3: {
            marginLeft: '3%',
            marginTop: '5px',
            marginBotom: '15px',
            borderLeftWidth: '8px',
            borderTopWidth: '8px',
            borderTop: '4px solid gray',

        },
        div: {
            marginLeft: '6%',
            marginTop: '5px',
            marginBotom: '15px',
            borderLeftWidth: '8px',
            borderTopWidth: '8px',
            borderTop: '4px solid gray',

        },
        div2: {
            marginLeft: '9%',
            marginTop: '5px',
            marginBotom: '15px',
            borderLeftWidth: '8px',
            borderTopWidth: '8px',
            borderTop: '4px solid gray',

        },

    }
    const DatosModalMovimientos: any[] = []

    const OpcionesMovimientos: any[] = []
    const [state, setState] = React.useState({
        CheckedAbierto: true,
        CheckedCerrados: false,
        Datos,
        DatosCopy,
        DatosInitial: {
            incMovs: 0,
            incDetalle: 0
        },
        BalanceTemporalID: 0,
        rowsProductosSeleccionables: true,
        rowsCuentasSeleccionables: true,
        Datos2,
        Datos3,
        Datos4,
        reAbierto: false,
        ProductosSeleccionados,
        DatosSeleccionados2,
        CuentasSeleccionadas,
        EstatusPeriodo: "A",
        SwalMostrado: false,
        Datos3F: false,
        Datos4F: false,
        primeraVez: false,
        Datos2F: false,
        Filtro: '',
        Cargando: false,
        Cargando2: false,
        Cargando3: false,
        Cargando4: false,
        Error: false,
        Error2: false,
        Error3: false,
        Error4: false,
        Form:
        {
            MostrarModal2: false,
            Mostrar: false,
            Id: undefined,
        },
        estatusPeriodo: "",
        estatusMostrar: true,
        opPeriodos,
        DatosSaldoBoveda,
        DatosModalMovimientos,
        periodoID: 0,
        tipoMovID: 0,
        productoID: 0,
        cuentaBancoID: 0,
        agrupacionID: 0,
        cuentaBanco: "",
        producto: "",
        movimiento: "",
        esReporteCuenta: 0
    })


    const MySwal = withReactContent(Swal)
    const MySwal2 = withReactContent2(Swal2)
    const FNGetPeriodos = (estatusRecibido: any) => {
        var EstatusEnviado = estatusRecibido.toUpperCase();
        Funciones.FNGetPeriodo(props.oidc, estatusRecibido)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (EstatusEnviado === "A") {
                        var periodos = respuesta.map((valor: any) => {
                            var obj = { value: valor.periodoID, label: valor.periodo };
                            return obj
                        });
                        setState(s => ({ ...s, opPeriodos: periodos }))
                    } else {
                        var periodos = respuesta.map((valor: any) => {
                            var obj = { value: valor.BalanceTempID, label: valor.NombreBalance };
                            return obj
                        });
                        setState(s => ({ ...s, opPeriodos: periodos }))
                    }

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, opPeriodos: [] }))
                }
            })
    }

    const FNGetEstatusPeriodo = (id: any) => {
        setState(s => ({ ...s, Cargando: true }))


        Funciones.FNGetEstatusPeriodo(props.oidc, id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (respuesta.ReAbierto == 1) {
                        setState(s => ({ ...s, reAbierto: true }))

                    } else {
                        setState(s => ({ ...s, reAbierto: false }))

                    }

                    if (respuesta.Estatus == "C") {
                        setState(s => ({ ...s, Cargando: false, Error: false, estatusPeriodo: respuesta.Estatus, estatusMostrar: false }))
                    }
                    else {
                        setState(s => ({ ...s, Cargando: false, Error: false, reAbierto: respuesta.ReAbierto, estatusPeriodo: respuesta.Estatus, estatusMostrar: false }))

                    }
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, estatusPeriodo: "Error", estatusMostrar: false }))
                }
            })
    }


    const FNGetEstatusPeriodo2 = (id: any) => {
        setState(s => ({ ...s, Cargando: true }))


        Funciones.FNGetEstatusPeriodo2(props.oidc, id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (respuesta.ReAbierto == 1) {
                        setState(s => ({ ...s, reAbierto: true }))

                    } else {
                        setState(s => ({ ...s, reAbierto: false }))

                    }

                    if (respuesta.Estatus == "C") {
                        setState(s => ({ ...s, Cargando: false, Error: false, estatusPeriodo: respuesta.Estatus, estatusMostrar: false }))
                    }
                    else {
                        setState(s => ({ ...s, Cargando: false, Error: false, reAbierto: respuesta.ReAbierto, estatusPeriodo: respuesta.Estatus, estatusMostrar: false }))

                    }
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, estatusPeriodo: "Error", estatusMostrar: false }))
                }
            })
    }

    const FNGetGenerarBalanceCierres = (id: any) => {
        setState(s => ({ ...s, Cargando: true, BalanceTemporalID: id }))
        var periodo = 0;
        Funciones.FNGetPeriodoBalance(props.oidc, id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, periodoID: respuesta.PeriodoID }))
                    let datosG2 = {
                        periodoId: respuesta.PeriodoID,
                        ctaBanco: 0,
                        producto: 0,
                        tipoMovimiento: 0,
                        BalanceIDTemp: id,
                        accion: 1,
                    }

                    Funciones.FNGetGenerarBalance(props.oidc, datosG2)
                        .then((respuesta: any) => {
                            if (isMounted.current === true) {
                                if (respuesta[0].CtaBancoId > 0) {
                                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))

                                } else {
                                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: [], }))
                                }
                            }
                        })
                        .catch(() => {
                            if (isMounted.current === true) {
                                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                            }
                        })
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true }))
                }
            })





    }

    const FNGetGenerarBalance = (id: any) => {


        setState(s => ({ ...s, Cargando: true }))
        let datosG = {
            periodoId: id,
            ctaBanco: 0,
            producto: 0,
            tipoMovimiento: 0,
            BalanceIDTemp: 0,
            accion: 0,

        }


        Funciones.FNGetGenerarBalance(props.oidc, datosG)
            .then((respuesta: any) => {
                if (isMounted.current === true) {


                    if (respuesta[0].Mensaje !== "Sin movimientos") {
                        setState(s => ({ ...s, BalanceTemporalID: respuesta[0].Mensaje }))

                        let datosG2 = {
                            periodoId: id,
                            ctaBanco: 0,
                            producto: 0,
                            tipoMovimiento: 0,
                            BalanceIDTemp: respuesta[0].Mensaje,
                            accion: 1,
                        }

                        Funciones.FNGetGenerarBalance(props.oidc, datosG2)
                            .then((respuesta: any) => {
                                if (isMounted.current === true) {
                                    if (respuesta.length > 0) {
                                        if (respuesta[0].CtaBancoId > 0) {

                                            setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                                        } else {
                                            setState(s => ({ ...s, Cargando: false, Error: false, Datos: [], }))
                                        }
                                    } else {
                                        setState(s => ({ ...s, Cargando: false, Error: false, Datos: [], }))
                                    }

                                }
                            })
                            .catch(() => {
                                if (isMounted.current === true) {
                                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                                }
                            })
                    } else {
                        console.log("SSSSSSSSSSSS")

                        setState(s => ({ ...s, Cargando: false, Error: false, Datos: [] }))
                    }


                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns: IDataTableColumn[] =
        [{
            name: 'Expandir',
            sortable: false,
            center: true,
            wrap: true,
            cell: (propsss) =>
                <button data-tip data-for="DetailTooltipProductos" className="asstext" type={"button"} onClick={() => {
                    FNGetGenerarBalance2(propsss.CtaBancoId, propsss.BalanceIDTemp)
                    console.log("PROPSSSSSSS ", propsss)
                }} >

                    <FaLongArrowAltDown></FaLongArrowAltDown>
                    <ReactTooltip
                        id="DetailTooltipProductos"
                        type="info"
                        effect="solid"
                        clickable
                        globalEventOff="click"
                    >
                        Mostrar productos
                    </ReactTooltip>
                </button>

        },
        {
            name: 'ID',
            center: true,

            selector: 'CtaBancoId',
            sortable: false,
            wrap: true

        },
        {
            name: 'Cuenta Banco',
            center: true,

            selector: 'CtaBanco',
            sortable: false,
        },

        {
            name: 'Cuenta Contable',
            selector: 'CtaContable',
            sortable: false,
        },

        {
            name: 'Saldo Cierre Anterior',
            selector: 'SaldoCierreAnterior',
            sortable: false,
            cell: (propss) =>
                FormateoDinero.format(propss.SaldoCierreAnterior)
        },
        {
            name: 'Saldo Movs. Aceptados    ',
            center: true,

            selector: 'SaldoSistema',
            sortable: false, cell: (propss) =>
                FormateoDinero.format(propss.SaldoSistema)
        },
        {
            name: 'Saldo Cuenta Actual',
            center: true,

            selector: 'SaldoEdoCuenta',
            sortable: false, cell: (propss) =>
                FormateoDinero.format(propss.SaldoEdoCuenta)
        },

        {
            name: 'Diferencia',
            center: true,

            selector: 'Diferencia',
            sortable: false, cell: (propss) =>
                FormateoDinero.format(propss.Diferencia)
        },
        ]


    // Use effect
    React.useEffect(() => {
        FNGetPeriodos("A")
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    const FNGetGenerarBalance2 = (cuenta: any, balanceIDTemp: any) => {
        setState(s => ({ ...s, Cargando2: true, Error2: false, Datos2: [], Datos3: [], Datos4: [], Datos2F: false, Datos3F: false, Datos4F: false }))
        let datos = {
            periodoId: state.periodoID,
            ctaBanco: cuenta,
            producto: 0,
            tipoMovimiento: 0,
            BalanceIDTemp: balanceIDTemp,
            accion: 2,

        }

        Funciones.FNGetGenerarBalance2(props.oidc, datos)

            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando2: false, Error2: false, Datos2: respuesta, Datos2F: true }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando2: false, Error2: true, Datos2: [], Datos2F: false }))
                }
            })
    }



    const ColumnsTable2: IDataTableColumn[] =
        [{
            name: 'Cuenta Banco',
            selector: 'CtaBanco',
            sortable: false,
            wrap: true,
            center: true,


        },

        {
            name: 'Cuenta Contable',
            selector: 'CtaContable',
            sortable: false,
            center: true,

            wrap: true

        },
        {
            name: 'Producto',
            selector: 'Producto',
            sortable: false,
            center: true,

            wrap: true,

        },
        {
            name: 'Saldo Sistema',
            selector: 'SaldoSistema',
            sortable: false,
            center: true,

            wrap: true,
            cell: (propss) =>
                FormateoDinero.format(propss.SaldoSistema)
        },
        {
            name: 'Ver Movimientos', sortable: false, center: true,

            cell: (propss) =>
                <button data-tip data-for="DetailTooltip" className="asstext" type={"button"} onClick={() => {
                    productosSeleccionados(propss.ProductoID, propss.CtaBancoId, propss.BalanceIDTemp)
                    console.log("SON PROPS ", propss)

                }} >
                    <FaEye></FaEye>
                    <ReactTooltip
                        id="DetailTooltip"
                        type="info"
                        effect="solid"
                        clickable
                        globalEventOff="click"
                    >
                        Ver Movimientos
                    </ReactTooltip>
                </button>
        },
        ]



    /*********************************************************************************** */
    /*********************************************************************************** */
    const ConsultarDetalle = (producto: any, ctaBanco: any) => {
        setState(state => ({ ...state, Cargando3: true, Datos4: [], Datos4F: false }))

        // FNGetGenerarBalances3(producto, ctaBanco)

    }
    const ConsultarDetalle2 = (tipoMovimiento: any, ctaBanco: any, producto: any, BalanceIDTemp: any) => {
        setState(state => ({ ...state, Cargando4: true }))
        FNGetGenerarBalance4(tipoMovimiento, ctaBanco, producto, BalanceIDTemp)

    }

    const FNGetGenerarBalances3 = (producto: any, cuenta: any, BalanceIDTemp: any) => {
        if (producto === "N/A") {
            producto = "NA"
        }
        let datosG = {
            periodoId: state.periodoID,
            ctaBanco: cuenta,
            producto: producto,
            tipoMovimiento: 0,
            BalanceIDTemp: BalanceIDTemp,
            accion: 3,

        }
        Funciones.FNGetGenerarBalance3(props.oidc, datosG)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    setState(s => ({ ...s, Cargando3: false, Error3: false, Datos3: respuesta, Datos3F: true }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {

                    setState(s => ({ ...s, Cargando3: false, Error3: true, Datos3: [] }))
                }
            })
    }

    const ColumnsTable3: IDataTableColumn[] =
        [/* {
            name: 'Cuenta Banco',
            selector: 'ctaBanco',
            sortable: false,
            wrap: true

        },
        {
            name: 'Cuenta Contable',
            selector: 'ctaContable',
            sortable: false,
            wrap: true

        }, */
            {
                name: 'Producto',
                selector: 'Producto',
                sortable: false,
                center: true,

                wrap: true,


            },
            {
                name: 'Tipo Movimiento',
                selector: 'TipoMovimiento',
                sortable: false,
                center: true,

                wrap: true,
            },
            {
                name: 'Saldo Sistema',
                selector: 'SaldoSistema',
                sortable: false,
                center: true,

                wrap: true,
                cell: (propss) =>
                    FormateoDinero.format(propss.SaldoSistema)

            },
            {
                name: 'Ver Detalle', sortable: false, center: true,

                cell: (propss) =>
                    <button data-tip data-for="DetailTooltipDetalle" className="asstext" type={"button"} onClick={() => {
                        console.log("PROPS TABLA 3")
                        console.log(propss)
                        ConsultarDetalle2(propss.CobranzaId, propss.CtaBancoId, propss.ProductoID, propss.BalanceIDTemp)
                    }} >
                        <FaEye></FaEye>
                        <ReactTooltip
                            id="DetailTooltipDetalle"
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Ver Detalle
                        </ReactTooltip>
                    </button>
            },
        ]

    const FNGetGenerarBalance4 = (movimiento: any, cuenta: any, producto: any, BalanceIDTemp: any) => {
        if (producto === "N/A") {
            producto = "NA"
        }
        let datosG = {
            periodoId: state.periodoID,
            ctaBanco: cuenta,
            producto: producto,
            tipoMovimiento: movimiento,
            BalanceIDTemp: BalanceIDTemp,
            accion: 4,

        }
        console.log("OBJETO ACCION 3")
        console.log(datosG)
        Funciones.FNGetGenerarBalance4(props.oidc, datosG)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    setState(s => ({ ...s, Cargando4: false, Error4: false, Datos4: respuesta, Datos4F: true }))
                }
            })
            .catch(() => {

                setState(s => ({ ...s, Cargando4: false, Error4: true, Datos4: [] }))

            })
    }

    const ColumnsTable4 = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [/* {
                name: 'Cuenta Banco',
                selector: 'ctaBanco',
                sortable: false,
                wrap: true

            },
            {
                name: 'Cuenta Contable',
                selector: 'ctaContable',
                sortable: false,
                wrap: true

            },
            {
                name: 'Producto',
                selector: 'producto',
                sortable: false,
                wrap: true,

            }, */
                {
                    name: 'Tipo Movimiento',
                    selector: 'TipoMovimiento',
                    sortable: false,
                    center: true,

                    wrap: true,
                },
                {
                    name: 'Saldo Sistema',
                    selector: 'SaldoSistema',
                    center: true,

                    sortable: false,
                    wrap: true,
                    cell: (propss) =>
                        FormateoDinero.format(propss.SaldoSistema)


                },
                {
                    name: 'Observaciones',
                    selector: 'Observaciones',
                    sortable: false,
                    center: true,

                    wrap: true

                },
                {
                    name: 'Cuenta Destino',
                    selector: 'CuentaDestino',
                    sortable: false,
                    center: true,

                    wrap: true

                },
                {
                    name: 'Fecha Captura',
                    selector: 'FechaCaptura',
                    sortable: false,
                    center: true,

                    wrap: true

                },
                {
                    name: 'Fecha Afectación',
                    selector: 'FechaAfectacion',
                    sortable: false,
                    center: true,

                    wrap: true

                }
            ]
        return colRet
    }, [state.Form])

    const cerrarSwal = () => {
        MySwal.close();
    }

    const generarPDF = () => {

        let seleccionados: any = []
        let datosCopia: any = []
        datosCopia = state.DatosSeleccionados2
        datosCopia.forEach(element => {
            let index = datosCopia.findIndex((res: any) => {
                return res.ProductoID === element.ProductoID
            })

            let datosG = {
                periodoId: state.periodoID,
                cuentaBancoId: datosCopia[index].CtaBancoId,
                productoId: datosCopia[index].ProductoID
            }

            seleccionados.push(datosG)
        });

        setState(s => ({ ...s, ProductosSeleccionados: seleccionados }))

        state.DatosSeleccionados2 = seleccionados
        console.log("SON----------DATOSSSSSS")
        console.log(state.DatosSeleccionados2)
        console.log(" ", state.ProductosSeleccionados)


        if (state.periodoID == 0) {
            MySwal.fire(
                'Periodo no seleccionado',
                '',
                'error'
            )
        } else {
            if (state.SwalMostrado == true) {
                let nombreBalance = state.opPeriodos.find((res: any) => {
                    return res.value === state.periodoID
                })
                if (!nombreBalance) {
                    nombreBalance = "NA"
                }
                MySwal.fire({
                    showCloseButton: true,
                    html: <div>
                        <div className="modal-header">
                            <h5 className="modal-title">Generación de PDF</h5>
                        </div>
                        <div className={`modal-body`}>
                            <CForm
                                isMounted={isMounted.current}
                                esReporteCuenta={state.esReporteCuenta}
                                cerrarSwal={cerrarSwal}
                                nombreBalance={nombreBalance == "NA" ? "NA" : nombreBalance.label}
                                periodoId={state.periodoID}
                                key={1}
                                DatosSeleccionados={state.ProductosSeleccionados}
                                Seguridad={props.oidc}
                                initialValues={state.DatosInitial}
                                Id={state.Form.Id}
                                CuentasSeleccionadas={state.CuentasSeleccionadas}

                            />
                        </div>
                    </div>,
                    showCancelButton: false,
                    showConfirmButton: false,

                })
            } else {
                if (state.DatosSeleccionados2.length == 0) {
                    MySwal2.fire(
                        'Selecciona al menos una cuenta o un producto',
                        '',
                        'error'
                    )
                }
                else {
                    let nombreBalance = state.opPeriodos.find((res: any) => {
                        return res.value === state.periodoID
                    })
                    MySwal.fire({
                        showCloseButton: true,
                        html: <div>
                            <div className="modal-header">
                                <h5 className="modal-title">Generación de PDF</h5>
                            </div>
                            <div className={`modal-body`}>
                                <CForm
                                    isMounted={isMounted.current}
                                    esReporteCuenta={state.esReporteCuenta}
                                    cerrarSwal={cerrarSwal}
                                    nombreBalance={nombreBalance.label}
                                    periodoId={state.periodoID}
                                    key={1}
                                    DatosSeleccionados={state.DatosSeleccionados2}
                                    Seguridad={props.oidc}
                                    initialValues={state.DatosInitial}
                                    Id={state.Form.Id}
                                    CuentasSeleccionadas={state.CuentasSeleccionadas}

                                />
                            </div>
                        </div>,
                        showCancelButton: false,
                        showConfirmButton: false,

                    })
                }
            }
        }

    }

    const cerrarBalance = () => {
        //se va a generar el pdf aqui
        if (state.periodoID !== 0) {
            if (state.estatusPeriodo == "A") {
                console.log("PERIODO ID", state.periodoID)
                MySwal2.fire({
                    icon: 'warning',
                    html: <div><br />
                        <h3 className="text-center">Aviso</h3>
                        <div className={`modal-body`}>
                            <h5 className="text-center">Estás a punto de cerrar el balance, acciòn no reversible. El periodo se cerrará y sólo un usuario autorizado podra abrirlo nuevamente.</h5>
                        </div>
                    </div>,
                    showCancelButton: true,
                    confirmButtonText: `Ok`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let datosG = {
                            periodoId: state.periodoID,
                            ctaBanco: 0,
                            producto: 0,
                            tipoMovimiento: 0,
                            BalanceIDTemp: state.BalanceTemporalID,
                            accion: 5,
                        }
                        Funciones.FNCerrarBalance(props.oidc, datosG)
                            .then((respuesta: any) => {
                                respuesta.map((res: any) => {
                                    if (res.MensajeID == "0") {

                                        MySwal2.fire({
                                            icon: 'success',
                                            html: <div><br />
                                                <h3 className="text-center">Balance cerrado</h3>
                                                <div className={`modal-body`}>
                                                    <h5 className="text-center">{res.Mensaje}</h5>
                                                </div>
                                            </div>,
                                            showCancelButton: false,
                                            confirmButtonText: `Ok`,
                                        })
                                        setState(s => ({ ...s, estatusPeriodo: "C" }))
                                        FNGetPeriodos("A")
                                    } else {
                                        MySwal2.fire({
                                            icon: 'warning',
                                            html: <div><br />
                                                <h3 className="text-center">Info</h3>
                                                <div className={`modal-body`}>
                                                    <h5 className="text-center">{res.Mensaje}</h5>
                                                </div>
                                            </div>,
                                            showCancelButton: false,
                                            confirmButtonText: `Ok`,
                                        })
                                    }

                                })
                            }).catch((err) => {
                                toast.error(err)
                            })
                        let timerInterval
                        MySwal2.fire(
                            {
                                icon: 'info',
                                html: <div><br />
                                    <h3 className="text-center">Aviso</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">Cerrando balance y periodo.</h5>
                                    </div>
                                </div>,
                                timerProgressBar: true,
                                confirmButtonText: `Ok`,
                                timer: 500,
                                didOpen: () => {
                                    MySwal2.showLoading()
                                },
                                willClose: () => {
                                    clearInterval(timerInterval)
                                }
                            }
                        );
                    } else {
                        MySwal2.fire(
                            {
                                icon: 'info',
                                html: <div><br />
                                    <h3 className="text-center">Aviso</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                    </div>
                                </div>,
                                confirmButtonText: `Ok`,
                            }
                        );
                    }
                });
            } else {
                MySwal2.fire(
                    {
                        icon: 'info',
                        html: <div><br />
                            <h3 className="text-center">Aviso</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">El periodo ya se encuentra cerrado.</h5>
                            </div>
                        </div>,
                        confirmButtonText: `Ok`,
                    }
                );
            }


        } else {
            MySwal2.fire({
                allowOutsideClick: false,
                icon: 'warning',
                html: <div><br />
                    <h3 className="text-center">Aviso</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Primero selecciona un periodo.</h5>
                    </div>
                </div>,
                confirmButtonText: `Ok`,
            })
        }

    }
    const [Productos, setProductos] = React.useState([] as number[])

    const [selectedRows1, setSelectedRows1] = React.useState([]);

    const productosSeleccionados = ((producto: any, ctaBanco: any, BalanceIDTemp: any) => {

        setState(state => ({ ...state, Cargando3: true, Datos4F: false }))
        FNGetGenerarBalances3(producto, ctaBanco, BalanceIDTemp)

    }
    )
    const periodoReabierto = () => {
        if (state.reAbierto) {
            return <h3 style={{ color: 'orange' }}>Periodo Re-Abierto</h3>
        } else {
            return <h3 style={styles.h3Abierto}>Periodo Abierto</h3>
        }
    }

    const cuentasSeleccionadas = (res) => {
        if (res.selectedCount > 0) {
            const styles = {
                div: {
                    width: "100% !important",
                    align: "center"
                },
            }
            setState(state => ({ ...state, CuentasSeleccionadas: res.selectedRows, rowsProductosSeleccionables: false, esReporteCuenta: 1, SwalMostrado: true }))
            if (state.SwalMostrado == false) {
                MySwal2.fire({
                    allowOutsideClick: false,
                    icon: 'info',
                    html: <div><br />
                        <h3 className="text-center">Aviso</h3>
                        <div className={`modal-body`}>
                            <h5 className="text-center">Al seleccionar la cuenta de banco se incluirá en el reporte todos los movimientos ligados a la misma.</h5>
                        </div>
                    </div>,
                    confirmButtonText: `Ok`,
                })
            }

        } else {
            setState(state => ({ ...state, CuentasSeleccionadas: res.selectedRows, rowsProductosSeleccionables: true, esReporteCuenta: 0, SwalMostrado: false }))
        }
    }
    /*    const rowsPreselectedTable2 = row => row.CtaBancoId > 1;
     
       const rowsSeleccionadas = (row) => {
           console.log("Estadooooooo")
           console.log(selectedRows1)
           return row.CtaBanco > 1;
       } */
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Consulta y cierre de balance">
                    <Card.Body>
                        <Card.Body.Content>

                            <div className="conteiner">
                                <Formik
                                    initialValues={state.Datos}
                                    enableReinitialize
                                    onSubmit={(values: any) => {
                                    }}>
                                    <Form>
                                        <div className="columns is-centered is-mobile is-multiline">
                                            <div className="column text-center is-full-mobile">
                                                <div className="mb-3">
                                                    <label className="form-label mb-0" htmlFor={"periodoID"}>Periodos</label>
                                                    <Field name={"periodoID"} className="form-select"  >
                                                        {(control: any) => (
                                                            <select
                                                                className="form-select"
                                                                //options={state.optCuentas}                                                                  
                                                                value={control.field.value}
                                                                onChange={(value: any) => {
                                                                    if (state.CheckedAbierto === true && state.CheckedCerrados === false) {
                                                                        if (parseInt(value.target.value) > 0) {
                                                                            FNGetGenerarBalance(parseInt(value.target.value))
                                                                            FNGetEstatusPeriodo(parseInt(value.target.value))
                                                                            setState(state => ({ ...state, periodoID: parseInt(value.target.value), Datos3: [], Datos4: [], Datos3F: false, Datos4F: false, Datos2F: false }))
                                                                        } else {
                                                                            setState(state => ({ ...state, Datos: [] }))
                                                                        }
                                                                    }
                                                                    if (state.CheckedAbierto === false && state.CheckedCerrados === true) {
                                                                        if (parseInt(value.target.value) > 0) {
                                                                            setState(state => ({ ...state, BalanceTemporalID: parseInt(value.target.value), Datos3: [], Datos4: [], Datos3F: false, Datos4F: false, Datos2F: false }))
                                                                            FNGetEstatusPeriodo2(parseInt(value.target.value))
                                                                            FNGetGenerarBalanceCierres(parseInt(value.target.value))
                                                                        } else {
                                                                            //STATE DATOS VACIOS
                                                                            setState(state => ({ ...state, Datos: [] }))
                                                                        }
                                                                    }
                                                                }}
                                                                disabled={false}
                                                                id={"periodoID"}
                                                                name={"periodoID"}
                                                            >
                                                                <option value="0">{"Selecciona un periodo"}</option>
                                                                {state.opPeriodos.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}

                                                            </select>

                                                        )}
                                                    </Field>
                                                    <ErrorMessage component="div" name={"periodoID"} className="text-danger" />
                                                </div>

                                            </div>
                                            <div className="column text-center is-half-mobile">
                                                <br />
                                                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                    <Field checked={state.CheckedAbierto} type="radio" className="btn-check" name="tipoCliente" id="Cliente1" autoComplete="off" value="1" onClick={() => {
                                                        setState(s => ({ ...s, CheckedAbierto: true, CheckedCerrados: false, opPeriodos: [], Datos: [], Datos2: [], Datos3: [], Datos4: [], Datos3F: false, Datos4F: false, Datos2F: false, estatusMostrar: true }));
                                                        FNGetPeriodos("A");
                                                    }} />
                                                    <label className="btn btn-outline-primary" htmlFor="Cliente1">Abiertos</label>

                                                    <Field checked={state.CheckedCerrados} type="radio" className="btn-check" name="tipoCliente" id="Cliente2" autoComplete="off" value="2" onClick={() => {
                                                        setState(s => ({ ...s, CheckedCerrados: true, CheckedAbierto: false, opPeriodos: [], Datos: [], Datos2: [], Datos3: [], Datos4: [], Datos3F: false, Datos4F: false, Datos2F: false, estatusMostrar: true }));
                                                        FNGetPeriodos("C");
                                                    }} />
                                                    <label className="btn btn-outline-primary" htmlFor="Cliente2">Cerrados</label>
                                                </div>

                                            </div>

                                            <div className="column text-center is-half-mobile">
                                                <br />

                                                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                    <button type="button" className="ms-2 btn btn-primary waves-effect waves-light"
                                                        disabled={state.estatusPeriodo != "A" ? true : false}
                                                        onClick={() => {
                                                            cerrarBalance()
                                                        }}>
                                                        Cerrar Balance
                                                    </button>
                                                    <button type="button" className="ms-2 btn btn-secondary waves-effect waves-light"
                                                        //disabled={state.estatusPeriodo != "A" ? true : false}
                                                        onClick={() => {
                                                            generarPDF()
                                                        }}>
                                                        <FaFilePdf size="20px" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="column text-center is-full-mobile">
                                                <br />

                                                <span hidden={state.estatusMostrar} >{state.estatusPeriodo != "C" ? periodoReabierto() : <h3 style={styles.h3Cerrado}>Periodo Cerrado</h3>}</span>
                                            </div>
                                        </div>
                                    </Form>
                                </Formik>
                                <br />
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
                                    <DataTable
                                        data={state.Datos}
                                        striped
                                        dense
                                        noDataComponent="Sin registros en el periodo seleccionado."
                                        noHeader
                                        responsive
                                        selectableRows={state.rowsCuentasSeleccionables}
                                        selectableRowsVisibleOnly={true}
                                        onSelectedRowsChange={(res: any) => {
                                            cuentasSeleccionadas(res)
                                        }}

                                        onRowDoubleClicked={(value: any) => {
                                            FNGetGenerarBalance2(value.CtaBancoId, value.BalanceIDTemp)
                                        }}
                                        keyField={"ctaBanco"}
                                        columns={Columns}
                                    />
                                }
                                <br />

                                {state.Cargando2 && <Spinner />}
                                {state.Error2 && <span>Error al cargar los datos...</span>}
                                {!state.Cargando2 && state.Datos2F && !state.Error2 && <div style={styles.div3}> <strong>Productos</strong><DataTable
                                    data={state.Datos2}
                                    striped
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"producto"}
                                    defaultSortField={"estadoNumero"}
                                    defaultSortAsc={false}
                                    columns={ColumnsTable2}
                                    theme="solarized"
                                    selectableRows={state.rowsProductosSeleccionables}
                                    onSelectedRowsChange={(res: any) => {
                                        console.log(res)
                                        if (res.selectedCount > 0) {
                                            if (isMounted.current === true) {
                                                setState(s => ({ ...s, DatosSeleccionados2: res.selectedRows, rowsCuentasSeleccionables: false }))
                                            }
                                        } else {
                                            if (isMounted.current === true) {
                                                setState(s => ({ ...s, DatosSeleccionados2: res.selectedRows, rowsCuentasSeleccionables: true }))
                                            }
                                        }

                                    }}

                                /*  onRowDoubleClicked={(res: any) => {
                                        setState(state => ({ ...state, producto: res.producto }))
         
                                        FNGetGenerarBalance3(res.producto, res.ctaBanco)
                                    }} */
                                // expandableRowsComponent={<ExpandableComponent2 />}
                                /*  onRowClicked={(res: any) => {
                                        setState(state => ({ ...state, producto: res.producto }))
                                        FNGetGenerarBalances3(res.producto, res.ctaBanco)
                                    }} */
                                /></div>
                                }
                                <br />
                                {state.Cargando3 && <Spinner />}
                                {state.Error3 && <span>Error al cargar los datos...</span>}
                                {!state.Cargando3 && state.Datos3F && !state.Error3 && <div style={styles.div}><strong>Movimientos del producto</strong><DataTable
                                    data={state.Datos3}
                                    striped
                                    pagination={false}
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"tipoMovimiento"}
                                    defaultSortField={"estadoNumero"}
                                    defaultSortAsc={false}
                                    columns={ColumnsTable3}
                                    theme="solarized"
                                    expandableRows={false}
                                />
                                </div>
                                }
                                <br />

                                {state.Cargando4 && <Spinner />}
                                {state.Error4 && <span>Error al cargar los datos...</span>}
                                {!state.Cargando4 && state.Datos4F && !state.Error4 && <div style={styles.div2}><strong>Detalle</strong><DataTable
                                    data={state.Datos4}
                                    striped
                                    pagination={false}
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"saldoSistema"}
                                    defaultSortField={"estadoNumero"}
                                    defaultSortAsc={false}
                                    columns={ColumnsTable4}
                                    theme="solarized"
                                    expandableRows={false}
                                />
                                </div>
                                }
                            </div>
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div >
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Balance);