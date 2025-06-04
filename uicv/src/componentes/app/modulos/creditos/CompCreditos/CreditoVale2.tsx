import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import PersonasDatosBancarios from '../../general/CompGeneral/PersonasDatosBancarios/PersonasDatosBancarios'
import Credito from './Credito'
import { AgregarCliente } from './CreditoCliente/AgregarCliente'
import * as Funciones from './CreditoVale/Funciones'
import * as FnProductos from './CreditoProducto/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
import * as FnClientes from '../../distribuidor/CompDistribuidor/Cliente/Funciones'
import * as FnSeries from '../../distribuidor/CompDistribuidor/CatalogoValeraSeries/Funciones'
import * as FnTiposDesmbolso from '../../tesoreria/CompTesoreria/BancoTipoDesembolso/Funciones'
import * as FnCajas from '../../tesoreria/CompTesoreria/CajasUsuarios/Funciones'
import * as FnCreditoCondicionDetalle from './CreditoCondicionDetalle/Funciones'
import * as FnPersona from '../../general/CompGeneral/Empleado/Funciones'
import * as FnVariablesGlobales from '../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import UseWindowSize from '../../../../global/UseWindowSize'

import { iUI } from '../../../../../interfaces/ui/iUI'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCreditCard, FaWindowClose, FaUserPlus, FaCashRegister, FaShoppingCart } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm2 } from './CreditoVale/CForm2'
// import CreditoArticulos from './CreditoArticulos'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, range } from '../../../../../global/functions'
import { toast } from 'react-toastify'
import * as DocsProspecto from '../../Prospeccion/CompProspeccion/DocsProspecto//Funciones'
import { SeleccionarCajaSucursal } from '../../../../selectores'

type CatalogosType = {
    oidc: IOidc,
    iUI: iUI,
    DatosForm?: {
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
        // datoBancario: '',
        personasDatosBancariosID: number,
        RequiereDatosBancarios: boolean,
        FechaExpedicion: Date
        MvCancelacion: string,
        TipoCancelacionID: number,
    }
    callBack?(res: any): any,
    cbCerrarMotivo(): any
}

const CreditoVale2 = (props: CatalogosType) => {
    // console.log('CreditoVale props: ', props)

    const { width } = UseWindowSize();
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        CreditoID: 0,
        ProductoId: 0,
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
        // datoBancario: '',
        personasDatosBancariosID: 0,
        RequiereDatosBancarios: false,
        FechaExpedicion: new Date,
        MvCancelacion: "",
        TipoCancelacionID: 0,
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
    const CajaDefault = {
        ProductoID: 0,
        SucursalID: 0,
        CajaID: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const Clientes: any[] = []
    const TiposDesembolso: any[] = []
    const Distribuidores: any[] = []
    const Folios: any[] = []
    const CondicionesDetalle: any[] = []
    const DatosCliente: {} = {}
    const DatosDistribuidor: {} = {}
    const DatosFolio: {} = {}
    const DatosTipoDesembolso: {} = {}
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
    // const optProductos: any[] = []
    const optDistribuidores: any[] = []
    const optSucursales: any[] = []
    const optClientes: any[] = []
    const optTiposDesembolso: any[] = []
    const optCapital: any[] = []
    const optPlazos: any[] = []
    const optFolios: any[] = []
    const optSeries: any[] = []
    const optTipoCancelacion: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: props.DatosForm ? props.DatosForm : DatosDefecto, MvCancelacion: "", TipoCancelacionID: 0,
            Id: props.DatosForm ? props.DatosForm!.CreditoID : 0,
            // isUpdate: false
        },
        // optProductos,
        optDistribuidores,
        optSucursales,
        optClientes,
        optTiposDesembolso,
        optCapital,
        optPlazos,
        optFolios,
        optSeries,
        optTipoCancelacion,
        isUpdate: props.DatosForm ? true : false,
        Clientes,
        TiposDesembolso,
        Distribuidores,
        Folios,
        CondicionesDetalle,
        DatosCliente,
        DatosDistribuidor,
        DatosFolio,
        DatosTipoDesembolso,
        ShowDatosBancarios: false,
        ShowCliente: false,
        ShowCredito: false,
        // ShowStore: false,
        PersonaID: 0,
        CreditoID: 0,
        Producto,
        DocumentoFirmaId: 0,
        ProdTiendita: 0,
        TabTiendita,
        ShowCaja: false,
        CajaDefault,
        Sistema: '',
        SociaSel: false,
        SociaIDAux: 0,
        ShowFechaExpedicion: false,
        MvCancelacion: "",
        TipoCancelacionID: 0,
    })

    // const FNGetLocal = () => {

    //     setState(s => ({ ...s, Cargando: true }))
    // Funciones.FNGet(props.Seguridad)
    //     .then((respuesta: any) => {
    //         if (isMounted.current === true) {
    //             setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
    //         }
    //     })
    //     .catch(() => {
    //         if (isMounted.current === true) {
    //             setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
    //         }
    //     })
    // }


    const FNGetVariablesGlobales = () => {

        let datos = { Id: 46, varName: 'SUCURSAL_CAJA_CANJE' }
        FnVariablesGlobales.FNGet(props.oidc, datos)
            .then((respuesta: any) => {
                // console.log('respuesta: ', respuesta)
                setState(s => ({ ...s, ShowCaja: respuesta.varValue == 'S' ? true : false }))
            })
            .catch(() => {
                setState(s => ({ ...s, ShowCaja: false }))
            })

        datos = { Id: 21, varName: 'ID_DOCUMENTO_FIRMA' }
        FnVariablesGlobales.FNGet(props.oidc, datos)
            .then((respuesta: any) => {
                // console.log('respuesta: ', respuesta)
                setState(s => ({ ...s, DocumentoFirmaId: respuesta.varValue }))
            })
            .catch(() => {
                setState(s => ({ ...s, DocumentoFirmaId: 0 }))
            })

        datos = { Id: 22, varName: 'SISTEMA_TIENDITA' }
        FnVariablesGlobales.FNGet(props.oidc, datos)
            .then((respuesta: any) => {
                // console.log('respuesta: ', respuesta)
                setState(s => ({ ...s, Sistema: respuesta.varValue }))
            })
            .catch(() => {
                setState(s => ({ ...s, Sistema: '' }))
            })

        datos = { Id: 49, varName: 'OCULTAR_FECHA_EXPEDICION' }
        FnVariablesGlobales.FNGet(props.oidc, datos)
            .then((respuesta: any) => {
                // console.log('respuesta: ', respuesta)
                setState(s => ({ ...s, ShowFechaExpedicion: respuesta.varValue == 'N' ? true : false }))
            })
            .catch(() => {
                setState(s => ({ ...s, ShowFechaExpedicion: false }))
            })

        if (state.Producto.EmpresaId == 6) {
            datos = { Id: 33, varName: 'ID_PRODUCTO_TIENDITA_PS' }
        } else {
            datos = { Id: 26, varName: 'ID_PRODUCTO_TIENDITA' }
        }

        FnVariablesGlobales.FNGet(props.oidc, datos)
            .then((respuesta: any) => {
                // console.log(respuesta1)
                setState(s => ({ ...s, ProdTiendita: respuesta.varValue }))
            })
            .catch(() => {
                setState(s => ({ ...s, ProdTiendita: 0 }))
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

                    // console.log(respuesta)

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

    const FnGetSeries = (ProductoID: number) => {
        setState(s => ({ ...s }))
        FnSeries.FNGetByProduct(props.oidc, ProductoID)
            .then((respuesta: any) => {
                var series = respuesta.map((valor: any) => {
                    var obj = { value: valor.serieId, label: valor.serie };
                    return obj
                });

                setState(s => ({ ...s, optSeries: series }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSeries: [] }))
            })
    }

    const FnGetTipoCancelacion = () => {
        Funciones.FNTipoCancelacion(props.oidc)
            .then((respuesta: any) => {
                var cancelacion = respuesta.map((valor: any) => {
                    var obj = { value: valor.TipoCancelacionID, label: valor.TipoCancelacion };
                    return obj
                });

                setState(s => ({ ...s, optTipoCancelacion: cancelacion }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTipoCancelacion: [] }))
            })
    }

    const fnGetFolios = (Id: number, SerieId: number, Folio: number) => {
        if (Id > 0 && SerieId > 0)
            FnDistribuidores.getFoliosValera(props.oidc, Id, SerieId, Folio)
                .then((respuesta: any) => {

                    var folios = respuesta.map((valor: any) => {
                        var obj = { value: valor.Folio, label: valor.Folio };
                        return obj
                    });

                    setState(s => ({ ...s, optFolios: folios, Folios: respuesta }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optFolios: [], Folios: [] }))
                })
    }

    const fnGetSucursales = () => {
        FnSucursales.FNGetbyCaja(props.oidc)
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

    const FnGetSucursalEmpleado = () => {
        FnPersona.FNGetById(props.oidc)
            .then((res: any) => {
                // console.log('res ', res)
                if (res.length > 0)
                    FnCajas.FNGetbySucursalSaldo(props.oidc, res[0].SucursalID)
                        .then((res2: any) => {
                            // console.log('res 2', res2)
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

    const fnGetClientes = (DistribuidorID: number, Nombre: string, callback: any) => {

        let Datos = { DistribuidorID, Nombre }

        FnClientes.FNGet(props.oidc, Datos)
            .then((respuesta: any) => {

                var clientes = respuesta.map((valor: any) => {
                    var obj = { value: valor.PersonaID, label: valor.PersonaID + ' - ' + valor.NombreCompleto };
                    return obj
                });

                setState(s => ({ ...s, optClientes: clientes, Clientes: respuesta }))

                callback(clientes)

            })
            .catch(() => {

                setState(s => ({ ...s, optClientes: [], Clientes: [] }))

                callback([])
            })
    }

    const fnGetTiposDesembolso = (SucursalId: number, ProductoID: number) => {
        if (state.isUpdate) {
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
        }

    }

    const fnGetCondicionesDetalle = (ProductoID: number, SucursalId?: number, DistribuidorID?: number) => {
        let Datos = {
            ProductoID,
            SucursalId: SucursalId as number,
            DistribuidorID: DistribuidorID as number
        }

        if (ProductoID! > 0 && SucursalId! > 0 && DistribuidorID! > 0)
            FnCreditoCondicionDetalle.FNGetCondiciones(props.oidc, Datos)
                .then((respuesta: any) => {

                    // console.log('respuesta: ', respuesta)

                    let arr = range(respuesta[0].ImporteMinimo, respuesta[respuesta.length - 1].ImporteMaximo, 500)

                    // console.log('arr: ', arr)

                    arr = arr.reverse()

                    // console.log('arr: ', arr)

                    let capital = arr.map((valor: any) => {
                        var obj = { value: valor, label: valor };
                        return obj
                    });


                    arr = range(respuesta[0].PlazosMinimos, respuesta[respuesta.length - 1].PlazosMaximos, 2)

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

    const fnGetVale = (Datos: {
        SerieId: number,
        ValeCanje: number,
    }) => {
        Funciones.FNGetVale(props.oidc, Datos)
            .then((respuesta: any) => {
                setState(s => ({
                    ...s, Form: {
                        ...state.Form,
                        Datos: {
                            ...state.Form.Datos,
                            FechaExpedicion: respuesta.FechaExpedicion
                        },
                    }
                }))
            })
            .catch(() => {
                setState(s => ({
                    ...s, Form: {
                        ...state.Form,
                        Datos: {
                            ...state.Form.Datos,
                            FechaExpedicion: new Date
                        },
                    }
                }))
            })
    }



    useEffect(() => {

        if (props.DatosForm) {

            // console.log('DatosForm: ', props.DatosForm)

            setState(s => ({
                ...s, Form: {
                    ...state.Form,
                    // Datos: {...state.Form.Datos, 
                    //     ProductoId:  props.DatosForm ? props.DatosForm!.ProductoId : 0,
                    //     SucursalId: props.DatosForm ? props.DatosForm!.SucursalId : 0,
                    //     CajaID: props.DatosForm ? props.DatosForm!.CajaID : 0,
                    //     DistribuidorId: props.DatosForm ? props.DatosForm!.DistribuidorId : 0,
                    //     ClienteId: props.DatosForm ? props.DatosForm!.ClienteId : 0,
                    //     Folio: props.DatosForm ? props.DatosForm!.Folio : 0,
                    //     SerieId: props.DatosForm ? props.DatosForm!.SerieId : 0,
                    //     Capital: props.DatosForm ? props.DatosForm!.Capital  : 0,
                    //     Plazos: props.DatosForm ? props.DatosForm!.Plazos : 0,
                    //     Cuenta: props.DatosForm ? props.DatosForm!.Cuenta : '',
                    //     TipoDesembolsoID: props.DatosForm ? props.DatosForm!.TipoDesembolsoID : 0,
                    //     personasDatosBancariosID: props.DatosForm ? props.DatosForm!.personasDatosBancariosID : 0,
                    //     RequiereDatosBancarios: props.DatosForm ? props.DatosForm!.RequiereDatosBancarios : false
                    // },
                    Id: props.DatosForm ? props.DatosForm!.CreditoID : 0
                },
                isUpdate: true
            }))

            if (props.DatosForm!.SerieId > 0 && props.DatosForm!.Folio > 0) {
                let Datos = { SerieId: props.DatosForm!.SerieId, ValeCanje: props.DatosForm!.Folio }

                fnGetVale(Datos)
            }

            // fnGetCondicionesDetalle(props.DatosForm!.ProductoId, props.DatosForm!.SucursalId, props.DatosForm!.DistribuidorId)

            // if (props.DatosForm!.SucursalId > 0 && props.DatosForm!.ProductoId > 0)
            //     fnGetTiposDesembolso(props.DatosForm!.SucursalId, props.DatosForm!.ProductoId)
        }
    }, [props.DatosForm])

    useEffect(() => {

        if (isMounted.current === true) {
            // FNGetVariablesGlobales()
            // FNGetLocal()
            FnGetProducto()
            // fnGetDistribuidores()
            // fnGetSucursales()
            if (!props.DatosForm) {
                FnGetSucursalEmpleado()
            }
            fnGetSucursalesCaja()
            // FnGetClientes()
            // FnGetTiposDesembolso()
        }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        FnGetSeries(state.Producto.ProductoID)
        FNGetVariablesGlobales()
        FnGetTipoCancelacion()
    }, [state.Producto.ProductoID])

    useEffect(() => {
        fnGetDatosDistribuidor(state.Form.Datos.DistribuidorId)
    }, [state.Form.Datos.DistribuidorId])

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

    // useEffect(() => {
    //     setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    //     // eslint-disable-next-line
    // }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (res: any) => props.callBack!(res)
    // setState(s => ({ ...s, ShowCredito: true, CreditoID: res.CreditoId }))

    const cbAgregarCliente = (item: any) => {
        // console.log('item: ', item)
        if (item.res == 1) {
            toast.success(item.msj)
        }
        if (item.res == 2) {
            toast.warning(item.msj)
        }
        setState(s => ({ ...s, ShowCliente: false }))
    }

    const cbCancelarCliente = () =>
        setState(s => ({ ...s, ShowCliente: false }))

    const cbDatosBancarios = (item: any) =>
        setState(s => ({ ...s, ShowDatosBancarios: false }))

    const fnSetSucCaja = (Data: any) => {
        setState(s => ({ ...s, Form: { ...state.Form, Datos: { ...state.Form.Datos, SucursalId: Data.SucursalID, CajaID: Data.CajaID } }, ShowCaja: false }))
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === item.ProductoID && Dato.SucursalId === item.SucursalId ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    ...state.Form.Datos,
                    DistribuidorId: 0,
                    ClienteId: 0,
                    Folio: 0,
                    SerieId: 0,
                    Capital: 0,
                    Plazos: 0,
                    Cuenta: '',
                    TipoDesembolsoID: 0,
                    personasDatosBancariosID: 0,
                    RequiereDatosBancarios: false
                }
            }, isUpdate: false
        }))

    const cbStore = (res: any) =>
        setState(s => ({ ...s, ShowStore: false, ShowCredito: true, CreditoID: res.CreditoId }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({
        ...s, Form: {
            ...state.Form, Mostrar: false, Datos: {
                ...state.Form.Datos,
                DistribuidorId: 0,
                ClienteId: 0,
                Folio: 0,
                SerieId: 0,
                Capital: 0,
                Plazos: 0,
                Cuenta: '',
                TipoDesembolsoID: 0,
                personasDatosBancariosID: 0,
                RequiereDatosBancarios: false
            }
        }, isUpdate: false
    }))

    const fnGetDatosDistribuidor = (DistribuidorID?: number) => {

        // setState(s => ({ ...s, DatosDistribuidor: distribuidor ? distribuidor : {} }))
        if (DistribuidorID != undefined && DistribuidorID > 0) {
            DocsProspecto.FNGetDocsByProspectoID(props.oidc, DistribuidorID)
                .then((respuesta: any) => {
                    // if (isMounted.current === true) {
                    // console.log('respuesta: ', respuesta);
                    // console.log('DocumentoFirmaId: ', state.DocumentoFirmaId);
                    let distribuidorData = respuesta.find(Dato => Dato.TipoDocumentoID == state.DocumentoFirmaId)
                    // console.log('distribuidorData: ', distribuidorData);
                    setState(s => ({ ...s, DatosDistribuidor: distribuidorData, SociaSel: true, SociaIDAux: DistribuidorID }))
                    // }
                })
                .catch((error) => {
                    console.log("###e", error)
                    // if (isMounted.current === true) {
                    setState(s => ({ ...s, DatosDistribuidor: {}, SociaSel: false }))
                    // }
                })
        } else {
            setState(s => ({ ...s, DatosDistribuidor: {}, SociaSel: false }))
        }
    }

    const fnGetLineaTiendita = (DistribuidorID: number) => {
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


    const fnGetDatosCliente = (PersonaID?: number) => {
        let cliente = state.Clientes.find(Dato => Dato.PersonaID === PersonaID)
        setState(s => ({ ...s, DatosCliente: cliente ? cliente : {}, PersonaID: PersonaID as number }))
    }

    // const fnGetDatosTipoDesembolso = (TipoDesembolsoID: number) => {
    //     if (state.isUpdate) {
    //         FnTiposDesmbolso.FNGetSucursalProducto(props.oidc, props.DatosForm!.SucursalId, props.DatosForm!.ProductoId)
    //             .then((respuesta: any) => {

    //                 // console.log('fnGetTiposDesembolso: ', respuesta)

    //                 // var tiposDesembolso = respuesta.map((valor: any) => {
    //                 //     var obj = { value: valor.TipoDesembolsoID, label: valor.TipoDesembolso };
    //                 //     return obj
    //                 // });
    //                 let tipoDesembolso = respuesta.find(Dato => Dato.TipoDesembolsoID === TipoDesembolsoID)

    //                 setState(s => ({ ...s, DatosTipoDesembolso: tipoDesembolso ? tipoDesembolso : {}, TipoDesembolsoID: TipoDesembolsoID as number }))
    //             })
    //             .catch(() => {
    //                 setState(s => ({ ...s, DatosTipoDesembolso: {}, TipoDesembolsoID: 0 }))
    //             })
    //     } else {
    //         let tipoDesembolso = state.TiposDesembolso.find(Dato => Dato.TipoDesembolsoID === TipoDesembolsoID)
    //         setState(s => ({ ...s, DatosTipoDesembolso: tipoDesembolso ? tipoDesembolso : {}, TipoDesembolsoID: TipoDesembolsoID as number }))
    //     }
    //     // console.log('TiposDesembolso: ', state.TiposDesembolso)        
    // }

    const fnGetDatosFolios = (Folio: number) => {
        // console.log('Folio: ', Folio)
        // console.log('Folios: ', state.Folios)
        let folio = state.Folios.find(Dato => Dato.Folio == Folio)
        // console.log('folio: ', folio)
        setState(s => ({ ...s, DatosFolio: folio ? folio : {} }))
    }

    const fnGetListaPlazos = (Capital?: number) => {
        if (Capital) {
            let condicionesDetalle = state.CondicionesDetalle.find(Dato => (Dato.ImporteMinimo <= Capital && Dato.ImporteMaximo >= Capital))

            if (condicionesDetalle) {
                let arr = range(condicionesDetalle.PlazosMinimos, condicionesDetalle.PlazosMaximos, 2)

                arr = arr.reverse()

                // let arr = generarLista(condicionesDetalle.PlazosMaximos, function(i: any) { return i + 1; }, condicionesDetalle.PlazosMinimos)

                let plazos = arr.map((valor: any) => {
                    var obj = { value: valor, label: valor };
                    return obj
                });

                setState(s => ({ ...s, optPlazos: plazos }))
            }
            else {
                setState(s => ({ ...s, optPlazos: [] }))
            }
        }
        else {
            setState(s => ({ ...s, optPlazos: [] }))
        }

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

    return (
        // <div class="columns is-desktop">
        //     <div class="column">1</div>
        //     <div class="column">2</div>
        // </div>
        // <div className="row">
        <div className="columns is-desktop">
            <div className="column">
                {!state.isUpdate &&
                    <Card Title="">
                        <Card.Body>
                            <Card.Body.Content>
                                <div className="columns is-desktop is-tablet">
                                    <div className="column is-3">
                                        {state.Producto.Logo &&
                                            <img className="my-1" src={'data:image/png;base64,' + state.Producto.Logo} style={{ maxWidth: 200, maxHeight: 100 }} alt="" />
                                        }
                                    </div>
                                    {state.SociaSel && <div className="column" >
                                        <br className="is-hidden-mobile" />
                                        <br className="is-hidden-mobile" />
                                        <br className="is-hidden-mobile" />
                                        <div className="buttons">
                                            {/* </div>
                                <br/>
                                <div> */}
                                            <button className="ms-2 button is-primary is-small is-outlined waves-effect waves-light" onClick={() => {
                                                setState(s => ({ ...s, ShowCliente: true }))
                                            }}>
                                                <span className="is-hidden-mobile">Nuevo Cliente</span>&nbsp;<FaUserPlus />
                                            </button>
                                            {/* </div>
                                <br/>
                                <div> */}
                                            <button className="ms-2 button is-primary is-small is-outlined waves-effect waves-light" onClick={() => {
                                                if (state.PersonaID > 0)
                                                    setState(s => ({ ...s, ShowDatosBancarios: true }))
                                                else
                                                    toast.error("Seleccione el cliente")
                                            }}>
                                                <span className="is-hidden-mobile">Datos Bancarios</span>&nbsp;<FaCreditCard />
                                            </button>
                                        </div>
                                    </div>}
                                </div>
                                {/* <br/> */}
                                {/* <div>
                                <button className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => {
                                    setState(s => ({ ...s, ShowStore: true }))
                                }}>
                                    Incluir Artículos <FaShoppingCart />
                                </button>
                            </div> */}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                }
                {/* </div>
            <div className="column is-10-desktop is-full-tablet is-full-mobile "> */}
                <Card>
                    <Card.Body>
                        <Card.Body.Content>
                            <div>
                                {state.Form.Datos.CajaID > 0 &&
                                    <CForm2
                                        cbCerrarMotivo={props.cbCerrarMotivo}
                                        oidc={props.oidc}
                                        ui={props.iUI}
                                        ProductoID={state.Producto.ProductoID}
                                        initialValues={state.Form.Datos}
                                        Id={state.Form.Id}
                                        // optProductos={state.optProductos}
                                        optDistribuidores={state.optDistribuidores}
                                        optSucursales={state.optSucursales}
                                        optClientes={state.optClientes}
                                        optTiposDesembolso={state.optTiposDesembolso}
                                        optTipoCancelacion={state.optTipoCancelacion}
                                        optCapital={state.optCapital}
                                        optPlazos={state.optPlazos}
                                        optFolios={state.optFolios}
                                        optSeries={state.optSeries}
                                        cbActualizar={cbActualizar}
                                        cbGuardar={cbAgregar}
                                        fnCancelar={fnCancelar}
                                        DatosCliente={state.DatosCliente}
                                        DatosDistribuidor={state.DatosDistribuidor}
                                        DatosFolio={state.DatosFolio}
                                        DatosTipoDesembolso={state.DatosTipoDesembolso}
                                        fnGetDistribuidores={fnGetDistribuidores}
                                        fnGetTiposDesembolso={fnGetTiposDesembolso}
                                        fnGetDatosDistribuidor={fnGetDatosDistribuidor}
                                        fnGetLineaTiendita={fnGetLineaTiendita}
                                        fnGetDatosCliente={fnGetDatosCliente}
                                        fnGetDatosFolios={fnGetDatosFolios}
                                        fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                                        fnGetListaPlazos={fnGetListaPlazos}
                                        fnGetFolios={fnGetFolios}
                                        // fnGetDatosTipoDesembolso={fnGetDatosTipoDesembolso}
                                        fnGetClientes={fnGetClientes}
                                        isUpdate={state.isUpdate}
                                        Sistema={state.Sistema}
                                        ProdTiendita={state.ProdTiendita}
                                        TabTiendita={state.TabTiendita}
                                        ShowFechaExpedicion={state.ShowFechaExpedicion}
                                    //fnGetDatosTipoDesembolso={function (id: any) {
                                    //   throw new Error('Function not implemented.')
                                    //}}                                    // ShowStore={state.ShowStore}
                                    />
                                }
                                {/* </ModalWin.Body>
                                    </ModalWin> */}

                                {state.ShowDatosBancarios &&
                                    <ModalWin open={state.ShowDatosBancarios} scrollable>
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

                                {state.ShowCredito &&
                                    <ModalWin open={state.ShowCredito} full={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Consulta de Crédito
                                            </h5>
                                            <button title='Cerrar' type="button" className="btn btn-danger waves-effect waves-light" onClick={() => setState(s => ({ ...s, ShowCredito: false }))}>
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

                                {/* {state.ShowCliente &&
                                    <ModalWin open={state.ShowCliente} full={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Detalle de la Condición
                                            </h5>
                                            <button type="button" className="delete" onClick={() => setState(s => ({ ...s, ShowCliente: false }))}/>
                                        </ModalWin.Header>
                                        <ModalWin.Body>*/}
                                {state.ShowCliente &&
                                    <AgregarCliente Item={state.SociaIDAux} oidc={props.oidc} cbActualizar={() => { }} cbGuardar={cbAgregarCliente} fnCancelar={cbCancelarCliente} mostrar={state.ShowCliente} />
                                } {/*
                                        </ModalWin.Body>
                                    </ModalWin>
                                } */}

                                {/* {state.ShowStore && 
                                <ModalWin open={state.ShowStore} >
                                    <ModalWin.Header>
                                        <h5 className={MODAL_TITLE_CLASS}>
                                            Incluir Artículos
                                        </h5>
                                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => setState(s => ({ ...s, ShowStore: false }))}>
                                            <FaWindowClose size={20} />
                                        </button>
                                    </ModalWin.Header>
                                    <ModalWin.Body>
                                        {state.ShowStore &&
                                            <CreditoArticulos
                                                ProductoID={}
                                                SucursalId={}
                                                DistribuidorID={}
                                                ClienteID={} 
                                            />
                                        }
                                    </ModalWin.Body>
                                </ModalWin>
                                } */}

                                {state.ShowCaja && !state.isUpdate &&
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
    oidc: state.oidc,
    iUI: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoVale2)