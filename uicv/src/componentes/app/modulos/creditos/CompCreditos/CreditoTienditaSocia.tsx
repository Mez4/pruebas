import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import PersonasDatosBancarios from '../../general/CompGeneral/PersonasDatosBancarios/PersonasDatosBancarios'
// import Credito from './Credito'
import { AgregarConPersona } from '../../seguridad/CompSeguridad/CompAdministracionUsuarios'
import { SeleccionarCajaSucursal } from '../../../../selectores'
import * as FnCajas from '../../tesoreria/CompTesoreria/CajasUsuarios/Funciones'
// import * as Funciones from './CreditoVale/Funciones'
import * as FnProductos from './CreditoProducto/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
import * as FnClientes from '../../distribuidor/CompDistribuidor/Cliente/Funciones'
import * as FnPersona from '../../general/CompGeneral/Empleado/Funciones'
import * as FnCuenta from '../../bancos/CompBancos/BancoCuenta/Funciones'
// import { FNGetCuentasBancos } from '../../tesoreria/CompTesoreria/CatalogoTipoOperacionCaja/Funciones'
// import * as FnSeries from '../../distribuidor/CompDistribuidor/CatalogoValeraSeries/Funciones'
import * as FnTiposDesmbolso from '../../tesoreria/CompTesoreria/BancoTipoDesembolso/Funciones'
import * as FnCreditoCondicionDetalle from './CreditoCondicionDetalle/Funciones'
import * as FnVariablesGlobales from '../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import UseWindowSize from '../../../../global/UseWindowSize'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCreditCard, FaWindowClose, FaUserPlus, FaCashRegister, FaShoppingCart } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
// import CreditoArticulos from './CreditoArticulos'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, range } from '../../../../../global/functions'
import { toast } from 'react-toastify'
import { number } from 'yup/lib/locale'

import { iUI } from '../../../../../interfaces/ui/iUI'
import { CForm } from './CreditoTienditaSocia/CForm'
import { CtxCreditoTiendita, CtxInitCreditoTiendita } from './CreditoTienditaSocia/CreditoTienditaContext'

type CatalogosType = {
    oidc: IOidc,
    iUI: iUI,
    DatosForm?: {
        CreditoID: number,
        ProductoId: number,
        DistribuidorId: number,
        ClienteId: number,
        SucursalId: number,
        SucursalDistID?: number,
        Distribuidor?: string,
        Sucursal?: string,
        CajaID: number,
        Folio: number,
        SerieId: number,
        Capital: number,
        Plazos: number,
        Cuenta: string,
        TipoDesembolsoID: number,
        personasDatosBancariosID: number,
        RequiereDatosBancarios: boolean,
        FechaExpedicion: any,
        NombreBeneficiario: string,
        ApellidoPaternoBeneficiario: string,
        ApellidoMaternoBeneficiario: string,
        ParentescoBeneficiario: string,
        FechaNacimientoBeneficiario: Date | null
    }
}

