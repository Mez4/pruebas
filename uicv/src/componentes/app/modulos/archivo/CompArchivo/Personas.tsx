import React from 'react'

// Tabla
import DataTable, { IDataTableColumn } from 'react-data-table-component'

// Formas
import { Form, Formik } from 'formik'

// Componentes personalizados
import { Card, CustomFieldText2, ModalWin, Spinner, CustomSelect, CustomSelect2 } from '../../../../global'
import { Escolaridad, EstadoCivil, Ocupaciones, Sexos, } from '../../../../selectores'
import { EstatusArchivo } from '../../../../selectores'
import { FiltrarDatos } from '../../../../../global/functions'

// Estado
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as RAcciones from '../../../../../redux/cache/acciones'

// Iconos
import { BiCloudDownload, BiSearchAlt, BiFilterAlt } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'
import { FaLink, FaSearch, FaFilter, FaEye } from 'react-icons/fa'

// Sub-Componentes
import * as Funciones from './CompPersonas/Funciones'
import { CForm } from './InfoPersona/CForm'

// Notificaciones
import { toast } from 'react-toastify'
import moment from 'moment'
// Router
import { Link } from 'react-router-dom'
import { DBConfia_General } from '../../../../../interfaces_db/DBConfia/General'

import { DescripcionDistribuidor } from '../../../../../global/variables'

// import { EditarEstatusSocia } from './CompPersona/EditarEstatusSocia'

import ReactTooltip from 'react-tooltip';
import { DBConfia_Archivo } from '../../../../../interfaces_db/DBConfia/Archivo'
import { EditarEstatusSocia } from '../../personas/CompAdministracion/CompPersona/EditarEstatusSocia'


