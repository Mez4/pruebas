import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './Funciones'

import { useParams, Link } from 'react-router-dom'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaFile, FaWindowClose } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionSelect } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FormateoDinero } from '../../../../../../global/variables'
import ReactTooltip from 'react-tooltip'

import { FiltrarDatos } from '../../../../../../global/functions'

import { CFormAsignarDistribuidor } from './CFormAsignarDistribuidor'

import { FaFilter } from 'react-icons/fa'
import { Formik, Form } from 'formik'
import { colors } from 'react-select/src/theme'
import { toast } from 'react-toastify'




type CatalogosType = {
    oidc: IOidc
}

const CFormListaAsignarDistribuidor = (props: CatalogosType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { DistribuidorID: 0, DistribuidorDesc: '', Capital: 0, SaldoActual: 0, DiasAtraso: 0, Motivo: '', TipoCobranza: '', MotivoID: 0, MesaCobranzaID: 0, Clave: '', ProductoID: 0, ColorAsignaCobranza: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optMesa: any[] = []
    const optMotivo: any[] = []
    const optTipoCobranza: any[] = []
    const optDistribuidor: any[] = []
    const optinformacion: any[] = []
    const FiltroTipoCobranza: number = 0
    const FiltroDistribuidor: number = 0
    const FiltroMotivo: number = 0
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optMesa,
        optMotivo,
        optTipoCobranza,
        optDistribuidor,
        FiltroTipoCobranza,
        FiltroDistribuidor,
        FiltroMotivo,
        Filtro: '',
        Cargando: true,
        Error: false,
        MesaCobranzaID: 0,
        MesaCobranzaDesc: '',
        NombreDirector: '',
        limInferiorDias: 0,
        limSuperiorDias: 0,
        optinformacion,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    type paramType = { id: string, productoId: string }
    let { id } = useParams<paramType>()
    let { productoId } = useParams<paramType>()
    let idRelMesaCredProd: number = parseInt(id as string)
    let id_int: number = parseInt(productoId as string)
    let ProductoID: number = parseInt(productoId as string)



    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.getAsignarDistribuidor(props.oidc, ProductoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetRelacionMesa = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.RelacionMesaProducto(props.oidc, idRelMesaCredProd, ProductoID)
            .then((respuesta: any) => {
                respuesta.map((valor: any) => {
                    setState(s => ({ ...s, MesaCobranzaID: valor.MesaCobranzaID, MesaCobranzaDesc: valor.MesaCobranzaDesc, NombreDirector: valor.NombreDirector, limInferiorDias: valor.limInferiorDias, limSuperiorDias: valor.limSuperiorDias }))
                });
            })
            .catch(() => {
                setState(s => ({ ...s, MesaCobranzaID: 0, MesaCobranzaDesc: '', NombreDirector: '', limInferiorDias: 0, limSuperiorDias: 0 }))
            })
    }

    // const FnGetMesaCobranza = () => {
    //     setState(s => ({ ...s }))
    //     Funciones.FNGet(props.oidc, { ProductoID })
    //         .then((respuesta: any) => {
    //             var mesa = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.MesaCobranzaID, label: [valor.MesaCobranzaDesc, ' - ', 'Limite Inferior Días:', '  ', valor.limInferiorDias, ' - ', 'limite Superior Días:', '  ', valor.limSuperiorDias] };
    //                 return obj
    //             });

    //             setState(s => ({ ...s, optMesa: mesa }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, optMesa: [] }))
    //         })
    // }

    const getMotivosAsignacion = () => {
        setState(s => ({ ...s }))
        Funciones.getMotivosAsignacion(props.oidc)
            .then((respuesta: any) => {
                var mesa = respuesta.map((valor: any) => {
                    var obj = { value: valor.MotivoID, label: valor.Descripcion };
                    return obj

                });

                setState(s => ({ ...s, optMotivo: mesa }))
            })
            .catch(() => {
                setState(s => ({ ...s, optMotivo: [] }))
            })
    }

    const FnTipoCobranza = () => {
        setState(s => ({ ...s }))
        Funciones.getTipoCobranza(props.oidc)
            .then((respuesta: any) => {
                var TipoCobranza = respuesta.map((valor: any) => {
                    var obj = { value: valor.CobranzaID, label: valor.Nombre };
                    //console.log(obj, 'ABC')
                    return obj

                });

                setState(s => ({ ...s, optTipoCobranza: TipoCobranza }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTipoCobranza: [] }))
            })
    }

    // const FnConsolidadoDictamen = () => {
    //     var obj = [{ value: 1, label: 'AUTOMATICO' }, { value: 2, label: 'MANUAL' }]
    //     setState(s => ({ ...s, optTipoCobranza: obj }))
    //     return obj
    // }

    const getDistribuidores = () => {
        setState(s => ({ ...s }))
        Funciones.getAsignarDistribuidor(props.oidc, ProductoID)
            .then((respuesta: any) => {
                var Distribuidor = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorID, label: valor.DistribuidorDesc };
                    return obj
                });

                setState(s => ({ ...s, optDistribuidor: Distribuidor }))
            })
            .catch(() => {
                setState(s => ({ ...s, optDistribuidor: [] }))
            })
    }

    const FnMonitoreo = (DistribuidorID: number, Capital: number, SaldoActual: number, DiasAtraso: number, DistribuidorDesc: string, Motivo: string, TipoCobranza: string, MotivoID: number, MesaCobranzaID: number, Clave: string, ProductoID: number, ColorAsignaCobranza: string) => {

        Funciones.ValidarBit(props.oidc, idRelMesaCredProd, 0, 1)
            .then(() => {

                setState(s => ({
                    ...s,
                    Form: {
                        ...state.Form, Mostrar: true,
                        Datos: { DistribuidorID, Capital, SaldoActual, DiasAtraso, DistribuidorDesc, Motivo, TipoCobranza, MotivoID, MesaCobranzaID, Clave, ProductoID, ColorAsignaCobranza },
                    }
                }))


            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(error.response.data)
                else if
                    (error.request)
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                else
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                setLoading(false)
            })

    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'SociaID',
                    selector: 'DistribuidorID',
                    sortable: true,
                    width: "10%",
                },

                {
                    name: 'Socia',
                    selector: 'DistribuidorDesc',
                    sortable: true,
                    //center: true,
                    width: "15%",

                    cell: (props) =>
                        <>
                            <label data-tip data-for={`A_${props.DistribuidorID}`} className="LabelInDTable" >
                                {props.DistribuidorDesc}
                            </label>
                            <ReactTooltip id={`A_${props.DistribuidorID}`} type="info" effect="solid">
                                {props.DistribuidorDesc}
                            </ReactTooltip>
                        </>
                },

                {
                    name: 'Capital',
                    selector: 'Capital',
                    sortable: true,
                    //center: true,
                    width: "10%",
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.Capital)}</span>
                },

                {
                    name: 'SaldoActual',
                    selector: 'SaldoActual',
                    sortable: true,
                    //center: true,
                    width: "10%",
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.SaldoActual)}</span>
                },

                {
                    name: 'Motivo',
                    selector: 'Motivo',
                    sortable: true,
                    width: "10%",
                },

                {
                    name: 'TipoCobranza.',
                    selector: 'TipoCobranzaDescCorto',
                    sortable: false,
                    width: '10%',
                    center: true,
                    //cell: (props) => <span>{props.TipoCobranza == 'MANUAL' ? 'M' : props.TipoCobranza == 'AUTOMATICO' ? 'A' : ''}</span>,
                    cell: (props) => <span>{props.TipoCobranzaDescCorto}</span>,
                },

                {
                    name: 'MesaCobranza',
                    selector: 'MesaCobranzaDesc',
                    sortable: false,
                    center: true,
                    width: '15%',
                    cell: (props) => <>
                        <label data-tip data-for={`ME_${props.MesaCobranzaDesc}`} className="text-center" >
                            {props.MesaCobranzaDesc}
                        </label>

                        <ReactTooltip id={`ME_${props.MesaCobranzaDesc}`} type="info" effect="solid">
                            {props.MesaCobranzaDesc}
                        </ReactTooltip>
                    </>,
                },

                // {
                //     name: 'MesaCobranza',
                //     selector: 'AsignGestorMesaCobranzaDesc',
                //     sortable: false,
                //     center: true,
                //     width: '10%',
                //     cell: (props) => <>
                //         <label data-tip data-for={`B_${props.AsignGestorMesaCobranzaDesc}`} className="text-center" >
                //             {props.AsignGestorMesaCobranzaDesc}
                //         </label>

                //         <ReactTooltip id={`B_${props.AsignGestorMesaCobranzaDesc}`} type="info" effect="solid">
                //             {props.AsignGestorMesaCobranzaDesc}
                //         </ReactTooltip>
                //     </>,
                // },


                {
                    name: 'DiasAtraso',
                    selector: 'DiasAtraso',
                    sortable: true,
                    center: true,
                    width: "10%",
                },

                // {
                //     name: 'Asignar a Cobranza',
                //     sortable: true,
                //     center: true,
                //     cell: (props) =>
                //         <>
                //             <button className="asstext" type={"button"} onClick={() => {
                //                 setState(s => ({
                //                     ...s,
                //                     Form: {
                //                         ...state.Form, Mostrar: true,
                //                         Datos: { DistribuidorID: props.DistribuidorID, Capital: props.Capital, SaldoActual: props.SaldoActual, DiasAtraso: props.DiasAtraso, DistribuidorDesc: props.DistribuidorDesc, Motivo: props.Motivo, TipoCobranza: props.TipoCobranza, MotivoID: props.MotivoID, MesaCobranzaID: props.MesaCobranzaID, Clave: props.Clave },
                //                         Id: props.DistribuidorID
                //                     }
                //                 }))
                //             }}>
                //                 <FaPencilAlt /></button>

                //             {/* <label data-tip data-for={`A_${props.DistribuidorID}`} className="LabelInDTable" >
                //                 {props.DistribuidorID}
                //             </label> */}

                //             <ReactTooltip id={`A_${props.DistribuidorID}`} type="info" effect="solid">
                //                 {props.DistribuidorDesc}
                //             </ReactTooltip>
                //         </>

                // },

                {
                    name: 'Asignar',
                    selector: '',
                    sortable: true,
                    width: "10%",
                    // center: true,
                    cell: (props) =>
                        <>
                            <div data-tip data-for={`DT_${props.DistribuidorID}`} className="divInDTable text-center radiusSmallDivR">
                                <button className="btn btn-outline-default buttonIconInDTable" onClick={() => {

                                    FnMonitoreo(props.DistribuidorID, props.Capital, props.SaldoActual, props.DiasAtraso, props.DistribuidorDesc, props.Motivo, props.TipoCobranza, props.MotivoID, state.MesaCobranzaID, props.Clave, ProductoID, props.ColorAsignaCobranza)

                                    // setState(s => ({
                                    //     ...s,
                                    //     Form: {
                                    //         ...state.Form, Mostrar: true,
                                    //         Datos: { DistribuidorID: props.DistribuidorID, Capital: props.Capital, SaldoActual: props.SaldoActual, DiasAtraso: props.DiasAtraso, DistribuidorDesc: props.DistribuidorDesc, Motivo: props.Motivo, TipoCobranza: props.TipoCobranza, MotivoID: props.MotivoID, MesaCobranzaID: state.MesaCobranzaID, Clave: props.Clave, ProductoID: ProductoID, ColorAsignaCobranza: props.ColorAsignaCobranza },
                                    //         Id: props.DistribuidorID
                                    //     }
                                    // }))
                                }
                                } >
                                    <FaPencilAlt color={props.ColorAsignaCobranza} /></button>
                            </div>
                            <ReactTooltip id={`DT_${props.DistribuidorID}`} type="info" effect="solid">
                                Socia {props.DistribuidorDesc}
                            </ReactTooltip>
                        </>
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        // FnGetMesaCobranza()
        getMotivosAsignacion()
        FnTipoCobranza()
        //FnConsolidadoDictamen()
        getDistribuidores()
        FNGetRelacionMesa()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroTipoCobranza, state.FiltroDistribuidor, state.FiltroMotivo])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', Capital: 0, SaldoActual: 0, DiasAtraso: 0, Motivo: '', TipoCobranza: '', MotivoID: 0, MesaCobranzaID: 0, Clave: '', ProductoID: 0, ColorAsignaCobranza: '' } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.DistribuidorID === item.DistribuidorID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', Capital: 0, SaldoActual: 0, DiasAtraso: 0, Motivo: '', TipoCobranza: '', MotivoID: 0, MesaCobranzaID: 0, Clave: '', ProductoID: 0, ColorAsignaCobranza: '' } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    // AQUI EMPIEZAN LA PARTE DE LOS FILTROS
    const fnGetFiltroTipoCobranza = (TipoCobranza: number) => {
        setState(s => ({ ...s, FiltroTipoCobranza: TipoCobranza }))
    }
    const fnGetFiltroDistribuidor = (DistribuidorID: number) => {
        setState(s => ({ ...s, FiltroDistribuidor: DistribuidorID }))
    }
    const fnGetFiltroMotivo = (MotivoID: number) => {
        setState(s => ({ ...s, FiltroMotivo: MotivoID }))
    }

    const FnFiltrando = () => {
        let numFiltro = (state.FiltroTipoCobranza, state.FiltroDistribuidor, state.FiltroMotivo)
        let datosFiltro = state.Datos
        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))

        if (state.FiltroTipoCobranza > 0)
            datosFiltro = datosFiltro.filter(d => { return d.TipoCobranzaID === state.FiltroTipoCobranza })


        if (state.FiltroDistribuidor > 0)
            datosFiltro = datosFiltro.filter(d => { return d.DistribuidorID === state.FiltroDistribuidor })

        if (state.FiltroMotivo > 0)
            datosFiltro = datosFiltro.filter(d => { return d.MotivoID === state.FiltroMotivo })


        setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="ASIGNAR SOCIAS">
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
                                            <div className="row" style={{ width: '102%' }}>
                                                <div className="d-flex justify-content-end">
                                                    <div style={{ width: '10%' }}>
                                                        <Link className="btn btn-danger" style={{ width: '3%', height: '3%' }} to={`/app/${id_int}/cobranza/RelacionMesaCobranza`}>Regresar</Link>
                                                    </div>
                                                </div>
                                                <span style={{ width: '300%', color: 'black', height: '200%' }}> MESA COBRANZA: &nbsp; {state.MesaCobranzaDesc} <br /> ENCARGADO: &nbsp; {state.NombreDirector} <br /> RANGO DE DIAS:&nbsp; {state.limInferiorDias} - {state.limSuperiorDias} </span>

                                                <p></p>
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                            <div>
                                                                <div style={{ float: 'right' }}>
                                                                    <div className="input-group mb-3">
                                                                        {/* <input type="text" className="form-control" placeholder="Buscar Distribuidor" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                                        <span className="input-group-text"><FaSearch /> </span> */}
                                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                                          onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                                          ><FaPlus /></button> */}
                                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                                    </div>
                                                                </div>
                                                                <div style={{ float: 'left' }}><FaFilter /></div>
                                                                <div ><label> FILTROS</label></div>
                                                            </div>

                                                            <Formik
                                                                initialValues={{}}
                                                                onSubmit={() => { }}
                                                            >
                                                                <Form>
                                                                    <div className="col-sm-12">
                                                                        <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                                            <div className="row" style={{ textAlign: 'initial' }}>

                                                                                <div style={{ height: '67px', width: '245px' }}>
                                                                                    <ActionSelect
                                                                                        disabled={false}
                                                                                        label="Socia"
                                                                                        name="DistribuidorID"
                                                                                        placeholder="TODOS"
                                                                                        options={state.optDistribuidor}
                                                                                        addDefault={true}
                                                                                        valor={state.FiltroDistribuidor}
                                                                                        accion={fnGetFiltroDistribuidor}
                                                                                    />
                                                                                </div>

                                                                                <div style={{ height: '67px', width: '245px' }}>
                                                                                    <ActionSelect
                                                                                        disabled={false}
                                                                                        label="TipoCobranza"
                                                                                        name="TipoCobranza"
                                                                                        placeholder="TODOS"
                                                                                        options={state.optTipoCobranza}
                                                                                        addDefault={true}
                                                                                        valor={state.FiltroTipoCobranza}
                                                                                        accion={fnGetFiltroTipoCobranza}
                                                                                    />
                                                                                </div>

                                                                                <div style={{ height: '67px', width: '245px' }}>
                                                                                    <ActionSelect
                                                                                        disabled={false}
                                                                                        label="MotivoID"
                                                                                        name="MotivoID"
                                                                                        placeholder="TODOS"
                                                                                        options={state.optMotivo}
                                                                                        addDefault={true}
                                                                                        valor={state.FiltroMotivo}
                                                                                        accion={fnGetFiltroMotivo}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Form>
                                                            </Formik>

                                                        </div>
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
                                        keyField={"DistribuidorID"}
                                        defaultSortField={"DistribuidorID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>ASIGNAR SOCIA <br />{state.MesaCobranzaDesc}</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CFormAsignarDistribuidor
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                // optMesa={state.optMesa}
                                                optMotivo={state.optMotivo}
                                                MesaCobranzaID={state.MesaCobranzaID}
                                                idRelMesaCredProd={idRelMesaCredProd}
                                            />}
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
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CFormListaAsignarDistribuidor);
