import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CuentasPorCaja/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import download from 'downloadjs'
import { FaLockOpen, FaFileInvoice, FaLock, FaPrint, FaBox, FaBan, FaEye, FaExclamationCircle, FaFile, FaPlus } from 'react-icons/fa'

// Icons
import { FaPencilAlt, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'
import moment from 'moment'

import { CForm } from './CuentasPorCaja/CForm'
// Custom components
import { Card, Spinner } from '../../../../global'

import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import axios from 'axios'

import ReactTooltip from 'react-tooltip';



type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoCaja = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        estatus: true

    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsCuentasBanco: any[] = []
    const OptionsCajas: any[] = []


    const OptionsSucursal: any[] = []
    const DatosDefectoCForm = {
        CajaID: 0,
        NombreCaja: "",
        NumeroCuentas: 0,
        Producto: "",
        Cuentas: [
            {
                NombreCaja: "",
                CajaId: 0,
                CuentaBancoID: 0,
                NumeroCuenta: "",
                Estatus: 0,

            }
        ]
    }

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            DatosIniciales: DatosDefectoCForm,
            Id: undefined
        },
        OptionsCajas,
        OptionsCuentasBanco



    })

    const FnGetCaja = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCajasSinCuenta(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var caja = respuesta.map((valor: any) => {
                        var obj = { value: valor.CajaID, label: valor.Nombre, sucursal: valor.SucursalID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCajas: caja }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCajas: [] }))
                }
            })
    }

    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetCuentasPCaja(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    toast.error("Ocurrió un problema al obtener los datos")
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }
    const FNGetCuentasBanco = (SucursalID: number) => {
        //  setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetCuentasDisponibles(props.Seguridad, SucursalID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    if (respuesta.length > 0) {
                        var cuenta = respuesta.map((valor: any) => {
                            var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta + ' [' + valor.Producto + ']', producto: valor.Producto };
                            return obj
                        });
                        // setState(s => ({ ...s, OptionsCaja: cuenta }))

                        setState(s => ({ ...s, Cargando: false, Error: false, OptionsCuentasBanco: cuenta }))

                    } else {
                        toast.error("La sucursal de la caja no tiene asignadas cuentas.")
                        var cuenta = respuesta.map((valor: any) => {
                            var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta + ' [' + valor.Producto + ']', producto: valor.Producto };
                            return obj
                        });
                        // setState(s => ({ ...s, OptionsCaja: cuenta }))

                        setState(s => ({ ...s, Cargando: false, Error: false, OptionsCuentasBanco: cuenta }))

                    }
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptionsCuentasBanco: [] }))
                }
            })
    }

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'CajaID',
                selector: 'CajaID', sortable: true, center: true
            },
            {
                name: 'Nombre Caja',
                selector: 'NombreCaja', sortable: true, center: true
            },
            {
                name: 'Numero de Cuentas',
                selector: 'NumeroCuentas', sortable: true, center: true
            },
            {
                name: 'Acciones',
                sortable: false,
                center: false,
                cell: (propss) =>
                    <div className="text-center">
                        <button data-tip data-for={"btnVer_1" + propss.CuentaBancoID} className="btn btn-outline-default" type={"button"}
                            onClick={() => {
                                FNGetCuentasBanco(propss.SucursalID)
                                let nuevo = {
                                    CajaID: propss.CajaID,
                                    NombreCaja: propss.NombreCaja,
                                    NumeroCuentas: propss.NumeroCuentas,
                                    Producto: propss.Producto,
                                    Cuentas: propss.Cuentas
                                }
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form,
                                        Mostrar: true,
                                        DatosIniciales: nuevo,
                                        Id: propss.CajaID,
                                    }
                                }))
                            }}>
                            <FaPencilAlt />
                            <ReactTooltip id={"btnVer_1" + propss.CuentaBancoID} type="info" effect="solid">
                                Editar
                            </ReactTooltip>
                        </button>
                    </div>
            },

        ]

    React.useEffect(() => {
        FNGetLocal()
        //FNGetCuentasBanco()
        FnGetCaja()


        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])
    const reAbiertoLabel = (reabierto) => {
        if (reabierto) {
            return <label style={{ color: "orange", marginBottom: '0px' }}>
                Re-Abierto
            </label>
        } else {
            return <label style={{ color: "green", marginBottom: '0px' }}>
                Abierto
            </label>
        }
    }


    const agregarTipoOperacionLista = (item: any, CuentaBancoID: any) => {
        let existe = state.Form.DatosIniciales.Cuentas.find((respuesta: any) => {
            return parseInt(respuesta.CuentaBancoID) === parseInt(item.CuentaBancoID)
        })
        console.log(existe)
        if (existe === undefined) {
            state.Form.DatosIniciales.Cuentas.push(item)
            setState(s => ({
                ...s, Form: {
                    ...s.Form, DatosIniciales: state.Form.DatosIniciales
                }
            }))
        }
    }

    const filaEliminada = (valor: any) => {
        console.log(valor)
        let index = state.Form.DatosIniciales.Cuentas.findIndex((respuesta: any) => {
            return respuesta.CuentaBancoID === valor.CuentaBancoID
        })
        //state.Form.DatosIniciales.TiposOperaciones[index].Activa = !valor.Activa
        state.Form.DatosIniciales.Cuentas[index].Estatus = 2

        setState(s => ({
            ...s, Form: {
                ...s.Form, DatosIniciales: state.Form.DatosIniciales
            }
        }))
    }

    const filaEliminadaOffline = (valor: any) => {
        console.log(valor)
        let index = state.Form.DatosIniciales.Cuentas.findIndex((respuesta: any) => {
            return respuesta.CuentaBancoID === valor.CuentaBancoID
        })
        //state.Form.DatosIniciales.TiposOperaciones[index].Activa = !valor.Activa
        state.Form.DatosIniciales.Cuentas.splice(index, 1)

        setState(s => ({
            ...s, Form: {
                ...s.Form, DatosIniciales: state.Form.DatosIniciales
            }
        }))
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        FNGetLocal()
        FnGetCaja()
        /*   setState(state => ({
              ...state, Datos: state.Datos.map(Dato => Dato.PeriodoID === item.PeriodoID ? item : Dato)
          }
          ))
          let index = state.Datos.findIndex((res: any) => {
              return res.value === item.PeriodoID
          }) */
    }



    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, OptionsCuentasBanco: [], Form: { ...state.Form, Mostrar: false } })
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Cajas con cuentas de banco activas">
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
                                                        <input type="text" className="form-control" placeholder="Buscar periodo" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => {
                                                                setState({
                                                                    ...state,
                                                                    Form: {
                                                                        Mostrar: true,
                                                                        DatosIniciales: {
                                                                            CajaID: 0,
                                                                            NombreCaja: "",
                                                                            NumeroCuentas: 0,
                                                                            Producto: "",
                                                                            Cuentas: []
                                                                        },
                                                                        Id: undefined
                                                                    }
                                                                })
                                                            }


                                                            }
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"PeriodoID"}
                                        defaultSortField={"PeriodoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin xlarge={true} scrollable={true} open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Editar cuentas de la caja
                                                {/* {state.Form.Id ? "Editar Caja" : "Agregar Caja"} */}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                fnCuentas={FNGetCuentasBanco}
                                                filaEliminadaOffline={filaEliminadaOffline}
                                                filaNoModificada={filaEliminada}
                                                agregarTipoOperacionLista={agregarTipoOperacionLista}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.DatosIniciales}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                fnCancelar={fnCancelar}
                                                OptionsCaja={state.OptionsCajas}
                                                OptionsCuentasBanco={state.OptionsCuentasBanco}
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoCaja)