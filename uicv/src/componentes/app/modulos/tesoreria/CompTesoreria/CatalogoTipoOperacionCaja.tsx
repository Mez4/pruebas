import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoTipoOperacionCaja/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoTipoOperacionCaja/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
//import { exists } from 'node:fs'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { CFormCrearCaja } from './CatalogoTipoOperacionCaja/CFormCrearCaja'
import * as FuncionesCaja from '../CompTesoreria/CatalogoCaja/Funciones'
import { CFormCrearMovimiento } from './CatalogoTipoOperacionCaja/CFormCrearMovimiento'
import * as FuncionesMovimiento from '../CompTesoreria/CatalogoMovimientosCaja/Funciones'
import { iUI } from '../../../../../interfaces/ui/iUI'

type CatalogosType = {
    Seguridad: IOidc,
    iUI: iUI

}

const CatalogoTipoOperacionCaja = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    type operacionType = {
        cajaId: number,
        tipoOperacion: [
            {
                cajaTipoOperacionID: number,
                caja: {
                    cajaId: number
                },
                tipoOperacion: {
                    tipoMovID: number
                },
                activa: boolean, 
            }
        ]
    }

    const TiposOperaciones: any[] = []


    const DatosDefectoCrearMovimiento = {
        Id: 0,
        CveMovimientoID: '',
        TipoMovimiento: '',
        Cargo: false,
        usuario: false,
        CorresponsalId: 0,
        gastosRubroID: 0,
        MovAgrupaID: 0,
        AceptaDepositos: false,
        AceptaRetiros: false,
        AplicaIva: false,
        ManejaCuentasdeOrden: false,
        AplicaIde: false,
        PagaInteres: false,
        TasaInteres: 0,
        RetieneIsr: false,
        MontoApertura: 0,
        MontoMaximo: 0,
        AplicaComision: false,
        MontoComision: 0,
        DepositoId: 0,
        RetiroId: 0,
        ComisionId: 0,
        IvaId: 0,
        ProductoId: 0,
        Activa: true
    }
    const DatosDefectoCrearCaja = {
        CajaID: 0,
        Nombre: '',
        Clave: '',
        Descripcion: '',
        Estatus: true,
        UsuarioID: 0,
        SucursalID: 0,
        CuentaID: 0,
        BovedaID: 0,
        ResponsableID: 0,
    }
    const DatosDefectoCForm = {
        CajaID: 0,
        DescripcionCaja: "",
        TiposOperaciones: [
            {
                CajaID: 0,
                CajaTipoOperacionID: 0,
                Cargo: false,
                CuentaBancoId: 0,
                CveMovimientoID: "",
                Estatus: 0,
                Id: 0,
                NumeroCuenta: "",
                TipoMovimiento: "",
                usuario: false,
                Activa: false,
                PuedeRecibir: false,
                PuedeSacar: false,
            }
        ]
    }

    const DatosDefecto = {
        CajaID: 0,
        nombreCaja: '',
        TipoOperacionID: 0,
        TipoOperacion: [{
            cajaId: 0,
            tipoOperacion:
            {
                cajaTipoOperacionID: 0,
                caja: {
                    cajaId: 0
                },
                tipoOperacion: {
                    tipoMovimiento: "",
                    tipoMovID: 0
                },
                cuentaBanco: {
                    cuentaBancoID: 0
                }
            },
            activa: true,
            puedeSacar: true
            
        }]
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsMovimiento: any[] = []
    const OptionsCaja: any[] = []
    const OptionsCuentasBanco: any[] = []
    const OptionsUsuario: any[] = []
    const OptionsSucursal: any[] = []
    const OptionsCuenta: any[] = []
    const OptionsBoveda: any[] = []
    const OptionsAcumula: any[] = []
    const OptionsRubro: any[] = []
    const OptionsMovimiento2: any[] = []
    const OptionsCorresponsal: any[] = []
    const OptionsProducto: any[] = []

    const [state, setState] = React.useState({
        Habilitar: true,
        Datos,
        DatosMostrar,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        DatosIniciales: TiposOperaciones,
        Form:
        {
            BovedaID: 0,
            DescripcionCaja: "",
            Mostrar: false,
            MostrarCrearCaja: false,
            MostrarCrearMovimiento: false,
            Datos: DatosDefecto,
            DatosCrearCaja: DatosDefectoCrearCaja,
            DatosCrearMovimiento: DatosDefectoCrearMovimiento,
            Id: undefined,
            IdCrearMovimiento: undefined,
            DatosIniciales: DatosDefectoCForm,
            SucursalID: undefined
        },
        OptionsMovimiento,
        OptionsCaja,
        OptionsCuentasBanco,
        TiposOperaciones,
        OptionsUsuario,
        OptionsSucursal,
        OptionsCuenta,
        OptionsBoveda,

        OptionsAcumula,
        OptionsRubro,
        OptionsMovimiento2,
        OptionsCorresponsal,
        OptionsProducto
    })

    const activador = (valor: any) => {
        let index = state.Form.DatosIniciales.TiposOperaciones.findIndex((respuesta: any) => {
            return respuesta.Id === valor.Id
        })
        state.Form.DatosIniciales.TiposOperaciones[index].Activa = !valor.Activa
        state.Form.DatosIniciales.TiposOperaciones[index].Estatus = 1

        setState(s => ({
            ...s, Form: {
                ...s.Form, DatosIniciales: state.Form.DatosIniciales
            }
        }))
    }

    const activador2 = (valor: any) => {
        let index = state.Form.DatosIniciales.TiposOperaciones.findIndex((respuesta: any) => {
            return respuesta.Id === valor.Id
        })
        state.Form.DatosIniciales.TiposOperaciones[index].PuedeRecibir = !valor.PuedeRecibir
        state.Form.DatosIniciales.TiposOperaciones[index].Estatus = 1

        setState(s => ({
            ...s, Form: {
                ...s.Form, DatosIniciales: state.Form.DatosIniciales
            }
        }))
    }

    const activador3 = (valor: any) => {
        let index = state.Form.DatosIniciales.TiposOperaciones.findIndex((respuesta: any) => {
            return respuesta.Id === valor.Id
        })
        state.Form.DatosIniciales.TiposOperaciones[index].PuedeSacar = !valor.PuedeSacar
        state.Form.DatosIniciales.TiposOperaciones[index].Estatus = 1

        setState(s => ({
            ...s, Form: {
                ...s.Form, DatosIniciales: state.Form.DatosIniciales
            }
        }))
    }

    const activadorCuentaBanco = (valor: any) => {
        let index = state.Form.DatosIniciales.TiposOperaciones.findIndex((respuesta: any) => {
            return respuesta.Id === valor.Id
        })
        //state.Form.DatosIniciales.TiposOperaciones[index].Activa = !valor.Activa
        state.Form.DatosIniciales.TiposOperaciones[index].Estatus = 1

        setState(s => ({
            ...s, Form: {
                ...s.Form, DatosIniciales: state.Form.DatosIniciales
            }
        }))
    }

    const filaNoModificada = (valor: any) => {
        let index = state.Form.DatosIniciales.TiposOperaciones.findIndex((respuesta: any) => {
            return respuesta.Id === valor.Id
        })
        //state.Form.DatosIniciales.TiposOperaciones[index].Activa = !valor.Activa
        state.Form.DatosIniciales.TiposOperaciones[index].Estatus = 0

        setState(s => ({
            ...s, Form: {
                ...s.Form, DatosIniciales: state.Form.DatosIniciales
            }
        }))
    }

    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
               
                
                if (isMounted.current === true) {
                    respuesta.forEach((element: any) => {
                        element.tipoOperacion = element.tipoOperacion
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((element: any) => {
                        element.tipoOperacion = element.tipoOperacion
                    });
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Cajas
    const FnGetCaja = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCajas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var caja = respuesta.map((valor: any) => {
                        var obj = { value: valor.CajaID, label: valor.Nombre, bovedaId: valor.BovedaID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCaja: caja }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCaja: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Cuentas Banco
    const FnGetCuentasBanco = (productoID: any) => {
        setState(s => ({ ...s }))
        Funciones.FNGetCuentasBancos(props.Seguridad, productoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    
                    //var cuentasBanco= respuesta.filter(a=> a.SucursalID==state.Form.SucursalID)
                   
                    
                    var cuentaBanco = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta + " [" + valor.Producto + "]", producto: valor.ProductoID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCuentasBanco: cuentaBanco }))
                }
            })
            .catch(() => {
                //toast.error('No hay cuentas disponibles para la caja, debe agregar una nueva cuenta de banco.')
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCuentasBanco: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Movimientos Caja
    const FnGetMovimiento = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetMovimientos(props.Seguridad)
            .then((respuesta: any) => {
                
                if (isMounted.current === true) {
                    var movimiento = respuesta.map((valor: any) => {
                        var obj = { value: valor.tipoMovID, label: valor.tipoMovimiento, ProductoIDMov: valor.ProductoIDMov };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsMovimiento: movimiento }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsMovimiento: [] }))
                }
            })
    }

    const Columns: IDataTableColumn[] =
        [
            { name: 'Id', selector: 'CajaID', sortable: true, center: true, },
            {
                name: 'Nombre', selector: 'Nombre', sortable: true, center: true,
                cell: (props) => <span className="text-center">{props.Nombre} </span>
            },
            { name: 'Clave', selector: 'Clave', sortable: true, center: true, },
            {
                name: 'Descripción', selector: 'DescripcionCaja', sortable: true, center: true,
                cell: (props) => <span className="text-center">{props.DescripcionCaja} </span>
            },
            {
                name: 'Editar', sortable: false, center: true,
                cell: (propss) =>
                    <button className="asstext" type={"button"} onClick={async () => {
                        FnGetCuentasBanco(props.iUI.Producto?.ProductoID)
                        //props.iUI.Producto.ProductoID
                        //  FnGetCuentasBanco(props.CajaID)
                        /*        let operaciones: any[] = []
                               props.TiposOperacion.forEach((element: any) => {
                                   let operactionTipo = {
                                       CajaTipoOperacionID: element.CajaTipoOperacionID,
                                       CuentaBanco: element.NumeroCuenta,
                                       CuentaBancoID: element.CuentaBancoId,
                                       MovimientoID: element.Id,
                                       MovimientoDesc: element.TipoMovimiento,
                                       Activa: element.Activa,
                                   }
                                   operaciones.push(operactionTipo)
   
                               }); */
                                    
                                    
                        let nuevo = {
                            CajaID: propss.CajaID,
                            TiposOperaciones: propss.TiposOperacion,
                            DescripcionCaja: propss.DescripcionCaja
                        }

                        setState(s => ({
                            ...s,
                            Form: {
                                ...s.Form,
                                Mostrar: true,
                                DatosIniciales: nuevo,
                                Id: propss.CajaID,
                                BovedaID: propss.BovedaID,
                                DescripcionCaja: propss.DescripcionCaja,
                                SucursalID: propss.TiposOperacion[0].SucursalID
                            }
                        }))

                        
                    }}>
                        <FaPencilAlt />
                    </button>
            },
        ]

    const agregarTipoOperacionLista = (item: any, cajaId: any) => {
        /* let existe = state.Form.DatosIniciales.TiposOperaciones.find((respuesta: any) => {
            return parseInt(respuesta.Id) === parseInt(item.Id)
        })
        if (existe === undefined) { */
        state.Form.DatosIniciales.TiposOperaciones.push(item)
        setState(s => ({
            ...s, Form: {
                ...s.Form, DatosIniciales: state.Form.DatosIniciales
            }
        }))
        /*  } */
    }


    React.useEffect(() => {
        //If mounted current
        if (isMounted.current === true) {
            FNGetLocal()
            FnGetCaja()
            FnGetMovimiento()

        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    //useffect call FnGetCuentasBanco(props.iUI.Producto) when Producto get value
    React.useEffect(() => {
        if (isMounted.current === true) {
            if (props.iUI.Producto?.ProductoID != undefined) {
                console.log("PRODUCTO ACTUAL EN LA INTERFAZ ,", props.iUI.Producto)
                FnGetCuentasBanco(props.iUI.Producto.ProductoID)
            }
        }
        // eslint-disable-next-line
    }, [props.iUI.Producto?.ProductoID])

    React.useEffect(() => {
        FnGetCuentasBanco(props.iUI.Producto?.ProductoID)
        // eslint-disable-next-line
    }, [state.Form.SucursalID])
    




    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        toast.success('El movimiento caja se agrego correctamente')
        setState(state => ({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    CajaID: 0,
                    nombreCaja: '',
                    TipoOperacionID: 0,
                    TipoOperacion: [],
                }
            }
        }))
        FNGetDatos();
        FnGetCaja();
    }

    const cbActualizar2 = (item: any) => {
        //If mounted
        if (isMounted.current === true) {
           
            setState({
                ...state, Datos: state.Datos.map(Dato => Dato.CajaID === item.CajaID
                    ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }
            })
            FnGetCaja()
            FNGetLocal()
        }

    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('El movimiento se actualizo correctamente')
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    CajaID: 0,
                    nombreCaja: '',
                    TipoOperacionID: 0,
                    cajaTipoOperacionID: 0,
                    TipoOperacion: []
                }
            }
        }
        ))

        FNGetDatos()
    }
    const FnGetUsuario = (Nombre: string, callback: any) => {

        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        FuncionesCaja.FNGetUsuariosPOST(props.Seguridad, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var usuario = respuesta.map((valor: any) => {
                        var username = valor.nombre + ' ' + valor.apellidoPaterno + ' ' + valor.apellidoMaterno
                        var obj = { value: valor.personaID, label: username, usuarioId: valor.usuarioID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsUsuario: usuario }))
                    callback(usuario)

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsUsuario: [] }))
                    callback([])

                }
            })
    }
    const FnGetSucursal = () => {
        setState(s => ({ ...s }))
        FuncionesCaja.FNGetSucursales(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var sucursal = respuesta.map((valor: any) => {
                        var obj = { value: valor.sucursalId, label: valor.sucursal };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsSucursal: sucursal }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsSucursal: [] }))
                }
            })
    }
    const FnGetCuenta = () => {
        setState(s => ({ ...s }))
        FuncionesCaja.FNGetCuentas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var cuenta = respuesta.map((valor: any) => {
                        var obj = { value: valor.id, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCuenta: cuenta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCuenta: [] }))
                }

            })
    }
    const FnGetBoveda = () => {
        setState(s => ({ ...s }))
        FuncionesCaja.FNGetBovedas(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var boveda = respuesta.map((valor: any) => {
                        var obj = { value: valor.BovedaID, label: valor.NombreBoveda };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsBoveda: boveda }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsBoveda: [] }))
                }
            })
    }

    const abrirModalCaja = () => {
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, MostrarCrearCaja: true,

            }
        }
        ))
        // FnGetUsuario()
        FnGetSucursal()
        FnGetCuenta()
        FnGetBoveda()
    }

    const cerrarModalCaja = () => {
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, MostrarCrearCaja: false,

            }
        }
        ))
        FnGetCaja()
    }
    const FnGetAcumula = () => {
        setState(s => ({ ...s }))
        FuncionesMovimiento.FNGetContable(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var acumula = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaID, label: valor.Nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsAcumula: acumula }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsAcumula: [] }))
                }
            })
    }
    const FnGetRubro = () => {
        setState(s => ({ ...s }))
        FuncionesMovimiento.FNGetRubros(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var rubro = respuesta.map((valor: any) => {
                        var obj = { value: valor.gastosRubroID, label: valor.gastosRubroDesc };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsRubro: rubro }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsRubro: [] }))
                }
            })
    }
    const FnGetMovimiento2 = () => {
        setState(s => ({ ...s }))
        FuncionesMovimiento.FNGetMovimientos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var movimiento = respuesta.map((valor: any) => {
                        var obj = { value: valor.movAgrupaId, label: valor.nombre };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsMovimiento2: movimiento }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsMovimiento2: [] }))
                }
            })
    }
    const FnGetCorresponsal = () => {
        setState(s => ({ ...s }))
        FuncionesMovimiento.FNGetCorresponsales(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var corresponsal = respuesta.map((valor: any) => {
                        var obj = { value: valor.corresponsalId, label: valor.corresponsalDesc };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCorresponsal: corresponsal }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCorresponsal: [] }))
                }
            })
    }
    const FnGetProducto = () => {
        setState(s => ({ ...s }))
        FuncionesMovimiento.FNGetProductos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var producto = respuesta.map((valor: any) => {
                        var obj = { value: valor.productoID, label: valor.producto };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsProducto: producto }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsProducto: [] }))
                }
            })
    }

    const abrirModalCrearMovimiento = () => {
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, MostrarCrearMovimiento: true,

            }
        }
        ))
        FnGetProducto()
        FnGetCorresponsal()
        FnGetMovimiento2()
        FnGetRubro()
        FnGetAcumula()
    }

    const cerraModalMovimiento = () => {
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, MostrarCrearMovimiento: false,

            }
        }
        ))
        FnGetMovimiento()
    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => {
        FNGetLocal()
        setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    }

    
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Tipos de operaciones por caja">
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
                                                        <input type="text" className="form-control" placeholder="Buscar caja" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => {
                                                                state.Form.Datos.TipoOperacion.splice(0, 1)
                                                                setState({
                                                                    ...state, Form: {
                                                                        ...state.Form,

                                                                        Mostrar: true,
                                                                        DatosIniciales: {
                                                                            CajaID: 0,
                                                                            DescripcionCaja: "",
                                                                            TiposOperaciones: []
                                                                        },
                                                                        Datos: {
                                                                            CajaID: 0,
                                                                            nombreCaja: '',
                                                                            TipoOperacionID: 0,
                                                                            TipoOperacion: []
                                                                        }, Id: undefined
                                                                    }
                                                                })
                                                            }}
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
                                        keyField={"cajaId"}
                                        defaultSortField={"cajaId"}
                                        columns={Columns}
                                    />
                                    <ModalWin xlarge={true} open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Tipo de Operación" : "Agregar Tipo de Operación"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                iUI={props.iUI}
                                                filaNoModificada={filaNoModificada}
                                                modificado={activadorCuentaBanco}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.DatosIniciales}
                                                DescripcionCaja={state.Form.DescripcionCaja}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar2}
                                                cbGuardar={cbAgregar}
                                                agregarTipoOperacionLista={agregarTipoOperacionLista}
                                                fnCancelar={fnCancelar}
                                                activador={activador}
                                                activador2={activador2}
                                                activador3={activador3}
                                                FnGetCuentasBanco={FnGetCuentasBanco}
                                                optionsCaja={state.OptionsCaja}
                                                optionsMovimiento={state.OptionsMovimiento}
                                                OptionsCuentasBanco={state.OptionsCuentasBanco}
                                                abrirModalCaja={abrirModalCaja}
                                                abrirModalCrearMovimiento={abrirModalCrearMovimiento}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin large={true} open={state.Form.MostrarCrearCaja} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Agregar Caja
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormCrearCaja
                                                fnGetClientes={FnGetUsuario}
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.DatosCrearCaja}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={cerrarModalCaja}
                                                options={state.OptionsUsuario}
                                                options2={state.OptionsSucursal}
                                                options3={state.OptionsCuenta}
                                                options4={state.OptionsBoveda}
                                                options5={state.OptionsUsuario}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin xlarge={true} open={state.Form.MostrarCrearMovimiento} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Agregar Movimientos Caja
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormCrearMovimiento
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.DatosCrearMovimiento}
                                                Id={state.Form.IdCrearMovimiento}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={cerraModalMovimiento}
                                                options={state.OptionsAcumula}
                                                optionsRubro={state.OptionsRubro}
                                                optionsMovimiento={state.OptionsMovimiento2}
                                                optionsCorresponsal={state.OptionsCorresponsal}
                                                optionsProducto={state.OptionsProducto}

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
    Seguridad: state.oidc,
    iUI: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoTipoOperacionCaja)