import React from 'react'

// Interfaces de base de datos
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'

// Componentes generales
import { Acordion, ModalWin, Spinner, ActionSelect } from '../../../../../global'

// Iconos
import { FaUser, FaHouseUser, FaCheckCircle, FaClock, FaClipboardCheck, FaTimesCircle, FaDotCircle, FaBan } from 'react-icons/fa'

// Formateo de fechas
import moment from 'moment'
import { FormateoDinero } from '../../../../../../global/variables'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import * as FuncionesProspecto from '../Prospectos/Funciones'
import * as Funciones from './FuncionesDictamen'
import * as FuncionesP from './/Funciones'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import DataTable, { IDataTableColumn } from 'react-data-table-component'

// Datos necesarios para el perfil
type PerfilProspectoTipo = {
    oidc: IOidc,
    Id?: number
    nombreProspecto: string
    mostrar: boolean
    cbActualizar(item: any): any,
    fnCancelar(): any,
    DictamenInfo: {
        Dictaminado: number,
        DistribuidorNivelID: number,
        DistribuidorNivel: string,
        Monto: number,
        DistribuidoresEstatusID: number,
        DistribuidoresEstatus: string,
        PersonaAnalistaID: number,
        DistribuidorTiposID: number,
        DistribuidorTipos: string,
        Activo: boolean,
    }
}

type EstadoTipo = {
    CargandoProcesos: boolean,
    ErrorProcesos: boolean,
    CargandoPerfil: boolean,
    ErrorPerfil: boolean,
    Procesos: [],
    Pendientes: [],
    DatosGenerales?: DBConfia_Prospeccion.IProspectosDatosGenereles_VW,
    DatosSocioeconomicos?: DBConfia_Prospeccion.IProspectosDatosSocioeconomicos_VW,
    Vehiculos: DBConfia_Prospeccion.IRelacionAutoMoto[],
    Experiencia: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[],
    Nota: string,
    optNotas: any[],
    MostrarCancelar: boolean,
}
export const DictamenProspecto = (props: PerfilProspectoTipo) => {
    const [state, setState] = React.useState<EstadoTipo>({
        CargandoProcesos: true,
        ErrorProcesos: false,
        CargandoPerfil: true,
        ErrorPerfil: false,
        Procesos: [],
        Pendientes: [],
        DatosGenerales: undefined,
        DatosSocioeconomicos: undefined,
        Vehiculos: [],
        Experiencia: [],
        Nota: '',
        optNotas: [],
        MostrarCancelar: false,
    })
    let isMounted = React.useRef(true)

    const optMontos: any[] = []
    const Niveles: any[] = []
    const Nivel: any[] = []
    const [placeHolderNivel, setPlaceHolderNivel] = React.useState("Seleccione un Nivel")
    const [placeHolderMonto, setPlaceHolderMonto] = React.useState("Seleccione un Monto")
    const [placeHolderTipoDv, setPlaceHolderTipoDv] = React.useState("")
    const [placeHolderEstatus, setPlaceHolderEstatus] = React.useState("Seleccione un Estatus para la Socia")
    const [stateOption, setStateOption] = React.useState({
        Disable: true,
        Niveles,
        Nivel,
        optNiveles: [],
        optMontos,
        montoEnable: false,
        optEstatus: [],
        optTiposDv: [],
        Cargando: false
    })

    const [mensajeID, setMensajeID] = React.useState(0)

    let validationShapeM = {
        Mensaje: Yup.string().required("Campo Obligatorio")
    }

    const fnAgregarNotaC = () => setState(s => ({ ...s, MostrarCancelar: true }))
    const fnCancelarC = () => setState(s => ({ ...s, MostrarCancelar: false }))
    const FnNota = (Nota: string) => setState(s => ({ ...s, Nota: Nota }))

    const GetMensajesFijos = () => {
        setState(s => ({ ...s }))
        FuncionesP.FnGetMensajesFijos(props.oidc, { StatusProcesoID: 0, TipoDocumentoID: 0 })
            .then((respuesta: any) => {
                var mensajes = respuesta.map((valor: any) => {
                    var obj = { value: valor.Mensaje, label: valor.Mensaje };
                    return obj
                });

                setState(s => ({ ...s, optNotas: mensajes }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNotas: [] }))
            })
    }

    const fnCancelarProspecto = (Nota: string) => {
        //setState(s => ({ ...s, Cargando: true }))
        FuncionesP.FNCancelarProspecto(props.oidc, { ProspectoID: props.Id, Nota, TipoMesa: 1, DesdeProceso: 1 })
            .then((resultado: any) => {
                setState(s => ({ ...s, Cargando: false, MostrarCancelar: false }))
                props.cbActualizar(resultado)
                props.fnCancelar()
                toast.success('PROSPECTO CANCELADO')
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(s => ({ ...s, MostrarCancelar: false }))
                setStateOption(s => ({ ...s, Cargando: false }))
            })
    }

    const ConsultarProcesos = async () => {
        try {
            setState(e => ({ ...e, CargandoProcesos: true, Procesos: [] }))
            let procesos: any = await FuncionesProspecto.FNObtenerProceso(props.oidc, props.Id)
            if (isMounted) {
                let procesosDictamen = procesos.filter((x: any) => x.StatusProcesoID > 7 && x.StatusProcesoID < 17)
                let pendiente = procesos.filter((x: any) => x.StatusProcesoID > 7 && x.StatusProcesoID < 17 && x.Validado === null && x.DictamenObligatorio)
                if (pendiente.length === 0 && props.DictamenInfo.Dictaminado !== 1) {
                    setStateOption(e => ({ ...e, Disable: false }))
                }
                setState(e => ({ ...e, CargandoProcesos: false, Procesos: procesosDictamen, Pendientes: pendiente }))
            }
        }
        catch (e) {
            if (isMounted)
                setState(e => ({ ...e, CargandoProcesos: false, ErrorProcesos: true, Procesos: [] }))
        }
    }

    const ConsultarPersona = async () => {
        setState(e => ({ ...e, CargandoPerfil: true }))
        FuncionesProspecto.FNObtenerPersona(props.oidc, props.Id)
            .then((resultado: any) => {
                if (isMounted)
                    setState(e => ({
                        ...e, CargandoPerfil: false, ErrorPerfil: false,
                        DatosGenerales: resultado.DatosGenerales,
                        DatosSocioeconomicos: resultado.DatosSocioeconomicos,
                        Vehiculos: resultado.Vehiculos,
                        Experiencia: resultado.Experiencia
                    }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

                if (isMounted)
                    setState(e => ({ ...e, CargandoPerfil: false, ErrorPerfil: true }))
            })
    }

    // const FnGetNiveles = () => {
    //     setState(s => ({ ...s }))
    //     Funciones.FNGetNiveles(props.oidc)
    //         .then((respuesta: any) => {
    //             var nivel = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivel };
    //                 return obj
    //             });

    //             setStateOption(s => ({ ...s, Nivel: respuesta, optNiveles: nivel }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, optNiveles: [] }))
    //         })
    // }
    const FnGetNivelesOrigen = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetNivelesOrigen(props.oidc)
            .then((respuesta: any) => {
                var niveles = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivel };
                    return obj
                });

                setStateOption(s => ({ ...s, Niveles: respuesta, optNiveles: niveles }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNiveles: [] }))
            })
    }

    const FnGetMontosbyNivel = (NivelID: number) => {
        let sel = stateOption.Niveles.find((x) => x.DistribuidorNivelID === NivelID)
        setPlaceHolderNivel(sel?.DistribuidorNivel)
        let nivel = stateOption.Niveles.filter((x: any) => x.DistribuidorNivelID === NivelID);
        let montos: number[] = []
        let monto = nivel[0]['CapitalColocadoMinimo'] - 1 + 1000

        while (monto <= nivel[0]['CapitalColocadoMaximo']) {
            montos.push(monto)
            monto = monto + 1000
        }

        let options: any[] = []
        montos.forEach(e => options.push({ value: e, label: FormateoDinero.format(e) }))
        console.log(options)
        setStateOption(s => ({ ...s, optMontos: options, montoEnable: true }))
    }

    // const FnGetEstatus = () => {
    //     setState(s => ({ ...s }))
    //     Funciones.FNGetEstatus(props.oidc)
    //         .then((respuesta: any) => {
    //             var DistribuidoresEstatus = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.DistribuidoresEstatusID, label: valor.DistribuidoresEstatus };
    //                 return obj
    //             });
    //             console.log(DistribuidoresEstatus)
    //             setStateOption(s => ({ ...s, optEstatus: DistribuidoresEstatus }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, optNiveles: [] }))
    //         })
    // }

    const FnGetTipoDV = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetTipoDV(props.oidc)
            .then((respuesta: any) => {
                var TiposDistribuidores = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorTiposID, label: valor.DistribuidorTipos };
                    return obj
                });
                setStateOption(s => ({ ...s, optTiposDv: TiposDistribuidores }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTiposDv: [] }))
            })
    }

    const Dictaminado = () => {
        setPlaceHolderTipoDv(props.DictamenInfo.DistribuidorTipos)
        if (props.DictamenInfo.Dictaminado === 1) {
            setPlaceHolderNivel(props.DictamenInfo.DistribuidorNivel)
            setPlaceHolderMonto(`${props.DictamenInfo.Monto}`)
            setPlaceHolderEstatus(props.DictamenInfo.DistribuidoresEstatus)
        }
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'StatusProcesoID',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                {props.StatusProcesoID}
                            </span>
                        </div>
                },
                {
                    name: 'PROCESO (Mesa de Crédito)',
                    selector: 'Descripcion',
                    sortable: true,
                    width: '58%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'start' }}>
                            {props.Descripcion}
                        </div>
                }, {
                    name: 'VALIDADO',
                    selector: 'Validado',
                    sortable: true,
                    center: true,
                    width: '15%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'left' }}>
                            {props.Validado ? <FaCheckCircle color='#58db83' size={20} /> : props.Validado === null ? <FaClock color='gray' size={20} /> : <FaTimesCircle color='red' size={20} />}
                        </div>
                },
                {
                    name: 'REQUERIDO',
                    selector: 'DictamenObligatorio',
                    sortable: true,
                    center: true,
                    width: '15%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {props.DictamenObligatorio ? <FaDotCircle color='#58db83' size={20} /> : <FaDotCircle color='gray' size={20} />}
                        </div>
                },
            ]
        return colRet
    }, [state.Procesos])

    React.useEffect(() => {
        console.log("1", props.oidc.user.profile.Persona[0].Id)
        console.log("2", props.DictamenInfo.PersonaAnalistaID)
        if (props.oidc.user.profile.Persona[0].Id !== props.DictamenInfo.PersonaAnalistaID) {
            toast.error("El usuario actual no esta asignado al Prospectox")
            props.fnCancelar()
            return
        }
        Dictaminado()
        ConsultarPersona()
        ConsultarProcesos()
        // FnGetNiveles()
        FnGetNivelesOrigen()
        //FnGetEstatus()
        FnGetTipoDV()
        GetMensajesFijos()
    }, [props.Id])

    let validationShape = {
        DistribuidorNivelID: Yup.number().required("Campo Obligatorio").moreThan(-1, 'Seleccione un nivel'),
        Monto: Yup.number().required("Campo Obligatorio").moreThan(0, 'Seleccione un monto'),
        // DistribuidoresEstatusID: Yup.string().required("Campo Obligatorio")

    }

    return (
        <>
            <ModalWin open={props.mostrar} xlarge>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>VALIDAR PROSPECTO {props.nombreProspecto} </h5>
                    <button type="button" className="delete" onClick={props.fnCancelar} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div className="row">

                        <div className="col-md-6">

                            {state.CargandoProcesos && <Spinner />}
                            {state.ErrorProcesos && <span>Error al cargar los datos del Proceso del Prospecto...</span>}
                            {state.Procesos?.length > 0 && <div className='row'>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Acordion TabSelecionado="Procesos">
                                        <Acordion.Tab Identificador="Procesos" Titulo={<React.Fragment><FaClipboardCheck />&nbsp;PROCESOS Y ETAPAS VALIDADAS</React.Fragment>}>
                                            <div>
                                                <DataTable
                                                    data={state.Procesos}
                                                    striped
                                                    dense
                                                    noHeader
                                                    responsive
                                                    keyField={"StatusProcesoID"}
                                                    defaultSortField={"StatusProcesoID"}
                                                    columns={Columns}
                                                />
                                            </div>
                                        </Acordion.Tab>
                                    </Acordion>
                                </div>
                            </div>}

                            {state.CargandoPerfil && <Spinner />}
                            {state.ErrorPerfil && <span>Error al cargar los datos del Prospecto...</span>}
                            {(!state.CargandoPerfil && !state.ErrorPerfil) && <div className='row'>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Acordion TabSelecionado="">
                                        <Acordion.Tab Identificador="General" Titulo={<React.Fragment><FaUser />&nbsp;DATOS GENERALES</React.Fragment>}>
                                            <>
                                                <div className="text-start">
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha Nacimiento:</td>
                                                                <td>{moment(state.DatosGenerales?.FechaNacimiento).format('DD-MM-YYYY')}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sexo:</td>
                                                                <td>{state.DatosGenerales?.Sexo}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CURP: </td>
                                                                <td>{state.DatosGenerales?.CURP}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EDO CIVIL:: </td>
                                                                <td>{state.DatosGenerales?.EstadoCivil}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                                <td>{state.DatosGenerales?.TelefonoMovil}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E-Mail:</td>
                                                                <td>{state.DatosGenerales?.CorreoElectronico}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lugar Nacimiento:</td>
                                                                <td>{state.DatosGenerales?.LugarNacimiento}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                <td>{state.DatosGenerales?.DireccionProspecto}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Telefono Fijo:</td>
                                                                <td>{state.DatosGenerales?.TelefonoDomicilio}</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </div>
                                                <hr />
                                                <div className="text-start">
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        <caption style={{ captionSide: 'top' }}><strong>DATOS LABORALES</strong></caption>
                                                        {!state.DatosGenerales?.TieneEmpleo && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene Empleo</td>
                                                                <td></td>
                                                            </tr>
                                                        </tbody>}
                                                        {Boolean(state.DatosGenerales?.TieneEmpleo) && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                                <td>{state.DatosGenerales?.Empresa}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                                <td>{state.DatosGenerales?.Ocupacion}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                                <td>{FormateoDinero.format(state.DatosGenerales?.Sueldo ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antigüedad:</td>
                                                                <td>{state.DatosGenerales?.Antiguedad}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                <td>{state.DatosGenerales?.DireccionEmpresaProspecto}</td>
                                                            </tr>
                                                        </tbody>}
                                                    </table>
                                                </div>
                                                <hr />
                                                <div className="text-start">
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        <caption style={{ captionSide: 'top' }}><strong>DATOS CONYUGE</strong></caption>
                                                        {!state.DatosGenerales?.TieneConyuge && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene conyuge</td>
                                                                <td></td>
                                                            </tr>
                                                        </tbody>}
                                                        {Boolean(state.DatosGenerales?.TieneConyuge) && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre:</td>
                                                                <td>{state.DatosGenerales?.NombreConyuge}</td>
                                                            </tr>
                                                        </tbody>}
                                                    </table>
                                                </div>
                                                {Boolean(state.DatosGenerales?.TieneConyuge && state.DatosGenerales?.TieneEmpleoConyuge) && <div className="text-start">
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        <caption style={{ captionSide: 'top' }}><strong>DATOS LABORALES CONYUGE</strong></caption>
                                                        {<tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                                <td>{state.DatosGenerales?.EmpresaConyuge}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                                <td>{state.DatosGenerales?.OcupacionConyuge}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                                <td>{FormateoDinero.format(state.DatosGenerales?.SueldoConyuge ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antigüedad:</td>
                                                                <td>{state.DatosGenerales?.AntiguedadConyuge}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                <td>{state.DatosGenerales?.DireccionEmpresaConyuge}</td>
                                                            </tr>
                                                        </tbody>}
                                                    </table>
                                                </div>}
                                            </>
                                        </Acordion.Tab>
                                    </Acordion>
                                    <Acordion TabSelecionado="">
                                        <Acordion.Tab Identificador="Economicos" Titulo={<React.Fragment><FaHouseUser />&nbsp;DATOS SOCIOECONOMICOS</React.Fragment>}>
                                            <>
                                                <div className="text-start">
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        {!state.DatosSocioeconomicos?.TipoVivienda && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Capturada</td>
                                                                <td></td>
                                                            </tr>
                                                        </tbody>}
                                                        {state.DatosSocioeconomicos?.TipoVivienda && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>RFC:</td>
                                                                <td>{state.DatosSocioeconomicos?.RFC}</td>
                                                            </tr>
                                                        </tbody>}
                                                    </table>
                                                </div>
                                                {state.DatosSocioeconomicos?.TipoVivienda && <div className="text-start">
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        <caption style={{ captionSide: 'top' }}><strong>DATOS VIVIENDA</strong></caption>
                                                        {!state.DatosSocioeconomicos?.TipoVivienda && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Capturada</td>
                                                                <td></td>
                                                            </tr>
                                                        </tbody>}
                                                        {state.DatosSocioeconomicos?.TipoVivienda && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tipo de Vivienda:</td>
                                                                <td>{state.DatosSocioeconomicos?.TipoVivienda}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Personas que la habitan:</td>
                                                                <td>{state.DatosSocioeconomicos?.numeroPersonasHabitan}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Valor (aprox):</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.valorAproximado ?? 0)}</td>
                                                            </tr>
                                                        </tbody>}
                                                    </table>
                                                </div>}
                                                {state.DatosSocioeconomicos?.TipoVivienda && <div className="text-start">
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        <caption style={{ captionSide: 'top' }}><strong>DATOS OTRA VIVIENDA</strong></caption>
                                                        {!state.DatosSocioeconomicos?.TieneOtraVivienda && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Tiene Otra Vivienda</td>
                                                                <td></td>
                                                            </tr>
                                                        </tbody>}
                                                        {Boolean(state.DatosSocioeconomicos?.TieneOtraVivienda) && <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tipo de Vivienda:</td>
                                                                <td>{state.DatosSocioeconomicos?.TipoViviendaOtra}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Valor (aprox.)</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.valorAproximadoOtra ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                <td>{state.DatosSocioeconomicos?.DireccionOtraVivienda}</td>
                                                            </tr>
                                                        </tbody>}
                                                    </table>
                                                </div>}
                                                <hr />
                                                {state.DatosSocioeconomicos?.TipoVivienda && <div className="text-start">
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        <caption style={{ captionSide: 'top' }}><strong>INGRESOS</strong></caption>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.ingresoSueldo ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ganancias como DV:</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.gananciasDV ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ingreso del Conyuge:</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.ingresoConyuge ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Otro Ingreso:</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.otrosIngresos ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong>Total de Ingreso:</strong></td>
                                                                <td><strong>{FormateoDinero.format(state.DatosSocioeconomicos?.ingresoTotal ?? 0)}</strong></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                        <caption style={{ captionSide: 'top' }}><strong>EGRESOS</strong></caption>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Alimentación:</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.AlimetacionEgreso ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tarjetas:</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.TarjetasEgreso ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Vivienda (pago o renta):</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.RentaPagoViviendaEgreso ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Servicios Domesticos:</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.ServiciosDomesticosEgreso ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Otros Egresos:</td>
                                                                <td>{FormateoDinero.format(state.DatosSocioeconomicos?.OtroEgreso ?? 0)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dependientes Economicos:</td>
                                                                <td>{state.DatosSocioeconomicos?.DependientesEconomicos}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong>Total de Egresos:</strong></td>
                                                                <td><strong>{FormateoDinero.format(state.DatosSocioeconomicos?.EgresoTotal ?? 0)}</strong></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <hr />
                                                    {state.Vehiculos.length <= 0 && <span>Sin Vehículos</span>}
                                                    {state.Vehiculos.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                                        <table className='table'>
                                                            <caption style={{ captionSide: 'top' }}>VEHÍCULOS</caption>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ backgroundColor: 'darkgray', color: 'white' }}>MARCA</th>
                                                                    <th style={{ backgroundColor: 'darkgray', color: 'white' }}>MODELO</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {state.Vehiculos.map((c: any, cId: number) =>
                                                                    <tr key={'crd_' + cId}>
                                                                        <td>{c.Marca}</td>
                                                                        <td>{c.Modelo}</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>}
                                                    <hr />
                                                    {state.Experiencia.length <= 0 && <span>Sin Experiencia</span>}
                                                    {state.Experiencia.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
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
                                                                {state.Experiencia.map((c: any, cId: number) =>
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
                                    </Acordion>
                                </div>
                            </div>}
                        </div>

                        <div className="col-md-6" style={{ backgroundColor: '#f9f9f9', padding: '1em' }}>
                            {state.CargandoProcesos && <Spinner />}
                            {state.ErrorProcesos && <span>Error al cargar los datos del Proceso del Prospecto...</span>}
                            {state.Pendientes.length > 0 && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO TIENE PROCESOS REQUERIDOS PENDIENTES DE VALIDACIÓN</span></div>}
                            {!props.DictamenInfo.Activo && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO ESTA CANCELADO</span></div>}
                            {
                                state.Procesos?.length > 0 && <Formik
                                    initialValues={{ DistribuidorNivelID: -1, Monto: 0, DistribuidoresEstatusID: '' }}
                                    enableReinitialize
                                    // validationSchema={Yup.object().shape(validationShape)}
                                    onSubmit={(values: any) => {

                                        setStateOption(e => ({ ...e, Cargando: true }))
                                        if (state.Pendientes.length > 0) {
                                            toast.error(`ES NECESARIO REVISAR Y/O VALIDAR CADA PROCESO ANTES DE VALIDAR AL PROSPECTO`)
                                            toast.info(`ESTE PROSPECTO TIENE ${state.Pendientes.length} PROCESOS REQUERIDOS PENDIETES DE REVISAR Y/O VALIDAR`)
                                        } else {
                                            Funciones.FNDictamen(props.oidc, { ...values, ProspectoID: props.Id })
                                                .then((respuesta: any) => {
                                                    console.log(respuesta)
                                                    toast.success("PROSPECTO VALIDADO CON EXITO")
                                                    props.cbActualizar(respuesta)
                                                    props.fnCancelar()
                                                    setStateOption(e => ({ ...e, Cargando: false }))
                                                })
                                                .catch((error: any) => {
                                                    if (error.response)
                                                        toast.error(`Response Error: ${error.response.data}`)
                                                    else if (error.request)
                                                        toast.error(`Request ${error}`)
                                                    else
                                                        toast.error(`${error}`)
                                                    setStateOption(e => ({ ...e, Cargando: false }))
                                                })
                                        }

                                    }}>
                                    <Form>
                                        <div className="row">
                                            <div className="col-md-12">
                                                {isMounted &&
                                                    <ActionSelect
                                                        disabled={true}
                                                        label="Tipo Socia"
                                                        name="DistribuidorTiposID"
                                                        placeholder={placeHolderTipoDv}
                                                        options={stateOption.optTiposDv}
                                                        addDefault={false}
                                                    />}
                                            </div>

                                            <div className="col-md-12">
                                                {isMounted &&
                                                    <ActionSelect
                                                        disabled={stateOption.Disable}
                                                        label="Nivel Origen"
                                                        name="DistribuidorNivelID"
                                                        placeholder={placeHolderNivel}
                                                        options={stateOption.optNiveles}
                                                        addDefault={false}
                                                        accion={FnGetMontosbyNivel}
                                                    />}
                                            </div>

                                            {/*       <div className="col-md-12">
                                                {isMounted &&
                                                    <ActionSelect
                                                        disabled={!stateOption.montoEnable}
                                                        label="Monto"
                                                        name="Monto"
                                                        placeholder={placeHolderMonto}
                                                        options={stateOption.optMontos}
                                                        addDefault={false}
                                                    />}
                                            </div> */}

                                            {/* <div className="col-md-12">
                                            {isMounted &&
                                                <ActionSelect
                                                    disabled={stateOption.Disable}
                                                    label="Estatus del Socia"
                                                    name="DistribuidoresEstatusID"
                                                    placeholder={placeHolderEstatus}
                                                    options={stateOption.optEstatus}
                                                    addDefault={false}
                                                //accion={props.fnGetDistribuidores}
                                                />}
                                        </div> */}

                                            {stateOption.Cargando && <Spinner />}
                                            {(!stateOption.Cargando && props.DictamenInfo.Dictaminado !== 1 && props.DictamenInfo.Activo) &&
                                                <div className="text-end">
                                                    <button disabled={stateOption.Disable} type="button" className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => fnAgregarNotaC()} >
                                                        {'CANCELAR PROSPECTO'}
                                                    </button>
                                                    <button disabled={stateOption.Disable} type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                                        {'VALIDAR'}
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    </Form>
                                </Formik>
                            }
                        </div >

                    </div >
                </ModalWin.Body >
            </ModalWin >
            <ModalWin open={state.MostrarCancelar} center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>CANCELAR PROSPECTO</h5>
                    <button type="button" className="delete" onClick={() => { fnCancelarC() }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Formik initialValues={{ Mensaje: '' }}
                                    enableReinitialize
                                    validationSchema={Yup.object().shape(validationShapeM)}
                                    onSubmit={(values: any) => {

                                        setStateOption(e => ({ ...e, Cargando: true }))
                                        if (values.Mensaje === '') {
                                            toast.error(`ES NECESARIO SELECCIONAR UN MOTIVO`)
                                        } else {
                                            fnCancelarProspecto(`${values.Mensaje} ${state.Nota ? ' - ' + state.Nota : ''}`)
                                        }

                                    }} >
                                    <Form>
                                        <ActionSelect
                                            disabled={stateOption.Cargando}
                                            label="Nota"
                                            name="Mensaje"
                                            placeholder="Selecciona el motivo de la nota"
                                            options={state.optNotas}
                                            addDefault={true}
                                            valor={mensajeID}
                                        // accion={setMensajeID}
                                        />
                                        {/* <CustomFieldText disabled={loading} label="Mensaje (Opcional)" name="Anotacion" placeholder=""/>  */}
                                        <label>Anotación</label>
                                        <textarea className="form-control" name='Anotacion' id='Anotacion' rows={5} placeholder="Escribe aquí un Mensaje para complementar la Nota a enviar (Opcional)" onChange={e => FnNota(e.target.value)} />
                                        <div className="text-center">
                                            <br />
                                            {stateOption.Cargando && <Spinner />}
                                            {!stateOption.Cargando && <button /*onClick={() => { fnEnviarMensaje() }}*/ type="submit" className="ms-1 btn btn-danger waves-effect waves-light"><FaBan /> CANCELAR PROSPECTO</button>}
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                        </div>
                    </div>

                </ModalWin.Body>
            </ModalWin>
        </>
    )
}
