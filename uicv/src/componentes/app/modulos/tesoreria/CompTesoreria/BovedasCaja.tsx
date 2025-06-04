import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as Funciones from './BovedasCaja/Funciones'
import DataTable, { createTheme, IDataTableColumn } from 'react-data-table-component'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// Icons
import { FaCheckCircle, FaCircle, FaExclamationCircle, FaEye, FaMinusCircle, FaPencilAlt, FaPlus, FaRegTimesCircle, FaSearch, FaTimesCircle } from 'react-icons/fa'
import { FormateoDinero } from '../../../../../global/variables'
// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BovedasCaja/CForm'

import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CFormCajasBoveda } from './BovedasCaja/CFormCajasBoveda'
import { MdDriveEta } from 'react-icons/md'
import ReactTooltip from 'react-tooltip';
import { CFormSaldosProducto } from './BovedasCaja/CFormSaldosProducto'

type CatalogosType = {
    oidc: IOidc
}

const BovedasCaja = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const Datos: any[] = []
    const DatosBoveda: any[] = []
    const DatosMostrar: any[] = []
    const DatosModal: any[] = []
    const DatosSaldoBoveda = {
        billetes: "",
        monedas: "",
        total: "",
        fecha: new Date()
    }
    const DatosModalMovimientos: any[] = []

    const OpcionesMovimientos: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosBoveda,
        DatosModal,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        CargandoExpand: true,
        CargandoModal: true,
        Error: false,
        ErrorModal: false,
        Form:
        {
            MostrarModal2: false,
            Mostrar: false,
            Id: undefined,
        },
        OpcionesMovimientos,
        DatosSaldoBoveda,
        DatosModalMovimientos
    })


    const FNGetLocal2 = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetSucursalesBovedas(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("RESPUESTA BOVEDA ", respuesta)
                    setState(s => ({ ...s, Cargando: false, Datos: respuesta }))

                    //  FNGetCajas(respuesta)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: [] }))
                }
            })
    }

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetSaldoBoveda(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("RESPUESTA BOVEDA ", respuesta)
                    FNGetCajas(respuesta)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: [] }))
                }
            })
    }

    const formatoNumero = (numero: any) => {
        return new Intl.NumberFormat("ES-MX", {
            style: "currency",
            currency: "MXN"
        }).format(numero)
    }

    const FNGetCajas = (respuestaB?: any) => {
        Funciones.FNGetCajasBovedas(props.oidc)
            .then((datosCajaB: any) => {
                if (isMounted.current === true) {
                    console.log("RESPUESTA DE CAJAS ,", respuestaB)
                    let a: any = []
                    respuestaB.forEach((element: any) => {
                        a.push(element.NombreSucursal)
                    });

                    let result = a.filter((item: any, index: any) => {
                        return a.indexOf(item) === index;
                    })
                    let DatosCaja: any[] = []
                    respuestaB.map((res: any) => {
                        console.log("RES ", res)
                        DatosCaja = []
                        datosCajaB.map((res2: any) => {
                            console.log("RES2 ", res2)
                            if (res.BovedaID == res2.BovedaID) {
                                console.log("MATCH ", res2)
                                DatosCaja.push(res2)
                            }
                        })
                        res.datosCaja = DatosCaja
                        console.log("DATOS DE CAJA ,", res.datosCaja)
                    })


                    respuestaB.map((element: any) => {
                        let mala = 0
                        let buena = 0
                        let regular = 0
                        element.datosCaja.forEach((datos: any) => {
                            switch (datos.estado) {
                                case "Mala":
                                    mala = 1
                                    break;
                                case "Muy Mala":
                                    mala = 1
                                    break;
                                case "Regular":
                                    regular = 1
                                    break;
                                case "Buena":
                                    buena = 1
                                    break;
                            }
                        });
                        if (mala === 1) {
                            element.estadoC = "Mala"
                            element.estadoNumero = 3
                        } else if (regular === 1 && mala === 0) {
                            element.estadoC = "Regular"
                            element.estadoNumero = 2
                        } else if (buena === 1 && mala === 0 && regular === 0) {
                            element.estadoC = "Buena"
                            element.estadoNumero = 1
                        }

                        if (element.estado === "Mala") {
                            element.estadoNumero = 3
                        } else if (element.estado === "Regular") {
                            element.estadoNumero = 2
                        } else if (element.estado === "Buena") {
                            element.estadoNumero = 1
                        }
                    });

                    let nuevoArreglo: any = []
                    result.forEach((sucursal: any) => {
                        let obj = respuestaB.map((res: any) => {
                            if (res.sucursal === sucursal) {
                                return res
                            }
                        })
                        obj = obj.filter((res: any) => res !== undefined)
                        let objetoANuevoArreglo = {
                            "sucursal": sucursal,
                            "total": 0,
                            "bovedas": obj
                        }
                        nuevoArreglo.push(objetoANuevoArreglo)
                    });
                    nuevoArreglo.map((e: any) => {

                        let sumaTotalSucursal = 0.0
                        let sumaTotalCajas = 0.0
                        let sumaTotalBovedas = 0.0


                        e.bovedas.forEach((el: any) => {
                            let sumaTotalCajaABoveda = 0.0
                            el.datosCaja.forEach((ele: any) => {
                                sumaTotalCajas = parseFloat(sumaTotalCajas.toString()) + parseFloat(ele.total.toString())
                                sumaTotalCajaABoveda = parseFloat(sumaTotalCajaABoveda.toString()) + parseFloat(ele.total.toString())
                                ele.total = formatoNumero(parseFloat(ele.total))
                            });
                            sumaTotalBovedas = parseFloat(sumaTotalBovedas.toString()) + parseFloat(el.total)
                            el.totalCajas = formatoNumero(parseFloat(sumaTotalCajaABoveda.toString()))
                            el.total = formatoNumero(parseFloat(el.total))
                        });

                        let estatusB = e.bovedas.find((res: any) => {
                            return (res.estado === "Buena" || res.estadoC === "Buena")
                        })
                        let estatusR = e.bovedas.find((res: any) => {
                            return (res.estado === "Regular" || res.estadoC === "Regular")
                        })
                        let estatusM = e.bovedas.find((res: any) => {
                            return (res.estado === "Mala" || res.estadoC === "Mala")
                        })

                        sumaTotalSucursal = parseFloat(sumaTotalBovedas.toString()) + parseFloat(sumaTotalCajas.toString())
                        e.total = formatoNumero(sumaTotalSucursal)
                        e.totalBoveda = formatoNumero(sumaTotalBovedas)
                        e.totalCajas = formatoNumero(sumaTotalCajas)
                        if (estatusM !== undefined) {
                            e.estado = "Mala"
                            e.estadoNumero = 3
                        } else if (estatusM === undefined && estatusR !== undefined) {
                            e.estado = "Regular"
                            e.estadoNumero = 2
                        } else if (estatusM === undefined && estatusR === undefined && estatusB !== undefined) {
                            e.estado = "Buena"
                            e.estadoNumero = 1
                        } else {
                            e.estado = "Mala"
                            e.estadoNumero = 3
                        }
                    });
                    let numeroCajas = 0
                    nuevoArreglo.map((respuesta: any) => {
                        respuesta.numeroBovedas = respuesta.bovedas.length
                        respuesta.bovedas.map((resultado: any) => {
                            numeroCajas = numeroCajas + resultado.datosCaja.length
                        })
                        respuesta.numeroCajas = numeroCajas
                    })
                    console.log(nuevoArreglo)
                    setState(s => ({ ...s, Cargando: false, DatosBoveda: datosCajaB, Datos: nuevoArreglo }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, DatosBoveda: [] }))
                }
            })
    }
    const fnGetMovimientosBoveda = () => {
        Funciones.FNGetMovimientosBoveda(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var movimientos = respuesta.map((valor: any) => {
                        var obj = { value: valor.movBovedaId, label: valor.descripcion };
                        return obj
                    });

                    setState(s => ({ ...s, OpcionesMovimientos: movimientos }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OpcionesMovimientos: [] }))
                }
            })
    }
    const FNGetCajasBovedas = (id: any) => {

        setState(s => ({ ...s, CargandoModal: true }))
        Funciones.FNGetCajasBovedas(props.oidc, id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, CargandoModal: false, ErrorModal: false, DatosModal: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, CargandoModal: false, ErrorModal: true, DatosModal: [] }))
                }
            })

    }

    const FNGetSaldos = (id: any) => {

        //setState(s => ({ ...s, CargandoModalSaldo: true }))
        Funciones.FNGetSaldos(props.oidc, id)
            .then((respuesta: any) => {
                console.log(respuesta)
                if (isMounted.current === true) {
                    respuesta.fecha = new Date(respuesta.fecha)
                    setState(s => ({ ...s, DatosSaldoBoveda: { billetes: respuesta.billete, fecha: respuesta.fecha, monedas: respuesta.moneda, total: respuesta.total } }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({
                        ...s, DatosSaldoBoveda: {
                            billetes: "",
                            monedas: "",
                            total: "",
                            fecha: new Date()
                        }
                    }))
                }
            })

    }

    const FNGetMovimientosModal2 = (id: any, fecha: any) => {

        //setState(s => ({ ...s, CargandoModalSaldo: true }))
        Funciones.FNGetMovimientosModal2(props.oidc, id, fecha)
            .then((respuesta: any) => {
                console.log(respuesta)
                let respuestaArreglo: [] = []
                respuesta.forEach((element: any) => {

                });
                if (isMounted.current === true) {
                    console.log(state.DatosModalMovimientos)
                    setState(s => ({ ...s, DatosModalMovimientos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({
                        ...s, DatosSaldoBoveda: {
                            billetes: "",
                            monedas: "",
                            total: "",
                            fecha: new Date()
                        }
                    }))
                }
            })

    }

    createTheme('solarized', {

        background: {
            default: 'withe',
        }
    });
    // Define the columns
    const ColumnsTable2: IDataTableColumn[] =
        [
            {
                name: 'Boveda',
                selector: 'NombreBoveda',
                sortable: false,
                center: true,
                style: {
                    "fontWeight": "bold"
                },
                cell: (props) => <span className="text-center">{props.NombreBoveda}</span>
            },
            {
                name: 'Activa',
                selector: 'Activa',
                sortable: false,
                center: true,
                cell: (props) => <span title="Texto flotante">{props.Activa ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },
            {
                name: 'Número de Cuenta',
                selector: 'NumeroCuenta',
                sortable: false,
                center: true

            },
            {
                name: 'Producto',
                selector: 'ProductoCuenta',
                sortable: false,
                center: true

            },
            {
                name: 'Saldo Boveda',
                selector: 'SaldoBoveda',
                sortable: false,
                center: true,
                cell: (props) => <span className="text-center">{FormateoDinero.format(props.SaldoBoveda)}</span>


            }, {
                name: 'Saldo Cajas',
                selector: 'SaldoTotalCajas',
                sortable: false,
                center: true,
                cell: (props) => <span className="text-center">{FormateoDinero.format(props.SaldoTotalCajas)}</span>


            }
        ]


    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Sucursal',
                selector: 'NombreSucursal',
                sortable: false,
                style: {
                    "fontWeight": "bold"
                },
                center: true,

            },

            {
                name: 'Numero de Bovedas',
                selector: 'NumeroBovedas',
                sortable: false,
                center: true,

            },
            {
                name: 'Total Bovedas',
                selector: 'SaldoBoveda',
                sortable: false,
                center: true,
                cell: (props) => <span className="text-center">{FormateoDinero.format(props.SaldoBoveda)}</span>
            },
            {
                name: 'Numero de Cajas',
                selector: 'NumeroCajas',
                sortable: false,
                center: true,
            },
            {
                name: 'Total Cajas',
                selector: 'SaldoCajas',
                sortable: false,
                center: true,
                cell: (props) => <span className="text-center">{FormateoDinero.format(props.SaldoCajas)}</span>


            }, {
                name: 'Estado Sucursal',
                selector: 'estado',
                sortable: false,
                center: true,
                cell: (props) => <span title="Texto flotante"> <FaCheckCircle size="20px" color="green" title="Buena" /> </span>

            }
        ]


    const ColumnsTable3: IDataTableColumn[] =
        [
            {
                name: 'Caja',
                selector: 'Nombre',
                sortable: false,
                center: true,
                style: {
                    "fontWeight": "bold"
                },
                cell: (props) => <span className="text-center">{props.Nombre}</span>


            },
            {
                name: 'Activa',
                selector: 'Estatus',
                sortable: false,
                center: true,
                cell: (props) => <span title="Texto flotante">{props.Estatus == 1 ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },
            {
                name: 'Cerrada',
                selector: 'Cerrada',
                sortable: false,
                center: true,
                cell: (props) => props.Cerrada == 0 ? <span className="text-center">No</span> : <span className="text-center">Si</span>
            },



            {
                name: 'Total',
                selector: 'TotalCaja',
                sortable: false,
                center: true,

                cell: (props) => props.TotalCaja != undefined ? <span className="text-center">{FormateoDinero.format(props.TotalCaja)}</span> : <span className="text-center">Sin Operación</span>


            },

            {
                name: 'Estado Caja',
                selector: 'estado',
                sortable: false,
                center: true,
                cell: (props) => <span title="Texto flotante"> <FaCheckCircle size="20px" color="green" title="Buena" /> </span>

            },
            {
                name: 'Saldos por producto', sortable: false, center: true,

                cell: (propss) =>
                    <button disabled={propss.EnOperacion == 1 ? false : true} data-tip data-for="DetailTooltipDetalle" className="asstext" type={"button"} onClick={() => {
                        console.log("PROPS TABLA 3")
                        console.log(propss)
                        verSaldosPorProducto(propss.DetalleProductos)
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



    const mostrarModal = (op: any, IdBoveda?: any) => {
        if (op === 1) {
            FNGetCajasBovedas(IdBoveda)
            setState(s => ({ ...s, Form: { ...s.Form, MostrarModal2: true } }))
        }
        if (op === 2) {
            setState(s => ({ ...s, Form: { ...s.Form, MostrarModal2: true, Mostrar: true } }))
        }
    }
    // Use effect
    React.useEffect(() => {
        FNGetLocal2()
        // fnGetMovimientosBoveda()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])


    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        //   setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' } } })
    }

    // /** funcion Callback al actualizar un item */
    //const cbActualizar = (item: any) =>
    // setState({ ...state, Datos: state.Datos.map(Dato => Dato.MonedaSatID === item.MonedaSatID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' } } })

    /** funcion para cancelar la forma */
    const fnCancelar = (op: any) => {
        if (op === 1) {
            setState({ ...state, Form: { ...state.Form, MostrarModal2: false, Mostrar: false } })
        }
        if (op === 2) {
            setState({ ...state, Form: { ...state.Form, MostrarModal2: true, Mostrar: false } })

        }
    }

    const verSaldosPorProducto = (respuesta: any) => {
        const MySwal = withReactContent(Swal)

        let timerInterval
        MySwal.fire({
            width: '75%',
            showCloseButton: true,
            html: <div>
                <div className="modal-header">
                    <h5 className="modal-title">Detalle de saldos por producto</h5>
                </div>
                <div className={`modal-body`}>
                    <CFormSaldosProducto
                        DatosSaldos={respuesta}
                    />
                </div>
            </div>,
            showCancelButton: false,
            showConfirmButton: false,

        })



    }

    const ExpandableComponent = (DATA: any) => {
        if (DATA.data !== undefined) {
            console.log("RECIBIDO ", DATA.data.Bovedas)

            const styles = {
                div: {
                    "margin-left": "6%",
                    "margin-top": "5px",
                    "margin-bottom": "15px",
                    "padding": "15px",
                    "border-left-width": "8px",
                    "border-left-color": "#BABABA",
                    "border-left-style": "inset",
                    "border-top-width": "8px",
                    "border-top-color": "#BABABA",
                    "border-top-style": "inset"


                },

            }

            return <div style={{
                marginLeft: "6%", marginTop: "5px", marginBottom: "15px",
                padding: "15px", borderLeftWidth: "8px", borderLeftColor: "#BABABA",
                borderLeftStyle: "inset", borderTopWidth: "8px", borderTopColor: "#BABABA",
                borderTopStyle: "inset"
            }}>
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => row.estado === "Buena",
                            style: {
                                backgroundColor: '#b8f3b8',
                            },
                        },
                        {
                            when: row => row.estado === "Regular",
                            style: {
                                backgroundColor: '#FDFF8F',

                            },
                        },
                        {
                            when: row => row.estado === "Mala",
                            style: {
                                backgroundColor: '#ff000052',

                            },
                        }
                    ]}
                    data={DATA.data.Bovedas}
                    striped
                    pagination={false}
                    dense
                    noHeader
                    responsive
                    keyField={"bovedaId"}
                    defaultSortField={"estadoNumero"}
                    defaultSortAsc={false}
                    columns={ColumnsTable2}
                    theme="solarized"
                    expandableRows={true}
                    onRowExpandToggled={(res: any, row: any) => {
                        ExpandableComponent2(row)
                    }}
                    expandableRowsComponent={<ExpandableComponent2 />}
                    expandOnRowClicked

                />
            </div>

        } else {
            return <div></div>
        }
    }

    const ExpandableComponent2 = (DATA: any) => {
        if (DATA.data !== undefined) {
            console.log("CAJAS RECIBIDAS ", DATA.data)
            /*
             let DatosCaja = state.DatosBoveda.map((res: any) => {
                 if (res.bovedaID === DATA.data.bovedaId && DATA.data.agrupacion === res.agrupacion ) {
                     return res
                 }
             })
     
             DatosCaja = DatosCaja.filter((res: any) => res !== undefined)
             DATA.data.datosCaja = DatosCaja
             console.log(DatosCaja)*/
            //   if (DATA.data.estadoC === "Buena") {
            const styles = {
                div: {
                    "margin-left": "6%",
                    "margin-top": "5px",
                    "margin-bottom": "15px",
                    "padding": "20px",
                    "border-left-width": "8px",
                    "border-left-color": "#848484",
                    "border-left-style": "inset",

                }
            }

            return <div style={{
                marginLeft: "6%", marginTop: "5px", marginBottom: "15px",
                padding: "15px", borderLeftWidth: "8px", borderLeftColor: "#BABABA",
                borderLeftStyle: "inset", borderTopWidth: "8px", borderTopColor: "#BABABA",
                borderTopStyle: "inset"
            }}>
                <DataTable
                    conditionalRowStyles={[
                        {
                            when: row => row.estado === "Buena",
                            style: {
                                backgroundColor: '#b8f3b8',
                                margin: 0
                            },
                        },
                        {
                            when: row => row.estado === "Regular",
                            style: {
                                backgroundColor: '#FDFF8F',
                                margin: 0

                            },
                        },
                        {
                            when: row => row.estado === "Mala",
                            style: {
                                backgroundColor: '#ff000052',
                                margin: 0

                            },
                        }
                    ]}
                    data={DATA.data.Cajas}
                    striped
                    pagination={false}
                    dense
                    noHeader
                    responsive
                    keyField={"bovedaId"}
                    defaultSortField={"estadoNumero"}
                    defaultSortAsc={false}
                    columns={ColumnsTable3}
                    theme="solarized"


                />
            </div>

        } else {
            return <div></div>
        }
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Saldo de cajas y bóvedas">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div className="conteiner">
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal2()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.Datos}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"bovedaId"}
                                        defaultSortField={"estadoNumero"}
                                        columns={Columns}
                                        expandableRows={true}
                                        onRowExpandToggled={(res: any, row: any) => {
                                            console.log("RES ", row.Bovedas)
                                            ExpandableComponent(row)
                                        }}
                                        expandableRowsComponent={<ExpandableComponent />}
                                        expandOnRowClicked
                                    />
                                    <ModalWin xlarge={true} open={state.Form.MostrarModal2}>
                                        <ModalWin.Body>
                                            {<CFormCajasBoveda
                                                oidc={props.oidc}
                                                Id={state.Form.Id}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                DatosModal={state.DatosModal}
                                                CargandoModal={state.CargandoModal}
                                                ErrorModal={state.ErrorModal}
                                                mostrarModal={mostrarModal}
                                                mostrar={state.Form.Mostrar}
                                                OpcionesMovimientos={state.OpcionesMovimientos}
                                                FNGetSaldos={FNGetSaldos}
                                                DatosSaldoBoveda={state.DatosSaldoBoveda}
                                                FNGetMovimientosModal2={FNGetMovimientosModal2}
                                                DatosModalMovimientos={state.DatosModalMovimientos}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>
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
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(BovedasCaja);