// Cache property
export enum TipoPersonas { Distribuidores, Clientes, Coordinadores, Promotores, Analistas, DirectoresMesaCredito, GestoresCobranza, DirectoresMesaCobranza }
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

    // Control de variables de tipo de consulta
    let CACHE__ESTADO = ''
    let Titulo: string = ""
    let PrefijoUrl: string = ""
    // let options: { value: number, label: string }[]

    // Validamos el tipo de consulta
    switch (props.TipoPersonas) {
        case TipoPersonas.Clientes:
            Titulo = "Clientes"
            CACHE__ESTADO = 'ARCH.PERSONAS.CLIENTES'
            PrefijoUrl = "clientes"
            break
        case TipoPersonas.Distribuidores:
            Titulo = "Socias"
            CACHE__ESTADO = 'ARCH.PERSONAS.DISTRIBUIDORES'
            PrefijoUrl = "distribuidores"
            break
        case TipoPersonas.Coordinadores:
            Titulo = "Coordinadores"
            CACHE__ESTADO = 'ARCH.PERSONAS.COORDINADORES'
            PrefijoUrl = "coordinadores"
            break
        case TipoPersonas.Promotores:
            Titulo = "Promotores"
            CACHE__ESTADO = 'ARCH.PERSONAS.PROMOTORES'
            PrefijoUrl = "promotores"
            break
        case TipoPersonas.Analistas:
            Titulo = "Analistas"
            CACHE__ESTADO = 'ARCH.PERSONAS.ANALISTAS'
            PrefijoUrl = "analistas"
            break
        case TipoPersonas.DirectoresMesaCredito:
            Titulo = "DirectoresMesaCredito"
            CACHE__ESTADO = 'ARCH.PERSONAS.DIRECTORESMESACREDITO'
            PrefijoUrl = "directoresmesacredito"
            break
        case TipoPersonas.GestoresCobranza:
            Titulo = "GestoresCobranza"
            CACHE__ESTADO = 'ARCH.PERSONAS.GESTORESCOBRANZA'
            PrefijoUrl = "gestorescobranza"
            break
        case TipoPersonas.DirectoresMesaCobranza:
            Titulo = "DirectoresMesCobranza"
            CACHE__ESTADO = 'ARCH.PERSONAS.DIRECTORESMESACOBRANZA'
            PrefijoUrl = "directoresmesacobranza"
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
    // const DatosDefecto = { ProductoID: 0, DistribuidorID: 0, serieId: '', FolioInicial: 0, FolioFinal: 0, Estatus: 'A', RegistroFecha: new Date, RegistroUsuarioId: '', AsignaSucursalId: 0, AsignaSucursalUsuarioId: '', ReciboSucursalUsuarioId: '', AsignaDistribudiorUsuarioId: '', CanceladoUsuarioId: '', ValeraTrackingEstatusID: 0, EnvioSucursalNota: '', ReciboSucursalNota: '', doc: '', productoName: '', serieName: '', CodigoBarras: '0000' }
    const DatosDefecto = { NombreEstatus: '', Clave: '', Color: '', Descripcion: '' }
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

    const [state, setState] = React.useState({
        Distribuidor: undefined,
        // Datos,
        // DatosMostrar,
        // conditionalRowStyles,
        // optProductos,
        // optSeries,
        // optSucursales,
        // optRastreos,
        // optDistribuidores,
        tituloModal: 'Agregar Valera',
        statusCircle: 'red',
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            // evento: ''
        },

        ModalAux:
        {
            Mostrar: false,
            tituloModalM: 'Asignar Sucursales',
            evento: ''
        },
        // DatosAuxMostrar,
        btnAsignar: false,
        btnReasignar: false,
        btnEnviar: false,
        btnRecibir: false,
        btnReenviar: false,

        showSerieFitro: true,
        showDistribuidorFitro: true,
        showRastreoFitro: true,
        Filtrando: false,
        ShowVales: false,
        ValeraID: 0,
    })
    // Estado del componente
    const [Estado, DefinirEstado] = React.useState(EstadoDefecto)

    const [ModalEstatus, AbrirModalEstatus] = React.useState(false)

    const [DatosDistribuidor, setDatosDistribuidor] = React.useState({
        DistribuidorID: 0,
        DistribuidoresEstatusID: ''
    })


    // const DatosDist = async () => {

    //     // Actualizamos el estado (por si se acciona alguna función de actualización)
    //     setState(e => ({ ...e, Distribuidor: undefined,  Cargando: true, Error: false }))
    //     try {

    //         // Obtenemos el distribuidor de las funciones del componente
    //         var Distribuidor = await Funciones.FNObtenerPorId(props.oidc, props.TipoPersonas.)
    //         // console.log(Distribuidor, 'Distribuidor')          

    //         // Definimos el estado
    //         if (isMounted)
    //             definirEstado(e => ({ ...e, Distribuidor, /* AvalesDistribuidor, */ExperienciaDistribuidor, exp: ExperienciaDistribuidor,/*ValerasDistribuidor,valeras:ValerasDistribuidor*/ Cargando: false, Error: false }))
    //     }
    //     catch (ex) {

    //         // Definimos el estado
    //         if (isMounted)
    //             definirEstado(e => ({ ...e, Distribuidor: undefined, Cargando: false, Error: true }))

    //         // Logeamos el error
    //         console.log(`Error al obtener el distribuidor con ID: ${DistribuidorID}`, ex)
    //     }
    // }


    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            // let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id', selector: 'PersonaID', sortable: true, width: '10%',
                },
                {
                    name: 'Nombre', selector: 'NombreCompleto', sortable: true,
                },
                {
                    name: 'NombreEstatus',
                    selector: 'NombreEstatus',
                    sortable: true,
                    cell: (props) =>
                        <div>
                            <label style={{ color: props.Color, marginBottom: '0px' }}>
                                {props.NombreEstatus}
                            </label>
                            <label style={{ color: props.Color, marginBottom: '0px' }}>
                                {props.NombreEstatus == null ? 'SIN EXPEDIENTE FISICO' : ''}
                            </label>

                        </div>
                },
                { name: 'Fecha Registro', selector: 'FechaHoraRegistro', sortable: true, cell: (props) => <span>{moment(props.FechaHoraRegistro).format('DD/MM/YYYY')}</span> },
                {
                    name: 'Acciones',
                    sortable: false,
                    width: '23%',
                    style: { display: 'block;' },
                    cell: (props) =>
                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            {true && <><button data-tip data-for={`btnVer_${props.ValeraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                DefinirEstado(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        // Datos: Estado.DatosMostrar // getDatos(props),
                                        // Id: props.ValeraID,
                                        // evento: 'Ver Valera',
                                    },
                                    tituloModal: 'Ver Valera',
                                    // statusCircle: props.valeraTrackingEstatus.Color
                                }))
                            }}>
                                <FaEye />
                            </button>

                                <ReactTooltip id={`btnCV_${props.ValeraID}`} type="info" effect="solid">
                                    CANCELAR BLOQUE DE VALERA
                                </ReactTooltip>
                            </>
                            }
                        </div>
                },
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

    //get de personas by id




    const cbGuardar = (item: any) => {
        // let personas = Estado.Datos.map(Dato => Dato.PersonaID === item.PersonaID ? item : Dato)   
        // DefinirEstado(e => ({ ...e, DatosMostrar: personas, Datos: personas }))
        FNConsultar({})
        AbrirModalEstatus(false)
        setDatosDistribuidor({ DistribuidorID: 0, DistribuidoresEstatusID: '' })
    }

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
                                            subHeaderComponent=
                                            {
                                                // <div className="row">
                                                //     <div className="col-sm-12">
                                                //         <div className="input-group mb-3">
                                                //             <input type="text" className="form-control" placeholder="Buscar persona" value={Estado.Filtro}
                                                //                 onChange={e => {
                                                //                     DefinirEstado(s => ({ ...s, Filtro: e.target.value, DatosMostrar: FiltrarDatos(s.Datos, Columns, e.target.value) }))
                                                //                     props.DefinirCache(CACHE__ESTADO, { ...Estado, Filtro: e.target.value })
                                                //                 }}
                                                //             />
                                                //             <span className="input-group-text"><FaSearch /> </span>
                                                //             <button className="btn btn-outline-secondary" type="button" onClick={() => DefinirEstado(e => ({ ...e, Forma: !e.Forma }))}><FaFilter size={15} /></button>
                                                //         </div>
                                                //     </div>
                                                // </div>
                                                //    subHeaderComponent=
                                                //    {
                                                <div className="row" style={{ width: '102%' }}>
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
                                                            <div></div>
                                                            <div>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" >
                                                                    {/* onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Asignación de Valeras a Sucursal', Mostrar: true, evento: 'ASIGNAR' }, btnAsignar: true })}} */}
                                                                    {/* <FaStore size={20} />  */}
                                                                    ENVIADO A SUCURSAL
                                                                </button>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" >
                                                                    {/* onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Reasignación de Valeras a una nueva Sucursal', Mostrar: true, evento: 'REASIGNAR' }, btnReasignar: true }) */}
                                                                    {/* <FaRetweet size={20} /> */}
                                                                    REASIGNAR A SUCURSAL
                                                                </button>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" >
                                                                    {/* onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Envío de Valeras a Sucursales', Mostrar: true, evento: 'ENVIAR' }, btnEnviar: true })} */}
                                                                    {/* <FaShippingFast size={20} />  */}
                                                                    ENVIAR A SUCURSAL
                                                                </button>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" >
                                                                    {/* onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Confirmación de recepción de Valeras en Sucursales', Mostrar: true, evento: 'RECIBIR' }, btnRecibir: true }) */}
                                                                    {/* <FaTruckLoading size={20} />  */}
                                                                    RECIBIDO EN SUCURSAL
                                                                </button>
                                                                <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" >
                                                                    {/* onClick={() =>setState({ ...state, ModalAux: { tituloModalM: 'Confirmación de recepción de Valeras en Sucursales', Mostrar: true, evento: 'REENVIAR' }, btnReenviar: true })} */}
                                                                    {/* <FaShippingFast size={20} />  */}
                                                                    REENVIAR A SUCURSAL
                                                                </button>
                                                                {/* {<button className="ms-2 btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            // }

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
                                                <Formik initialValues={{ NombreCompleto: '', EstatusID: '' }} onSubmit={(values) => FNConsultar(values)}>
                                                    <Form>
                                                        <CustomFieldText2 disabled={Estado.Cargando} datoType='text' label={'NombreCompleto'} name={'NombreCompleto'} placeholder={'...'} />
                                                        {/* <CustomFieldText2 disabled={Estado.Cargando} label={'CURP'} name={'CURP'} placeholder={'XXXXXXXXXXXXXXXXXX'} />
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'RFC'} name={'RFC'} placeholder={'XXXXXXXXXXXX'} />
                                                        <Sexos disabled={Estado.Cargando} />
                                                        <EstadoCivil disabled={Estado.Cargando} />
                                                        <Escolaridad disabled={Estado.Cargando} />
                                                        <Ocupaciones disabled={Estado.Cargando} /> */}
                                                        <EstatusArchivo oidc={props.oidc} disabled={Estado.Cargando} name={'EstatusID'} />

                                                        <div className='text-end'>
                                                            <button type={'button'} onClick={() => DefinirEstado(e => ({ ...e, Forma: false }))} className='btn btn-danger text-white fw-bold text-end me-1'><IoMdClose size={20} /> Cancelar</button>
                                                            <button type={'submit'} className='btn btn-confia text-white fw-bold text-end'><BiSearchAlt size={20} /> Consultar</button>
                                                        </div>
                                                    </Form>
                                                </Formik>
                                            </ModalWin.Body>
                                        </ModalWin>
                                        <ModalWin.Body>
                                            {/* Add children property */}
                                            {null}
                                        </ModalWin.Body>
                                        <ModalWin open={state.Form.Mostrar} large>
                                            <ModalWin.Header>
                                                <h5 >{state.tituloModal}</h5>
                                                <div>
                                                    <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: state.statusCircle }}></div>
                                                </div>
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                {<CForm
                                                    oidc={props.oidc}
                                                    initialValues={state.Form.Datos}
                                                    Id={state.Form.Id}
                                                // optProductos={state.optProductos}
                                                // optSeries={state.optSeries}
                                                // optSucursales={state.optSucursales}
                                                // optDistribuidores={state.optDistribuidores}
                                                // evento={state.Form.evento}
                                                // fnGetDistribuidores={fnGetDistribuidores}
                                                // cbActualizar={cbActualizar}
                                                // cbGuardar={cbAgregar}
                                                // fnCancelar={fnCancelar}
                                                />}
                                            </ModalWin.Body>
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