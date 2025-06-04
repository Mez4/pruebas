import { IOidc } from "../../../../../interfaces/oidc/IOidc"
import { iUI } from "../../../../../interfaces/ui/iUI"
import { CtxCreditoTiendita } from "./CreditoTienditaSocia/CreditoTienditaContext"
import React, { useState, useEffect } from 'react'
import { Card } from '../../../../global'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { SeleccionarCajaSucursal } from '../../../../selectores'
import * as FnCuenta from '../../bancos/CompBancos/BancoCuenta/Funciones'
import * as FnCajas from '../../tesoreria/CompTesoreria/CajasUsuarios/Funciones'
import * as FnProductos from './CreditoProducto/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
import * as FnPersona from '../../general/CompGeneral/Empleado/Funciones'
import * as FnVariablesGlobales from '../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones'
import { IEstado } from "../../../../../interfaces/redux/IEstado"
import { connect } from "react-redux"
import { CForm } from "./CreditoTienditaMonedero/CForm"
import * as FnTiposDesmbolso from '../../tesoreria/CompTesoreria/BancoTipoDesembolso/Funciones'
import { toast } from 'react-toastify'

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

const CreditoTienditaMonedero = (props: CatalogosType) => {

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

    useEffect(() => {
        FNGetVariablesGlobales()
        FnGetProducto()
    }, [props.iUI.Producto?.ProductoID])

    useEffect(() => {

        if (isMounted.current === true) {
            if (!props.DatosForm) {
                FnGetSucursalEmpleado()
            }
            fnGetSucursalesCaja()
        }

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        fnGetDatosCliente(state.Form.Datos.DistribuidorID)
    }, [state.Form.Datos.DistribuidorID])

    useEffect(() => {
        fnGetDistribuidores(state.Form.Datos.SucursalId)
        if (state.Form.Datos.SucursalId > 0 && state.TabTiendita.ProductoID > 0) {
            fnGetTiposDesembolso(state.Form.Datos.SucursalId, state.TabTiendita.ProductoID)
        }
    }, [state.Form.Datos.SucursalId, state.TabTiendita.ProductoID])

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

    const FNGetVariablesGlobales = () => {
        let datos = { Id: 22, varName: 'SISTEMA_TIENDITA' }
        FnVariablesGlobales.FNGet(props.oidc, datos)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Sistema: respuesta.varValue }))
            })
            .catch(() => {
                setState(s => ({ ...s, Sistema: '' }))
            })
        FnProductos.FNGetTiendita(props.oidc)
            .then((respuesta: any) => {

                setState(s => ({ ...s, ProdTiendita: respuesta.ProductoID }))
            })
            .catch(() => {
                setState(s => ({ ...s, ProdTiendita: 0 }))
            })
    }

    const FnGetProducto = () => {
        FnProductos.FNGet(props.oidc, props.iUI.Producto?.ProductoID)
            .then((respuesta: any) => {
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

    const fnGetDatosCliente = (PersonaID?: number) => {
        let cliente = state.Clientes.find(Dato => Dato.PersonaID === PersonaID)
        setState(s => ({ ...s, DatosCliente: cliente ? cliente : {}, PersonaID: PersonaID as number }))
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
    const cbAgregar = (res: any) =>
        setState(s => ({ ...s, ShowCredito: true, CreditoID: res.CreditoId }))
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.ProductoID === item.ProductoID && Dato.SucursalId === item.SucursalId ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto
            }, isUpdate: false
        }))

    const fnCancelar = () =>
        setState(s => ({ ...s, DatosDistribuidor: {}, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

    const fnGetDatosDistribuidor2 = (DistribuidorID: number) => {
        FnDistribuidores.FNGetDistribuidorMonedero(props.oidc, state.ProdTiendita, DistribuidorID)
            .then((respuesta: any) => {
                // console.log('FNLealtadGet: ', respuesta)
                let Monedero = respuesta.Monedero
                let distribuidor = state.Distribuidores.find(Dato => Dato.DistribuidorID === DistribuidorID)
                setState(s => ({ ...s, DatosDistribuidor: distribuidor ? { ...distribuidor, Monedero } : {} }))
            })
            .catch(() => {
                setState(s => ({ ...s, DatosDistribuidor: {} }))
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
                <Card Title="Crédito Tiendita Monedero">
                    <Card.Body>
                        <Card.Body.Content>
                            <div>
                                <CForm
                                    oidc={props.oidc}
                                    ProductoID={props.iUI.Producto?.ProductoID as number}
                                    initialValues={state.Form.Datos}
                                    Id={state.Form.Id}
                                    optDistribuidores={state.optDistribuidores}
                                    optSucursales={state.optSucursales}
                                    optClientes={state.optClientes}
                                    optTiposDesembolso={state.optTiposDesembolso}
                                    optPlazos={state.optPlazos}
                                    optCuenta={state.optCuenta}
                                    cbActualizar={cbActualizar}
                                    cbGuardar={cbAgregar}
                                    fnCancelar={fnCancelar}
                                    DatosCliente={state.DatosCliente}
                                    DatosDistribuidor={state.DatosDistribuidor}
                                    TiposDesembolso={state.TiposDesembolso}
                                    fnGetDistribuidores={fnGetDistribuidores}
                                    fnGetDatosDistribuidor={fnGetDatosDistribuidor2}
                                    fnGetDatosCliente={fnGetDatosCliente}
                                    fnGetTiposDesembolso={fnGetTiposDesembolso}
                                    fnGetEmpleados={fnGetEmpleados}
                                    fnGetCuentas={fnGetCuentas}
                                    isUpdate={state.isUpdate}
                                    Sistema={state.Sistema}
                                    fnGetLineaTiendita={fnGetLineaTiendita}
                                    TabTiendita={state.TabTiendita}
                                    iu={props.iUI} ProdTiendita={state.ProdTiendita}
                                />

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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoTienditaMonedero)