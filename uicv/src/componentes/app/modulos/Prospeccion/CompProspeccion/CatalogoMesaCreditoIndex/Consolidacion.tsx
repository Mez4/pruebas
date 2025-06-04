import React from 'react'

// Interfaces de base de datos
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'

// Componentes generales
import { Acordion, ActionSelect, CustomFieldText, ModalWin, Spinner } from '../../../../../global'

// Iconos
import { FaUser, FaHouseUser, FaCheckCircle, FaClock, FaClipboardCheck, FaTimesCircle, FaExclamationTriangle, FaFile, FaUserFriends, FaUsers, FaLink, FaDotCircle, FaBan, FaEdit, FaSave } from 'react-icons/fa'

// Formateo de fechas
import moment from 'moment'
import { FormateoDinero } from '../../../../../../global/variables'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import * as FuncionesProspecto from '../Prospectos/Funciones'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import VerDoc from '../DocsProspecto/VerDoc'
import AvalInfo from '../AvalInfo'
import DocsAval from '../DocsAval'
import ReferenciasAval from '../ReferenciasAval/ReferenciasAval'
import * as Funciones from './FuncionesDictamen'
import * as FuncionesP from './/Funciones'
import { Link } from 'react-router-dom'
import { Form, Formik, } from 'formik'
import * as Yup from 'yup'
import VerDocAct from '../../CompProspeccion/Prospectos/VerDoc'
import { iUI } from '../../../../../../interfaces/ui/iUI'

// Datos necesarios para el perfil
type PerfilProspectoTipo = {
    oidc: IOidc,
    Id?: number,
    ui: iUI,
    nombreProspecto: string,
    mostrar: boolean,
    productoID?: number,
    DistribuidorNivelInternoID?: number,
    DistribuidorNivel?: string,
    cbActualizar(item: any): any,
    Actualizar(): any,
    fnCancelar(): any,
    Listener: boolean,
    DictamenInfo: {
        Dictaminado: number,
        DistribuidorNivelID: number,
        DistribuidorNivelInternoID?: number,
        NivelOrigen_BuroID: number,
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
    Documentos: DBConfia_Prospeccion.IProspectosDocumentos_VW[],
    Referencias: DBConfia_Prospeccion.IReferencias[]
    Vehiculos: DBConfia_Prospeccion.IRelacionAutoMoto[],
    Experiencia: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[],
    Avales: DBConfia_Prospeccion.IAvales_VW[]
    Nota: string,
    optNotas: any[],
    MostrarCancelar: boolean,
    DistribuidorNivelMostrar: string
}
type BotonesEditar = {
    EditOg: boolean,
    EditDic: boolean,
    BotonEdit1: boolean,
    BotonGuardar1: boolean,
    BotonEdit2: boolean,
    BotonGuardar2: boolean,
    Cargar: boolean,
    Actualizado: boolean,
}
type EstadoInfo = {
    Modal:
    {
        Mostrar: boolean,
        VerDoc: boolean,
        VerInfo: boolean
    },
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
}

export const ConsolidaProspecto = (props: PerfilProspectoTipo) => {
    const [state, setState] = React.useState<EstadoTipo>({
        CargandoProcesos: true,
        ErrorProcesos: false,
        CargandoPerfil: true,
        ErrorPerfil: false,
        Procesos: [],
        Pendientes: [],
        DatosGenerales: undefined,
        DatosSocioeconomicos: undefined,
        Documentos: [],
        Referencias: [],
        Vehiculos: [],
        Experiencia: [],
        Avales: [],
        Nota: '',
        optNotas: [],
        MostrarCancelar: false,
        DistribuidorNivelMostrar: ''
    })

    const [stateAct, setStateAct] = React.useState({
        VerDoc: false,
        documentoPath: '',
        documentoNombre: ''
    })
    const permisoDocumentacion = props.ui.PermisosProductos?.find(p => p.PermisoID == 2646)


    let isMounted = React.useRef(true)
    const selectref = React.useRef<any>(null);
    const selectref2 = React.useRef<any>(null);

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
                console.log(resultado);

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

    const [stateConsolida, setStateCosolida] = React.useState({
        Cargando: false
    })

    const [editar, setEditar] = React.useState<BotonesEditar>({
        EditOg: true,
        EditDic: true,
        BotonEdit1: false,
        BotonGuardar1: true,
        BotonEdit2: false,
        BotonGuardar2: true,
        Cargar: false,
        Actualizado: false,
    })
    const [stateDoc, setStateDoc] = React.useState<EstadoInfo>({
        Modal:
        {
            Mostrar: false,
            VerDoc: false,
            VerInfo: false
        },
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
    })

    const optMontos: any[] = []
    const Niveles: any[] = []
    const NivelesNB: any[] = []
    const optNivelInterior: any[] = []
    const [placeHolderNivel, setPlaceHolderNivel] = React.useState("Seleccione un Nivel")
    const [placeHolderMonto, setPlaceHolderMonto] = React.useState("Ingrese un monto múltiplo de 5000")
    const [placeHolderTipoDv, setPlaceHolderTipoDv] = React.useState("")
    const [placeHolderNivelInterno, setPlaceHolderNivelInterno] = React.useState("")
    const [placeHolderEstatus, setPlaceHolderEstatus] = React.useState("Seleccione un Estatus para la socia")
    const [stateOption, setStateOption] = React.useState({
        Disable: true,
        Niveles,
        NivelesNB,
        optNiveles: [],
        optNivelNB: [],
        optMontos,
        optNivelInterior,
        montoEnable: false,
        optEstatus: [],
        optTiposDv: [],
        Cargando: false
    })


    const handleEditarBuro = (campo: number) => {
        setEditar(e => ({
            ...e,
            BotonGuardar1: !editar.BotonGuardar1,
            BotonEdit1: !editar.BotonEdit1,
            EditOg: !editar.EditOg,
            Cargar: !editar.Cargar
        }))

        switch (campo) {
            case 1: {
                let Datos = {
                    opcion: 1,
                    ProspectoID: props.Id,
                    ProductoID: props.productoID,
                    NivelOrigen: selectref.current?.props?.value.value
                };

                FuncionesProspecto.FNEditarProspectoPreActivacion(props.oidc, Datos)
                    .then(async (resultado: any) => {
                        console.log(resultado);

                        await props.Actualizar();
                        setEditar(e => ({ ...e, Cargar: false, Actualizado: !editar.Actualizado }));

                        toast.success('PROSPECTO ACTUALIZADO');
                    })
                    .catch((error: any) => {
                        setEditar(e => ({ ...e, Cargar: false }));

                        if (error.response)
                            toast.error(`Response Error: ${error.response.data}`);
                        else if (error.request)
                            toast.error(`Request ${error}`);
                        else
                            toast.error(`${error}`);
                    });

                break;
            }

            case 2: {
                let Datos = {
                    opcion: 1,
                    ProspectoID: props.Id,
                    ProductoID: props.productoID,
                    BuroInterno: selectref2.current?.props?.value.value
                };

                FuncionesProspecto.FNEditarProspectoPreActivacion(props.oidc, Datos)
                    .then(async (resultado: any) => {
                        console.log(resultado);

                        await props.Actualizar();
                        setEditar(e => ({ ...e, Cargar: false, Actualizado: !editar.Actualizado }));

                        toast.success('PROSPECTO ACTUALIZADO');
                    })
                    .catch((error: any) => {
                        setEditar(e => ({ ...e, Cargar: false }));

                        if (error.response)
                            toast.error(`Response Error: ${error.response.data}`);
                        else if (error.request)
                            toast.error(`Request ${error}`);
                        else
                            toast.error(`${error}`);
                    });
                break;
            }
        }
    }

    const ConsultarProcesos = async () => {
        try {
            setState(e => ({ ...e, CargandoProcesos: true, Procesos: [] }))
            let procesos: any = await FuncionesProspecto.FNObtenerProceso(props.oidc, props.Id)
            if (isMounted) {
                let procesosDictamen = procesos.filter((x: any) => x.StatusProcesoID > 7 && x.StatusProcesoID < 17)
                let pendiente = procesos.filter((x: any) => x.StatusProcesoID > 7 && x.StatusProcesoID < 17 && x.Validado === null && x.DictamenObligatorio)

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
                        Experiencia: resultado.Experiencia,
                        Documentos: resultado.Documentos,
                        Referencias: resultado.Referencias,
                        Avales: resultado.Avales
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

    const FnGetNiveles = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetNiveles(props.oidc)
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

    const FnGetNivelesInternos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetNivelesInternos(props.oidc)
            .then((respuesta: any) => {
                var niveles = respuesta.map((valor: any) => {
                    var obj = { value: valor.NivelOrigen_BuroID, label: valor.Nombre };
                    return obj
                });
                setStateOption(s => ({ ...s, NivelesNB: respuesta, optNivelNB: niveles }))
            })
            .catch(() => {
                //   setState(s => ({ ...s, optNivelInterior: [] }))
            })
    }

    const FnGetMontosbyNivel = (NivelID: number) => {
        if (NivelID === null) return null
        if (stateOption.NivelesNB.length > 0) {
            let sel = stateOption.NivelesNB.find((x) => x.NivelOrigen_BuroID === NivelID)
            setPlaceHolderNivel(sel?.NivelOrigen_BuroID)
            let nivel = stateOption.NivelesNB.filter((x: any) => x.NivelOrigen_BuroID === NivelID);
            let montos: number[] = []
            let monto = nivel[0]['LineaCreditoMinimo'] - 1 + 1000

            while (monto <= nivel[0]['LineaCredito']) {
                montos.push(monto)
                monto = monto + 1000
            }

            let options: any[] = []
            montos.forEach(e => options.push({ value: e, label: FormateoDinero.format(e) }))
            setStateOption(s => ({ ...s, optMontos: options, montoEnable: true }))
        }
    }

    const FnGetTipoDV = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetTipoDV(props.oidc)
            .then((respuesta: any) => {
                var TiposDistribuidores = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorTiposID, label: valor.DistribuidorTipos };
                    return obj
                });
                console.log(TiposDistribuidores)
                setStateOption(s => ({ ...s, optTiposDv: TiposDistribuidores }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTiposDv: [] }))
            })
    }

    const FnGetEstatus = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetEstatus(props.oidc)
            .then((respuesta: any) => {
                var DistribuidoresEstatus = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidoresEstatusID, label: valor.DistribuidoresEstatus };
                    return obj
                });
                setStateOption(s => ({ ...s, optEstatus: DistribuidoresEstatus }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNiveles: [] }))
            })
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
        // if(props.oidc.user.profile.Persona.Id !== props.DictamenInfo.PersonaAnalistaID){
        //     toast.error("El usuario actual no esta asignado al Prospecto")
        //     props.fnCancelar()
        //     return
        // }
        // console.log("UI", props.ui)
        ConsultarPersona()
        ConsultarProcesos()
        FnGetNiveles()
        FnGetEstatus()
        FnGetNivelesInternos()
        // console.log("DICTAMEN INFO", props.DictamenInfo)
        // console.log("MONTO", props.DictamenInfo.Monto)
        GetMensajesFijos()
        setPlaceHolderTipoDv(props.DictamenInfo.DistribuidorTipos)
        if (props.DictamenInfo.Monto > 0)
            setStateOption(e => ({ ...e, Disable: false }))
    }, [props.Id])

    React.useEffect(() => {
        FnGetMontosbyNivel(props.DictamenInfo.NivelOrigen_BuroID)
    }, [stateOption.NivelesNB])



    const Consolidar = (values: any) => {
        let valDocAct = (state.DatosGenerales?.Contrato?.length ?? 0) * (state.DatosGenerales?.Pagare?.length ?? 0) * (state.DatosGenerales?.Pagare?.length ?? 0)
        // console.log("props.ID CATALOGO MESA CREDITO", props.Id)
        if (valDocAct === 0) {
            toast.error(`ES NECESARIO QUE EL CONTRATO Y EL PAGARE ESTEN CAPTURADOS `)
            setStateOption(e => ({ ...e, Cargando: false }))
        } else {
            setStateCosolida(e => ({ ...e, Cargando: true }))
            Funciones.FNConsolidar(props.oidc, { ...values, ProspectoID: props.Id ?? 0, ProductoID: props.productoID ?? 0 })
                .then((respuesta: any) => {
                    toast.success("PROSPECTO CONSOLIDADO CON EXITO")
                    toast.info("SE HA REALIZADO EL ALTA DE LA SOCIA", { autoClose: 10000 })
                    props.cbActualizar(respuesta)
                    props.fnCancelar()
                    setStateCosolida(e => ({ ...e, Cargando: false }))
                })
                .catch((error: any) => {
                    if (error.response)
                        toast.error(`Response Error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)
                    setStateCosolida(e => ({ ...e, Cargando: false }))
                })
        }
    }

    const fnVerDoc = (id: number, nombre: string) => setStateDoc({ ...stateDoc, Modal: { ...stateDoc.Modal, Mostrar: false, VerDoc: true }, Documento: { ...stateDoc.Documento, documentoID: id, documentoNombre: nombre } })
    const fnCancelDoc = () => setStateDoc({ ...stateDoc, Modal: { ...stateDoc.Modal, Mostrar: false, VerDoc: false, VerInfo: false } })
    const fnVerDocA = (documentoPath: string, documentoNombre: string) => setStateAct({ ...stateAct, VerDoc: true, documentoPath, documentoNombre })
    const fnCancelarVerDoc = () => setStateAct({ ...stateAct, VerDoc: false })

    const fnVerInfAval = (id: number, nombre: string, info: DBConfia_Prospeccion.IAvales_VW) => {
        if (info != undefined)
            setStateDoc({ ...stateDoc, Modal: { ...stateDoc.Modal, Mostrar: false, VerDoc: false, VerInfo: true }, Documento: { ...stateDoc.Documento }, Datos: { ...stateDoc.Datos, AvalID: id, AvalNombreCompleto: nombre, Info: info } })
    }

    const fnVerRefAval = (id: number, nombre: string) => setStateDoc({ ...stateDoc, Modal: { ...stateDoc.Modal, Mostrar: true, VerDoc: false }, Documento: { ...stateDoc.Documento }, Datos: { ...stateDoc.Datos, AvalID: id, AvalNombreCompleto: nombre, VerDocs: false } })

    const fnVerDocAval = (id: number, nombre: string) => setStateDoc({ ...stateDoc, Modal: { ...stateDoc.Modal, Mostrar: true, VerDoc: false }, Documento: { ...stateDoc.Documento }, Datos: { ...stateDoc.Datos, AvalID: id, AvalNombreCompleto: nombre, VerDocs: true } })

    let validationShape = {
        DistribuidorNivelID: Yup.number().required("Campo Obligatorio").moreThan(-1, 'Seleccione un nivel'),
        DistribuidorNivelID2: Yup.number().required("Campo Obligatorio").moreThan(-1, 'Seleccione un nivel'),

        Monto: Yup.string().matches(/^[1-9]{1}[0-9]{1}000$/, 'Ingrese un monto válido múltiplo de 5000').required().typeError('Ingrese un monto válido múltiplo de 5000'),
        DistribuidoresEstatusID: Yup.string().required("Campo Obligatorio")

    }

    return (
        <>
            <ModalWin open={props.mostrar} xlarge>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>ACTIVAR SOCIA {props.nombreProspecto} </h5>
                    <button type="button" className="delete" onClick={props.fnCancelar} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div className="row">

                        <div className="col-md-6">

                            {state.Procesos?.length > 0 && <Acordion TabSelecionado="Dictamen">
                                <Acordion.Tab Identificador="Dictamen" Titulo={<React.Fragment><FaClipboardCheck />&nbsp;VALIDACIÓN</React.Fragment>}>
                                    <>
                                        <div className="text-start">
                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nivel (Origen):</td>
                                                        <td>{props.DictamenInfo.DistribuidorNivel ?? '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Monto Dictaminado:</td>
                                                        <td>{FormateoDinero.format(props.DictamenInfo.Monto)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Estatus de la Socia: </td>
                                                        <td>{props.DictamenInfo.DistribuidoresEstatus ?? '-'}</td>
                                                    </tr>

                                                </tbody>
                                            </table>

                                        </div>
                                    </>
                                </Acordion.Tab>
                            </Acordion>}
                            {permisoDocumentacion &&
                                <Acordion TabSelecionado="DocumentosAct">
                                    <Acordion.Tab Identificador="DocumentosAct" Titulo={<React.Fragment><FaFile />&nbsp;DOCUMENTOS ACTIVACIÓN</React.Fragment>}>
                                        <>
                                            <table className='table table-striped' style={{ width: '100%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '15%' }}></th>
                                                        <th style={{ width: '40%' }}>Documento</th>
                                                        <th style={{ width: '20%' }}>Ver</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr style={{ verticalAlign: 'middle' }}>
                                                        <td style={{}}>
                                                            {state.DatosGenerales?.Contrato && <FaCheckCircle color='green' size={20} />}
                                                            {state.DatosGenerales?.Contrato === null && <FaClock color='gray' size={20} />}
                                                        </td>
                                                        <td style={{}}>CONTRATO FIRMADO</td>
                                                        <td>
                                                            {state.DatosGenerales?.Contrato && <button className="btn btn-link" style={{ width: '100%', textAlign: 'center', paddingTop: '0px', paddingBottom: '0px' }} type="button" onClick={() => fnVerDocA(state.DatosGenerales?.Contrato ?? '', 'CONTRATO')}>VER</button>}
                                                            {state.DatosGenerales?.Contrato === null && <div className="text-center"><i style={{ fontSize: '.8em' }}>Pendiete</i></div>}
                                                        </td>
                                                    </tr>
                                                    <tr style={{ verticalAlign: 'middle' }}>
                                                        <td style={{}}>
                                                            {state.DatosGenerales?.Pagare && <FaCheckCircle color='green' size={20} />}
                                                            {state.DatosGenerales?.Pagare === null && <FaClock color='gray' size={20} />}
                                                        </td>
                                                        <td style={{}}>PAGARE FRENTE</td>
                                                        <td>
                                                            {state.DatosGenerales?.Pagare && <button className="btn btn-link" style={{ width: '100%', textAlign: 'center', paddingTop: '0px', paddingBottom: '0px' }} type="button" onClick={() => fnVerDocA(state.DatosGenerales?.Pagare ?? '', 'PAGARE')}>VER</button>}
                                                            {state.DatosGenerales?.Pagare === null && <div className="text-center"><i style={{ fontSize: '.8em' }}>Pendiete</i></div>}
                                                        </td>
                                                    </tr>
                                                    <tr style={{ verticalAlign: 'middle' }}>
                                                        <td style={{}}>
                                                            {state.DatosGenerales?.PagareReverso && <FaCheckCircle color='green' size={20} />}
                                                            {state.DatosGenerales?.PagareReverso === null && <FaClock color='gray' size={20} />}
                                                        </td>
                                                        <td style={{}}>PAGARE REVERSO</td>
                                                        <td>
                                                            {state.DatosGenerales?.PagareReverso && <button className="btn btn-link" style={{ width: '100%', textAlign: 'center', paddingTop: '0px', paddingBottom: '0px' }} type="button" onClick={() => fnVerDocA(state.DatosGenerales?.PagareReverso ?? '', 'PAGARE REVERSO')}>VER</button>}
                                                            {state.DatosGenerales?.PagareReverso === null && <div className="text-center"><i style={{ fontSize: '.8em' }}>Pendiete</i></div>}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </>
                                    </Acordion.Tab>
                                </Acordion>
                            }

                            {state.CargandoProcesos && <Spinner />}
                            {state.ErrorProcesos && <span>Error al cargar los datos del Proceso del Prospecto...</span>}
                            {state.Procesos?.length > 0 && <div className='row'>
                                <div className="col-sm-12 col-md-12 col-lg-12">
                                    <Acordion TabSelecionado="">
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
                                    <Acordion TabSelecionado="">
                                        <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaFile />&nbsp;DOCUMENTOS</React.Fragment>}>
                                            <>
                                                {state.Documentos.length <= 0 && <span>Sin Documentos</span>}
                                                {state.Documentos.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                                    <table className='table'>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '80%', color: 'white' }}></th>
                                                                <th style={{ width: '20%', color: 'white' }}></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {state.Documentos.map((c: any, cId: number) =>
                                                                <tr key={'crd_' + cId}>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.NombreDocumento}</td>
                                                                    <td><button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerDoc(c.DocumentoID, c.NombreDocumento)}>VER</button></td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>}
                                            </>
                                        </Acordion.Tab>
                                    </Acordion>
                                    <Acordion TabSelecionado="">
                                        <Acordion.Tab Identificador="Referencias" Titulo={<React.Fragment><FaUserFriends />&nbsp;REFERENCIAS</React.Fragment>}>
                                            <>
                                                {state.Referencias.length <= 0 && <span>Sin Referencias</span>}
                                                {state.Referencias.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                                    <table className='table' >
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '5%', backgroundColor: 'darkgray', color: 'white' }}>NOMBRE</th>
                                                                <th style={{ width: '13%', backgroundColor: 'darkgray', color: 'white' }}>EDAD</th>
                                                                <th style={{ width: '23%', backgroundColor: 'darkgray', color: 'white' }}>CELULAR</th>
                                                                <th style={{ width: '23%', backgroundColor: 'darkgray', color: 'white' }}>PARENTESCO</th>
                                                                <th style={{ width: '35%', backgroundColor: 'darkgray', color: 'white' }}></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {state.Referencias.map((c: any, cId: number) =>
                                                                <tr key={'crd_' + cId}>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{`${c.nombre} ${c.primerApellido}`}</td>
                                                                    <td>{c.edad}</td>
                                                                    <td>{c.celular}</td>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.parentesco}</td>
                                                                    <td>{c.Validado ? <FaCheckCircle color='#58db83' size={20} /> : c.Validado == null ? <FaClock color='gray' size={20} /> : <FaTimesCircle color='red' size={20} />}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>}
                                            </>
                                        </Acordion.Tab>
                                    </Acordion>
                                    <Acordion TabSelecionado="">
                                        <Acordion.Tab Identificador="Avales" Titulo={<React.Fragment><FaUsers />&nbsp;AVALES</React.Fragment>}>
                                            <>
                                                {state.Avales.length <= 0 && <span>Sin Avales</span>}
                                                {state.Avales.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                                    <table className='table'>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '35%', backgroundColor: 'darkgray', color: 'white' }}>NOMBRE AVAL</th>
                                                                <th style={{ width: '20%', backgroundColor: 'darkgray', color: 'white' }}>INFO.</th>
                                                                <th style={{ width: '20%', backgroundColor: 'darkgray', color: 'white' }}>REFS.</th>
                                                                <th style={{ width: '20%', backgroundColor: 'darkgray', color: 'white' }}>DOCS.</th>
                                                                <th style={{ width: '5%', backgroundColor: 'darkgray', color: 'white' }}></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {state.Avales.map((c: any, cId: number) =>
                                                                <tr key={'crd_' + cId}>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.NombreCompleto}</td>
                                                                    <td style={{ textAlign: 'center' }} ><button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerInfAval(c.AvalID, c.NombreCompleto, c)}>VER</button></td>
                                                                    <td style={{ textAlign: 'center' }} ><button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerRefAval(c.AvalID, c.NombreCompleto)}>VER</button></td>
                                                                    <td style={{ textAlign: 'center' }} ><button type="button" style={{ paddingTop: '0px', paddingBottom: '0px' }} className="btn btn-link" onClick={() => fnVerDocAval(c.AvalID, c.NombreCompleto)}>VER</button></td>
                                                                    <td>{c.Validado ? <FaCheckCircle color='#58db83' size={20} /> : c.Validado == null ? <FaClock color='gray' size={20} /> : <FaTimesCircle color='red' size={20} />}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
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
                            {state.Pendientes.length > 0 && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO TIENE PROCESOS PENDIENTES DE VALIDACIÓN</span></div>}
                            {props.DictamenInfo.Monto <= 0 && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO NO HA SIDO VALIDADO</span></div>}
                            {props.DictamenInfo.Monto <= 0 && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO AÚN NO PUEDE SER ACTIVADO COMO DV</span></div>}
                            {!props.DictamenInfo.Activo && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO ESTA CANCELADO</span></div>}
                            {state.DatosGenerales?.Contrato === null && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO AUN NO TIENE EL CONTRATO CAPTURADO</span></div>}
                            {state.DatosGenerales?.Pagare === null && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO AUN NO TIENE EL PAGARÉ CAPTURADO</span></div>}
                            {state.DatosGenerales?.PagareReverso === null && <div className='text-end'><span style={{ color: 'red' }}>* ESTE PROSPECTO AUN NO TIENE EL REVERSO DEL PAGARÉ  CAPTURADO</span></div>}
                            {props.DictamenInfo.Dictaminado === 3 && <>
                                <div style={{ padding: '1em' }}>
                                    <span >¿Esta Seguro(a) de ACTIVAR como Socia a este Prospecto ? </span><br /><br />
                                    <FaExclamationTriangle />
                                    <span > Atención: Una vez Activado el Prospecto, el proceso para darlo de alta como Socia iniciara.</span><br />
                                </div>
                                <br />
                                {/* <div style={{textAlign: 'end'}}>
                                    { stateConsolida.Cargando && <Spinner/>}
                                    { !stateConsolida.Cargando && <button disabled={props.DictamenInfo.Monto <= 0} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={Consolidar}>CONTINUAR Y CONSOLIDAR</button>}
                                </div> */}

                                {



                                    <Formik
                                        initialValues={{ DistribuidorNivelID: props.DictamenInfo.DistribuidorNivelID, Monto: props.DictamenInfo.Monto, DistribuidoresEstatusID: props.DictamenInfo.DistribuidoresEstatusID }}
                                        enableReinitialize
                                        validationSchema={Yup.object().shape(validationShape)}

                                        onSubmit={(values: any) => {

                                            setStateOption(e => ({ ...e, Cargando: true }))
                                            if (state.Pendientes.length > 0) {
                                                toast.error(`ES NECESARIO REVISAR Y/O VALIDAR CADA PROCESO ANTES DE ACTIVAR AL PROSPECTO`)
                                                toast.info(`ESTE PROSPECTO TIENE ${state.Pendientes.length} PROCESOS REQUERIDOS PENDIETES DE REVISAR Y/O VALIDAR`)
                                            } else {
                                                Consolidar(values)
                                                // Funciones.FNDictamen(props.oidc, {...values, ProspectoID: props.Id})
                                                //     .then((respuesta: any) => {
                                                //         console.log(respuesta)
                                                //         toast.success("PROSPECTO VALIDADO CON EXITO")
                                                //         props.cbActualizar(respuesta)
                                                //         props.fnCancelar()
                                                //         setStateOption(e => ({ ...e, Cargando: false}))
                                                //     })
                                                //     .catch((error: any) => {
                                                //         if (error.response) 
                                                //             toast.error(`Response Error: ${error.response.data}`)
                                                //         else if (error.request)
                                                //             toast.error(`Request ${error}`)
                                                //         else
                                                //             toast.error(`${error}`)
                                                //             setStateOption(e => ({ ...e, Cargando: false}))
                                                //     })
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
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 me-2">
                                                                <ActionSelect
                                                                    disabled={editar.EditOg}
                                                                    label="Nivel Origen"
                                                                    name="DistribuidorNivelID"
                                                                    placeholder={placeHolderNivel}
                                                                    options={stateOption.optNiveles}
                                                                    addDefault={false}
                                                                    onChange={(e) => console.log(e.value)}
                                                                    ref={selectref}
                                                                    // accion={FnGetMontosbyNivel}
                                                                    valor={props.DictamenInfo.DistribuidorNivelID}
                                                                />
                                                            </div>
                                                            <button
                                                                disabled={editar.BotonEdit1}
                                                                type="button"
                                                                className="btn"
                                                                onClick={() => setEditar(e => ({ ...e, EditOg: !editar.EditOg, BotonGuardar1: !editar.BotonGuardar1, BotonEdit1: !editar.BotonEdit1 }))}
                                                            >
                                                                <FaEdit color='orange' size={16} />
                                                            </button>
                                                            {!editar.Cargar && <button
                                                                disabled={editar.BotonGuardar1}
                                                                type="button"
                                                                className="btn"

                                                                onClick={(e) => handleEditarBuro(1)}
                                                            >
                                                                <FaSave color='blue' size={16} />
                                                            </button>} {editar.Cargar && <Spinner />}
                                                        </div>
                                                    }
                                                </div>

                                                <div className="col-md-12">
                                                    {isMounted &&
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="Nivel Ingreso"
                                                            name="DistribuidorNivelID2"
                                                            placeholder={'Seleccione el Nivel'}
                                                            options={stateOption.optNiveles}
                                                            addDefault={false}
                                                        // accion={FnGetMontosbyNivel}
                                                        // valor={props.DictamenInfo.DistribuidorNivelInternoID}
                                                        />}
                                                </div>

                                                <div className="col-md-12">
                                                    {isMounted &&
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 me-2">
                                                                <ActionSelect
                                                                    disabled={editar.EditDic}
                                                                    label="Dictamen Buro"
                                                                    name="BuroInternoEstatusID"
                                                                    placeholder={placeHolderNivel}
                                                                    options={stateOption.optNivelNB}
                                                                    addDefault={false}
                                                                    accion={FnGetMontosbyNivel}
                                                                    valor={props.DictamenInfo.NivelOrigen_BuroID}
                                                                    ref={selectref2}
                                                                />
                                                            </div>
                                                            <button
                                                                disabled={editar.BotonEdit2}
                                                                type="button"
                                                                className="btn"
                                                                onClick={() => setEditar(e => ({ ...e, EditDic: !editar.EditDic, BotonGuardar2: !editar.BotonGuardar2, BotonEdit2: !editar.BotonEdit2 }))}
                                                            >
                                                                <FaEdit color='orange' size={16} />
                                                            </button>
                                                            {!editar.Cargar && <button
                                                                disabled={editar.BotonGuardar2}
                                                                type="button"
                                                                className="btn"

                                                                onClick={() => handleEditarBuro(2)}
                                                            >
                                                                <FaSave color='blue' size={16} />
                                                            </button>} {editar.Cargar && <Spinner />}
                                                        </div>
                                                    }
                                                </div>

                                                {/* 
                                                <div className="col-md-12">
                                                    {isMounted &&
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="Monto"
                                                            name="Monto"
                                                            placeholder={placeHolderMonto}
                                                            options={stateOption.optMontos}
                                                            addDefault={false}
                                                            valor={props.DictamenInfo.Monto}
                                                        />}
                                                </div> */}

                                                <CustomFieldText
                                                    disabled={false}
                                                    label="Monto"
                                                    name="Monto"
                                                    placeholder={placeHolderMonto}
                                                />

                                                <div className="col-md-12">
                                                    {isMounted &&
                                                        <ActionSelect
                                                            disabled={true}
                                                            label="Estatus del Socia"
                                                            name="DistribuidoresEstatusID"
                                                            placeholder={placeHolderEstatus}
                                                            options={stateOption.optEstatus}
                                                            addDefault={false}

                                                            valor={props.DictamenInfo.DistribuidoresEstatusID}
                                                        //accion={props.fnGetDistribuidores}
                                                        />}
                                                </div>

                                                {stateOption.Cargando && <Spinner />}
                                                {(!stateOption.Cargando && props.DictamenInfo.Activo) &&
                                                    <div className="text-end">
                                                        <button disabled={stateOption.Disable} type="button" className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => fnAgregarNotaC()}>
                                                            {'CANCELAR PROSPECTO'}
                                                        </button>
                                                        <button disabled={stateOption.Disable} type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                                            {'ACTIVAR'}
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        </Form>

                                    </Formik>
                                }
                            </>}
                            {props.DictamenInfo.Dictaminado === 1 && <>
                                <div style={{ padding: '1em' }}>
                                    <div className='text-center'>
                                        <FaCheckCircle color='#58db83' size={100} />
                                    </div>
                                    <br />
                                    <span >Este Prospecto ya fue Activado, para ver su información como Socia puede ir al siguiente enlace... </span><br /><br />
                                </div>
                                <br />
                                <div style={{ textAlign: 'end' }}>
                                    {/*   <Link to={`/app/administracion/personas/distribuidores/${props.Id}`} type="button" className="ms-2 btn btn-info waves-effect waves-light"><FaLink /> IR AL PERFIL DE LA SOCIA</Link>
                                    */} {/* <button disabled={props.DictamenInfo.Monto <= 0} type="button" className="ms-2 btn btn-info waves-effect waves-light" onClick={Consolidar}>IR AL PERFIL DE LA SOCIA </button> */}
                                </div>
                            </>}
                        </div>

                    </div>
                </ModalWin.Body>
            </ModalWin>

            {stateDoc.Modal.VerDoc && <ModalWin open={stateDoc.Modal.VerDoc} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>{stateDoc.Documento.documentoNombre}</h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelDoc()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <VerDoc DocumentoID={stateDoc.Documento.documentoID} fnCancelar={fnCancelDoc} />
                </ModalWin.Body>
            </ModalWin>}

            {stateDoc.Modal.VerInfo && <ModalWin open={stateDoc.Modal.VerInfo} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Información de Aval: {stateDoc.Datos.AvalNombreCompleto} </h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelDoc()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {stateDoc.Datos.Info != undefined && <AvalInfo DatosGenerales={stateDoc.Datos.Info} />}
                </ModalWin.Body>
            </ModalWin>}

            {stateDoc.Modal.Mostrar && <ModalWin open={stateDoc.Modal.Mostrar} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>{(stateDoc.Datos.VerDocs ? 'Documentos' : 'Referencias')} Aval: {stateDoc.Datos.AvalNombreCompleto} </h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelDoc()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {stateDoc.Datos.VerDocs && <DocsAval AvalID={stateDoc.Datos.AvalID} Editar={false} />}
                    {!stateDoc.Datos.VerDocs && <ReferenciasAval AvalID={stateDoc.Datos.AvalID} Editar={false} />}
                </ModalWin.Body>
            </ModalWin>}
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
            {stateAct.VerDoc && <ModalWin open={stateAct.VerDoc} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>{stateAct.documentoNombre}</h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelarVerDoc()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <VerDocAct DocumentoPath={stateAct.documentoPath} fnCancelar={fnCancelarVerDoc} />
                </ModalWin.Body>
            </ModalWin>}
        </>
    )
}