const CreditoTienditaSocia = (props: CatalogosType) => {
    const { width } = UseWindowSize();
    const [ArticulosSelector, setArticulosSelector] = useState([])
    const [ArticulosCarrito, setArticulosCarrito] = useState([])
    const [InfoToSent, setInfoToSent] = useState({
        totalItems: 0,
        totalPrice: 0,
        totalQty: 0,
        totalPriceOrg: 0,
    })
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        DistribuidorID: 0,
        SucursalId: 0,
        CajaID: 0,
        Plazos: 0,
        TipoDesembolsoID: 0
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
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const Clientes: any[] = []
    const Distribuidores: any[] = []
    const Folios: any[] = []
    const CondicionesDetalle: any[] = []
    const DatosCliente: {} = {}
    const DatosDistribuidor: any = {}
    const DatosFolio: {} = {}
    const TiposDesembolso: {} = {}
    // const optProductos: any[] = []
    const optDistribuidores: any[] = []
    const optSucursales: any[] = []
    const optClientes: any[] = []
    const optTiposDesembolso: any[] = []
    const optCapital: any[] = []
    const optPlazos: any[] = []
    const optCuenta: any[] = []
    const optFolios: any[] = []
    const optSeries: any[] = []
    const CajaDefault = {
        ProductoID: 0,
        SucursalID: 0,
        CajaID: 0
    }
    const TabTiendita:
        {
            ProductoID: number
            DistribuidorNivelID: number
            PorcComisionBase: number
            CapitalColocadoMinimo: number
            CapitalColocadoMaximo: number
            ImporteProteccionSaldo: number
            importeMaxCanje: number
            maximoPrestamoPersonal: number
            maximoImporteCanjeCliente: number
            maximoImporteCanjeAval: number
            monto: number
        } = {
        ProductoID: 0,
        DistribuidorNivelID: 0,
        PorcComisionBase: 0,
        CapitalColocadoMinimo: 0,
        CapitalColocadoMaximo: 0,
        ImporteProteccionSaldo: 0,
        importeMaxCanje: 0,
        maximoPrestamoPersonal: 0,
        maximoImporteCanjeCliente: 0,
        maximoImporteCanjeAval: 0,
        monto: 0
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
            Id: undefined
        },
        // optProductos,
        optDistribuidores,
        optSucursales,
        optClientes,
        optTiposDesembolso,
        optCapital,
        optPlazos,
        optCuenta,
        optFolios,
        optSeries,
        isUpdate: false,
        Clientes,
        Distribuidores,
        Folios,
        CondicionesDetalle,
        DatosCliente,
        DatosDistribuidor,
        DatosFolio,
        TiposDesembolso,
        ShowDatosBancarios: false,
        ShowCliente: false,
        ShowCredito: false,
        // ShowStore: false,
        PersonaID: 0,
        CreditoID: 0,
        Producto,
        Sistema: '',
        ProdTiendita: 0,
        TabTiendita,
        ShowCaja: true,
        CajaDefault
    })


    const FNGetVariablesGlobales = () => {
        let datos = { Id: 22, varName: 'SISTEMA_TIENDITA' }
        FnVariablesGlobales.FNGet(props.oidc, datos)
            .then((respuesta: any) => {
                // console.log('respuesta: ', respuesta)
                setState(s => ({ ...s, Sistema: respuesta.varValue }))
            })
            .catch(() => {
                setState(s => ({ ...s, Sistema: '' }))
            })

        // if (state.Producto.EmpresaId == 6) {
        //     datos = { Id: 33, varName: 'ID_PRODUCTO_TIENDITA_PS' }
        // } else {
        //     datos = { Id: 26, varName: 'ID_PRODUCTO_TIENDITA' }
        // }
        FnProductos.FNGetTiendita(props.oidc)
            .then((respuesta: any) => {
                // console.log(respuesta1)
                setState(s => ({ ...s, ProdTiendita: respuesta.ProductoID }))
            })
            .catch(() => {
                setState(s => ({ ...s, ProdTiendita: 0 }))
            })
    }

    const FnGetProducto = () => {
        FnProductos.FNGet(props.oidc, props.iUI.Producto?.ProductoID)
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

    const fnGetDistribuidores = (SucursalID?: number) => {
        if (SucursalID! > 0)
            FnDistribuidores.FNGetBySucursalProd(props.oidc, SucursalID)
                .then((respuesta: any) => {

                    // console.log('respuesta: ', respuesta)

                    var distribuidores = respuesta.map((valor: any) => {
                        var obj = { value: valor.DistribuidorID, label: valor.DistribuidorID + ' - ' + valor.PersonaNombre };
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

                    setState(s => ({ ...s, optClientes: empleados, Clientes: respuesta }))

                    callback(empleados)
                })
                .catch(() => {
                    setState(s => ({ ...s, optClientes: [], Clientes: [] }))

                    callback([])
                })
        }
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
        setState(s => ({ ...s, Form: { ...state.Form, Datos: { ...state.Form.Datos, SucursalId: Data.SucursalID, CajaID: Data.CajaID } }, ShowCaja: false }))
        fnGetCuentas(0, Data.SucursalID)
    }

    const FnGetSucursalEmpleado = () => {
        FnPersona.FNGetById(props.oidc)
            .then((res: any) => {
                if (res.length > 0)
                    FnCajas.FNGetbySucursalSaldo(props.oidc, res[0].SucursalID)
                        .then((res2: any) => {
                            setState(s => ({ ...s, Form: { ...state.Form, Datos: { ...state.Form.Datos, SucursalId: res[0].SucursalID, CajaID: res2.CajaID } } }))
                        })
                        .catch(() => {
                            setState(s => ({ ...s, Form: { ...state.Form, Datos: { ...state.Form.Datos, SucursalId: 0, CajaID: 0 } } }))
                        })
                else
                    setState(s => ({ ...s, Form: { ...state.Form, Datos: { ...state.Form.Datos, SucursalId: 0, CajaID: 0 } } }))
            })
            .catch(() => {
                setState(s => ({ ...s, Form: { ...state.Form, Datos: { ...state.Form.Datos, SucursalId: 0, CajaID: 0 } } }))
            })
    }


    const fnGetCuentas = (ProductoID?: number, SucursalId?: number) => {
        FnCuenta.FNGet(props.oidc, ProductoID, SucursalId)
            .then((respuesta: any) => {

                console.log('respuesta cuentas', respuesta)

                var cuentas = respuesta.map((valor: any) => {
                    var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                    return obj
                });

                setState(s => ({ ...s, optCuenta: cuentas }))
            })
            .catch(() => {
                setState(s => ({ ...s, optCuenta: [] }))
            })
    }


    const fnGetTiposDesembolso = (SucursalId: number, ProductoID: number) => {
        FnTiposDesmbolso.FNGetSucursalProductoTiendita(props.oidc, SucursalId, ProductoID)
            .then((respuesta: any) => {
                if (respuesta.status === false) {
                    toast.error(respuesta.msj)
                }
                else {
                    var tiposDesembolso = respuesta.map((valor: any) => {
                        var obj = { value: valor.TipoDesembolsoID, label: valor.TipoDesembolso };
                        return obj
                    });

                    setState(s => ({ ...s, optTiposDesembolso: tiposDesembolso, TiposDesembolso: respuesta, Form: { ...state.Form, Datos: { ...state.Form.Datos, TipoDesembolsoID: respuesta[0].TipoDesembolsoID } } }))
                }
            })
            .catch((error: any) => {
                setState(s => ({ ...s, optTiposDesembolso: [], TiposDesembolso: [] }))
                toast.error(error);
            })


    }

    // const fnGetCondicionesDetalle = (ProductoID: number, SucursalId?: number, DistribuidorID?: number) => {
    //     let Datos = {
    //         ProductoID,
    //         SucursalId: SucursalId as number,
    //         DistribuidorID: DistribuidorID as number
    //     }

    //     // console.log('Datos: ', Datos)

    //     if (ProductoID! > 0 && SucursalId! > 0)
    //         FnCreditoCondicionDetalle.FNGetCondiciones(props.oidc, Datos)
    //             .then((respuesta: any) => {
    //                 let arr = range(respuesta[0].ImporteMinimo, respuesta[0].ImporteMaximo, 500)

    //                 arr = arr.reverse()

    //                 let capital = arr.map((valor: any) => {
    //                     var obj = { value: valor, label: valor };
    //                     return obj
    //                 });

    //                 arr = range(respuesta[0].PlazosMinimos, respuesta[0].PlazosMaximos, 2)

    //                 arr = arr.reverse()

    //                 let plazos = arr.map((valor: any) => {
    //                     var obj = { value: valor, label: valor };
    //                     return obj
    //                 });

    //                 setState(s => ({ ...s, CondicionesDetalle: respuesta, optCapital: capital, optPlazos: plazos }))
    //             })
    //             .catch(() => {
    //                 setState(s => ({ ...s, CondicionesDetalle: [], optCapital: [], optPlazos: [] }))
    //             })
    // }

    const fnGetLineaTiendita = (DistribuidorID: number) => {
        // console.log('ProdTiendita: ', state.ProdTiendita)
        FnDistribuidores.FNGetNivelProducto(props.oidc, state.ProdTiendita, DistribuidorID)
            .then((respuesta: any) => {
                // console.log('respuesta: ', respuesta);
                if (respuesta) {
                    setState(s => ({ ...s, TabTiendita: respuesta }))
                } else {
                    setState(s => ({
                        ...s,
                        TabTiendita: {
                            ProductoID: 0,
                            DistribuidorNivelID: 0,
                            PorcComisionBase: 0,
                            CapitalColocadoMinimo: 0,
                            CapitalColocadoMaximo: 0,
                            ImporteProteccionSaldo: 0,
                            importeMaxCanje: 0,
                            maximoPrestamoPersonal: 0,
                            maximoImporteCanjeCliente: 0,
                            maximoImporteCanjeAval: 0,
                            monto: 0
                        }
                    }))
                }
            })
            .catch(() => {
                setState(s => ({
                    ...s, TabTiendita: {
                        ProductoID: 0,
                        DistribuidorNivelID: 0,
                        PorcComisionBase: 0,
                        CapitalColocadoMinimo: 0,
                        CapitalColocadoMaximo: 0,
                        ImporteProteccionSaldo: 0,
                        importeMaxCanje: 0,
                        maximoPrestamoPersonal: 0,
                        maximoImporteCanjeCliente: 0,
                        maximoImporteCanjeAval: 0,
                        monto: 0
                    }
                }))
            })
    }


    useEffect(() => {
        FNGetVariablesGlobales()
        FnGetProducto()
    }, [props.iUI.Producto?.ProductoID])

    useEffect(() => {

        if (isMounted.current === true) {
            // FNGetLocal()
            // FnGetProducto()
            // fnGetDistribuidores()
            // fnGetSucursales()
            if (!props.DatosForm) {
                FnGetSucursalEmpleado()
            }
            fnGetSucursalesCaja()
            // fnGetCuentas()
            // fnGetEmpleados()
            // FnGetClientes()
            // FnGetTiposDesembolso()
        }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // useEffect(() => {
    //     FnGetSeries(state.Producto.ProductoID)
    // }, [state.Producto.ProductoID])

    // useEffect(() => {
    //     fnGetDatosDistribuidor(state.Form.Datos.DistribuidorId)
    // }, [state.Form.Datos.DistribuidorId])

    useEffect(() => {
        fnGetDatosCliente(state.Form.Datos.DistribuidorID)
    }, [state.Form.Datos.DistribuidorID])

    useEffect(() => {
        fnGetDistribuidores(state.Form.Datos.SucursalId)
        if (state.Form.Datos.SucursalId > 0 && state.TabTiendita.ProductoID > 0) {
            fnGetTiposDesembolso(state.Form.Datos.SucursalId, state.TabTiendita.ProductoID)
        }
    }, [state.Form.Datos.SucursalId, state.TabTiendita.ProductoID])


    // useEffect(() => {
    //     fnGetTiposDesembolso(state.Form.Datos.SucursalId)
    // }, [state.Form.Datos.SucursalId])

    // useEffect(() => {
    //     fnGetDatosFolios(state.Form.Datos.Folio)
    // }, [state.Form.Datos.Folio])

    // useEffect(() => {
    //     setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    //     // eslint-disable-next-line
    // }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (res: any) =>
        setState(s => ({ ...s, ShowCredito: true, CreditoID: res.CreditoId }))

    const cbAgregarCliente = (item: any) =>
        setState(s => ({ ...s, ShowCliente: false }))

    const cbCancelarCliente = () =>
        setState(s => ({ ...s, ShowCliente: false }))

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
    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

    const fnGetDatosDistribuidor = (DistribuidorID: number) => {
        FnDistribuidores.FNLealtadAuth()
            .then((res: any) => {
                // console.log('FNLealtadAuth: ', res)
                FnDistribuidores.FNLealtadGet('C40000100', res.token)
                    .then((respuesta: any) => {
                        // console.log('FNLealtadGet: ', respuesta)

                        let Monedero = respuesta[0].saldo

                        let distribuidor = state.Distribuidores.find(Dato => Dato.DistribuidorID === DistribuidorID)
                        setState(s => ({ ...s, DatosDistribuidor: distribuidor ? { ...distribuidor, Monedero } : {} }))
                    })
                    .catch(() => {
                        setState(s => ({ ...s, DatosDistribuidor: {} }))
                    })
            })
            .catch(() => {
                setState(s => ({ ...s, DatosDistribuidor: {} }))
            })
    }



    const fnGetDatosCliente = (PersonaID?: number) => {
        let cliente = state.Clientes.find(Dato => Dato.PersonaID === PersonaID)
        setState(s => ({ ...s, DatosCliente: cliente ? cliente : {}, PersonaID: PersonaID as number }))
    }

    // const fnGetDatosFolios = (Folio: number) => {
    //     let folio = state.Folios.find(Dato => Dato.Folio === Folio)
    //     setState(s => ({ ...s, DatosFolio: folio ? folio : {} }))
    // }

    // const fnGetListaPlazos = (Capital?: number) => {
    //     if (Capital) {
    //         let condicionesDetalle = state.CondicionesDetalle.find(Dato => (Dato.ImporteMinimo <= Capital && Dato.ImporteMaximo >= Capital))

    //         if (condicionesDetalle) {
    //             let arr = range(condicionesDetalle.PlazosMinimos, condicionesDetalle.PlazosMaximos, 2)

    //             arr = arr.reverse()

    //             // let arr = generarLista(condicionesDetalle.PlazosMaximos, function(i: any) { return i + 1; }, condicionesDetalle.PlazosMinimos)

    //             let plazos = arr.map((valor: any) => {
    //                 var obj = { value: valor, label: valor };
    //                 return obj
    //             });

    //             setState(s => ({ ...s, optPlazos: plazos }))
    //         }
    //         else {
    //             setState(s => ({ ...s, optPlazos: [] }))
    //         }
    //     }
    //     else {
    //         setState(s => ({ ...s, optPlazos: [] }))
    //     }

    // }

    const fnGetDatosDistribuidor2 = (DistribuidorID: number) => {
        FnDistribuidores.FNGetNivelDistribuidor(props.oidc, state.ProdTiendita, DistribuidorID)
            .then((respuesta: any) => {
                // console.log('FNLealtadGet: ', respuesta)
                let Monedero = respuesta.LineaCreditoDisponible
                let distribuidor = state.Distribuidores.find(Dato => Dato.DistribuidorID === DistribuidorID)
                setState(s => ({ ...s, DatosDistribuidor: distribuidor ? { ...distribuidor, Monedero } : {} }))
            })
            .catch(() => {
                setState(s => ({ ...s, DatosDistribuidor: {} }))
            })

    }

    // const generarPlazos = (count: number, content: any, start: any) => {
    //     let result = [];
    //     if (typeof (content) == "function") {
    //         for (let i = start-1; i < count; i++) {
    //             result.push(content(i));
    //         }
    //     } else {
    //         for (let i = start-1; i < count; i++) {
    //             result.push(content);
    //         }
    //     }
    //     return result;
    // }  

    return (<CtxCreditoTiendita.Provider value={{
        DistribuidorID: state.DatosDistribuidor.DistribuidorID || 0,
        Oidc: props.oidc,
        ArticulosCarrito,
        ArticulosSelector,
        setArticulosCarrito,
        setArticulosSelector,
        InfoToSent,
        setInfoToSent
    }}>
        <div className="columns is-desktop">
            <div className="column is-full-desktop is-full-tablet is-full-mobile ">
                <Card Title="Crédito Tiendita">
                    <Card.Body>
                        <Card.Body.Content>
                            <div>
                                <CForm
                                    oidc={props.oidc}
                                    ProductoID={props.iUI.Producto?.ProductoID as number} //{state.ProdTiendita}
                                    initialValues={state.Form.Datos}
                                    Id={state.Form.Id}
                                    // optProductos={state.optProductos}
                                    optDistribuidores={state.optDistribuidores}
                                    optSucursales={state.optSucursales}
                                    optClientes={state.optClientes}
                                    optTiposDesembolso={state.optTiposDesembolso}
                                    // optCapital={state.optCapital}
                                    optPlazos={state.optPlazos}
                                    optCuenta={state.optCuenta}
                                    cbActualizar={cbActualizar}
                                    cbGuardar={cbAgregar}
                                    fnCancelar={fnCancelar}
                                    DatosCliente={state.DatosCliente}
                                    DatosDistribuidor={state.DatosDistribuidor}
                                    TiposDesembolso={state.TiposDesembolso}
                                    // DatosFolio={state.DatosFolio}
                                    fnGetDistribuidores={fnGetDistribuidores}
                                    fnGetDatosDistribuidor={fnGetDatosDistribuidor2}
                                    fnGetDatosCliente={fnGetDatosCliente}
                                    // fnGetDatosFolios={fnGetDatosFolios}
                                    // fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                                    fnGetTiposDesembolso={fnGetTiposDesembolso}
                                    // fnGetListaPlazos={fnGetListaPlazos}
                                    // fnGetFolios={fnGetFolios}
                                    // optFolios={state.optFolios}
                                    // optSeries={state.optSeries}
                                    fnGetEmpleados={fnGetEmpleados}
                                    fnGetCuentas={fnGetCuentas}
                                    isUpdate={state.isUpdate}
                                    Sistema={state.Sistema}
                                    fnGetLineaTiendita={fnGetLineaTiendita}
                                    TabTiendita={state.TabTiendita}
                                    iu={props.iUI} ProdTiendita={state.ProdTiendita}
                                // ShowStore={state.ShowStore}
                                />

                                {state.ShowDatosBancarios &&
                                    <ModalWin open={state.ShowDatosBancarios} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Datos Bancarios del Cliente
                                            </h5>
                                            <button title='Cerrar' type="button" className="delete" onClick={() => setState(s => ({ ...s, ShowDatosBancarios: false }))} />
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

                                {state.ShowCaja &&
                                    <ModalWin open={state.ShowCaja} large scrollable>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Selección de Caja
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body style={{ overflowY: 'unset' }}>
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

                                <AgregarConPersona oidc={props.oidc} cbActualizar={() => { }} cbGuardar={cbAgregarCliente} fnCancelar={cbCancelarCliente} mostrar={state.ShowCliente} />


                            </div>

                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>

        </div >
    </CtxCreditoTiendita.Provider>)
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    iUI: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoTienditaSocia)