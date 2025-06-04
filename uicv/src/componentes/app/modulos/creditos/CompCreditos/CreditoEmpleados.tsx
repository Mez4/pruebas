import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import PersonasDatosBancarios from '../../general/CompGeneral/PersonasDatosBancarios/PersonasDatosBancarios'
import Credito from './Credito'
import { AgregarCliente } from './CreditoCliente/AgregarCliente'
import { SeleccionarCajaSucursal } from '../../../../selectores'
import * as FnCajas from '../../tesoreria/CompTesoreria/CajasUsuarios/Funciones'
// import * as Funciones from './CreditoVale/Funciones'
import * as FnProductos from './CreditoProducto/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import * as FnPersona from '../../general/CompGeneral/Empleado/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
import * as FnSeries from '../../distribuidor/CompDistribuidor/CatalogoValeraSeries/Funciones'
import * as FnTiposDesmbolso from '../../tesoreria/CompTesoreria/BancoTipoDesembolso/Funciones'
import * as FnVariablesGlobales from '../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones'
import * as FnCreditoCondicionDetalle from './CreditoCondicionDetalle/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import UseWindowSize from '../../../../global/UseWindowSize'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCreditCard, FaWindowClose, FaUserPlus, FaCashRegister, FaShoppingCart } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoEmpleados/CForm'
// import CreditoArticulos from './CreditoArticulos'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, range } from '../../../../../global/functions'
import { toast } from 'react-toastify'
import { Switch } from 'react-router'

type CatalogosType = {
    oidc: IOidc,
    DatosForm?: {
        CreditoID: number,
        ProductoId: number,        
        DistribuidorId: number,
        ClienteId: number,
        SucursalId: number,
        CajaID: number,
        EmpleadoId: number,
        Folio: number,
        SerieId: number,
        Capital: number,        
        interes: number,
        manejo: number,
        iva: number,
        Plazos: number,
        Cuenta: string,
        TipoDesembolsoID: number,
        datoBancario: string,
        personasDatosBancariosID: number,
        RequiereDatosBancarios: boolean,
        Motivo: string,
        InteresVG: string,
        ManejoVG: string,
        IvaVG: string,
    },
    callBack?(res: any): any
}

