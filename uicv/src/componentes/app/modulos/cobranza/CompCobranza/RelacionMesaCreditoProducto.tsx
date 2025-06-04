import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import ReactTooltip from 'react-tooltip'

import * as Funciones from './RelacionMesaCreditoProducto/Funciones'

import * as FnMora from '../../cobranza/CompCobranza/CatalogoTabDiasMora/Funciones'

// Link
import { Link, useParams } from 'react-router-dom'

// Icons
import { FaPencilAlt, FaPlus, FaTasks,FaSearch, FaCircle, FaEye, FaPlusCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionSelect } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './RelacionMesaCreditoProducto/CForm'
import {CFormValidaAsignacion} from './RelacionMesaCreditoProducto/CFormValidaAsignacion'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { FcContacts } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { number } from 'yup/lib/locale'
import { Formik, Form } from 'formik'
import { FaFilter } from 'react-icons/fa'


type CatalogosType = {
    oidc: IOidc
}

const RelacionMesaCobranza = (props: CatalogosType) => {
    type paramType = { productoId: string }
    let { productoId } = useParams<paramType>()
    let id_int: number = parseInt(productoId as string)
    let ProductoID: number = parseInt(productoId as string)

    // Controll our mounted state
    let isMounted = React.useRef(true)

    //const DatosDefecto = { idRelMesaCredProd: 0, ProductoID: 0, Producto: '', DirectorMesaCobranzaID: 0, NombreDirector: '', idTabMora: 0, MesaCobranzaID: 0, MesaCobranzaDesc: '', Clave: '', limInferiorDias: 0, limSuperiorDias: 0, Activo: false, verifDom: false, Monitoreo: false, Cobranza: false, Coordinador: false, Legal: false }
    const DatosDefecto = { idRelMesaCredProd: 0, ProductoID: 0, Producto: '', DirectorMesaCobranzaID: 0, NombreDirector: '', idTabMora: 0, MesaCobranzaID: 0,  limInferiorDias: 0, limSuperiorDias: 0, Activo: false, verifDom: false, Monitoreo: false, Cobranza: false, Coordinador: false, Legal: false }
    const Datos: any[] = []
    const AsignacionesD = {DistribuidorID: 0 ,DistribuidorDesc : '' ,SucursalDesc : '' ,DiasAtraso : 0 ,ProductoID : 0,ColorAsignaGestor : ''	,ColorAsignaCobranza : '' ,Grupo : '' ,Capital : 0,SaldoActual : 0}
    const Asignaciones : any[] = []
    const DatosMostrar: any[] = []
    const optMesa: any[] = []
    const optTabMora: any[] = []
    const optPersonas: any[] = []
    const optDistribuidor: any[] = []
    const FiltroEncargado: number = 0
    const FiltroDiasAtraso: number = 0
    const [state, setState] = React.useState({
        Datos,
        Asignaciones:AsignacionesD,
        optMesa,
        optTabMora,
        optPersonas,
        optDistribuidor,
        FiltroEncargado,
        FiltroDiasAtraso,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Identificador: 0,
        DiasAtraso: 0,
        MostrarListado: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc, { ProductoID })
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

    const FngGetMesa =() => {
        setState(s => ({ ...s}))
        Funciones.FNGetMesaC(props.oidc)
        .then((respuesta :any) => {
            var mesa = respuesta.map((valor: any) =>{
                // var obj = {value: valor.MesaCobranzaID, label: valor.Nombre, Clave: valor.Clave}
                var obj = {value: valor.MesaCobranzaID, label: [valor.Nombre, ' - ',valor.Clave]}
                return obj
            })
            setState(s => ({...s, optMesa: mesa}))
        })
        .catch(() => {
            setState(s => ({...s, optMesa:[]}))
        })
    }

    const FnGetTabMora = () => {
        setState(s => ({ ...s }))
        //FnMora.FNGet(props.oidc)
        Funciones.FNGetTabMora(props.oidc)
            .then((respuesta: any) => {
                //console.log('Prueba', respuesta)
                var mora = respuesta.map((valor: any) => {
                    var obj = { value: valor.idTabMora, label: ['idTabMora:', '  ', valor.idTabMora, ' - ', 'Limite Inferior Días:', '  ', valor.limInferiorDias, ' - ', 'limite Superior Días:', '  ', valor.limSuperiorDias] };
                    return obj
                });

                setState(s => ({ ...s, optTabMora: mora }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTabMora: [] }))
            })
    }

    const FnGetPersonas = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetDirectores(props.oidc)
            .then((respuesta: any) => {
                var personas = respuesta.map((valor: any) => {
                    var obj = { value: valor.DirectorMesaCobranzaID, label: valor.NombreCompleto };
                    return obj

                });

                setState(s => ({ ...s, optPersonas: personas }))
            })
            .catch(() => {
                setState(s => ({ ...s, optPersonas: [] }))
            })
    }

    const FnGetDistribuidores = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetDistribuidores(props.oidc, ProductoID)
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
    


    // const ColumnsList : IDataTableColumn[]=[
    //     {
    //         name: 'id',
    //         selector: 'idRelMesaCredProd',
    //         width: '5%',
    //         sortable: true,
    //     },
    // ]


    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'idRelMesaCredProd',
                width: '5%',
                sortable: true,
            },

            {
                name: 'Encargado',
                selector: 'NombreDirector',
                sortable: true,
                width: '20%',
            },

            {
                name: 'Límite Días',
                selector: 'limInferiorDias',
                sortable: true,
                width: '10%',
                cell: (props) =>
                    <span className="text-center">
                        {props.limInferiorDias} - {props.limSuperiorDias}
                    </span>
            },

            {
                name: 'Mesa Cobranza',
                selector: 'MesaCobranzaDesc',
                sortable: true,
                width: '13%',
            },

            {
                name: 'Activo',
                selector: 'Activo',
                sortable: true,
                width: '7%',
                center: true,
                cell: (props) =>
                    <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },

            {
                name: 'Verificación Domicilio',
                selector: 'verifDom',
                sortable: true,
                width: '7%',
                center: true,
                cell: (props) =>
                    <span>{props.verifDom ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },

            {
                name: 'Monitoreo',
                selector: 'Monitoreo',
                sortable: true,
                width: '7%',
                center: true,
                cell: (props) =>
                    <span>{props.Monitoreo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },

            {
                name: 'Cobranza',
                selector: 'Cobranza',
                sortable: true,
                width: '7%',
                center: true,
                cell: (props) =>
                    <span>{props.Cobranza ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },

            {
                name: 'Coordinador',
                selector: 'Coordinador',
                sortable: true,
                width: '7%',
                center: true,
                cell: (props) =>
                    <span>{props.Coordinador ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },

            {
                name: 'Legal',
                selector: 'Legal',
                sortable: true,
                width: '7%',
                center: true,
                cell: (props) =>
                    <span>{props.Legal ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
            },

            {
                name: 'Acciones',
                sortable: false,
                center: true,
                width: '7%',
                cell: (props) =>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <React.Fragment>
                            {/* <button className="asstext" type={"button"} onClick={() => { fnValidacion(props.idRelMesaCredProd, props.ProductoID, props.Producto, props.DirectorMesaCobranzaID, props.NombreDirector, props.idTabMora, props.MesaCobranzaID, props.MesaCobranzaDesc, props.Clave, props.limInferiorDias, props.limSuperiorDias, props.Activo, props.verifDom, props.Monitoreo, props.Cobranza, props.Coordinador, props.Legal, 1) }}><FaPencilAlt /></button> */}
                            <button className="asstext" type={"button"} onClick={() => { fnValidacion(props.idRelMesaCredProd, props.ProductoID, props.Producto, props.DirectorMesaCobranzaID, props.NombreDirector, props.idTabMora, props.MesaCobranzaID, props.limInferiorDias, props.limSuperiorDias, props.Activo, props.verifDom, props.Monitoreo, props.Cobranza, props.Coordinador, props.Legal, 1) }}><FaPencilAlt /></button>
                            &nbsp;
                            <Link className={`has-text-dark ml-1`} to={`/app/${id_int}/cobranza/Distribuidores/${props.idRelMesaCredProd}`} ><FaEye size={16} /></Link>
                            &nbsp;
                            <Link className={`has-text-dark ml-1`} to={`/app/${id_int}/cobranza/ListaAsignarDistribuidor/${props.idRelMesaCredProd}`}><FaPlusCircle size={16} /></Link>
                        </React.Fragment>
                    </div>
            },
        ]

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetTabMora()
        FngGetMesa()
        FnGetPersonas()
        FnGetDistribuidores()
       // FnValidaAsignacion()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroEncargado, state.FiltroDiasAtraso])


    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])
    console.log(`agregar`)
    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        //setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { idRelMesaCredProd: 0, ProductoID: 0, Producto: '', DirectorMesaCobranzaID: 0, NombreDirector: '', idTabMora: 0, MesaCobranzaID: 0, MesaCobranzaDesc: '', Clave: '', limInferiorDias: 0, limSuperiorDias: 0, Activo: false, verifDom: false, Monitoreo: false, Cobranza: false, Coordinador: false, Legal: false } } })
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { idRelMesaCredProd: 0, ProductoID: 0, Producto: '', DirectorMesaCobranzaID: 0, NombreDirector: '', idTabMora: 0, MesaCobranzaID: 0,  limInferiorDias: 0, limSuperiorDias: 0, Activo: false, verifDom: false, Monitoreo: false, Cobranza: false, Coordinador: false, Legal: false } } })
    }


    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        // setState({ ...state, Datos: state.Datos.map(Dato => Dato.idRelMesaCredProd === item.idRelMesaCredProd ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { idRelMesaCredProd: 0, ProductoID: 0, Producto: '', DirectorMesaCobranzaID: 0, NombreDirector: '', idTabMora: 0, MesaCobranzaID: 0, MesaCobranzaDesc: '', Clave: '', limInferiorDias: 0, limSuperiorDias: 0, Activo: false, verifDom: false, Monitoreo: false, Cobranza: false, Coordinador: false, Legal: false } } })
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.idRelMesaCredProd === item.idRelMesaCredProd ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { idRelMesaCredProd: 0, ProductoID: 0, Producto: '', DirectorMesaCobranzaID: 0, NombreDirector: '', idTabMora: 0, MesaCobranzaID: 0, limInferiorDias: 0, limSuperiorDias: 0, Activo: false, verifDom: false, Monitoreo: false, Cobranza: false, Coordinador: false, Legal: false } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, MostrarListado: false, Form: { ...state.Form,  Mostrar: false } })
 
    // const fnValidacion = (idRelMesaCredProd: number, ProductoID: number, Producto: string, DirectorMesaCobranzaID: number, NombreDirector: string, idTabMora: number, MesaCobranzaID: number, MesaCobranzaDesc: string, Clave:string ,limInferiorDias: number, limSuperiorDias: number, Activo: boolean, verifDom: boolean, Monitoreo: boolean, Cobranza: boolean, Coordinador: boolean, Legal, Identificador: number) => {
        const fnValidacion = (idRelMesaCredProd: number, ProductoID: number, Producto: string, DirectorMesaCobranzaID: number, NombreDirector: string, idTabMora: number, MesaCobranzaID: number,  limInferiorDias: number, limSuperiorDias: number, Activo: boolean, verifDom: boolean, Monitoreo: boolean, Cobranza: boolean, Coordinador: boolean, Legal, Identificador: number) => {
        Funciones.FNValidacionAltaRelacionMesaProducto(props.oidc)
            .then((respuesta: any) => {
                if (Identificador == 2) {
                    setState(s => ({
                        ...s, Identificador: 2,
                        Form: {
                            ...state.Form, Mostrar: true,
                            // Datos: { idRelMesaCredProd, ProductoID, Producto, DirectorMesaCobranzaID, NombreDirector, idTabMora, MesaCobranzaID, MesaCobranzaDesc, Clave, limInferiorDias, limSuperiorDias, Activo, verifDom, Monitoreo, Cobranza, Coordinador, Legal },
                            Datos: { idRelMesaCredProd, ProductoID, Producto, DirectorMesaCobranzaID, NombreDirector, idTabMora, MesaCobranzaID,  limInferiorDias, limSuperiorDias, Activo, verifDom, Monitoreo, Cobranza, Coordinador, Legal },
                        }
                    }))
                }
                else {
                    setState(s => ({
                        ...s, Identificador: 1,
                        Form: {
                            ...state.Form, Mostrar: true,
                            // Datos: { idRelMesaCredProd, ProductoID, Producto, DirectorMesaCobranzaID, NombreDirector, idTabMora, MesaCobranzaID, MesaCobranzaDesc, Clave, limInferiorDias, limSuperiorDias, Activo, verifDom, Monitoreo, Cobranza, Coordinador, Legal },
                            Datos: { idRelMesaCredProd, ProductoID, Producto, DirectorMesaCobranzaID, NombreDirector, idTabMora, MesaCobranzaID,   limInferiorDias, limSuperiorDias, Activo, verifDom, Monitoreo, Cobranza, Coordinador, Legal },

                        }
                    }))
                }
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

            })
        }

    // AQUI EMPIEZAN LA PARTE DE LOS FILTROS
    const fnGetFiltrosEncargado = (FiltroEncargado: number) => {
        setState(s => ({ ...s, FiltroEncargado: FiltroEncargado }))
    }

    const fnGetFiltrosDistribuidor = (DistribuidorID: number) => {
        // setState(s => ({ ...s, FiltroDiasAtraso: 15 }))
        Funciones.FNGetFiltroDistribuidor(props.oidc, DistribuidorID, ProductoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, FiltroDiasAtraso: respuesta }))
                }
            })
            .catch((error) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false }))
                }
            })
    }

    const FnFiltrando = () => {
        let numFiltro = (state.FiltroEncargado, state.FiltroDiasAtraso)
        let datosFiltro = state.Datos
        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))

        if (state.FiltroEncargado > 0)
            datosFiltro = datosFiltro.filter(d => { return d.DirectorMesaCobranzaID === state.FiltroEncargado })

        if (state.FiltroDiasAtraso > 0)
            datosFiltro = datosFiltro.filter(d => { return state.FiltroDiasAtraso >= d.limInferiorDias && state.FiltroDiasAtraso <= d.limSuperiorDias })

        setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    }

    const fnMostrar = () => {
        setState(s => ({...s, MostrarListado:true}))
    }
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="RELACIÓN MESA COBRANZA">
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
                                                {/* <div style={{ width: '25%' }}>
                                                    <Link className="ms-2 btn btn-success waves-effect waves-light" style={{ width: '5%', height: '5%' }} to={`/app/${id_int}/cobranza/ListaAsignarDistribuidor`}>Asignar Socia a Cobranza</Link>
                                                </div>
                                                <p></p> */}
                                                <div className="col-sm-12">
                                                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                        <div>
                                                            <div style={{ float: 'right' }}>
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => fnMostrar()} style={{marginRight: '1em'}}
                                                                ><FaTasks/></button>
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => fnValidacion(0, ProductoID, '', 0, '', 0, 0,  0, 0, false, false, false, false, false, false, 2)}
                                                                    // onClick={() => fnValidacion(0, ProductoID, '', 0, '', 0, 0, '', '', 0, 0, false, false, false, false, false, false, 2)}
                                                                ><FaPlus /></button>
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}
                                                                ><FiRefreshCcw /></button>
                                                            </div>
                                                            <div style={{ float: 'left' }}
                                                                ><FaFilter /></div>
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
                                                                                    label="Encargado"
                                                                                    name="DirectorMesaCobranzaID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optPersonas}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroEncargado}
                                                                                    accion={fnGetFiltrosEncargado}
                                                                                />
                                                                            </div>

                                                                            <div style={{ height: '67px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="Socia"
                                                                                    name="DistribuidorDesc"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optDistribuidor}
                                                                                    addDefault={true}
                                                                                    //valor={state.FiltroDiasAtraso}
                                                                                    accion={fnGetFiltrosDistribuidor}
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
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"idRelMesaCredProd"}
                                        defaultSortField={"idRelMesaCredProd"}
                                        columns={Columns}
                                    />

                                    <ModalWin open={state.Form.Mostrar} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>RELACIÓN MESA COBRANZA</h5>
                                            {/* <button type="button" className="delete" onClick={fnCancelar}></button> */}
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                optMesa={state.optMesa}
                                                optTabMora={state.optTabMora}
                                                optPersonas={state.optPersonas}
                                                Id={state.Form.Id}
                                                identificador={state.Identificador}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin open={state.MostrarListado} xlarge center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>SOCIAS SIN ASIGNAR</h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {
                                                <CFormValidaAsignacion
                                                oidc={props.oidc}
                                                Id={state.Form.Id}
                                                ProductoID={ProductoID}
                                                />
                                            }
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
export default connect(mapStateToProps, mapDispatchToProps)(RelacionMesaCobranza);
