import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Balances/Funciones2'
import DataTable, { createTheme, IDataTableColumn } from 'react-data-table-component'
// Icons
import { FaFilePdf } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BovedasCaja/CForm'
import { ErrorMessage, Field, Formik } from 'formik'
import { Form } from 'usetheform'
import axios from 'axios'
import download from 'downloadjs'
import { toast } from 'react-toastify'

type CatalogosType = {
    oidc: IOidc
}

const Balances = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)
    const opPeriodos: any[] = []

    const Datos: any[] = []
    const Datos2: any[] = []
    const Datos3: any[] = []
    const Datos4: any[] = []
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
        Datos2,
        Datos3,
        Datos4,
        Filtro: '',
        Cargando: false,
        Cargando2: true,
        Cargando3: true,
        Cargando4: true,
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
        opPeriodos,
        DatosSaldoBoveda,
        DatosModalMovimientos,
        periodoID: 0,
        cuentaBanco: "",
        producto: "",
        movimiento: "",
    })

    const [estado, setEstado] = React.useState({
        estatus1: false,
        estatus2: false,
        estatus3: false,
        estatus4: false
    })

    const FNGetPeriodos = () => {
        Funciones.FNGetPeriodo(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var periodos = respuesta.map((valor: any) => {
                        var obj = { value: valor.periodoID, label: valor.periodo };
                        return obj
                    });
                    setState(s => ({ ...s, opPeriodos: periodos }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, opPeriodos: [] }))
                }
            })
    }

    const FNGetGenerarBalance = (id: any) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetGenerarBalance(props.oidc, id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Cuenta Banco',
                    selector: 'ctaBanco',
                    sortable: false,
                },

                {
                    name: 'Cuenta Contable',
                    selector: 'ctaContable',
                    sortable: false,
                },
                {
                    name: 'Saldo Sistema',
                    selector: 'saldoSistema',
                    sortable: false,
                },
                {
                    name: 'Saldo Edo. Cuenta',
                    selector: 'saldoEdoCuenta',
                    sortable: false,

                },

                {
                    name: 'Diferencia',
                    selector: 'diferencia',
                    sortable: false,
                }
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetPeriodos()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [props.oidc])


    const FNGetGenerarBalance2 = (cuenta: any) => {
        Funciones.FNGetGenerarBalance2(props.oidc, state.periodoID, cuenta)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    let index = state.Datos.findIndex((res: any) => {
                        return res.ctaBanco === cuenta
                    })

                    state.Datos[index].listaCuentas = respuesta
                    setState(s => ({ ...s, Cargando2: false, Error2: false, Datos2: respuesta, Datos: state.Datos }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    let index = state.Datos.findIndex((res: any) => {
                        return res.ctaBanco === cuenta
                    })

                    state.Datos[index].listaCuentas = null
                    setState(s => ({ ...s, Cargando2: false, Error2: true, Datos: state.Datos }))
                }
            })
    }

    const ColumnsTable2 = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [{
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

            },
            {
                name: 'Saldo Sistema',
                selector: 'saldoSistema',
                sortable: false,
                wrap: true,
            }
            ]
        return colRet
    }, [state.Form])

    const ExpandableComponent = (datos: any, row: any) => {
        if (datos === false || datos === true) {
            setEstado(s => ({ ...s, estatus1: datos }))
        } else {
            if (datos != undefined)
                row = datos.data
        }
        if (row !== undefined) {
            let index = state.Datos.findIndex((res: any) => {
                return res.ctaBanco === row.ctaBanco
            })
            console.log(row)
            if (datos === false) {
                //eliminar registro
                console.log("eliminando")
                state.Datos[index].listaCuentas = []
                state.Datos[index].listaMovimiento = []
                state.Datos[index].listaProducto = []
                setState(state => ({ ...state, Datos: state.Datos }))
            } else {
                if (state.Datos[index].listaCuentas <= 0 || state.Datos[index].listaCuentas === undefined) {
                    FNGetGenerarBalance2(row.ctaBanco)
                }
                const styles = {
                    div: {
                        "margin-left": "6%",
                        "margin-top": "5px",
                        "margin-bottom": "15px",
                        "padding": "15px",
                        "border-left-width": "8px",
                        //"border-left-color": "#BABABA",
                        //"border-left-style": "inset",
                        "border-top-width": "8px",
                        //"border-top-color": "#BABABA",
                        "border-top-style": "inset"
                    },
                }

                return <div style={styles.div}>
                    {state.Cargando2 && <Spinner />}
                    {state.Error2 && <span>Error al cargar los datos...</span>}
                    {!state.Cargando2 && !state.Error2 && <DataTable
                        data={state.Datos[index].listaCuentas}
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
                            ExpandableComponent2(res, row)
                        }}
                        expandableRowsComponent={<ExpandableComponent2 />}
                        onRowClicked={(res: any) => {
                            setState(state => ({ ...state, producto: res.producto }))

                            FNGetGenerarBalance3(res.producto, res.ctaBanco)
                        }}


                    />
                    }
                </div>

            }

            return <div></div>

        } else {
            return <div></div>
        }
    }

    /*********************************************************************************** */
    /*********************************************************************************** */

    const FNGetGenerarBalance3 = (producto: any, cuenta: any) => {
        if (producto === "N/A") {
            producto = "NA"
        }
        Funciones.FNGetGenerarBalance3(props.oidc, state.periodoID, cuenta, producto)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    let index = state.Datos.findIndex((res: any) => {
                        return res.ctaBanco === cuenta
                    })

                    state.Datos[index].listaProducto = respuesta
                    setState(s => ({ ...s, Cargando3: false, Error3: false, Datos3: respuesta, Datos: state.Datos }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    let index = state.Datos.findIndex((res: any) => {
                        return res.ctaBanco === cuenta
                    })

                    state.Datos[index].listaProducto = null
                    setState(s => ({ ...s, Cargando3: false, Error3: true, Datos: state.Datos }))
                }
            })
    }

    const ColumnsTable3 = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [{
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

            },
            {
                name: 'Tipo Movimiento',
                selector: 'tipoMovimiento',
                sortable: false,
                wrap: true,
            },
            {
                name: 'Saldo Sistema',
                selector: 'saldoSistema',
                sortable: false,
                wrap: true

            }
            ]
        return colRet
    }, [state.Form])

    const ExpandableComponent2 = (datos: any, row: any) => {
        if (datos === false) {
            let index = state.Datos.findIndex((res: any) => {
                return res.ctaBanco === row.ctaBanco
            })
            console.log("eliminando 2")
            state.Datos[index].listaMovimiento = []
            state.Datos[index].listaProducto = []

            setState(state => ({ ...state, Datos: state.Datos }))

        }
        if (datos.data !== undefined) {
            let index = state.Datos.findIndex((res: any) => {
                return res.ctaBanco === datos.data.ctaBanco
            })


            if (state.Datos[index].listaProducto <= 0 || state.Datos[index].listaProducto === undefined) {
                FNGetGenerarBalance3(datos.data.producto, datos.data.ctaBanco)
            }

            const styles = {
                div: {
                    "margin-left": "6%",
                    "margin-top": "5px",
                    "margin-bottom": "15px",
                    "padding": "15px",
                    "border-left-width": "8px",
                    //"border-left-color": "#BABABA",
                    //"border-left-style": "inset",
                    "border-top-width": "8px",
                    //"border-top-color": "#BABABA",
                    "border-top-style": "inset"
                },
            }

            return <div style={styles.div}>
                {state.Cargando3 && <Spinner />}
                {state.Error3 && <span>Error al cargar los datos...</span>}
                {!state.Cargando3 && !state.Error3 && <DataTable
                    data={state.Datos[index].listaProducto}
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
                    expandableRows={true}
                    onRowExpandToggled={(res: any, row: any) => {
                        ExpandableComponent3(res, row)
                    }}
                    expandableRowsComponent={<ExpandableComponent3 />}
                    onRowClicked={(res: any) => {
                        setState(state => ({ ...state, movimiento: res.tipoMovimiento }))

                        FNGetGenerarBalance4(res.tipoMovimiento, res.ctaBanco, res.producto)
                    }}
                />
                }
            </div>

        } else {
            return <div></div>
        }
    }

    /*********************************************************************************** */
    /*********************************************************************************** */


    const FNGetGenerarBalance4 = (movimiento: any, cuenta: any, producto: any) => {
        Funciones.FNGetGenerarBalance4(props.oidc, state.periodoID, cuenta, producto, movimiento)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    let index = state.Datos.findIndex((res: any) => {
                        return res.ctaBanco === cuenta
                    })

                    state.Datos[index].listaMovimiento = respuesta
                    setState(s => ({ ...s, Cargando4: false, Error4: false, Datos4: respuesta, Datos: state.Datos }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    let index = state.Datos.findIndex((res: any) => {
                        return res.ctaBanco === cuenta
                    })

                    state.Datos[index].listaMovimiento = null
                    setState(s => ({ ...s, Cargando4: false, Error4: true, Datos4: [], Datos: state.Datos }))
                }
            })
    }

    const ColumnsTable4 = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [{
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

            },
            {
                name: 'Tipo Movimiento',
                selector: 'tipoMovimiento',
                sortable: false,
                wrap: true,
            },
            {
                name: 'Saldo Sistema',
                selector: 'saldoSistema',
                sortable: false,
                wrap: true

            },
            {
                name: 'Observaciones',
                selector: 'observaciones',
                sortable: false,
                wrap: true

            },
            {
                name: 'Cuenta Destino',
                selector: 'cuentaDestino',
                sortable: false,
                wrap: true

            },
            {
                name: 'Fecha Captura',
                selector: 'fechaCaptura',
                sortable: false,
                wrap: true

            },
            {
                name: 'Fecha Afectación',
                selector: 'fechaAfectacion',
                sortable: false,
                wrap: true

            }
            ]
        return colRet
    }, [state.Form])

    const ExpandableComponent3 = (datos: any, row: any) => {
        if (datos === false) {
            let index = state.Datos.findIndex((res: any) => {
                return res.ctaBanco === row.ctaBanco
            })
            console.log("eliminando 3")
            state.Datos[index].listaMovimiento = []
            setState(state => ({ ...state, Datos: state.Datos }))

        }
        if (datos.data !== undefined) {
            let index = state.Datos.findIndex((res: any) => {
                return res.ctaBanco === datos.data.ctaBanco
            })
            if (state.Datos[index].listaMovimiento <= 0 || state.Datos[index].listaMovimiento === undefined) {
                FNGetGenerarBalance4(datos.data.tipoMovimiento, datos.data.ctaBanco, datos.data.producto)
            }
            const styles = {
                div: {
                    "margin-left": "6%",
                    "margin-top": "5px",
                    "margin-bottom": "15px",
                    "padding": "15px",
                    "border-left-width": "8px",
                    //"border-left-color": "#BABABA",
                    //"border-left-style": "inset",
                    "border-top-width": "8px",
                    //"border-top-color": "#BABABA",
                    "border-top-style": "inset"


                },

            }

            return <div style={styles.div}>
                {state.Cargando4 && <Spinner />}
                {state.Error4 && <span>Error al cargar los datos...</span>}
                {!state.Cargando4 && !state.Error4 && <DataTable
                    data={state.Datos[index].listaMovimiento}
                    striped
                    pagination={false}
                    dense
                    noHeader
                    responsive
                    keyField={"bovedaId"}
                    defaultSortField={"estadoNumero"}
                    defaultSortAsc={false}
                    columns={ColumnsTable4}
                    theme="solarized"


                />
                }
            </div>

        } else {
            return <div></div>
        }
    }

    /*********************************************************************************** */
    /*********************************************************************************** */

    const generarPDF = () => {
        //se va a generar el pdf aqui
        toast.info("Generando PDF")
        console.log(state.Datos)
        if (state.Datos.length > 0) {
            const lBalance1N: any[] = []
            const lBalance2N: any[] = []
            const lBalance3N: any[] = []
            const lBalance4N: any[] = []
            let arregloAEnviar = {
                nombreBalance: "",
                lBalance1N: lBalance1N,
                lBalance2N: lBalance2N,
                lBalance3N: lBalance3N,
                lBalance4N: lBalance4N,
                opcion: 1

            }
            let nombreBalance = state.opPeriodos.find((res: any) => {
                return res.value === state.periodoID
            })
            arregloAEnviar.nombreBalance = nombreBalance.label
            state.Datos.forEach((res: any) => {
                let a1 = {
                    ctaBanco: res.ctaBanco,
                    ctaContable: res.ctaContable,
                    saldoSistema: res.saldoSistema,
                    saldoEdoCuenta: res.saldoEdoCuenta,
                    diferencia: res.diferencia
                }
                arregloAEnviar.lBalance1N.push(a1)

                if (res.listaCuentas !== undefined) {
                    res.listaCuentas.forEach((respuesta: any) => {
                        let a2 = {
                            ctaBanco: respuesta.ctaBanco,
                            ctaContable: respuesta.ctaContable,
                            producto: respuesta.producto,
                            saldoSistema: respuesta.saldoSistema,
                            saldoBalance: respuesta.saldoBalance,
                            diferencia: respuesta.diferecia
                        }
                        arregloAEnviar.lBalance2N.push(a2)
                    })
                }

                if (res.listaProducto !== undefined) {
                    res.listaProducto.forEach((movimiento: any) => {
                        let a3 = {
                            ctaBanco: movimiento.ctaBanco,
                            ctaContable: movimiento.ctaContable,
                            producto: movimiento.producto,
                            tipoMovimiento: movimiento.tipoMovimiento,
                            saldoSistema: movimiento.saldoSistema,
                            saldoBalance: movimiento.saldoBalance,
                            diferencia: movimiento.diferencia
                        }
                        arregloAEnviar.lBalance3N.push(a3)
                    })
                }
                if (res.listaMovimiento !== undefined) {
                    res.listaMovimiento.forEach((producto: any) => {

                        let a4 = {
                            ctaBanco: producto.ctaBanco,
                            ctaContable: producto.ctaContable,
                            producto: producto.producto,
                            tipoMovimiento: producto.tipoMovimiento,
                            saldoSistema: producto.saldoSistema,
                            saldoBalance: producto.saldoBalance,
                            diferencia: producto.diferencia,
                            observaciones: producto.observaciones,
                            cuentaDestino: producto.cuentaDestino,
                            fechaAfectacion: producto.fechaAfectacion,
                            fechaCaptura: producto.fechaCaptura,
                            estatus: producto.estatus
                        }
                        arregloAEnviar.lBalance4N.push(a4)
                    })
                }
            })
            console.log(arregloAEnviar)
            axios({
                url: "https://services-tsr.herokuapp.com/api/pdf/balance",
                data: arregloAEnviar,
                method: "POST",
                responseType: 'blob',
                headers: {

                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${props.oidc.user.access_token}`
                }
            })
                .then((respuesta: any) => {

                    toast.success("PDF Generado con exito")
                    const content = respuesta.headers['content-type'];
                    download(respuesta.data, "Balance_" + arregloAEnviar.nombreBalance)

                }).catch((error: any) => {
                    toast.error("Error al generar el PDF")
                    console.log(error)
                }
                );
        }
    }

    const cerrarBalance = () => {
        //se va a generar el pdf aqui
        if (state.periodoID !== 0) {
            Funciones.FNCerrarBalance(props.oidc, state.periodoID)
                .then((respuesta: any) => {
                    respuesta.map((res: any) => {
                        toast.success(res.mensage)
                    })
                }).catch((err) => {
                    toast.error(err)
                })
        }

    }


    return (
        <div className="row">
            <div className="mt-lg-5 p-3">
                <Card Title="Balance">
                    <Card.Body>
                        <Card.Body.Content>

                            <div className="conteiner">
                                <Formik
                                    initialValues={state.Datos}
                                    enableReinitialize
                                    onSubmit={(values: any) => {
                                    }}>
                                    <Form>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="mb-3">
                                                    <label className="form-label mb-0" htmlFor={"periodoID"}>Periodos</label>
                                                    <Field name={"periodoID"} className="form-select"  >
                                                        {(control: any) => (
                                                            <select
                                                                className="form-select"
                                                                //options={state.optCuentas}                                                                  
                                                                value={control.field.value}
                                                                onChange={(value: any) => {
                                                                    control.form.setFieldValue("periodoID", parseInt(value.target.value))
                                                                    FNGetGenerarBalance(parseInt(value.target.value))
                                                                    setState(state => ({ ...state, periodoID: parseInt(value.target.value) }))
                                                                }}
                                                                disabled={false}
                                                                id={"periodoID"}
                                                                name={"periodoID"}
                                                            >
                                                                <option value="0">{"Selecciona un producto"}</option>
                                                                {state.opPeriodos.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}

                                                            </select>

                                                        )}
                                                    </Field>
                                                    <ErrorMessage component="div" name={"periodoID"} className="text-danger" />
                                                </div>
                                            </div>
                                            <div className="col-5">

                                            </div>
                                            <div className="col-2">
                                                <br></br>
                                                <button type="button" className="ms-2 btn btn-primary waves-effect waves-light"
                                                    disabled={false}
                                                    onClick={() => {
                                                        cerrarBalance()
                                                    }}>
                                                    Cerrar Balance
                                                </button>
                                            </div>
                                            <div className="col-1">
                                                <br></br>
                                                <button type="button" className="ms-2 btn btn-secondary waves-effect waves-light"
                                                    disabled={false}
                                                    onClick={() => {
                                                        generarPDF()
                                                    }}>
                                                    <FaFilePdf size="20px" />
                                                </button>
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
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"ctaBanco"}
                                        columns={Columns}
                                        expandableRows={true}
                                        onRowExpandToggled={(resBooleana: any, row: any) => {
                                            console.log(resBooleana)
                                            ExpandableComponent(resBooleana, row)
                                        }}
                                        expandableRowsComponent={<ExpandableComponent />}
                                        onRowClicked={(res: any) => {
                                            setState(state => ({ ...state, cuentaBanco: res.ctaBanco }))
                                            console.log(res)
                                            FNGetGenerarBalance2(res.ctaBanco)
                                        }}
                                        expandOnRowClicked




                                    />
                                }
                            </div>

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
export default connect(mapStateToProps, mapDispatchToProps)(Balances);
