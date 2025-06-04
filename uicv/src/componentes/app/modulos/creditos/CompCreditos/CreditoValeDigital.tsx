import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../interfaces/ui/iUI'

import { Card, Spinner } from '../../../../global'
import { ValeDigital } from './CreditoVale/ValeDigital'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

import * as FnProductos from './CreditoProducto/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
import * as FnCajas from '../../tesoreria/CompTesoreria/CajasUsuarios/Funciones'
import * as FnCreditoCondicionDetalle from './CreditoCondicionDetalle/Funciones'
import * as Funciones from './CreditoVale/Funciones'
import * as FnVariablesGlobales from '../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones'
import { SeleccionarCajaSucursal } from '../../../../selectores'
import { FiltrarDatos, addOneDay, formatDate, range } from '../../../../../global/functions'
import { toast } from 'react-toastify'
import { AgregarCliente } from './CreditoVale/AgregarCliente'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import moment from 'moment'

type CatalogosType = {
    oidc: IOidc,
    iUI: iUI
}

export const CreditoValeDigital = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        Codigo: '',
        SucursalId: 0,
        CajaID: 0,
        DistribuidorId: 0,
        ClienteId: 0,
        Capital: 0,
        Folio: 0,
        SerieId: 0,
        Plazos: 0,
        TipoDesembolsoID: 0,
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
    const optSucursales: any[] = []
    const optCapital: any[] = []
    const optPlazos: any[] = []
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

    const DatosPlanPagosDigital: any[] = []
    const [state, setState] = React.useState({
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            // Id: undefined
        },
        ShowCaja: true,
        optSucursales,
        optCapital,
        optPlazos,
        CajaDefault,
        ProdTiendita: 0,
        Sistema: '',
        Producto,
        TabTiendita,
        ShowCliente: false,
        clientePersona: {},
        clienteDireccion: {},
        CreditoIDConfirmadoDigital: 0,
        DatosPlanPagosDigital,
        VerPlanPagosDigital: false,
        ErrorPlanPagosDigital: false,
        CargandoPlanPagosDigital: false,
        CreditoID: 0,
    })

    const ActualizarCreditoModalDigital = (CreditoIDConfirmadoDigital: number) => {
        // console.log("CreditoIDRecibidoDigital: ", CreditoIDConfirmadoDigital)
        // console.log("CreditoIDConfirmadoDigital: ", state.CreditoIDConfirmadoDigital)
        setState(s => ({ ...s, CreditoIDConfirmadoDigital: CreditoIDConfirmadoDigital }))
    }


    const AbrirPlanDePagosDigital = () => {
        let a = {
            CreditoID: state.CreditoIDConfirmadoDigital,
        }
        Funciones.getPlanPagos(props.oidc, a)
            .then((respuesta: any) => {
                // console.log("Respuesta Plan de Pagos Digital: ", respuesta)
                setState(s => ({ ...s, DatosPlanPagosDigital: respuesta, VerPlanPagosDigital: true }))
            })
            .catch(() => {
                setState(s => ({ ...s, DatosPlanPagosDigital: [] }))
            })

    }

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
    }

    const fnGetDatos = (Codigo: string) => {
        /* console.log(Codigo);
        return false; */
        let confirmDatos = false
        if (Codigo.length == 6) {

            let Datos = {
                ProductoID: 0,
                Codigo,
                SucursalID: state.Form.Datos.SucursalId,
                CajaID: state.Form.Datos.CajaID,
            }

            Funciones.FNGetDatos(props.oidc, Datos)
                .then((res: any) => {
                    if (res.regresa < 1) {
                        if (res.EstatusCodigo == 'T') {
                            toast.warning(res.msj)
                        }
                        else {
                            toast.error(res.msj)
                        }

                    } else {
                        toast.success(res.msj)
                    }
                    setState(s => ({
                        ...s, Form: {
                            ...state.Form, Datos: {
                                ...state.Form.Datos,
                                Codigo: Codigo,
                                DistribuidorId: res.DistribuidorID,
                                ClienteId: res.ClienteID,
                                Capital: res.Capital,
                                Folio: res.Folio,
                                SerieId: res.SerieId,
                                Plazos: res.Plazos,
                                TipoDesembolsoID: res.TipoDesembolsoID,
                                personasDatosBancariosID: res.personasDatosBancariosID,
                            }
                        }
                    }))
                    /* state.Form.Datos.Codigo = Codigo
                    console.log('Datos de form', state.Form) */

                    /* if (state.Form.Datos.Codigo !== Codigo) confirmDatos = true

                    if (confirmDatos)
                        Funciones.FNGetPrimerCanje(props.oidc, Datos)
                            .then((res: any) => {
                                setState(s => ({ ...s, ShowCliente: true, clientePersona: res.persona, clienteDireccion: res.direccion }))
                            }) */
                })
                .catch(() => {
                    toast.error('Error al recuperar los datos, intente lo nuevamente o reporte el error a sistemas')
                    setState(s => ({
                        ...s, Form: {
                            ...state.Form, Datos: {
                                ...state.Form.Datos,
                                Codigo,
                                DistribuidorId: 0,
                                ClienteId: 0,
                                Capital: 0,
                                Folio: 0,
                                SerieId: 0,
                                Plazos: 0,
                                TipoDesembolsoID: 0,
                                personasDatosBancariosID: 0,
                                RequiereDatosBancarios: false
                            }
                        }
                    }))
                })
        }
    }

    const fnGetLineaTiendita = (DistribuidorID: number) => {
        FnDistribuidores.FNGetNivelProducto(props.oidc, state.ProdTiendita, DistribuidorID)
            .then((respuesta: any) => {
                console.log('Respuesta Vale Digital: ', respuesta);
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

    const fnGetCondicionesDetalle = (SucursalId?: number, DistribuidorID?: number) => {
        let Datos = {
            ProductoID: 0,
            SucursalId: SucursalId as number,
            DistribuidorID: DistribuidorID as number
        }

        if (SucursalId! > 0 && DistribuidorID! > 0)
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

    useEffect(() => {
        // FnGetSeries(state.Producto.ProductoID)
        FNGetVariablesGlobales()
    }, [state.Producto.ProductoID])

    useEffect(() => {
        console.log('Codigo: ', state.Form.Datos.Codigo)

        fnGetCondicionesDetalle(state.Form.Datos.SucursalId, state.Form.Datos.DistribuidorId)

        fnGetLineaTiendita(state.Form.Datos.DistribuidorId)

    }, [state.Form.Datos.Codigo])

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

    const cbAgregarCliente = (item: any) => {
        console.log('item: ', item)
        if (item.res == 1) {
            setState(s => ({
                ...s, Form: {
                    ...state.Form, Datos: {
                        ...state.Form.Datos,
                        DistribuidorId: 0,
                        ClienteId: 0,
                        Capital: 0,
                        Folio: 0,
                        SerieId: 0,
                        Plazos: 0,
                        TipoDesembolsoID: 0,
                        personasDatosBancariosID: 0,
                        RequiereDatosBancarios: false
                    }
                }
            }))
            fnGetDatos(state.Form.Datos.Codigo)
            toast.success(item.msj)
        }
        if (item.res == 2) {
            toast.warning(item.msj)
        }
        setState(s => ({ ...s, ShowCliente: false }))
    }

    const cbCancelarCliente = () => {
        //setState(s => ({ ...s, ShowCliente: false }))
        window.location.reload();
    }


    useEffect(() => {

        if (isMounted.current === true) {
            fnGetSucursalesCaja()
            FnGetProducto()
        }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    const ColumnsPlanPagosDigital: IDataTableColumn[] =
        [
            { name: 'Credito', selector: 'CreditoID', sortable: false, center: true },
            { name: 'Nº Pago', selector: 'NoPago', sortable: false, center: true },
            { name: 'Monto Pago', selector: 'ImporteTotal', sortable: false, center: true },
            {
                name: 'Fecha Pago', width: '110px', selector: 'FechaVencimientoClienteFinal', sortable: true, cell: (props) => props.NoPago != null ? <span>{formatDate(addOneDay(new Date(props.FechaVencimientoClienteFinal)))}</span> : <span></span>, conditionalCellStyles: [
                    {
                        when: row => row.NoPago == null,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },
                    },
                ]
            },
        ]

    return (
        <Card Title="Canje Folio Digital">
            <Card.Body>
                <Card.Body.Content>
                    <ValeDigital
                        ActualizarCreditoModalDigital={ActualizarCreditoModalDigital}
                        AbrirPlanDePagosDigital={AbrirPlanDePagosDigital}
                        oidc={props.oidc}
                        initialValues={state.Form.Datos}
                        optSucursales={state.optSucursales}
                        optCapital={state.optCapital}
                        optPlazos={state.optPlazos}
                        fnGetDatos={fnGetDatos}
                        Sistema={state.Sistema}
                        ProdTiendita={state.ProdTiendita}
                        TabTiendita={state.TabTiendita}
                    />
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
                    {state.ShowCliente &&
                        <AgregarCliente Item={state.Form.Datos.DistribuidorId} Item2={state.clientePersona} Item3={state.clienteDireccion} oidc={props.oidc} cbActualizar={() => { }} cbGuardar={cbAgregarCliente} fnCancelar={cbCancelarCliente} mostrar={state.ShowCliente} />
                    }


                    <ModalWin center open={state.VerPlanPagosDigital} zIndex={100000} large>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>
                            </h5>
                            <button type="button" className="delete" onClick={() => setState(s => ({ ...s, VerPlanPagosDigital: false, DatosPlanPagosDigital: [] }))} />

                        </ModalWin.Header>
                        <ModalWin.Body>
                            <div className="row">
                                <Card Title="Plan de Pagos">
                                    <Card.Body>
                                        <Card.Body.Content>
                                            {state.CargandoPlanPagosDigital && <Spinner />}
                                            {state.ErrorPlanPagosDigital && <span>Error al cargar los datos...</span>}
                                            {!state.CargandoPlanPagosDigital && !state.ErrorPlanPagosDigital &&
                                                <div>
                                                    <DataTable
                                                        subHeader
                                                        data={state.DatosPlanPagosDigital}
                                                        striped
                                                        pagination
                                                        dense
                                                        noHeader
                                                        responsive
                                                        keyField={"CreditoID"}
                                                        defaultSortField={"CreditoID"}
                                                        columns={ColumnsPlanPagosDigital}
                                                    />
                                                </div>
                                            }
                                        </Card.Body.Content>
                                    </Card.Body>
                                </Card>
                            </div >
                        </ModalWin.Body>
                    </ModalWin>

                </Card.Body.Content>
            </Card.Body>
        </Card>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    iUI: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoValeDigital)