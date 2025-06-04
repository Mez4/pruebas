import React from 'react'

// Tabla
import DataTable, { IDataTableColumn } from 'react-data-table-component'

// Formas
import { Form, Formik } from 'formik'

import * as Yup from 'yup'
// Componentes personalizados
import { Card, CustomFieldText2, ModalWin, Spinner } from '../../../../global'
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
import { FaLink, FaSearch, FaPencilAlt, FaUserPlus, FaCircle, FaBlackTie } from 'react-icons/fa'
import { FiUserPlus } from 'react-icons/fi'

// Sub-Componentes
import * as Funciones from './CompPersonas/Funciones'

// Notificaciones
import { toast } from 'react-toastify'

// Router
import { Link, useParams } from 'react-router-dom'
import { DBConfia_General } from '../../../../../interfaces_db/DBConfia/General'
import { DescripcionDistribuidor } from '../../../../../global/variables'
import { EditarEstatusSocia } from './CompPersona/EditarEstatusSocia'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import ReactTooltip from 'react-tooltip'
import { AgregarCliente } from '../../creditos/CompCreditos/CreditoCliente/AgregarCliente'
import { iUI } from '../../../../../interfaces/ui/iUI'



// Cache property
export enum TipoPersonas { Distribuidores, Clientes, Coordinadores, Empleados }
type PersonasType = {

    oidc: IOidc,
    ui: iUI,
    // Cache: any,
    TipoPersonas: TipoPersonas

    // Funcion para definir el cache
    // DefinirCache(Llave: string, Objecto: any): any
}
const Personas = (props: PersonasType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)

    const MySwal = withReactContent(Swal)

    let { productoId } = useParams<{ productoId: string }>();

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
        case TipoPersonas.Empleados:
            Titulo = "Empleados"
            CACHE__ESTADO = 'ADMIN.PERSONAS.EMPLEADOS'
            PrefijoUrl = "empleados"
            break
    }

    // Definimos el tipo del estado
    type EstadoType = {
        Filtro: string,
        Cargando: boolean,
        Error: boolean,
        Forma: boolean,
        Datos: DBConfia_General.IPersonas_VW[],
        DatosMostrar: DBConfia_General.IPersonas_VW[]

        // DATA-TABLE CACHE
        defaultSortField: string
        defaultSortAsc: boolean
        paginationDefaultPage: number
    }

    // Definimos el estado del control
    // const EstadoDefecto: EstadoType = props.Cache[CACHE__ESTADO] ? props.Cache[CACHE__ESTADO] :
    const EstadoDefecto: EstadoType =
    {
        Filtro: '',
        Cargando: false,
        Error: false,
        Forma: false,
        Datos: [],
        DatosMostrar: [],
        defaultSortAsc: true,
        defaultSortField: 'NombreCompleto',
        paginationDefaultPage: 1,
    }


    // Estado del componente
    const [Estado, DefinirEstado] = React.useState(EstadoDefecto)
    const [ModalEstatus, AbrirModalEstatus] = React.useState(false)
    const [ShowCliente, SetshowCliente] = React.useState(false)
    const [DatosDistribuidor, setDatosDistribuidor] = React.useState({
        DistribuidorID: 0,
        DistribuidoresEstatusID: ''
    })
    const ConvertirCoordi = (Item: any) => {
        MySwal.fire({
            title: '<strong>¿CANJE PLUS</strong>',
            icon: 'warning',
            html:
                <div className="text-center">
                    <br />
                    <span className='text-center'>¿Encender CanjePlus a:  {<strong> {Item.PersonaID} - {Item.NombreCompleto} </strong>}?</span>
                </div>,
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            focusCancel: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
            cancelButtonAriaLabel: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',

        }
        )
            .then((result) => {
                if (result.isConfirmed) {
                    let a = {
                  PersonaID: Item.PersonaID
                        
                    }
                                console.log('VALUEEES',a)
                    Funciones.CanjePlus(props.oidc, a)
                        .then((respuesta: any) => {
                            console.log("RESPUESTA", respuesta)
                            if (isMounted.current === true) {
                                toast.success("CanjePlus agregado correctamente")
                                /*     setState(s => ({ ...s, ContrasenaNueva: respuesta.Contrasena }))
                                    fnMostrarContra() */
                            }

                        },
                        )
                        .catch(() => {
                            
                                toast.error("Error al agregar CanjePlus")
                           

                        })
                } else {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center"><strong>Aviso</strong></h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Ok`,
                            confirmButtonAriaLabel: `Ok`,
                            confirmButtonColor: `#3085d6`,
                        }
                    );
                }
            })
    }

    const ActivarCoordi = (Item: any) => {
        MySwal.fire({
            title: '<strong>Activar Coordinador</strong>',
            icon: 'warning',
            html:
                <div className="text-center">
                    <br />
                    <span className='text-center'>¿Activar el Coordinador {<strong> {Item.PersonaID} - {Item.NombreCompleto} </strong>}?</span>
                </div>,
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            focusCancel: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
            cancelButtonAriaLabel: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',

        }
        )
            .then((result) => {
                if (result.isConfirmed) {
                    let a = {
                        CoordinadorID: Item.PersonaID,
                        SucursalID: Item.SucursalID,
                        GrupoID: Item.GrupoID
                    }

                    Funciones.FNUpdate(props.oidc, a)
                        .then((respuesta: any) => {
                            console.log("RESPUESTA", respuesta)
                            if (isMounted.current === true) {
                                toast.success("Se activo Coordinador exitosamente")
                                /*     setState(s => ({ ...s, ContrasenaNueva: respuesta.Contrasena }))
                                    fnMostrarContra() */
                            }

                        },
                        )
                        .catch(() => {
                            toast.error("El usuario no es Coordinador")
                        })
                } else {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center"><strong>Aviso</strong></h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Ok`,
                            confirmButtonAriaLabel: `Ok`,
                            confirmButtonColor: `#3085d6`,
                        }
                    );
                }
            })
    }

    const cbAgregarCliente = (item: any) => {
        console.log('item: ', item)
        if (item.res == 1) {
            toast.success(item.msj)
        }
        if (item.res == 2) {
            toast.warning(item.msj)
        }
        SetshowCliente(false)
    }

    const cbCancelarCliente = () => SetshowCliente(false)

    const permisoActivar = props.ui.PermisosProductos?.find(p => p.PermisoID > 3000)

    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Persona ID', selector: 'PersonaID',
                },
                {
                    name: 'Nombre', selector: 'NombreCompleto', grow: 1, minWidth: "200px", sortable: true, cell: (cprops) => (
                        <span>
                            <Link style={{ color: '#146acc' }} to={`/app/${productoId}/personas/${PrefijoUrl}/${cprops.PersonaID}`}><FaLink /> {cprops.NombreCompleto}</Link>
                        </span>
                    )
                },
                { name: 'CURP', selector: 'CURP', sortable: true },
                { name: 'Teléfono Mov', selector: 'TelefonoMovil', sortable: true },
                { name: 'RFC', selector: 'RFC', sortable: true },
                { name: 'Canje Plus', cell: (e) => (
                    <span>
                        {
                            <button onClick={() => ConvertirCoordi(e)} title={`Convertir a Coordinador`} className="ms-1 asstext text-dark"><FaBlackTie /></button>

                        }
                    </span>
                )
                    },
                props.TipoPersonas === TipoPersonas.Distribuidores ? {
                    name: 'Estatus', selector: 'DistribuidoresEstatus', sortable: true,
                    cell: (props) => <>{props.DistribuidoresEstatus}&nbsp;
                        {permisoActivar && <button data-tip data-for={`btnEditEstt_${props.PersonaID}`}
                            className="asstext" type={"button"} onClick={() => {
                                setDatosDistribuidor({ DistribuidorID: props.DistribuidorID, DistribuidoresEstatusID: props.DistribuidoresEstatusID })
                                AbrirModalEstatus(true)
                            }}>
                            <FaPencilAlt />
                        </button>}
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
                props.TipoPersonas == TipoPersonas.Empleados ?
                    {
                        name: 'Convertir a Coordinador', cell: (e) => (
                            <span>
                                {
                                    <button onClick={() => ConvertirCoordi(e)} title={`Convertir a Coordinador`} className="ms-1 asstext text-dark"><FaBlackTie /></button>

                                }
                            </span>
                        )
                    } : {},
                props.TipoPersonas == TipoPersonas.Empleados ?
                    {

                        name: 'Activar Coordinador', cell: (e) => (
                            <span>
                                {
                                    <button onClick={() => ActivarCoordi(e)} title={`Activar Coordinador`} className="ms-1 asstext text-dark"><FaCircle /></button>

                                }
                            </span>
                        )
                    }
                    : {},
                props.TipoPersonas !== TipoPersonas.Clientes ?
                    {
                        name: 'Usuario', cell: (e) => (
                            <span>
                                {e.CorreoElectronico &&
                                    <button onClick={(c) => alert(JSON.stringify(e))} className='btn btn-default px-1 py-1' title={'Generar usuario utilizando el correo'}>
                                        <FiUserPlus size={18} />
                                    </button>
                                }
                            </span>
                        )
                    }

                    : {},

            ]
        return colRet
    }, [PrefijoUrl, props.TipoPersonas])

    // React.useEffect(() => {
    //     FNConsultar({})
    // }, [])

    // Definimos la funcion para obtener las personas del servicio web
    const FNConsultar = async (values: any) => {
        if (!Object.values(values).some(v => v != '')) {
            toast.error('Favor de llenar al menos un campo', { autoClose: 2500 })
            return
        }

        // Cambiamos el estado
        DefinirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [], DatosMostrar: [] }))

        // Iniciamos la peticion contra el servicio web
        try {

            // Obtenemos las personas del servicio web
            let personas = await Funciones.FNGet(props.oidc, values, props.TipoPersonas)

            // Si el componente esta montado...
            if (isMounted.current === true) {
                DefinirEstado(e => ({ ...e, Cargando: false, Filtro: '', DatosMostrar: personas, Datos: personas, Error: false, Forma: false }))
                toast.success('Datos obtenidos', { autoClose: 2500 })
            }

            // Definimos nuestro cache
            // props.DefinirCache(CACHE__ESTADO, { ...Estado, Datos: personas, DatosMostrar: personas, Error: false, Forma: false })
        }
        catch (e) {
            if (isMounted.current === true) {
                DefinirEstado(e => ({ ...e, Cargando: false, Filtro: '', Error: true }))
                toast.error('Error al obtener los datos', { autoClose: 2500 })
            }
        }
    }

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
                                        {<span>{Titulo}</span>}
                                        <DataTable
                                            subHeader
                                            subHeaderComponent=
                                            {
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3">
                                                            <input type="text" className="form-control" placeholder="Buscar persona" value={Estado.Filtro}
                                                                onChange={e => {
                                                                    DefinirEstado(s => ({ ...s, Filtro: e.target.value, DatosMostrar: FiltrarDatos(s.Datos, Columns, e.target.value) }))
                                                                    // props.DefinirCache(CACHE__ESTADO, { ...Estado, Filtro: e.target.value })
                                                                }}
                                                            />
                                                            <span className="input-group-text"><FaSearch /> </span>
                                                            <button className="btn btn-outline-secondary" type="button" onClick={() => DefinirEstado(e => ({ ...e, Forma: !e.Forma }))}><BiCloudDownload size={22} /></button>
                                                            {Titulo === 'Clientes' && <button className="button is-primary is-outlined waves-effect waves-light" onClick={() => { SetshowCliente(true) }}>
                                                                <span className="is-hidden-mobile">Nuevo Cliente</span>&nbsp;<FaUserPlus />
                                                            </button>}
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
                                            onSort={(Column, Direction) => DefinirEstado(e => ({ ...e, defaultSortField: Column.selector as string, defaultSortAsc: Direction === "asc" }))}
                                            onChangePage={(page) => DefinirEstado(e => ({ ...e, paginationDefaultPage: page }))}

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
                                                <Formik
                                                    initialValues={{ DistribuidorID: '', Nombre: '', CURP: '', RFC: '', SexoID: '', EstadoCivilID: '', EscolaridadID: '', OcupacionID: '' }}
                                                    onSubmit={(values) => FNConsultar(values)}
                                                >
                                                    <Form>
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'ID VR'} name={'DistribuidorIDVR'} placeholder={'...'} />
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'ID'} name={'DistribuidorID'} placeholder={'...'} />
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'Nombre'} name={'Nombre'} placeholder={'...'} />
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'CURP'} name={'CURP'} placeholder={'XXXXXXXXXXXXXXXXXX'} />
                                                        <CustomFieldText2 disabled={Estado.Cargando} label={'RFC'} name={'RFC'} placeholder={'XXXXXXXXXXXX'} />
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
                                            <ModalWin.Body>
                                                <EditarEstatusSocia
                                                    oidc={props.oidc}
                                                    initialValues={DatosDistribuidor}
                                                    cbGuardar={cbGuardar}
                                                    fnCancelar={fnCancelar}
                                                />
                                            </ModalWin.Body>
                                        </ModalWin>
                                        {ShowCliente &&
                                            <AgregarCliente oidc={props.oidc} cbActualizar={() => { }} cbGuardar={cbAgregarCliente} fnCancelar={cbCancelarCliente} mostrar={ShowCliente} />
                                        }
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
    // Cache: Estado.Cache,
    ui: Estado.UI
})

// Funcion para acceder al cache
// const mapDispatchToProps = (dispatch: any) => ({
//     DefinirCache: (Llave: string, Objecto: any) => dispatch(RAcciones.DefinirCache({ Llave, Objecto }))
// })

// Regresar el control
export default connect(mapStateToProps)(Personas)