import React from 'react'

// Interfaces de base de datos
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'

// Componentes generales
import { Acordion, Tabs, ImgViewer, ModalWin } from '../../../../../global'

// Iconos
import { FaFile, FaUser, FaHouseUser, FaUserFriends, FaUsers, FaCheckCircle, FaPlusCircle, FaPencilAlt } from 'react-icons/fa'
import { FcBusiness, FcHome } from 'react-icons/fc'

// Formateo de fechas
import moment from 'moment'
import { FormateoDinero } from '../../../../../../global/variables'
import { MdClose } from 'react-icons/md'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import VerDoc from '../DocsProspecto/VerDoc'
import DocsAval from '../DocsAval'
import ReferenciasAval from '../ReferenciasAval/ReferenciasAval'
import AvalInfo from '../AvalInfo'
import { ValidacionProspecto } from './ValidacionProspecto'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import * as FuncionesRef from '../ReferenciasAval/Funciones'
import * as Funciones from '../MatrizProcesosDetalle/Funciones'
import VerBuro from './VerBuro'
import { iUI } from '../../../../../../interfaces/ui/iUI'
// Datos necesarios para el perfil
type PerfilProspectoTipo = {
    oidc: IOidc,
    ui: iUI,
    // Detalle para mostrar los detalles del perfil
    DatosGenerales: DBConfia_Prospeccion.IProspectosDatosGenereles_VW
    DatosSocioeconomicos: DBConfia_Prospeccion.IProspectosDatosSocioeconomicos_VW
    Vehiculos: DBConfia_Prospeccion.IRelacionAutoMoto[]
    Experiencia: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[]
    Referencias: DBConfia_Prospeccion.IReferencias[]
    Documentos: DBConfia_Prospeccion.IProspectosDocumentos_VW[]
    Avales: DBConfia_Prospeccion.IAvales_VW[]
    Procesos: []
    Id: number
    Editar: boolean
    Validado: boolean
    showDocumentos(): any
    showReferencias(): any
    showAvales(aval: number): any
    showDatosEconomicos(): any
    showDatos(): any
}

type EstadoTipo = {
    Referencias: DBConfia_Prospeccion.IReferencias[]
    Documento: {
        documentoID: number,
        documentoNombre: string
    },
    Datos: {
        AvalNombreCompleto: string,
        AvalID: number,
        VerDocs: boolean,
        Info?: DBConfia_Prospeccion.IAvales_VW
    },
    Form:
    {
        Mostrar: boolean,
        VerDoc: boolean,
        VerInfo: boolean
    }
    ValidarProspecto: boolean,
    VerBuro: boolean,
    Validado: boolean,
    DatoMuestraBC: any,
}
export const PerfilProspecto = (props: PerfilProspectoTipo) => {

    let isMounted = React.useRef(true)
    const [state, setState] = React.useState<EstadoTipo>({
        Referencias: [],
        Documento: {
            documentoID: 0,
            documentoNombre: ''
        },
        Datos: {
            AvalNombreCompleto: '',
            AvalID: 0,
            VerDocs: false,
            Info: undefined
        },
        Form:
        {
            Mostrar: false,
            VerDoc: false,
            VerInfo: false
        },
        ValidarProspecto: false,
        VerBuro: false,
        Validado: props.Validado,
        DatoMuestraBC: {},
    })

    React.useEffect(() => {
        GetReferencias()
        FNGetMuestraBC()
    }, [])

    const GetReferencias = () => {
        setState({ ...state, Referencias: props.Referencias })
    }

    const ConsultaReferencias = () => {
        FuncionesRef.FNGetReferenciasByAvalID(props.oidc, props.Id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState({ ...state, Referencias: respuesta, Form: { ...state.Form, Mostrar: false } })
                }
            })
            .catch((error) => {
                toast.error(`Error al obtener Referancias ${error}`)
                if (isMounted.current === true) {
                    setState({ ...state, Referencias: [], Form: { ...state.Form, Mostrar: false } })
                }
            })
    }
    const permisoDeshabilitarValidar = props.ui.PermisosProductos?.find(p => p.PermisoID == 2640)


    const FNGetMuestraBC = () => {
        Funciones.FNGetMuestraBC(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, DatoMuestraBC: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    if (error.response)
                        toast.error(`Response Error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)
                    setState(s => ({ ...s, DatoMuestraBC: {} }))
                }
            })
    }

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false, VerInfo: false } })

    const fnVerDoc = (id: number, nombre: string) => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: true }, Documento: { ...state.Documento, documentoID: id, documentoNombre: nombre } })

    const fnVerDocAval = (id: number, nombre: string) => setState({ ...state, Form: { ...state.Form, Mostrar: true, VerDoc: false }, Documento: { ...state.Documento }, Datos: { ...state.Datos, AvalID: id, AvalNombreCompleto: nombre, VerDocs: true } })

    const fnVerRefAval = (id: number, nombre: string) => setState({ ...state, Form: { ...state.Form, Mostrar: true, VerDoc: false }, Documento: { ...state.Documento }, Datos: { ...state.Datos, AvalID: id, AvalNombreCompleto: nombre, VerDocs: false } })

    const fnVerInfAval = (id: number, nombre: string, info: DBConfia_Prospeccion.IAvales_VW) => {
        if (info != undefined)
            setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false, VerInfo: true }, Documento: { ...state.Documento }, Datos: { ...state.Datos, AvalID: id, AvalNombreCompleto: nombre, Info: info } })
    }

    const cbValidar = (item: any) => {
        console.log('item: ', item)
        if (item.res == 1) {
            toast.success(item.msj)
            setState({ ...state, Form: { ...state.Form }, Documento: { ...state.Documento }, Datos: { ...state.Datos }, ValidarProspecto: false, Validado: true })
        } else {
            toast.warning(item.msj)
        }
    }

    const fnValidar = (id: number, nombre: string) => setState({ ...state, Form: { ...state.Form }, Documento: { ...state.Documento }, Datos: { ...state.Datos }, ValidarProspecto: true })

    const fnVerBuro = () => setState({ ...state, Form: { ...state.Form }, Documento: { ...state.Documento }, Datos: { ...state.Datos }, VerBuro: true })

    const fnCancelAval = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false, VerInfo: false }, Documento: { ...state.Documento }, Datos: { ...state.Datos } })

    const fnCancelInfo = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false, VerInfo: false }, Documento: { ...state.Documento }, Datos: { ...state.Datos } })

    const fnCancelVali = () => setState({ ...state, Form: { ...state.Form }, Documento: { ...state.Documento }, Datos: { ...state.Datos }, ValidarProspecto: false })

    const fnCancelVerBuro = () => setState({ ...state, Form: { ...state.Form }, Documento: { ...state.Documento }, Datos: { ...state.Datos }, VerBuro: false })

    return (
        <div className="">
            <div className=''>
                <div className="text-end" >
                    {state.Validado && <button className="btn btn-success" style={{ textAlign: 'center' }} type="button" onClick={() => { }}><span><FaCheckCircle size={18} /> PROSPECTO VALIDADO Y EN MESA DE CRÉDITO</span></button>}
                    {!state.Validado && permisoDeshabilitarValidar && <button className="btn btn-primary" style={{ textAlign: 'center' }} type="button" onClick={() => fnValidar(props.Id, props.DatosGenerales.NombreCompleto)}>VALIDAR PROSPECTO</button>}
                </div>
                <div className="text-start">
                    <p className={'mt-2 mb-0 fw-bold'}>PROSPECTO: {props.DatosGenerales.NombreCompleto}</p>
                </div>
            </div>
            <br />
            <div className='row'>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <Acordion TabSelecionado="General">
                        <>
                            {!props.Procesos.find((x: any) => x.Descripcion === 'VERIFICA TITULAR' && x.Validado) &&
                                <div style={{ position: 'absolute', right: '0px', top: '-10px', zIndex: 10, cursor: 'pointer' }} title={'Agregar Datos Generales'} onClick={props.showDatos}>
                                    <FaPlusCircle size={25} color='#3e7cba' />
                                </div>
                            }
                            <Acordion.Tab Identificador="General" Titulo={<React.Fragment><FaUser />&nbsp;DATOS GENERALES</React.Fragment>}>
                                <>
                                    <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha Nacimiento:</td>
                                                    <td>{moment(props.DatosGenerales.FechaNacimiento).format('DD-MM-YYYY')}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sexo:</td>
                                                    <td>{props.DatosGenerales.Sexo}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CURP: </td>
                                                    <td>{props.DatosGenerales.CURP}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EDO. CIVIL: </td>
                                                    <td>{props.DatosGenerales.EstadoCivil}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                    <td>{props.DatosGenerales.TelefonoMovil}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E-Mail:</td>
                                                    <td>{props.DatosGenerales.CorreoElectronico}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lugar Nacimiento:</td>
                                                    <td>{props.DatosGenerales.LugarNacimiento}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                    <td>{props.DatosGenerales.DireccionProspecto}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Telefono Fijo:</td>
                                                    <td>{props.DatosGenerales.TelefonoDomicilio}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <hr />
                                    <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <caption style={{ captionSide: 'top' }}><strong>DATOS LABORALES</strong></caption>
                                            {!props.DatosGenerales.TieneEmpleo && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene Empleo</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>}
                                            {Boolean(props.DatosGenerales.TieneEmpleo) && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                    <td>{props.DatosGenerales.Empresa}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                    <td>{props.DatosGenerales.Ocupacion}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                    <td>{FormateoDinero.format(props.DatosGenerales.Sueldo ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antigüedad:</td>
                                                    <td>{props.DatosGenerales.Antiguedad}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                    <td>{props.DatosGenerales.DireccionEmpresaProspecto}</td>
                                                </tr>
                                            </tbody>}
                                        </table>
                                    </div>
                                    <hr />
                                    <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <caption style={{ captionSide: 'top' }}><strong>DATOS CONYUGE</strong></caption>
                                            {!props.DatosGenerales.TieneConyuge && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene conyuge</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>}
                                            {Boolean(props.DatosGenerales.TieneConyuge) && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre:</td>
                                                    <td>{props.DatosGenerales.NombreConyuge}</td>
                                                </tr>
                                            </tbody>}
                                        </table>
                                    </div>
                                    {Boolean(props.DatosGenerales.TieneConyuge && props.DatosGenerales.TieneEmpleoConyuge) && <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <caption style={{ captionSide: 'top' }}><strong>DATOS LABORALES CONYUGE</strong></caption>
                                            {<tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                    <td>{props.DatosGenerales.EmpresaConyuge}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                    <td>{props.DatosGenerales.OcupacionConyuge}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                    <td>{FormateoDinero.format(props.DatosGenerales.SueldoConyuge ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antigüedad:</td>
                                                    <td>{props.DatosGenerales.AntiguedadConyuge}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                    <td>{props.DatosGenerales.DireccionEmpresaConyuge}</td>
                                                </tr>
                                            </tbody>}
                                        </table>
                                    </div>}
                                </>
                            </Acordion.Tab>
                        </>
                    </Acordion>


                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <Acordion TabSelecionado="Economicos">
                        <>
                            {!props.Procesos.find((x: any) => x.Descripcion === 'VERIFICA TITULAR' && x.Validado) &&
                                <div style={{ position: 'absolute', right: '0px', top: '-10px', zIndex: 10, cursor: 'pointer' }} title={'Agregar Datos Socioeconómicos'} onClick={props.showDatosEconomicos}>
                                    <FaPlusCircle size={25} color='#3e7cba' />
                                </div>
                            }
                            <Acordion.Tab Identificador="Economicos" Titulo={<React.Fragment><FaHouseUser />&nbsp;DATOS SOCIOECONOMICOS</React.Fragment>}>
                                <>
                                    <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            {!props.DatosSocioeconomicos.TipoVivienda && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Capturada</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>}
                                            {props.DatosSocioeconomicos.TipoVivienda && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>TIPO SOCIA:</td>
                                                    <td>{props.DatosSocioeconomicos.DistribuidorTipos}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>RFC:</td>
                                                    <td>{props.DatosSocioeconomicos.RFC}</td>
                                                </tr>
                                            </tbody>}
                                        </table>
                                    </div>
                                    {props.DatosSocioeconomicos.TipoVivienda && <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <caption style={{ captionSide: 'top' }}><strong>DATOS VIVIENDA</strong></caption>
                                            {!props.DatosSocioeconomicos.TipoVivienda && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Capturada</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>}
                                            {props.DatosSocioeconomicos.TipoVivienda && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tipo de Vivienda:</td>
                                                    <td>{props.DatosSocioeconomicos.TipoVivienda}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Personas que la habitan:</td>
                                                    <td>{props.DatosSocioeconomicos.numeroPersonasHabitan}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Valor (aprox):</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.valorAproximado ?? 0)}</td>
                                                </tr>
                                            </tbody>}
                                        </table>
                                    </div>}
                                    {props.DatosSocioeconomicos.TipoVivienda && <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <caption style={{ captionSide: 'top' }}><strong>DATOS OTRA VIVIENDA</strong></caption>
                                            {!props.DatosSocioeconomicos.TieneOtraVivienda && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Tiene Otra Vivienda</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>}
                                            {Boolean(props.DatosSocioeconomicos.TieneOtraVivienda) && <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tipo de Vivienda:</td>
                                                    <td>{props.DatosSocioeconomicos.TipoViviendaOtra}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Valor (aprox.)</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.valorAproximadoOtra ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                    <td>{props.DatosSocioeconomicos.DireccionOtraVivienda}</td>
                                                </tr>
                                            </tbody>}
                                        </table>
                                    </div>}
                                    <hr />
                                    {props.DatosSocioeconomicos.TipoVivienda && <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <caption style={{ captionSide: 'top' }}><strong>INGRESOS</strong></caption>
                                            <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.ingresoSueldo ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ganancias como DV:</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.gananciasDV ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ingreso del Conyuge:</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.ingresoConyuge ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Otro Ingreso:</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.otrosIngresos ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong>Total de Ingreso:</strong></td>
                                                    <td><strong>{FormateoDinero.format(props.DatosSocioeconomicos.ingresoTotal ?? 0)}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <caption style={{ captionSide: 'top' }}><strong>EGRESOS</strong></caption>
                                            <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Alimentación:</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.AlimetacionEgreso ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tarjetas:</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.TarjetasEgreso ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Vivienda (pago o renta):</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.RentaPagoViviendaEgreso ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Servicios Domesticos:</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.ServiciosDomesticosEgreso ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Otros Egresos:</td>
                                                    <td>{FormateoDinero.format(props.DatosSocioeconomicos.OtroEgreso ?? 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dependientes Economicos:</td>
                                                    <td>{props.DatosSocioeconomicos.DependientesEconomicos}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong>Total de Egresos:</strong></td>
                                                    <td><strong>{FormateoDinero.format(props.DatosSocioeconomicos.EgresoTotal ?? 0)}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <hr />
                                        {props.Vehiculos.length <= 0 && <span>Sin Vehículos</span>}
                                        {props.Vehiculos.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                            <table className='table'>
                                                <caption style={{ captionSide: 'top' }}>VEHÍCULOS</caption>
                                                <thead>
                                                    <tr>
                                                        <th style={{ backgroundColor: 'darkgray', color: 'white' }}>MARCA</th>
                                                        <th style={{ backgroundColor: 'darkgray', color: 'white' }}>MODELO</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.Vehiculos.map((c: any, cId: number) =>
                                                        <tr key={'crd_' + cId}>
                                                            <td>{c.Marca}</td>
                                                            <td>{c.Modelo}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>}
                                        <hr />
                                        {props.Experiencia.length <= 0 && <span>Sin Experiencia</span>}
                                        {props.Experiencia.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                            <table className='table' >
                                                <caption style={{ captionSide: 'top' }}>EXPERIENCIA EN VENTAS</caption>
                                                <thead>
                                                    <tr>
                                                        <th style={{ backgroundColor: 'darkgray', color: 'white', verticalAlign: 'bottom' }}>EMPRESA</th>
                                                        <th style={{ backgroundColor: 'darkgray', color: 'white', verticalAlign: 'bottom' }}>INGRESO</th>
                                                        <th style={{ backgroundColor: 'darkgray', color: 'white' }}>LIMITE DE CRÉDITO</th>
                                                        <th style={{ backgroundColor: 'darkgray', color: 'white' }}>CRÉDITO DISPONIBLE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.Experiencia.map((c: any, cId: number) =>
                                                        <tr key={'crd_' + cId}>
                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.Descripcion}</td>
                                                            <td>{moment(c.FechaIngreso).format('DD/MM/YYYY')}</td>
                                                            <td>{FormateoDinero.format(c.LimiteCredito)}</td>
                                                            <td>{FormateoDinero.format(c.CreditoDisponible)}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>}
                                    </div>}
                                </>
                            </Acordion.Tab>
                        </>
                    </Acordion>


                </div>



            </div>

            <div className='row'>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <Acordion TabSelecionado="Documentos">
                        <>
                            {!props.Procesos.find((x: any) => x.Descripcion === 'REVISION DE DOCUMENTOS' && x.Validado) &&
                                <div style={{ position: 'absolute', right: '0px', top: '-10px', zIndex: 10, cursor: 'pointer' }} title={'Agregar Documentos'} onClick={props.showDocumentos}>
                                    {<FaPlusCircle size={25} color='#3e7cba' />}
                                </div>
                            }
                            <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaFile />&nbsp;DOCUMENTOS</React.Fragment>}>
                                <>
                                    {props.Documentos.length <= 0 && <span>Sin Documentos</span>}
                                    {props.Documentos.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '80%', color: 'white' }}></th>
                                                    <th style={{ width: '20%', color: 'white' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.Documentos.map((c: any, cId: number) =>
                                                    <tr key={'crd_' + cId}>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.NombreDocumento}</td>
                                                        <td><button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerDoc(c.DocumentoID, c.NombreDocumento)}>VER</button></td>
                                                    </tr>
                                                )}
                                                {state.DatoMuestraBC.MostrarBuroPromotor && <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>BURO DE CRÉDITO</td>
                                                    <td><button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerBuro()}>VER</button></td>
                                                </tr>}
                                            </tbody>
                                        </table>
                                    </div>}
                                </>
                            </Acordion.Tab>
                        </>
                    </Acordion>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <Acordion TabSelecionado="Referencias">
                        <>
                            {!props.Procesos.find((x: any) => x.Descripcion === 'REVISION REFERENCIAS TITULAR' && x.Validado) &&
                                <div style={{ position: 'absolute', right: '0px', top: '-10px', zIndex: 10, cursor: 'pointer' }} title={'Agregar Referencias'} onClick={() => {
                                    if (state.Referencias.length <= 0)
                                        props.showReferencias()
                                    else
                                        fnVerRefAval(props.Id, props.DatosGenerales.NombreCompleto)
                                }}>
                                    <FaPlusCircle size={25} color='#3e7cba' />
                                </div>
                            }
                            <Acordion.Tab Identificador="Referencias" Titulo={<React.Fragment><FaUserFriends />&nbsp;REFERENCIAS</React.Fragment>}>
                                <>
                                    {state.Referencias.length <= 0 && <span>Sin Referencias</span>}
                                    {state.Referencias.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                        <table className='table' >
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '40%', backgroundColor: 'darkgray', color: 'white' }}>NOMBRE</th>
                                                    <th style={{ width: '13%', backgroundColor: 'darkgray', color: 'white' }}>EDAD</th>
                                                    <th style={{ width: '23%', backgroundColor: 'darkgray', color: 'white' }}>CELULAR</th>
                                                    <th style={{ width: '23%', backgroundColor: 'darkgray', color: 'white' }}>PARENTESCO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {state.Referencias.map((c: any, cId: number) =>
                                                    <tr key={'crd_' + cId}>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{`${c.nombre} ${c.primerApellido}`}</td>
                                                        <td>{c.edad}</td>
                                                        <td>{c.celular}</td>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.parentesco}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>}
                                </>
                            </Acordion.Tab>
                        </>
                    </Acordion>
                </div>
            </div>

            <div className='row'>
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <Acordion TabSelecionado="Avales">
                        <>
                            {!props.Procesos.find((x: any) => x.Descripcion === 'VERIFICA AVAL' && x.Validado) &&
                                <div style={{ position: 'absolute', right: '0px', top: '-10px', zIndex: 10, cursor: 'pointer' }} title={'Agregar Avales'} onClick={() => props.showAvales(0)}>
                                    {/*!props.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION AVALES' && x.Validado || x.Descripcion === 'REFERENCIAS AVALES' && x.Validado) && */<FaPlusCircle size={25} color='#3e7cba' />}
                                </div>
                            }
                            <Acordion.Tab Identificador="Avales" Titulo={<React.Fragment><FaUsers />&nbsp;AVALES</React.Fragment>}>
                                <>
                                    {props.Avales.length <= 0 && <span>Sin Avales</span>}
                                    {props.Avales.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th style={{ backgroundColor: 'darkgray', color: 'white' }}>ID</th>
                                                    <th style={{ width: '40%', backgroundColor: 'darkgray', color: 'white' }}>NOMBRE AVAL</th>
                                                    <th style={{ width: '20%', backgroundColor: 'darkgray', color: 'white' }}>INFORMACIÓN</th>
                                                    <th style={{ width: '20%', backgroundColor: 'darkgray', color: 'white' }}>REFERENCIAS</th>
                                                    <th style={{ width: '20%', backgroundColor: 'darkgray', color: 'white' }}>DOCUMENTOS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.Avales.map((c: any, cId: number) =>
                                                    <tr key={'crd_' + cId}>
                                                        <td>{c.AvalID}</td>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.NombreCompleto}</td>
                                                        <td>
                                                            <button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerInfAval(c.AvalID, c.NombreCompleto, c)}>VER</button>
                                                            |
                                                            <button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => props.showAvales(c.AvalID)}>EDITAR</button>
                                                        </td>
                                                        <td><button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerRefAval(c.AvalID, c.NombreCompleto)}>VER REFERENCIAS</button></td>
                                                        <td><button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerDocAval(c.AvalID, c.NombreCompleto)}>VER DOCUMENTOS</button></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>}
                                </>
                            </Acordion.Tab>
                        </>
                    </Acordion>
                </div>
            </div>

            {state.Form.VerDoc && <ModalWin open={state.Form.VerDoc} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>{state.Documento.documentoNombre}</h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelar()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <VerDoc DocumentoID={state.Documento.documentoID} fnCancelar={fnCancelar} />
                </ModalWin.Body>
            </ModalWin>}

            {state.Form.Mostrar && <ModalWin open={state.Form.Mostrar} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>{(state.Datos.VerDocs ? 'Documentos' : 'Referencias')}: {state.Datos.AvalNombreCompleto} </h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelAval()
                        ConsultaReferencias()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {state.Datos.VerDocs && <DocsAval AvalID={state.Datos.AvalID} Editar={props.Procesos.find((x: any) => x.Descripcion === 'VERIFICA AVAL' && x.Validado) === undefined} />}
                    {!state.Datos.VerDocs && <ReferenciasAval AvalID={state.Datos.AvalID} Editar={props.Procesos.find((x: any) => x.Descripcion === 'REVISION REFERENCIAS AVAL' && x.Validado) === undefined} />}
                </ModalWin.Body>
            </ModalWin>}

            {state.Form.VerInfo && <ModalWin open={state.Form.VerInfo} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Información de Aval: {state.Datos.AvalNombreCompleto} </h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelInfo()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {state.Datos.Info != undefined && <AvalInfo DatosGenerales={state.Datos.Info} />}
                </ModalWin.Body>
            </ModalWin>}

            {state.ValidarProspecto && <ModalWin open={state.ValidarProspecto} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>VALIDAR Y ENVIAR A MESA DE CRÉDITO AL PROSPECTO : {props.DatosGenerales.NombreCompleto} </h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelVali()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <ValidacionProspecto oidc={props.oidc} Id={props.Id} Procesos={props.Procesos} cbValidar={cbValidar} />
                </ModalWin.Body>
            </ModalWin>}

            {state.VerBuro && <ModalWin open={state.VerBuro} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>BURO DE CRÉDITO: {props.DatosGenerales.NombreCompleto} </h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelVerBuro()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <VerBuro DocumentoID={props.Id} fnCancelar={fnCancelVerBuro} />
                </ModalWin.Body>
            </ModalWin>}
        </div>
    )
}
