import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CuentasAbonosCargo/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import download from 'downloadjs'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CuentasAbonosCargo/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import axios from 'axios'
import moment from 'moment'
import { FormateoDinero } from '../../../../../global/variables'




type CatalogosType = {
    Seguridad: IOidc
}

const CuentasAbonoCargo = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        MovimientoID: 0,
        CuentaID: 0,
        Nombre: '',
        CuentaDestinoID: 0,
        CuentaEnvia: 0,
        CuentaDestino: '',
        FechaAfectacion: '',
        FechaCaptura: '',
        NombreCompleto: '',
        CatEstatusMovID: 0

    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const OptionsSucursal: any[] = []
    const optBancos: any[] = []
    const optTipoCuentaBancaria: any[] = []
    const optCuentas: any[] = []


    const [state, setState] = React.useState({
        Habilitar: true,
        optTipoCuentaBancaria,
        Datos,
        DatosMostrar,
        optCuentas,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },

        OptionsSucursal,

    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var bancos = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                        return obj
                    });
                    setState(s => ({ ...s, optCuentas: bancos, Cargando: false }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const FNGetMovimientos = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNMovs(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, DatosMostrar: respuesta, Cargando: false }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id', selector: 'MovimientoID', sortable: false, center: true, width: "8%",
                    conditionalCellStyles: [
                        {
                            when: row => row.CatEstatusMovID == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green',
                            },

                        },
                        {
                            when: row => row.CatEstatusMovID == 2,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#ffa8a1',
                                fontWeight: 'bold',
                                color: 'red',
                            },

                        },
                    ],
                },
                {
                    name: 'Número Cuenta', selector: 'NumeroCuenta', sortable: false, center: true, width: "30%",
                    cell: (props) => <span className='text-center'>{props.NumeroCuenta}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.CatEstatusMovID == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green',
                            },

                        },
                        {
                            when: row => row.CatEstatusMovID == 2,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#ffa8a1',
                                fontWeight: 'bold',
                                color: 'red',
                            },

                        },
                    ],
                },
                {
                    name: 'Sucursal', selector: 'Sucursal', sortable: false, center: true, width: "10%",
                    cell: (props) => <span className='text-center'>{props.Sucursal}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.CatEstatusMovID == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green',
                            },

                        },
                        {
                            when: row => row.CatEstatusMovID == 2,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#ffa8a1',
                                fontWeight: 'bold',
                                color: 'red',
                            },

                        },
                    ],
                },
                {
                    name: 'Tipo Movimiento', selector: 'TipoMovimiento', sortable: false, center: true, width: "10%",
                    cell: (props) => <span className='text-center'>{props.TipoMovimiento === "Abono" ? <FaCircle color="green" title="Abono" /> : <FaCircle color="red" title="Cargo" />}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.CatEstatusMovID == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green',
                            },

                        },
                        {
                            when: row => row.CatEstatusMovID == 2,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#ffa8a1',
                                fontWeight: 'bold',
                                color: 'red',
                            },

                        },
                    ],
                },
                {
                    name: 'Importe', selector: 'Importe', sortable: false, center: true, width: "10%", format: row => FormateoDinero.format(row.Importe),
                    conditionalCellStyles: [
                        {
                            when: row => row.CatEstatusMovID == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green',
                            },

                        },
                        {
                            when: row => row.CatEstatusMovID == 2,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#ffa8a1',
                                fontWeight: 'bold',
                                color: 'red',
                            },

                        },
                    ],
                },
                {
                    name: 'Fecha', selector: 'FechaAfectacion', sortable: false, center: true, width: "10%",
                    cell: (props) => <span>{moment(props.FechaAfectacion).format('DD/MM/YYYY')}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.CatEstatusMovID == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green',
                            },

                        },
                        {
                            when: row => row.CatEstatusMovID == 2,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#ffa8a1',
                                fontWeight: 'bold',
                                color: 'red',
                            },

                        },
                    ],
                },

                {
                    name: 'Observaciones', selector: 'Observaciones', sortable: false, center: true, width: "30%",
                    conditionalCellStyles: [
                        {
                            when: row => row.CatEstatusMovID == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green',
                            },

                        },
                        {
                            when: row => row.CatEstatusMovID == 2,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#ffa8a1',
                                fontWeight: 'bold',
                                color: 'red',
                            },

                        },
                    ],
                }
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        FNGetMovimientos()
        //FNGetTipoCuentaBancarias()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-lined
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */

    const cbAgregar = (item: any) => {
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    MovimientoID: 0,
                    CuentaID: 0,
                    Nombre: '',
                    CuentaDestinoID: 0,
                    CuentaEnvia: 0,
                    CuentaDestino: '',
                    FechaAfectacion: '',
                    FechaCaptura: '',
                    NombreCompleto: '',
                    CatEstatusMovID: 0

                }
            }
        })
        FNGetMovimientos()
    }

    const cbActualizar2 = (item: any) => {
        toast.success('La cuenta se actualizó correctamente.')

        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.CuentaBancariaPrincipalID === item.CuentaBancariaPrincipalID ?
                {
                    ...Dato,
                    NumeroCuenta: item.NumeroCuenta,
                    DescripcionCuenta: item.DescripcionCuenta,
                    EsReal: item.EsReal,
                    CuentaActiva: item.CuentaActiva,
                    TipoCuentaBancoID: item.TipoCuentaBancoID,
                    TipoCuenta: item.TipoCuenta,
                    BancoID: item.BancoID,
                    BancoNombre: item.BancoNombre,
                    BancoActivo: item.BancoActivo,
                } : Dato)
        }
        ))
        //Modal false
        setState(s => ({ ...s, Form: { ...s.Form, Mostrar: false } }))
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Cuentas Abonos / Cargos">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        {/* <input type="text" className="form-control" placeholder="Buscar Cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} /> */}
                                                        {/* <span className="input-group-text"><FaSearch /> </span> */}
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetMovimientos()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        // striped
                                        // pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"CuentaBancariaPrincipalID"}
                                        defaultSortField={"CuentaBancariaPrincipalID"}
                                        columns={Columns}
                                    />
                                    <ModalWin large={true} center={true} open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Realizar Cargo o abono a la cuenta"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbGuardar={cbAgregar}
                                                cbActualizar={cbActualizar2}
                                                fnCancelar={fnCancelar}
                                                optCuentas={state.optCuentas}
                                                optTipoCuentaBancaria={state.optTipoCuentaBancaria}
                                            />
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
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CuentasAbonoCargo)