const CreditoEmpleados = (props: CatalogosType) => {
    const { width } = UseWindowSize();
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        ProductoId: 0,
        DistribuidorId: 0,
        ClienteId: 0,
        SucursalId: 0,
        CajaID: 0,
        EmpleadoId: 0,
        Folio: 0,
        SerieId: 0,
        Capital: 0,
        interes: 0,
        manejo: 0,
        iva: 0,
        Plazos: 0,
        Cuenta: '',
        TipoDesembolsoID: 0,
        datoBancario: '',
        RequiereDatosBancarios: false,
        Motivo: '',
        InteresVG: '0',
        ManejoVG: '0',
        IvaVG: '0',
    }
    const Producto = {
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
    const ProductoPresEmpl = {
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
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const Clientes: any[] = []
    const TiposDesembolso: any[] = []
    const Distribuidores: any[] = []
    const Empleados: any[] = []
    const Folios: any[] = []
    const CondicionesDetalle: any[] = []
    const DatosCliente: {} = {}
    const DatosDistribuidor: {} = {}
    const DatosEmpleado: {} = {}
    const DatosFolio: {} = {}
    const DatosTipoDesembolso: {} = {}
    // const optProductos: any[] = []
    const optDistribuidores: any[] = []
    const optSucursales: any[] = []
    const optEmpleados: any[] = []
    const optTiposDesembolso: any[] = []
    const optCapital: any[] = []
    const optPlazos: any[] = []
    const optFolios: any[] = []
    const optSeries: any[] = []
    const CajaDefault = {
        ProductoID: 0,
        SucursalID: 0,
        CajaID: 0
    }
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: 0,
            evento: ''
        },
        optEmpleados,
        optDistribuidores,
        optSucursales,
        optTiposDesembolso,
        optCapital,
        optPlazos,
        optFolios,
        optSeries,
        isUpdate: false,
        Clientes,
        TiposDesembolso,
        Distribuidores,
        Empleados,
        Folios,
        CondicionesDetalle,
        DatosCliente,
        DatosDistribuidor,
        DatosEmpleado,
        DatosFolio,
        DatosTipoDesembolso,
        ShowDatosBancarios: false,
        ShowCliente: false,
        ShowCredito: false,
        PersonaID: 0,
        CreditoID: 0,
        Producto,
        ProductoPresEmpl,
        InteresVG: '0',
        ManejoVG: '0',
        IvaVG: '0',
        ShowCaja: true,
        CajaDefault
    })

    const FNGetVariablesGlobales = () => {
        let datosInteres = { Id: 19, varName: 'INTERES' }
        FnVariablesGlobales.FNGet(props.oidc, datosInteres)
            .then((respuesta1: any) => {
                // console.log(respuesta1)
                setState(s => ({ ...s, Form: { ...s.Form, Datos: { ...s.Form.Datos, InteresVG: respuesta1.varValue } } }))
            })
            .catch(() => {
                setState(s => ({ ...s, Form: { ...s.Form, Datos: { ...s.Form.Datos, InteresVG: '' } } }))
            })

        let datosManejo = { Id: 18, varName: 'MANEJO_CUENTA' }
        FnVariablesGlobales.FNGet(props.oidc, datosManejo)
            .then((respuesta2: any) => {
                setState(s => ({ ...s, Form: { ...s.Form, Datos: { ...s.Form.Datos, ManejoVG: respuesta2.varValue } } }))
            })
            .catch(() => {
                setState(s => ({ ...s, Form: { ...s.Form, Datos: { ...s.Form.Datos, ManejoVG: '' } } }))
            })

        let datosIVA = { Id: 4, varName: 'IVA' }
        FnVariablesGlobales.FNGet(props.oidc, datosIVA)
            .then((respuesta3: any) => {
                setState(s => ({ ...s, Form: { ...s.Form, Datos: { ...s.Form.Datos, IvaVG: respuesta3.varValue } } }))
            })
            .catch(() => {
                setState(s => ({ ...s, Form: { ...s.Form, Datos: { ...s.Form.Datos, IvaVG: '' } } }))
            })
    }

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
                        RequiereEmpleado: false,
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

    const FnGetProductoPresEmpl = () => {
        FnProductos.FNGetProdPresEmpl(props.oidc, state.Producto.EmpresaId)
            .then((respuesta: any) => {

                // var productos = respuesta.map((valor: any) => {
                //     var obj = { value: valor.ProductoID, label: valor.Producto };
                //     return obj
                // });

                setState(s => ({ ...s, ProductoPresEmpl: respuesta }))

            })
            .catch(() => {
                setState(s => ({
                    ...s,
                    ProductoPresEmpl: {
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

    const fnGetDistribuidores = (SucursalID?: number) => {
        if (SucursalID! > 0)
            FnDistribuidores.FNGetBySucursalProd(props.oidc, SucursalID)
                .then((respuesta: any) => {

                    //  console.log(respuesta)

                    var distribuidores = respuesta.map((valor: any) => {
                        var obj = { value: valor.DistribuidorID, label: valor.PersonaNombre };
                        return obj
                    });

                    setState(s => ({ ...s, optDistribuidores: distribuidores, Distribuidores: respuesta }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optDistribuidores: [], Distribuidores: [] }))
                })
    }

    const fnGetEmpleados = (SucursalID: number, Nombre: string, callback: any) => {
        if (SucursalID! > 0) {

            let Datos = { SucursalID, Nombre }

            FnPersona.FNGetBySucursal(props.oidc, Datos)
                .then((respuesta: any) => {

                    var empleados = respuesta.map((valor: any) => {
                        var obj = { value: valor.PersonaID, label: valor.PersonaID + ' - ' + valor.NombreCompleto };
                        return obj
                    });
                    let Estatus = respuesta[0].Est_cod
                    //  console.log('respuesta: ', respuesta)
                    let productoID = respuesta[0].ProductoID

                    setState(s => ({ ...s, optEmpleados: empleados, Empleados: respuesta, DatosEmpleado: { ...Estatus, productoID } }))

                    callback(empleados)
                })
                .catch(() => {
                    setState(s => ({ ...s, optEmpleados: [], Empleados: [], DatosEmpleado: {} }))

                    callback([])
                })
        }
    }

    const cbDatosEmpleado = (res: any, id: number) => {   
        let DatosEmpleado = res.find(Dato => Dato.PersonaID == id)
        setState(s => ({ ...s, DatosEmpleado: { ...DatosEmpleado.Est_cod, ...DatosEmpleado.ProductoID } }))

    }

    const fnGetSucursales = () => {
        FnSucursales.FNGet(props.oidc)
            .then((respuesta: any) => {

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });

                setState(s => ({ ...s, optSucursales: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursales: [] }))
            })
    }

    const fnGetSucursalesCaja = () => {
        FnCajas.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {

                // console.log('respuesta: ', respuesta)

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
        setState(s => ({ ...s, Form: { ...state.Form, Datos: {...state.Form.Datos, SucursalId: Data.SucursalID, CajaID: Data.CajaID} }, ShowCaja: false }))
        fnGetTiposDesembolso(Data.SucursalID, 0)
    }

    const fnGetTiposDesembolso = (SucursalId: number, ProductoID: number) => {
        if(state.isUpdate)
        {
            FnTiposDesmbolso.FNGetSucursalProductoModificable(props.oidc, SucursalId, ProductoID)
            .then((respuesta: any) => {

                // console.log('fnGetTiposDesembolso: ', respuesta)

                var tiposDesembolso = respuesta.map((valor: any) => {
                    var obj = { value: valor.TipoDesembolsoID, label: valor.TipoDesembolso };
                    return obj
                });

                setState(s => ({ ...s, optTiposDesembolso: tiposDesembolso, TiposDesembolso: respuesta }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTiposDesembolso: [], TiposDesembolso: [] }))
            })
        } else {
            FnTiposDesmbolso.FNGetSucursalProducto(props.oidc, SucursalId, ProductoID)
                .then((respuesta: any) => {

                    var tiposDesembolso = respuesta.map((valor: any) => {
                        var obj = { value: valor.TipoDesembolsoID, label: valor.TipoDesembolso };
                        return obj
                    });

                    setState(s => ({ ...s, optTiposDesembolso: tiposDesembolso, TiposDesembolso: respuesta }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optTiposDesembolso: [], TiposDesembolso: [] }))
                })
        }
    }

    const fnGetCondicionesDetalle = (ProductoID: number, SucursalId?: number, DistribuidorID?: number) => {
        let Datos = {
            ProductoID,
            SucursalId: SucursalId as number,
            DistribuidorID: DistribuidorID as number,
        }

        console.log('fnGetCondicionesDetalle: ', Datos)

        if (ProductoID! > 0 && SucursalId! > 0)
            FnCreditoCondicionDetalle.FNGetCondicionesbyProd(props.oidc, Datos)
                .then((respuesta: any) => {

                    let arr = range(respuesta[0].ImporteMinimo, respuesta[0].ImporteMaximo, 500)

                    arr = arr.reverse()

                    let capital = arr.map((valor: any) => {
                        var obj = { value: valor, label: valor };
                        return obj
                    });

                    arr = range(respuesta[0].PlazosMinimos, respuesta[0].PlazosMaximos, 2)

                    arr = arr.reverse()

                    let plazos = arr.map((valor: any) => {
                        var obj = { value: valor, label: valor };
                        return obj
                    });

                    setState(s => ({ ...s, CondicionesDetalle: respuesta, optCapital: capital, optPlazos: plazos }))
                })
                .catch(() => {
                    setState(s => ({ ...s, CondicionesDetalle: [], optCapital: [], optPlazos: [] }))
                })
    }

    useEffect(() => {

        if (isMounted.current === true) {
            FNGetVariablesGlobales()
            FnGetProducto()
            // fnGetSucursales()
            fnGetSucursalesCaja()
        }

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {

        if(props.DatosForm)
        {       
        
            console.log('DatosForm: ', props.DatosForm)

            setState(s => ({
                ...s, Form: {
                    ...state.Form, 
                    Datos: {...state.Form.Datos, 
                        CreditoID: props.DatosForm ? props.DatosForm!.CreditoID : 0,
                        ProductoId:  props.DatosForm ? props.DatosForm!.ProductoId : 0,                        
                        DistribuidorId: props.DatosForm ? props.DatosForm!.DistribuidorId : 0,                    
                        ClienteId: props.DatosForm ? props.DatosForm!.ClienteId : 0,
                        SucursalId: props.DatosForm ? props.DatosForm!.SucursalId : 0,
                        CajaID: props.DatosForm ? props.DatosForm!.CajaID : 0,
                        EmpleadoId: props.DatosForm ? props.DatosForm!.EmpleadoId : 0,
                        Folio: props.DatosForm ? props.DatosForm!.Folio : 0,
                        SerieId: props.DatosForm ? props.DatosForm!.SerieId : 0,
                        Capital: props.DatosForm ? props.DatosForm!.Capital  : 0,
                        interes: props.DatosForm ? props.DatosForm!.interes  : 0,
                        manejo: props.DatosForm ? props.DatosForm!.manejo  : 0,
                        iva: props.DatosForm ? props.DatosForm!.iva  : 0,
                        Plazos: props.DatosForm ? props.DatosForm!.Plazos : 0,
                        Cuenta: props.DatosForm ? props.DatosForm!.Cuenta : '',
                        TipoDesembolsoID: props.DatosForm ? props.DatosForm!.TipoDesembolsoID : 0,
                        datoBancario: props.DatosForm ? props.DatosForm!.datoBancario  : '',
                        personasDatosBancariosID: props.DatosForm ? props.DatosForm!.personasDatosBancariosID : 0,
                        RequiereDatosBancarios: props.DatosForm ? props.DatosForm!.RequiereDatosBancarios : false,
                        Motivo: props.DatosForm ? props.DatosForm!.Motivo  : '',
                        InteresVG: props.DatosForm ? props.DatosForm!.InteresVG  : '',
                        ManejoVG: props.DatosForm ? props.DatosForm!.ManejoVG  : '',
                        IvaVG: props.DatosForm ? props.DatosForm!.IvaVG  : '',
                    },
                    Id: props.DatosForm ? props.DatosForm!.CreditoID : 0
                }, 
                isUpdate: true
            }))

            fnGetCondicionesDetalle(props.DatosForm!.ProductoId, props.DatosForm!.SucursalId, 0)

            fnGetTiposDesembolso(props.DatosForm!.SucursalId, props.DatosForm!.ProductoId)
        }
    }, [props.DatosForm])

    useEffect(() => {
        FnGetProductoPresEmpl()
    }, [state.Producto])

    useEffect(() => {
        fnGetDatosDistribuidor(state.Form.Datos.DistribuidorId)
    }, [state.Form.Datos.DistribuidorId])

    useEffect(() => {
        fnGetDatosEmpleado(state.Form.Datos.EmpleadoId)
    }, [state.Form.Datos.EmpleadoId])

    useEffect(() => {
        fnGetDatosCliente(state.Form.Datos.ClienteId)
    }, [state.Form.Datos.ClienteId])

    useEffect(() => {
        fnGetDistribuidores(state.Form.Datos.SucursalId)
    }, [state.Form.Datos.SucursalId])

    useEffect(() => {
        fnGetTiposDesembolso(state.Form.Datos.SucursalId, state.Producto.ProductoID)
    }, [state.Form.Datos.SucursalId, state.Producto.ProductoID])

    useEffect(() => {
        fnGetDatosFolios(state.Form.Datos.Folio)
    }, [state.Form.Datos.Folio])

    /** funcion Callback al agregar un item */
    const cbAgregar = (res: any) => {
        setState(s => ({ ...s, ShowCredito: true, CreditoID: res.CreditoId }))
        props.callBack!(res)
    }

    const cbDatosBancarios = (item: any) =>
        setState(s => ({ ...s, ShowDatosBancarios: false }))

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === item.ProductoID && Dato.SucursalId === item.SucursalId ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        }))

    const cbStore = (res: any) =>
        setState(s => ({ ...s, ShowStore: false, ShowCredito: true, CreditoID: res.CreditoId }))

    /** funcion para cancelar la forma */
    const fnCancelar = () =>{
         setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))
         if(props.callBack)
            props.callBack({})
    }

    const fnGetDatosDistribuidor = (DistribuidorID?: number) => {
        let distribuidor = state.Distribuidores.find(Dato => Dato.DistribuidorID === DistribuidorID)
        setState(s => ({ ...s, DatosDistribuidor: distribuidor ? distribuidor : {} }))
    }

    const fnGetDatosEmpleado = (EmpleadoID?: number) => {
        // let empleado = state.Empleados.find(Dato => Dato.EmpleadoID === EmpleadoID)
        // setState(s => ({ ...s, DatosEmpleado: empleado ? empleado : {} })) 
    }

    const fnGetDatosCliente = (PersonaID?: number) => {
        let cliente = state.Clientes.find(Dato => Dato.PersonaID === PersonaID)
        setState(s => ({ ...s, DatosCliente: cliente ? cliente : {}, PersonaID: PersonaID as number }))
    }

    const fnGetDatosTipoDesembolso = (TipoDesembolsoID: number) => {
        let tipoDesembolso = state.TiposDesembolso.find(Dato => Dato.TipoDesembolsoID === TipoDesembolsoID)
        setState(s => ({ ...s, DatosTipoDesembolso: tipoDesembolso ? tipoDesembolso : {}, TipoDesembolsoID: TipoDesembolsoID as number }))
    }

    const fnGetDatosFolios = (Folio: number) => {
        let folio = state.Folios.find(Dato => Dato.Folio === Folio)
        setState(s => ({ ...s, DatosFolio: folio ? folio : {} }))
    }

    const fnGetListaPlazos = (Capital?: number) => {
        let arr = range(2, 10, 2)

        arr = arr.reverse()
        let plazos = arr.map((valor: any) => {
            var obj = { value: valor, label: valor };
            return obj
        });

        setState(s => ({ ...s, optPlazos: plazos }))
    }

    const fnGetListaCapital = () => {
        let arr = range(500, 10000, 500)

        arr = arr.reverse()
        let capital = arr.map((valor: any) => {
            var obj = { value: valor, label: valor };
            return obj
        });

        setState(s => ({ ...s, optCapital: capital }))

    }

    return (
        // <div class="columns is-desktop">
        //     <div class="column">1</div>
        //     <div class="column">2</div>
        // </div>
        // <div className="row">
        <div className="columns is-desktop">
            <div className="column">
                {/* </div>
            <div className="column is-10-desktop is-full-tablet is-full-mobile "> */}
                <Card Title="Crédito de Empleado">
                    <Card.Body>
                        <Card.Body.Content>
                            {/* {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error && */}
                            <div>

                                <CForm
                                    oidc={props.oidc}
                                    ProductoID={state.Producto.ProductoID}
                                    evento={state.Form.evento}
                                    initialValues={state.Form.Datos}
                                    Id={state.Form.Id}
                                    optDistribuidores={state.optDistribuidores}
                                    optSucursales={state.optSucursales}
                                    optEmpleados={state.optEmpleados}
                                    optTiposDesembolso={state.optTiposDesembolso}
                                    optCapital={state.optCapital}
                                    optPlazos={state.optPlazos}
                                    optFolios={state.optFolios}
                                    optSeries={state.optSeries}
                                    cbActualizar={cbActualizar}
                                    cbGuardar={cbAgregar}
                                    fnCancelar={fnCancelar}
                                    DatosCliente={state.DatosCliente}
                                    DatosDistribuidor={state.DatosDistribuidor}
                                    DatosEmpleado={state.DatosEmpleado}
                                    InteresVG={state.InteresVG}
                                    ManejoVG={state.ManejoVG}
                                    IvaVG={state.IvaVG}
                                    DatosFolio={state.DatosFolio}
                                    DatosTipoDesembolso={state.DatosTipoDesembolso}
                                    fnGetEmpleados={fnGetEmpleados}
                                    cbDatosEmpleado={cbDatosEmpleado}
                                    fnGetDistribuidores={fnGetDistribuidores}
                                    fnGetTiposDesembolso={fnGetTiposDesembolso}
                                    fnGetDatosDistribuidor={fnGetDatosDistribuidor}
                                    fnGetDatosEmpleado={fnGetDatosEmpleado}
                                    fnGetDatosFolios={fnGetDatosFolios}
                                    fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                                    fnGetListaPlazos={fnGetListaPlazos}
                                    fnGetListaCapital={fnGetListaCapital}
                                    fnGetDatosTipoDesembolso={fnGetDatosTipoDesembolso}
                                    FNGetVariablesGlobales={FNGetVariablesGlobales}
                                    isUpdate={state.isUpdate}
                                // ShowStore={state.ShowStore}
                                />
                                {/* </ModalWin.Body>
                                    </ModalWin> */}

                                {state.ShowDatosBancarios &&
                                    <ModalWin open={state.ShowDatosBancarios} scrollable>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Datos Bancarios del Cliente
                                            </h5>
                                            <button type="button" className="delete" onClick={() => setState(s => ({ ...s, ShowDatosBancarios: false }))} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowDatosBancarios &&
                                                <PersonasDatosBancarios
                                                    PersonaID={state.PersonaID}
                                                    cbGuardar={cbDatosBancarios}
                                                />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>
                                }

                                {state.ShowCredito &&
                                    <ModalWin open={state.ShowCredito} full={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Consulta de Crédito
                                            </h5>
                                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => setState(s => ({ ...s, ShowCredito: false }))}>
                                                <FaWindowClose size={20} />
                                            </button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowCredito &&
                                                <div className="row">
                                                    <div className="col-10">
                                                        <Credito
                                                            CreditoID={state.CreditoID}
                                                        />
                                                    </div>
                                                    <div className="col-2">
                                                        <button className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => {
                                                            setState(s => ({ ...s, ShowCredito: true }))
                                                        }}>
                                                            Entregar <FaCashRegister />
                                                        </button>
                                                    </div >
                                                </div>
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>
                                }

                                {state.ShowCaja &&
                                    <ModalWin open={state.ShowCaja} large scrollable>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Selección de Caja
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowCaja &&
                                                <SeleccionarCajaSucursal
                                                    optSucursales={state.optSucursales}
                                                    initialValues={state.CajaDefault}
                                                    cbAceptar={fnSetSucCaja}
                                                />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoEmpleados)