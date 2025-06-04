import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import PersonasDatosBancarios from '../../general/CompGeneral/PersonasDatosBancarios/PersonasDatosBancarios'
// import Credito from './Credito'
// import * as Funciones from './CreditoVale/Funciones'
import * as FnProductos from './CreditoProducto/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
// import * as FnClientes from '../../distribuidor/CompDistribuidor/Cliente/Funciones'
// import * as FnPersona from '../../general/CompGeneral/Empleado/Funciones'
// import * as FnCuenta from '../../bancos/CompBancos/BancoCuenta/Funciones'
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
import { CForm2 } from './CreditoDistribuidor/CForm2'
// import CreditoArticulos from './CreditoArticulos'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, range } from '../../../../../global/functions'
import { toast } from 'react-toastify'
import { number } from 'yup/lib/locale'

import { iUI } from '../../../../../interfaces/ui/iUI'

type CatalogosType = {
    oidc: IOidc,
    iUI: iUI,
    DistribuidorID: number,
    SucursalId: number,
    CajaID: number,
    optSucursales: any[],
    ProductoID: number | undefined,
    ProdPresPersonal: number,
    CreditoID?: number,
    Capital?: number,
    Plazos?: number,
    TipoDesembolsoID?: number,
    personasDatosBancariosID?: number,
    RequiereDatosBancarios?: boolean,
    fnCancelar(res: any): any,
}

const CreditoDistribuidor2 = (props: CatalogosType) => {
    // console.log('props :', props)
    const { width } = UseWindowSize();
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        ProductoID: props.ProdPresPersonal,
        DistribuidorID: props.DistribuidorID,
        SucursalId: props.SucursalId,
        CajaID: props.CajaID,
        ClienteId: 0,
        Plazos: 0,
        TipoDesembolsoID: 0,
        Capital: 0,
        personasDatosBancariosID: 0,
        RequiereDatosBancarios: false
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
    const DatosDistribuidor: {} = {}
    const DatosFolio: {} = {}
    const TiposDesembolso: any[] = []
    const DatosTipoDesembolso: {} = {}
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
            Id: 0
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
        isUpdate: props.CreditoID ? true : false,
        Clientes,
        Distribuidores,
        Folios,
        CondicionesDetalle,
        DatosCliente,
        DatosDistribuidor,
        DatosFolio,
        TiposDesembolso,
        DatosTipoDesembolso,
        ShowDatosBancarios: false,
        ShowCliente: false,
        ShowCredito: false,
        PersonaID: 0,
        CreditoID: 0,
        Producto,
        Sistema: '',
        // ProdPresPersonal: 0,
        TabTiendita
    })

    // const FNGetVariablesGlobales = () => {
    //     let datos = { Id: 27, varName: 'ID_PRODUCTO_PERSONAL' }
    //     FnVariablesGlobales.FNGet(props.oidc, datos)
    //         .then((respuesta: any) => {
    //             setState(s => ({ ...s, ProdPresPersonal: respuesta.varValue }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, ProdPresPersonal: 0 }))
    //         })

    // }

    // const FnGetProducto = () => {
    //     FnProductos.FNGet(props.oidc, props.iUI.Producto?.ProductoID)
    //         .then((respuesta: any) => {

    //             // var productos = respuesta.map((valor: any) => {
    //             //     var obj = { value: valor.ProductoID, label: valor.Producto };
    //             //     return obj
    //             // });

    //             setState(s => ({ ...s, Producto: respuesta }))

    //         })
    //         .catch(() => {
    //             setState(s => ({
    //                 ...s,
    //                 Producto: {
    //                     ProductoID: 0,
    //                     EmpresaId: 0,
    //                     Producto: '',
    //                     Activo: false,
    //                     TasaTipoId: '',
    //                     RequiereDistribuidor: false,
    //                     RequiereGrupo: false,
    //                     ValidaDisponible: false,
    //                     Restructura: false,
    //                     GeneraDesembolso: false,
    //                     SeguroFinanciado: false,
    //                     Canje: false,
    //                     DesglosarIVA: false,
    //                     EdadMinima: 0,
    //                     EdadMaxima: 0,
    //                     CapitalAlFinal: false,
    //                     CargoFinanciado: false,
    //                     CargoAlInicio: false,
    //                     ActivaCredito: false,
    //                     CreditosLiquidadosReq: false,
    //                     PermisoEspecial: false,
    //                     ValidarCondiciones: false,
    //                     FhRegitro: '',
    //                     FhMoficiacion: '',
    //                     AplicaIVAInteres: false,
    //                     AplicaIVASeguro: false,
    //                     AplicaIVAManejoCuenta: false,
    //                     Logo: ''
    //                 }
    //             }))
    //         })
    // }

    const fnGetDistribuidores = (SucursalID?: number) => {
        if (SucursalID! > 0)
            FnDistribuidores.FNGetBySucursalProd(props.oidc, SucursalID)
                .then((respuesta: any) => {

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

    const fnGetTiposDesembolso = (ProductoID: number, SucursalId: number) => {
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
            DistribuidorID: DistribuidorID as number
        }
        console.log('Datos: ', Datos)
        if (ProductoID! > 0 && SucursalId! > 0 && DistribuidorID! > 0)
            FnCreditoCondicionDetalle.FNGetCondicionesAdminProd(props.oidc, Datos)
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

    // useEffect(() => {
    //     fnGetCondicionesDetalle(state.ProdPresPersonal, props.SucursalId, props.DistribuidorID)
    //     fnGetTiposDesembolso(props.SucursalId, state.ProdPresPersonal)
    // }, [state.ProdPresPersonal])

    useEffect(() => {
        // if (isMounted.current === true) {
        // FNGetVariablesGlobales()

        fnGetCondicionesDetalle(props.ProdPresPersonal, props.SucursalId, props.DistribuidorID)
        // fnGetTiposDesembolso(props.ProductoID as number, props.SucursalId)
        // fnGetSucursales()
        // }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [props.ProdPresPersonal, props.SucursalId, props.DistribuidorID])

    useEffect(() => {
        fnGetTiposDesembolso(props.ProductoID as number, props.SucursalId)
    }, [props.ProductoID, props.SucursalId])

    useEffect(() => {
        fnGetDatosCliente(state.Form.Datos.ClienteId)
    }, [state.Form.Datos.ClienteId])

    useEffect(() => {
        fnGetDistribuidores(state.Form.Datos.SucursalId)
    }, [state.Form.Datos.SucursalId])

    useEffect(() => {
        // console.log('props: ', props)
        if(props.CreditoID! > 0)
        {
            setState(s => ({
                ...s,
                Form: {
                    ...s.Form,
                    Mostrar: true,
                    Datos: {
                        ...s.Form.Datos,                        
                        Plazos: props.Plazos!,
                        TipoDesembolsoID: props.TipoDesembolsoID!,
                        Capital: props.Capital!,
                        personasDatosBancariosID: props.personasDatosBancariosID!,
                        RequiereDatosBancarios: props.RequiereDatosBancarios!
                    },
                    Id: props.CreditoID!
                }
            }))
        }
    }, [props.CreditoID])

    // const cbAgregar = (res: any) =>
    //     setState(s => ({ ...s, ShowCredito: true, CreditoID: res.CreditoId }))

    const cbDatosBancarios = (item: any) =>
        setState(s => ({ ...s, ShowDatosBancarios: false }))

    // const cbStore = (res: any) =>
    //     setState(s => ({ ...s, ShowStore: false, ShowCredito: true, CreditoID: res.CreditoId }))

    const fnCancelar = (res: any) => props.fnCancelar(res) //setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))
    // const fnGetDatosDistribuidor = (DistribuidorID: number) => {
    //     FnDistribuidores.FNLealtadAuth()
    //         .then((res: any) => {
    //             // console.log('FNLealtadAuth: ', res)
    //             FnDistribuidores.FNLealtadGet('C40000100', res.token)
    //                 .then((respuesta: any) => {
    //                     // console.log('FNLealtadGet: ', respuesta)

    //                     let Monedero = respuesta[0].saldo

    //                     let distribuidor = state.Distribuidores.find(Dato => Dato.DistribuidorID === DistribuidorID)
    //                     setState(s => ({ ...s, DatosDistribuidor: distribuidor ? { ...distribuidor, Monedero } : {} }))
    //                 })
    //                 .catch(() => {
    //                     setState(s => ({ ...s, DatosDistribuidor: {} }))
    //                 })
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, DatosDistribuidor: {} }))
    //         })
    // }

    const fnGetDatosCliente = (PersonaID?: number) => {
        let cliente = state.Clientes.find(Dato => Dato.PersonaID === PersonaID)
        setState(s => ({ ...s, DatosCliente: cliente ? cliente : {}, PersonaID: PersonaID as number }))
    }

    // const fnGetDatosFolios = (Folio: number) => {
    //     let folio = state.Folios.find(Dato => Dato.Folio === Folio)
    //     setState(s => ({ ...s, DatosFolio: folio ? folio : {} }))
    // }

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

    const fnGetDatosTipoDesembolso = (TipoDesembolsoID: number) => {
        let tipoDesembolso = state.TiposDesembolso.find(Dato => Dato.TipoDesembolsoID === TipoDesembolsoID)
        setState(s => ({ ...s, DatosTipoDesembolso: tipoDesembolso ? tipoDesembolso : {}, TipoDesembolsoID: TipoDesembolsoID as number }))
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
        <div className="columns is-desktop">
            <div className="column is-full-desktop is-full-tablet is-full-mobile ">
                {/* <Card Title="">
                    <Card.Body>
                        <Card.Body.Content> */}
                <div>
                    <CForm2
                        oidc={props.oidc}
                        ui={props.iUI}
                        ProductoID={props.ProductoID as number}
                        Id={state.Form.Id}
                        initialValues={state.Form.Datos}
                        fnCancelar={fnCancelar}
                        fnGetDistribuidores={fnGetDistribuidores}
                        fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                        fnGetTiposDesembolso={fnGetTiposDesembolso}
                        fnGetListaPlazos={fnGetListaPlazos}
                        fnGetDatosTipoDesembolso={fnGetDatosTipoDesembolso}
                        // fnGetDatosDistribuidor={fnGetDatosDistribuidor}
                        DatosTipoDesembolso={state.DatosTipoDesembolso}
                        optDistribuidores={state.optDistribuidores}
                        optSucursales={props.optSucursales}
                        optPlazos={state.optPlazos}
                        optTiposDesembolso={state.optTiposDesembolso}
                        optCapital={state.optCapital}
                        DatosDistribuidor={state.DatosDistribuidor}
                        TiposDesembolso={state.TiposDesembolso}
                    // cbActualizar={cbActualizar}
                    // cbGuardar={cbAgregar}
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

                </div>
                {/* </Card.Body.Content>
                    </Card.Body>
                </Card> */}
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
export default connect(mapStateToProps, mapDispatchToProps)(CreditoDistribuidor2)