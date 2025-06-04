import React from 'react'

// Tabla
import DataTable, { IDataTableColumn } from 'react-data-table-component'

// Formas
import { Form, Formik } from 'formik'


// Componentes personalizados
import { Card, CustomFieldText2, ModalWin, Spinner, ActionSelect } from '../../../../global'
import { Escolaridad, EstadoCivil, Ocupaciones, Sexos } from '../../../../selectores'
import { FiltrarDatos } from '../../../../../global/functions'

// Estado
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as RAcciones from '../../../../../redux/cache/acciones'

// Iconos
import { BiCloudDownload, BiSearchAlt } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'
import { FaLink, FaSearch, FaFilter } from 'react-icons/fa'

// Sub-Componentes
import * as Funciones from './CompPersonas/Funciones'

// Notificaciones
import { toast } from 'react-toastify'

// Router
import { Link } from 'react-router-dom'
import { DBConfia_General } from '../../../../../interfaces_db/DBConfia/General'

import { DescripcionDistribuidor } from '../../../../../global/variables'

// import { EditarEstatusSocia } from './CompPersona/EditarEstatusSocia'

import ReactTooltip from 'react-tooltip';
import { DBConfia_Archivo } from '../../../../../interfaces_db/DBConfia/Archivo'

// Cache property
export enum TipoPersonas { Distribuidores, Clientes, Coordinadores }
type PersonasType = {
    oidc: IOidc,
    Cache: any,
    TipoPersonas: TipoPersonas

    // Funcion para definir el cache
    DefinirCache(Llave: string, Objecto: any): any
}
const Personas = (props: PersonasType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)
    const optProductos: any[] = []

    const [state, setState] = React.useState({
        optProductos,
    })

    // Control de variables de tipo de consulta
    let CACHE__ESTADO = ''
    let Titulo: string = ""
    let PrefijoUrl: string = ""

    // Validamos el tipo de consulta
    switch (props.TipoPersonas) {
        case TipoPersonas.Clientes:
            Titulo = "Clientes"
            CACHE__ESTADO = 'ADMIN.PERSONAS.CLIENTES'
            PrefijoUrl = "clientes"
            break
        case TipoPersonas.Distribuidores:
            Titulo = "Socias"
            CACHE__ESTADO = 'ADMIN.PERSONAS.DISTRIBUIDORES'
            PrefijoUrl = "distribuidores"
            break
        case TipoPersonas.Coordinadores:
            Titulo = "Coordinadores"
            CACHE__ESTADO = 'ADMIN.PERSONAS.COORDINADORES'
            PrefijoUrl = "coordinadores"
            break

    }

    // Definimos el tipo del estado
    type EstadoType = {
        Filtro: string,
        Cargando: boolean,
        Error: boolean,
        Forma: boolean,
        Datos: DBConfia_Archivo.IPersonas_Dcs_VW[],
        DatosMostrar: DBConfia_Archivo.IPersonas_Dcs_VW[]

        // DATA-TABLE CACHE
        defaultSortField: string
        defaultSortAsc: boolean
        paginationDefaultPage: number

    }

    // Definimos el estado del control
    const EstadoDefecto: EstadoType = props.Cache[CACHE__ESTADO] ? props.Cache[CACHE__ESTADO] :
        {
            Filtro: '',
            Cargando: false,
            Error: false,
            Forma: false,
            Datos: [],
            DatosMostrar: [],
            defaultSortAsc: true,
            defaultSortField: undefined,
            paginationDefaultPage: 1,
        }

    // Estado del componente
    const [Estado, DefinirEstado] = React.useState(EstadoDefecto)

    const [ModalEstatus, AbrirModalEstatus] = React.useState(false)

    const [DatosDistribuidor, setDatosDistribuidor] = React.useState({
        DistribuidorID: 0,
        DistribuidoresEstatusID: ''
    })

    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id', selector: 'PersonaID', sortable: true, width: '10%',
                    // cell: (cprops) =>
                    //     <Link style={{ color: '#0000EE' }} to={`/app/administracion/personas/${PrefijoUrl}/${cprops.PersonaID}`}><FaLink /> {cprops.NombreCompleto}</Link>
                },
                {
                    name: 'Nombre', selector: 'NombreCompleto', sortable: true,
                    // cell: (cprops) =>
                    //     <Link style={{ color: '#0000EE' }} to={`/app/administracion/personas/${PrefijoUrl}/${cprops.PersonaID}`}><FaLink /> {cprops.NombreCompleto}</Link>
                },
                // { name: 'NombreEstatus', selector: 'NombreEstatus', sortable: true },
                {
                    name: 'NombreEstatus',
                    selector: 'NombreEstatus',
                    sortable: true,
                    cell: (props) =>
                        <div>
                            <label style={{ color: props.Color, marginBottom: '0px' }}>
                                {props.NombreEstatus}
                            </label>
                        </div>
                },
                { name: 'Clave', selector: 'Clave', sortable: true },
                // { name: 'Color', selector: 'Color', sortable: true },
                { name: 'FechaHoraRegistro', selector: 'FechaHoraRegistro', sortable: true },

                props.TipoPersonas == TipoPersonas.Distribuidores ? {
                    name: 'NombreCompleto', selector: 'NombreCompleto', sortable: true,
                    cell: (props) => <>{props.DistribuidoresEstatus}&nbsp;<button data-tip data-for={`btnEditEstt_${props.PersonaID}`}
                        className="asstext" type={"button"} onClick={() => {
                            setDatosDistribuidor({ DistribuidorID: props.DistribuidorID, DistribuidoresEstatusID: props.DistribuidoresEstatusID })
                            AbrirModalEstatus(true)
                        }}>
                        {/* <FaPencilAlt /> */}
                    </button>
                        <ReactTooltip id={`btnEditEstt_${props.PersonaID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Cambiar Estatus
                        </ReactTooltip>

                    </>
                    // <span style={{ color: cprops.DistribuidoresEstatus == 'Activo' ? '#00FF00' : '#FF0000' }}>{cprops.DistribuidoresEstatus}</span>
                } : {},
            ]
        return colRet
    }, [PrefijoUrl])

    React.useEffect(() => {
        FNConsultar({})
    }, [])

    // Definimos la funcion para obtener las personas del servicio web
    const FNConsultar = async (values: any) => {
        // Cambiamos el estado
        DefinirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [], DatosMostrar: [] }))
        // Iniciamos la peticion contra el servicio web
        try {
            // Obtenemos las peronas del servicio web
            let personas = await Funciones.FNGet(props.oidc, values, props.TipoPersonas)
            console.log(personas, values)
            // Si el componente esta montado...
            if (isMounted.current === true) {
                DefinirEstado(e => ({ ...e, Cargando: false, Filtro: '', DatosMostrar: personas, Datos: personas, Error: false, Forma: false }))
                toast.success('Datos obtenidos', { autoClose: 2500 })
            }

            // Definimos nuestro cache
            props.DefinirCache(CACHE__ESTADO, { ...Estado, Datos: personas, DatosMostrar: personas, Error: false, Forma: false })
        }
        catch (e) {
            if (isMounted.current === true) {
                DefinirEstado(e => ({ ...e, Cargando: false, Filtro: '', Error: true }))
                toast.error('Error al obtener los datos', { autoClose: 2500 })
            }
        }
    }

    const FnGetTiposPersona = () => {
        setState(s => ({ ...s }))
        // FnProductos.FNGet(props.oidc)
        //     .then((respuesta: any) => {
        //         var productosActivos = respuesta.filter((d: any) => { return d.Canje })
        //         var productos = productosActivos.map((valor: any) => {
        //             var obj = { value: valor.ProductoID, label: valor.Producto };
        //             return obj
        //         });

        //         setState(s => ({ ...s, optProductos: productos }))
        //     })
        //     .catch(() => {
        //         setState(s => ({ ...s, optProductos: [] }))
        //     })
    }
    // const cbGuardar = (item: any) => {
    //     // let personas = Estado.Datos.map(Dato => Dato.PersonaID === item.PersonaID ? item : Dato)   
    //     // DefinirEstado(e => ({ ...e, DatosMostrar: personas, Datos: personas }))
    //     FNConsultar({})
    //     AbrirModalEstatus(false)
    //     setDatosDistribuidor({ DistribuidorID: 0, DistribuidoresEstatusID: '' })
    // }

    const fnCancelar = () => AbrirModalEstatus(false)

    // Rendereamos el componente
    return (
        <div>
            {/* <div className="page-title-box">
                <h4>Administración</h4>
                <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><Link to="/app/administracion" className="text-dark">Administración</Link></li>
                    <li className="breadcrumb-item">{Titulo}</li>
                </ol>
            </div> */}
            <div className="row">
                <div className="col-12">
                    <Card>
                        <Card.Body>
                            <Card.Body.Content>
                                {Estado.Cargando &&
                                    <div className="text-center">
                                        <Spinner />
                                        <br />
                                        <span>Cargando {Titulo}</span>
                                    </div>
                                }
                                {Estado.Error &&
                                    <div className="text-center">
                                        <p>Error al cargar los {Titulo}</p>
                                        <button className="btn btn-sm btn-confia text-white">Actualizar</button>
                                    </div>
                                }
                                {!Estado.Cargando && !Estado.Error &&
                                    <div>
                                        <DataTable
                                            subHeader
                                            // subHeaderComponent=
                                            // {
                                            //     <div className="row">
                                            //         <div className="col-sm-12">
                                            //             <div className="input-group mb-3">
                                            //                 <input type="text" className="form-control" placeholder="Buscar persona" value={Estado.Filtro}
                                            //                     onChange={e => {
                                            //                         DefinirEstado(s => ({ ...s, Filtro: e.target.value, DatosMostrar: FiltrarDatos(s.Datos, Columns, e.target.value) }))
                                            //                         props.DefinirCache(CACHE__ESTADO, { ...Estado, Filtro: e.target.value })
                                            //                     }}
                                            //                 />
                                            //                 <span className="input-group-text"><FaSearch /> </span>
                                            //                 <button className="btn btn-outline-secondary" type="button" onClick={() => DefinirEstado(e => ({ ...e, Forma: !e.Forma }))}><BiCloudDownload size={22} /></button>
                                            //             </div>
                                            //         </div>
                                            //     </div>
                                            // }
                                            subHeaderComponent=
                                            {

                                                <div className="row" style={{ width: '102%' }}>
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
                                                            <div></div>
                                                            <div>
                                                                {/* <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Asignación de Valeras a Sucursal', Mostrar: true, evento: 'ASIGNAR' }, btnAsignar: true })}>
                                                                    <FaStore size={20} /> ASIGNAR A SUCURSAL
                                                                </button>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Reasignación de Valeras a una nueva Sucursal', Mostrar: true, evento: 'REASIGNAR' }, btnReasignar: true })}>
                                                                    <FaRetweet size={20} /> REASIGNAR A SUCURSAL
                                                                </button>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Envío de Valeras a Sucursales', Mostrar: true, evento: 'ENVIAR' }, btnEnviar: true })}>
                                                                    <FaShippingFast size={20} /> ENVIAR A SUCURSAL
                                                                </button>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Confirmación de recepción de Valeras en Sucursales', Mostrar: true, evento: 'RECIBIR' }, btnRecibir: true })}>
                                                                    <FaTruckLoading size={20} /> RECIBIDO EN SUCURSAL
                                                                </button>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Confirmación de recepción de Valeras en Sucursales', Mostrar: true, evento: 'REENVIAR' }, btnReenviar: true })}>
                                                                    <FaShippingFast size={20} /> REENVIAR A SUCURSAL
                                                                </button>
                                                                {<button className="ms-2 btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                            <div>
                                                                <div style={{ float: 'left' }}><FaFilter /></div>
                                                                <div ><label> FILTROS</label></div>
                                                            </div>
                                                            <div style={{ width: '100%', textAlign: 'center' }}>
                                                                <div style={{ display: 'inline-block' }}>
                                                                    <Formik
                                                                        initialValues={{}}
                                                                        onSubmit={() => { }}
                                                                    >
                                                                        <Form>
                                                                            <div className="row" style={{ textAlign: 'initial' }}>
                                                                                <div style={{ height: '67px', width: '250px' }}>
                                                                                    <ActionSelect
                                                                                        disabled={false}
                                                                                        label="Tipo Persona"
                                                                                        name="ProductoIDF"
                                                                                        placeholder="NO SELECCIONADO"
                                                                                        options={optProductos}
                                                                                        addDefault={true}
                                                                                    // valor={state.FiltroProductos}
                                                                                    // accion={FnGetProductosFiltro} 
                                                                                    />
                                                                                </div>
                                                                                {/* <div style={{ height: '67px', width: '250px' }}> */}
                                                                                {/* {!state.showSerieFitro && <div>
                                                                                        <label className="form-label mb-0">Cargando Series ...</label>
                                                                                        <Spinner /> */}
                                                                                {/* </div>} */}
                                                                                {/* {state.showSerieFitro && <ActionSelect
                                                                                        disabled={state.optSeriesFiltro.length === 0}
                                                                                        label="Series"
                                                                                        name="serieIdF"
                                                                                        placeholder="NO SELECCIONADO"
                                                                                        options={state.optSeriesFiltro}
                                                                                        addDefault={true}
                                                                                        valor={state.FiltroSeries}
                                                                                        accion={FnGetSeriesFiltro} />} */}
                                                                                {/* </div> */}
                                                                                <div style={{ height: '67px', width: '250px' }}>
                                                                                    {/* {state.showRastreoFitro &&  */}
                                                                                    <div>
                                                                                        <ActionSelect
                                                                                            disabled={false}
                                                                                            label="Estatus"
                                                                                            name="TrackingIDF"
                                                                                            placeholder="NO SELECCIONADO"
                                                                                            options={optProductos}
                                                                                            addDefault={true}
                                                                                        // valor={state.Filtrotracking}
                                                                                        // accion={FnGetRastreoFiltro} 
                                                                                        />
                                                                                    </div>
                                                                                    {/* } */}
                                                                                </div>
                                                                                {/* <div style={{ height: '67px', width: '250px' }}> */}
                                                                                {/* {state.showRastreoFitro && <div>
                                                                                        <label className="form-label mb-0">Folio Inicial</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="Folio INICIAL"
                                                                                            value={state.FiltroFolioI}
                                                                                            onChange={e => FnGetFolioIFiltro(e.target.value)} />
                                                                                    </div>} */}
                                                                                {/* </div> */}
                                                                            </div>
                                                                            <div className="row" style={{ textAlign: 'initial' }}>
                                                                                {/* <div style={{ height: '57px', width: '250px' }}> */}
                                                                                {/* {state.showRastreoFitro && <div>
                                                                                        <ActionSelect
                                                                                            disabled={false}
                                                                                            label="Sucursales"
                                                                                            name="SucursalIDF"
                                                                                            placeholder="NO SELECCIONADO"
                                                                                            options={state.optSucursales}
                                                                                            addDefault={true}
                                                                                            valor={state.FiltroSucursales}
                                                                                            accion={FnGetSucursalFiltro} />
                                                                                    </div>} */}
                                                                                {/* </div> */}
                                                                                {/* <div style={{ height: '57px', width: '250px' }}> */}
                                                                                {/* {!state.showDistribuidorFitro && <div>
                                                                                        <label className="form-label mb-0">Cargando DVs ...</label>
                                                                                        <Spinner />
                                                                                    </div>}
                                                                                    {state.showDistribuidorFitro && <ActionSelect
                                                                                        disabled={state.optDistribuidoresFiltro.length === 0}
                                                                                        label="DVs"
                                                                                        name="DistribuidorIDF"
                                                                                        placeholder="NO SELECCIONADO"
                                                                                        options={state.optDistribuidoresFiltro}
                                                                                        addDefault={true}
                                                                                        valor={state.FiltroDistribuidoras}
                                                                                        accion={FnGetDistribuidoresFiltro} />}
                                                                                </div> */}
                                                                                {/* <div style={{ height: '67px', width: '250px' }}>
                                                                                    {state.showRastreoFitro && <div>
                                                                                        <label className="form-label mb-0">Código de Barras</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="NO CAPTURADO"
                                                                                            value={state.FiltroCodigo}
                                                                                            onChange={e => FnGetCodigoFiltro(e.target.value)} />
                                                                                    </div>} */}
                                                                                {/* </div> */}
                                                                                {/* <div style={{ height: '67px', width: '250px' }}> */}
                                                                                {/* {state.showRastreoFitro && <div>
                                                                                        <label className="form-label mb-0">Folio Final</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="Folio FINAL"
                                                                                            value={state.FiltroFolioF}
                                                                                            onChange={e => FnGetFolioFFiltro(e.target.value)} />
                                                                                    </div>} */}
                                                                                {/* </div> */}
                                                                                <div style={{ height: '67px', width: '150px' }}>
                                                                                    {<div>
                                                                                        <label className="form-label mb-0">Todas</label>
                                                                                        <br />
                                                                                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                style={{ marginTop: '0.7em' }}
                                                                                                className="form-check-input"
                                                                                            // checked={state.FiltroTodo}
                                                                                            // onChange={e => FnGetTodoFiltro(e.target.checked)} 
                                                                                            />
                                                                                        </div>
                                                                                    </div>}
                                                                                </div>
                                                                            </div>
                                                                        </Form>
                                                                    </Formik>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            data={Estado.DatosMostrar}
                                            striped
                                            pagination
                                            dense
                                            noHeader
                                            responsive
                                            keyField={"PersonaID"}
                                            columns={Columns}

                                            // Cache de configuracion
                                            onSort={(Column, Direction) => props.DefinirCache(CACHE__ESTADO, { ...Estado, defaultSortField: Column.selector, defaultSortAsc: Direction === "asc" })}
                                            onChangePage={(page) => { props.DefinirCache(CACHE__ESTADO, { ...Estado, paginationDefaultPage: page }) }}

                                            // Valores por defecto
                                            defaultSortField={Estado.defaultSortField}
                                            defaultSortAsc={Estado.defaultSortAsc}
                                            paginationDefaultPage={Estado.paginationDefaultPage}
                                            paginationPerPage={100}
                                        />
                                        <ModalWin open={Estado.Forma}>
                                            <ModalWin.Header>
                                                Consultar datos al servidor
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                <Formik initialValues={{ Nombre: '', CURP: '', RFC: '', SexoID: '', EstadoCivilID: '', EscolaridadID: '', OcupacionID: '' }} onSubmit={(values) => FNConsultar(values)}>
                                                    <Form>
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'Nombre'} datoType='text' name={'Nombre'} placeholder={'...'} />
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'CURP'} datoType='text' name={'CURP'} placeholder={'XXXXXXXXXXXXXXXXXX'} />
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'RFC'} datoType='text' name={'RFC'} placeholder={'XXXXXXXXXXXX'} />
                                                        <Sexos disabled={Estado.Cargando} />
                                                        <EstadoCivil disabled={Estado.Cargando} />
                                                        <Escolaridad disabled={Estado.Cargando} />
                                                        <Ocupaciones disabled={Estado.Cargando} />
                                                        <div className='text-end'>
                                                            <button type={'button'} onClick={() => DefinirEstado(e => ({ ...e, Forma: false }))} className='btn btn-danger text-white fw-bold text-end me-1'><IoMdClose size={20} /> Cancelar</button>
                                                            <button type={'submit'} className='btn btn-confia text-white fw-bold text-end'><BiSearchAlt size={20} /> Consultar</button>
                                                        </div>
                                                    </Form>
                                                </Formik>
                                            </ModalWin.Body>
                                        </ModalWin>
                                        <ModalWin open={ModalEstatus}>
                                            <ModalWin.Header>
                                                Cambiar estatus {DescripcionDistribuidor(1)}
                                            </ModalWin.Header>
                                            {/* <ModalWin.Body>
                                                <EditarEstatusSocia
                                                    oidc={props.oidc}
                                                    initialValues={DatosDistribuidor}
                                                    cbGuardar={cbGuardar}
                                                    fnCancelar={fnCancelar}
                                                />
                                            </ModalWin.Body> */}
                                        </ModalWin>
                                    </div>
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

Personas.TipoPersonas = TipoPersonas

// Obtenemos las propiedades del estado
const mapStateToProps = (Estado: IEstado) => ({
    oidc: Estado.oidc,
    Cache: Estado.Cache,
    ui: Estado.UI
})

// Funcion para acceder al cache
const mapDispatchToProps = (dispatch: any) => ({
    DefinirCache: (Llave: string, Objecto: any) => dispatch(RAcciones.DefinirCache({ Llave, Objecto }))
})

// Regresar el control
export default connect(mapStateToProps, mapDispatchToProps)(Personas)