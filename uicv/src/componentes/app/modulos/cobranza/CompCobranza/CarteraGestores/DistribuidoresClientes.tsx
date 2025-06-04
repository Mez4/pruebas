import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from '../../../cobranza/CompCobranza/CarteraGestores/Funciones'

import * as FuncionesGestoresCobranza from '../../../cobranza/CompCobranza/CatalogoGestoresCobranza/Funciones'

import { useParams, Link } from 'react-router-dom'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaFile, FaWindowClose, FaEye } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionSelect } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FormateoDinero } from '../../../../../../global/variables'
import ReactTooltip from 'react-tooltip'

import { FiltrarDatos } from '../../../../../../global/functions'

//import { CFormAsignarDistribuidor } from './CFormAsignarDistribuidor'

import { FaFilter } from 'react-icons/fa'
import { Formik, Form } from 'formik'
import { colors } from 'react-select/src/theme'
import { date } from 'yup/lib/locale'




type CatalogosType = {
    oidc: IOidc,
    initialValues: { GestorID: number, DistribuidorID: number, DistribuidorDesc: string, FechaAsignacion: Date, DiasAtraso: number, TicketID: number },
    fnCancelar(): any,
    ProductoID: number,
}

export const DistribuidoresClientes = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { DistribuidorID: 0, DistribuidorDesc: '', FechaAsignacion: new Date, DiasAtraso: 0 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCliente: any[] = []
    const optinformacion: any[] = []
    const FiltroCliente: number = 0
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optCliente,
        FiltroCliente,
        Filtro: '',
        Cargando: true,
        Error: false,
        MesaCobranzaID: 0,
        MesaCobranzaDesc: '',
        NombreDirector: '',
        limInferiorDias: 0,
        limSuperiorDias: 0,
        optinformacion,
        DistribuidorID: 0,
        DistribuidorDesc: '',
        GestorID: 0,
        GestorDesc: '',
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    // type paramType = { id: string, productoId: string }
    // let { id } = useParams<paramType>()
    // let { productoId } = useParams<paramType>()
    // let DistribuidorID: number = parseInt(id as string)
    // let PersonaID: number = parseInt(id as string)
    // let id_int: number = parseInt(productoId as string)
    // let ProductoID: number = parseInt(productoId as string)


    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.DistribuidoresClientes(props.oidc, props.initialValues.DistribuidorID, props.ProductoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    // const FnGetClientes = () => {
    //     setState(s => ({ ...s }))
    //     Funciones.DistribuidoresClientes(props.oidc, props.initialValues.DistribuidorID, props.ProductoID)
    //         .then((respuesta: any) => {
    //             var Grupo = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.ClienteID, label: valor.ClienteDesc };
    //                 console.log(obj, 'ABC')
    //                 return obj

    //             });

    //             setState(s => ({ ...s, optCliente: Grupo }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, optCliente: [] }))
    //         })
    // }

    // const FNGetDistribuidores = () => {
    //     setState(s => ({ ...s, Cargando: true }))
    //     Funciones.FNGetPersonas(props.oidc, { PersonaID })
    //         .then((respuesta: any) => {
    //             respuesta.map((valor: any) => {
    //                 setState(s => ({ ...s, DistribuidorID: valor.PersonaID, DistribuidorDesc: valor.NombreCompleto }))
    //             });
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, DistribuidorID: 0, DistribuidorDesc: '' }))
    //         })
    // }

    // const FNGetGestores = () => {
    //     setState(s => ({ ...s, Cargando: true }))
    //     Funciones.FNGetGestores(props.oidc, { DistribuidorID, ProductoID })
    //         .then((respuesta: any) => {
    //             respuesta.map((valor: any) => {
    //                 setState(s => ({ ...s, GestorID: valor.GestorID, GestorDesc: valor.GestorDesc }))
    //             });
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, GestorID: 0, GestorDesc: '' }))
    //         })
    // }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'ClienteID',
                    sortable: true,
                    width: '10%',
                    center: true,
                },

                {
                    name: 'Cliente',
                    selector: 'ClienteDesc',
                    sortable: true,
                    width: '15%',
                    center: true,
                    cell: (props) =>

                        <>
                            <label data-tip data-for={`A_${props.ClienteDesc}`} className="text-center" >
                                {props.ClienteDesc}
                            </label>
                            <ReactTooltip id={`A_${props.ClienteDesc}`} type="info" effect="solid">
                                {props.ClienteDesc}
                            </ReactTooltip>

                        </>
                },

                {
                    name: 'TelMovil',
                    selector: 'TelefonoMovil',
                    sortable: true,
                    width: '12%',
                    center: true,
                },

                {
                    name: 'FHAsignacion',
                    selector: 'FechaAsignacion',
                    sortable: true,
                    width: '10%',
                    center: true,
                },

                // {
                //     name: 'Direccion',
                //     selector: 'Direccion',
                //     sortable: true,
                //     width: '10%',
                //     center: true,
                //     cell: (props) =>
                //         <>
                //             <label data-tip data-for={`A_${props.Direccion}`} className="LabelInDTable" >
                //                 {props.Direccion}
                //             </label>
                //             <ReactTooltip id={`A_${props.Direccion}`} type="info" effect="solid">
                //                 {props.Direccion}
                //             </ReactTooltip>

                //         </>
                // },

                {
                    name: 'ContratoID',
                    selector: 'ContratoID',
                    sortable: true,
                    width: '10%',
                    center: true,
                },

                {
                    name: 'CreditoID',
                    selector: 'CreditoID',
                    sortable: true,
                    width: '10%',
                    center: true,
                },

                {
                    name: 'SaldoAct',
                    selector: 'SaldoActual',
                    sortable: true,
                    width: '10%',
                    center: true,
                    cell: (props) => <span className="text-center">{FormateoDinero.format(props.SaldoActual)}</span>
                },

                {
                    name: 'SaldoAtr',
                    selector: 'SaldoAtrasado',
                    sortable: true,
                    width: '10%',
                    center: true,
                    cell: (props) => <span className="text-center">{FormateoDinero.format(props.SaldoAtrasado)}</span>
                },

                {
                    name: 'DiasAtr',
                    selector: 'DiasAtraso',
                    sortable: true,
                    center: true,
                    width: '10%',
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        // FnGetClientes()
        // FNGetDistribuidores()
        // FNGetGestores()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // React.useEffect(() => {
    //     FnFiltrando()
    // }, [state.FiltroCliente])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', FechaAsignacion: new Date, DiasAtraso: 0 } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.DistribuidorID === item.DistribuidorID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', FechaAsignacion: new Date, DiasAtraso: 0 } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    // AQUI EMPIEZAN LA PARTE DE LOS FILTROS
    // const fnGetFiltrosClientes = (FiltroCliente: number) => {
    //     setState(s => ({ ...s, FiltroCliente: FiltroCliente }))
    // }

    // const FnFiltrando = () => {
    //     let numFiltro = (state.FiltroCliente)
    //     let datosFiltro = state.Datos
    //     if (numFiltro > 0)
    //         setState(s => ({ ...s, Filtrando: true }))
    //     else
    //         setState(s => ({ ...s, Filtrando: false }))

    //     if (state.FiltroCliente > 0)
    //         datosFiltro = datosFiltro.filter(d => { return d.ClienteID === state.FiltroCliente })

    //     // if (state.FiltroDiasAtraso > 0)
    //     //     datosFiltro = datosFiltro.filter(d => { return state.FiltroDiasAtraso >= d.limInferiorDias && state.FiltroDiasAtraso <= d.limSuperiorDias })

    //     setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    // }

    return (
        <div className="row">
            <div className="col-12">
                <Card>
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
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button> */}
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
                                        // keyField={"ClienteID"}
                                        // defaultSortField={"ClienteID"}
                                        columns={Columns}
                                    />
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
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(DistribuidoresClientes);

