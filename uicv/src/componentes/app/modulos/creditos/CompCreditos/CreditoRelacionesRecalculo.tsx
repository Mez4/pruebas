import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoRelacionesRecalculo/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
import * as FnCoordinadores from './CreditoCoordinador/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { DescripcionDistribuidor } from '../../../../../global/variables'
import { iUI } from '../../../../../interfaces/ui/iUI'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoRelacionesRecalculo/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc,
    iUI: iUI
}

const CreditoRelacionesRecalculo = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    const DatosDefecto = { fechaCorte: '',
        SucursalID: 0,
        DistribuidorID: 0,
        swForzar: false, }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optSucursales: any[] = []
    const optCoordinadores: any[] = []
    const optFechasCortes: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        // Form:
        // {
        //     Mostrar: false,
        fecha: '',
        Form: DatosDefecto,
        Distribuidores: [] as number[],
        //     Id: undefined
        // },
        optSucursales,
        optCoordinadores,
        optFechasCortes,
        loading: false
    })

    const fnGetSucursales = () => {
        setState(s => ({ ...s, Cargando: true }))
        FnSucursales.FNGetProd(props.oidc, props.iUI.Producto?.ProductoID)
            .then((respuesta: any) => {

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });

                sucursales.shift();

                sucursales.unshift({ value: 0, label: 'TODAS' });

                setState(s => ({ ...s, Cargando: false, optSucursales: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, optSucursales: [] }))
            })
    }

    const fnGetCoordinadores = (SucursalID: number) => {
        if (SucursalID > 0)
            FnCoordinadores.FNGetBySucursal(props.oidc, SucursalID)
                .then((respuesta: any) => {

                    var coordinadores = respuesta.map((valor: any) => {
                        var obj = { value: valor.CoordinadorID, label: valor.CoordinadorID + ' - ' + valor.NombreCompleto };
                        return obj
                    });

                    setState(s => ({ ...s, optCoordinadores: coordinadores }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optCoordinadores: [] }))
                })
    }

    const fnGetDistribuidores = (SucursalID: number, CoordinadorID: number, fechaCorte: string) => {
        if (SucursalID > 0 && CoordinadorID > 0)
            FnDistribuidores.FNGetByCoordinadorSucursal(props.oidc, SucursalID, CoordinadorID, fechaCorte)
                .then((respuesta: any) => {
                    // if (isMounted.current === true) {
                    setState(s => ({ ...s, Error: false, Datos: respuesta }))
                    // }
                })
                .catch(() => {
                    // if (isMounted.current === true) {
                    setState(s => ({ ...s, Error: true, Datos: [] }))
                    // }
                })
    }

    const fnGetFechaCortes = (SucursalID: number) => {
        Funciones.FNGetFechaCorte(props.oidc, SucursalID)
            .then((respuesta: any) => {

                var fechacortes = respuesta.map((valor: any) => {
                    var obj = { value: valor.fechaCorte, label: valor.fechaCorte };
                    return obj
                });

                console.log(fechacortes[0].value)

                setState(s => ({
                    ...s, optFechasCortes: fechacortes,
                    fecha: fechacortes[0].value,
                    // Form: {
                    //     ...s.Form,
                    //     fecha: fechacortes[0].value
                    // }
                }))
            })
            .catch(() => {
                setState(s => ({ ...s, optFechasCortes: [] }))
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', width: '70px', selector: 'DistribuidorID', sortable: true, },
                { name: 'Nombre', selector: 'NombreCompleto', sortable: true, },
                {
                    name: 'Fecha Relación', selector: 'fechaCorte', sortable: true, cell: (props) => <span>{props.fechaCorte ? props.fechaCorte : "Sin relación"}</span>, conditionalCellStyles: [
                        {
                            when: row => row.fechaCorte == null,
                            style: {
                                color: 'red',
                            }
                        }
                    ]
                },
                { name: 'Saldo Plazo', selector: 'saldoPlazo', sortable: true, cell: (props) => <span>{props.saldoPlazo ? formatter.format(props.saldoPlazo) : 0}</span> },
                {
                    name: 'Saldo Atrasado', selector: 'saldoAtrasado', sortable: true, cell: (props) => <span>{props.saldoAtrasado ? formatter.format(props.saldoAtrasado) : 0}</span>, conditionalCellStyles: [
                        {
                            when: row => row.saldoAtrasado > 0,
                            style: {
                                color: 'red',
                            }
                        }
                    ]
                },
                {
                    name: 'Pagos Atrasados', selector: 'pagosAtr', sortable: true, conditionalCellStyles: [
                        {
                            when: row => row.pagosAtr > 0,
                            style: {
                                color: 'red',
                            }
                        }
                    ]
                },
                // {
                //     name: 'Acciones', sortable: false,
                //     cell: (props) =>
                //         <button className="asstext" type={"button"} onClick={() => {
                //             setState(s => ({
                //                 ...s,
                //                 Form: {
                //                     ...s.Form, Mostrar: true,
                //                     Datos: { creditoPromotorNombre: props.creditoPromotorNombre, activo: props.activo },
                //                     Id: props.creditoPromotorId
                //                 }
                //             }))
                //         }}>
                //             <FaPencilAlt />
                //         </button>
                // },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            fnGetSucursales()
            fnGetFechaCortes(0)
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    // const cbAgregar = (item: any) =>
    //     setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true } } })

    /** funcion Callback al actualizar un item */
    // const cbActualizar = (item: any) =>
    //     setState({ ...state, Datos: state.Datos.map(Dato => Dato.creditoPromotorId === item.creditoPromotorId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true } } })

    /** funcion para cancelar la forma */
    const fnPrinting = (loading: boolean) => {
        setState(s => ({ ...s, loading: loading }))
    }

    return (
        // <div className="row">
        //     <div className="col-12">
        <Card Title="Recálculo de Relaciones">
            <Card.Body>
                <Card.Body.Content>
                    {state.Cargando && <Spinner />}
                    {state.Error && <span>Error al cargar los datos...</span>}
                    {!state.Cargando && !state.Error &&
                        <div>
                            {/* <div className="text-end">
                                        <button type="button" className="btn btn-secondary btn-sm mb-2"
                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                        >
                                            Agregar
                                        </button>
                                    </div> */}
                            <CForm
                                oidc={props.oidc}
                                initialValues={state.Form}
                                fnGetFechaCortes={fnGetFechaCortes}
                                optSucursales={state.optSucursales}
                                optFechasCortes={state.optFechasCortes}
                                fnPrinting={fnPrinting}
                                fecha={state.fecha}
                            />
                            {/* <DataTable
                                subHeader
                                subHeaderComponent=
                                {
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" placeholder={`Buscar ${DescripcionDistribuidor(1)}`} value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                <span className="input-group-text"><FaSearch /></span>
                                                <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
                                            </div>
                                        </div>
                                    </div>
                                }
                                data={state.DatosMostrar}
                                selectableRows
                                onSelectedRowsChange={(row: any) => setState(s => ({
                                    ...s,
                                    Distribuidores: row.selectedRows.map((valor: any) => {
                                        return valor.DistribuidorID;
                                    })
                                }))
                                }
                                selectableRowDisabled={(row: any) => row.saldoPlazo == null ? true : false}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"DistribuidorID"}
                                defaultSortField={"DistribuidorID"}
                                columns={Columns}
                            /> */}
                        </div>
                    }
                </Card.Body.Content>
            </Card.Body>
        </Card>
        //     </div>
        // </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    iUI: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoRelacionesRecalculo)