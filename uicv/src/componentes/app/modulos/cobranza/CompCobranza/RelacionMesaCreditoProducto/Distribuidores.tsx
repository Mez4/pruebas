import React, {useState} from 'react'
import moment, { now } from 'moment'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import ReactTooltip from 'react-tooltip'
import { CustomFieldText2, CustomSelect2 } from '../../../../../global'
import * as Funciones from '../RelacionMesaCreditoProducto/Funciones'
import * as FuncionesGestores from '../CatalogoGestoresCobranza/Funciones'
import * as FuncionesSucursales from '../../../catalogos/CompCatalogos/CatalogoSucursal/Funciones'

import { useParams, Link } from 'react-router-dom'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaUserPlus, FaPhoneAlt, FaFile, FaHouseDamage } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionSelect, DatePickeStart, DatePickeEnd } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../../global/functions'
import { CFormAsignaGestor } from '../RelacionMesaCreditoProducto/CFormAsignaGestor'
import { CFormReferencias } from '../RelacionMesaCreditoProducto/CFormReferencias'
import { CFormDocumentos } from '../RelacionMesaCreditoProducto/CFormDocumentos'
import { CFormReferenciasAvales } from '../RelacionMesaCreditoProducto/CFormReferenciasAvales'

import { CFormDireccion } from '../RelacionMesaCreditoProducto/CFormDireccion'

import { Formik, Form } from 'formik'
import { FaFilter } from 'react-icons/fa'
import { elementOrEmpty } from '../../../../../../node_modules_local/react-csv/lib/core'
import { Index } from 'usetheform'
import { TextComponent } from 'react-native'
import { toast } from 'react-toastify'
import { Row } from 'react-grid-system'


type CatalogosType = {
    oidc: IOidc
}

const Distribuidores = (props: CatalogosType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { DistribuidorID: 0, DistribuidorDesc: '', SucursalDesc: '', DiasAtraso: 0, GestorId: 0, GestorDesc: '', ColorAsignaGestor: '', ColorReferencias: '', Grupo: '', ClasificadorGrupoID: 0, ColorReferenciasAvales: '', ProductoID: 0, idRelMesaCredProd: 0, Sucursal: '', MesaCobranzaID: 0, AsignGestorMesaCobranzaID: 0, AsignGestorMesaCobranzaDesc: '' ,FechaHoraAsignacion: new Date }
    const respuesta: any[] = []
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optGestor: any[] = []
    const optGestorF: any[] = []
    const optSucursal: any[] = []
    const optGrupo: any[] = []
    const optDistribuidor: any[] = []
    const optTipoCobranza: any[] = []
    const FiltroSucursal: number = 0
    const FiltroGestor: number = 0
    const FiltroGrupo: number = 0
    const FiltroDistribuidor: number = 0
    const FiltroTipoCobranza: number = 0
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optGestor,
        optGestorF,
        optSucursal,
        optGrupo,
        optDistribuidor,
        optTipoCobranza,
        FiltroSucursal,
        FiltroGestor,
        FiltroGrupo,
        FiltroDistribuidor,
        FiltroTipoCobranza,
        Filtro: '',
        Cargando: true,
        Error: false,
        MesaCobranzaID: 0,
        MesaCobranzaDesc: '',
        NombreDirector: '',
        limInferiorDias: 0,
        limSuperiorDias: 0,
        CFormReferencias: false, Prueba: 0,
        CFormReferenciasAvales: false,
        CFormDocumentos: false, SucursalDesc: "", respuesta,
        CFormDireccion: false,
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
        Funciones.GetDistribuidoresDiasAtrasos(props.oidc, { idRelMesaCredProd, ProductoID })
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, respuesta: respuesta }))
                    FNGetDistri(respuesta)
                }
                console.log(respuesta)
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

    const FnGetDistribuidor = () => {
        setState(s => ({ ...s }))
        Funciones.GetDistribuidoresDiasAtrasos(props.oidc, { idRelMesaCredProd, ProductoID })
            .then((respuesta: any) => {
                var Distribuidor = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorID, label: valor.DistribuidorDesc };
                    return obj
                });
                var Gestor = respuesta.map((valor :any) => {
                    var obj = { value: valor.GestorId, label: valor.GestorDesc };
                    return obj
                })

                let Grupos = Gestor.filter((obj, pos) => {
                    return Gestor.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })

                // console.log(Distribuidor)
                // console.log(Gestor)
                // console.log(Grupos)
                
                setState(s => ({ ...s, optDistribuidor: Distribuidor }))
                setState(s => ({ ...s, optGestor: Grupos }))

                console.log(`optDistribuidor`)
                console.log(optDistribuidor)
            })
            .catch(() => {
                setState(s => ({ ...s, optDistribuidor: [] }))
                setState(s => ({ ...s, optGestor: [] }))
            })
    }

    // se comenta ya que el select ahora se llena de la constante  /FnGetDistribuidor
    // const FnGetGestores = () => {
    //     setState(s => ({ ...s }))
    //     Funciones.getGestorCobranza(props.oidc, idRelMesaCredProd)
    //         .then((respuesta: any) => {
    //             var Gestor = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.GestorCobranzaID, label: valor.NombreCompleto };
    //                 return obj

    //             });

    //             setState(s => ({ ...s, optGestor: Gestor }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, optGestor: [] }))
    //         })
    // }}


    const FnGetSucursales = () => {
        setState(s => ({ ...s }))
        Funciones.getSucursales(props.oidc)
            .then((respuesta: any) => {
                var Sucursal = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    //console.log(obj, 'ABC')
                    return obj

                });

                setState(s => ({ ...s, optSucursal: Sucursal }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursal: [] }))
            })
    }

    const FnGetGrupos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetGrupo(props.oidc)
            .then((respuesta: any) => {
                var Grupo = respuesta.map((valor: any) => {
                    var obj = { value: valor.ClasificadorGrupoID, label: valor.Descripcion };
                    //console.log(obj, 'ABC')
                    return obj

                });

                setState(s => ({ ...s, optGrupo: Grupo }))
            })
            .catch(() => {
                setState(s => ({ ...s, optGrupo: [] }))
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

    const FnAsignaGestorMonitoreo = (DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string, Grupo: string, ClasificadorGrupoID: number, ColorReferenciasAvales: string, ProductoID: number, idRelMesaCredProd, Sucursal: string, MesaCobranzaID: number) => {

        Funciones.ValidarBit(props.oidc, idRelMesaCredProd, 0, 1)
            .then(() => {

                Funciones.ValidacionAsignaGestor(props.oidc, DistribuidorID, MesaCobranzaID, ProductoID)
                    .then(() => {

                        setState(s => ({
                            ...s, CFormReferencias: false,
                            Form: {
                                ...state.Form, Mostrar: true,
                                Datos: { DistribuidorID, DistribuidorDesc, SucursalDesc, DiasAtraso, GestorId, GestorDesc, ColorAsignaGestor, ColorReferencias, Grupo, ClasificadorGrupoID, ColorReferenciasAvales, ProductoID, idRelMesaCredProd, Sucursal, MesaCobranzaID, AsignGestorMesaCobranzaID: 0, AsignGestorMesaCobranzaDesc: '' ,FechaHoraAsignacion:new Date},
                            }

                        }))

                    })
                    .catch((error: any) => {
                        if (error.response)
                            toast.error(`Response: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                        setLoading(false)
                    })

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })
    }

    const FnExpedienteMonitoreo = (DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string, Grupo: string, ClasificadorGrupoID: number, ColorReferenciasAvales: string, ProductoID: number, MesaCobranzaID: number) => {

        Funciones.ValidarBit(props.oidc, idRelMesaCredProd, 0, 1)
            .then(() => {

                Funciones.ValidacionAsignaGestor(props.oidc, DistribuidorID, MesaCobranzaID, ProductoID)
                    .then(() => {



                        setState(s => ({
                            ...s, ...s, CFormDocumentos: true,
                            Form: {
                                ...state.Form, Mostrar: false,
                                Datos: { DistribuidorID, DistribuidorDesc, SucursalDesc, DiasAtraso, GestorId, GestorDesc, ColorAsignaGestor, ColorReferencias, Grupo, ClasificadorGrupoID, ColorReferenciasAvales, ProductoID, idRelMesaCredProd, Sucursal: '', MesaCobranzaID: 0, AsignGestorMesaCobranzaID: 0, AsignGestorMesaCobranzaDesc: '' ,FechaHoraAsignacion:new Date},
                            }

                        }))

                    })
                    .catch((error: any) => {
                        if (error.response)
                            toast.error(`Response: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                        setLoading(false)
                    })

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })

    }

    const FnReferenciaMonitoreo = (DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string, Grupo: string, ClasificadorGrupoID: number, ColorReferenciasAvales: string, ProductoID: number, MesaCobranzaID: number) => {

        Funciones.ValidarBit(props.oidc, idRelMesaCredProd, 0, 1)
            .then(() => {

                Funciones.ValidacionAsignaGestor(props.oidc, DistribuidorID, MesaCobranzaID, ProductoID)
                    .then(() => {

                        setState(s => ({
                            ...s, ...s, CFormReferencias: true,
                            Form: {
                                ...state.Form, Mostrar: false,
                                Datos: { DistribuidorID, DistribuidorDesc, SucursalDesc, DiasAtraso, GestorId, GestorDesc, ColorAsignaGestor, ColorReferencias, Grupo, ClasificadorGrupoID, ColorReferenciasAvales, ProductoID, idRelMesaCredProd, Sucursal: '', MesaCobranzaID: 0, AsignGestorMesaCobranzaID: 0, AsignGestorMesaCobranzaDesc: '' ,FechaHoraAsignacion:new Date},
                            }

                        }))

                    })
                    .catch((error: any) => {
                        if (error.response)
                            toast.error(`Response: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                        setLoading(false)
                    })

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })

    }

    const FnReferenciaAvalMonitoreo = (DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string, Grupo: string, ClasificadorGrupoID: number, ColorReferenciasAvales: string, ProductoID: number, MesaCobranzaID: number) => {

        Funciones.ValidarBit(props.oidc, idRelMesaCredProd, 0, 1)
            .then(() => {

                Funciones.ValidacionAsignaGestor(props.oidc, DistribuidorID, MesaCobranzaID, ProductoID)
                    .then(() => {

                        setState(s => ({
                            ...s, ...s, CFormReferenciasAvales: true,
                            Form: {
                                ...state.Form, Mostrar: false,
                                Datos: { DistribuidorID, DistribuidorDesc, SucursalDesc, DiasAtraso, GestorId, GestorDesc, ColorAsignaGestor, ColorReferencias, Grupo, ClasificadorGrupoID, ColorReferenciasAvales, ProductoID, idRelMesaCredProd, Sucursal: '', MesaCobranzaID: 0, AsignGestorMesaCobranzaID: 0, AsignGestorMesaCobranzaDesc: '' ,FechaHoraAsignacion:new Date},
                            }

                        }))

                    })
                    .catch((error: any) => {
                        if (error.response)
                            toast.error(`Response: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                        setLoading(false)
                    })

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })

    }

    const FnDireccion = (DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string, Grupo: string, ClasificadorGrupoID: number, ColorReferenciasAvales: string, ProductoID: number, MesaCobranzaID: number) => {

        Funciones.ValidarBit(props.oidc, idRelMesaCredProd, 0, 2)
            .then(() => {

                Funciones.ValidacionAsignaGestor(props.oidc, DistribuidorID, MesaCobranzaID, ProductoID)
                    .then(() => {

                        setState(s => ({
                            ...s, ...s, CFormDireccion: true,
                            Form: {
                                ...state.Form, Mostrar: false,
                                Datos: { DistribuidorID, DistribuidorDesc, SucursalDesc, DiasAtraso, GestorId, GestorDesc, ColorAsignaGestor, ColorReferencias, Grupo, ClasificadorGrupoID, ColorReferenciasAvales, ProductoID, idRelMesaCredProd, Sucursal: '', MesaCobranzaID: 0, AsignGestorMesaCobranzaID: 0, AsignGestorMesaCobranzaDesc: '', FechaHoraAsignacion:new Date},
                            }

                        }))

                    })
                    .catch((error: any) => {
                        if (error.response)
                            toast.error(`Response: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                        setLoading(false)
                    })

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })

    }

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Sucursaldesc',
                selector: 'SucursalDesc',
                sortable: false,
                center: true,
                width: '8%',

                cell: (props) => <span className="text-center"><strong>{props.SucursalDesc}</strong></span>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Sucursal',
                selector: 'Sucursal',
                sortable: true,
                center: true,
                width: '7%',
                cell: (props) =>
                    <div style={{ width: '100%', textAlign: 'center' }} className='LabelInDTable'>
                        <label style={{ fontSize: '.75em' }}>
                            {props.Sucursal}
                        </label>
                    </div>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],

            },

            {
                name: 'Grupo',
                selector: 'Grupo',
                sortable: false,
                center: true,
                width: '7%',
                cell: (props) =>
                    <>
                        <label data-tip data-for={`GR_${props.Grupo}`} className="text-center" >
                            {props.Grupo}
                        </label>

                        <ReactTooltip id={`GR_${props.Grupo}`} type="info" effect="solid">
                            {props.Grupo}
                        </ReactTooltip>
                    </>,

                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },
                    },
                ],
            },


            {
                name: 'SociaID',
                selector: 'DistribuidorID',
                sortable: false,
                width: '7%',
                center: true,
                cell: (props) => <span>{props.DistribuidorID}</span>,

                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },
                    },

                ],
            },

            {
                name: 'Asigna Gestor',
                selector: '',
                sortable: false,
                width: '7%',
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <div className='radiusSmallDiv'>
                        <div className={`divInDTable text-center ${props.ColorAsignaGestor != 'GREEN' ? 'pulsingButton' : ''}`}>
                            <button data-tip data-for={`AA_${props.DistribuidorID}`} className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                FnAsignaGestorMonitoreo(props.DistribuidorID, props.DistribuidorDesc, props.SucursalDesc, props.DiasAtraso, props.GestorId, props.GestorDesc, props.ColorAsignaGestor, props.ColorReferencias, props.Grupo, props.ClasificadorGrupoID, props.ColorReferenciasAvales, props.ProductoID, idRelMesaCredProd, props.Sucursal, state.MesaCobranzaID)

                            }
                            } >
                                <FaUserPlus color={props.ColorAsignaGestor} size={20} />
                            </button>
                            <ReactTooltip id={`AA_${props.DistribuidorID}`} type="info" effect="solid">
                                {props.ColorAsignaGestor === 'GREEN' ? 'Re' : ''}Asignar Gestor a {props.DistribuidorDesc}
                            </ReactTooltip>
                        </div>
                    </div>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'


                        },

                    },
                ],
            },

            {
                name: 'Socia',
                selector: 'DistribuidorDesc',
                sortable: false,
                width: '8%',
                center: true,
                cell: (props) => <>
                    <label data-tip data-for={`SO_${props.DistribuidorDesc}`} className="text-center" >
                        {props.DistribuidorDesc}
                    </label>

                    <ReactTooltip id={`SO_${props.DistribuidorDesc}`} type="info" effect="solid">
                        {props.DistribuidorDesc}
                    </ReactTooltip>
                </>,

                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'


                        },

                    },
                ],
            },
            {
                name: 'FHAsign',
                selector: 'FechaHoraAsignacion',
                sortable: false,
                width: '8%',
                center: true,
                cell: (props) => <span className="LabelInDTable">{props.FechaHoraAsignacion}</span>,
                    // {/* <label data-tip data-for={`SO_${props.FechaHoraAsignacion}`} className="text-center" >
                    //     {props.FechaHoraAsignacion}
                    // </label> */}

                    // <ReactTooltip id={`SO_${props.FechaHoraAsignacion}`} type="info" effect="solid">
                    //     {props.FechaHoraAsignacion}
                    // </ReactTooltip>,
                

                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'


                        },

                    },
                ],
            },

            {
                name: 'Gestor',
                selector: 'GestorDesc',
                sortable: false,
                width: '8%',
                center: true,
                cell: (props) => <>
                    <label data-tip data-for={`GE_${props.GestorDesc}`} className="text-center" >
                        {props.GestorDesc}
                    </label>

                    <ReactTooltip id={`GE_${props.GestorDesc}`} type="info" effect="solid">
                        {props.GestorDesc}
                    </ReactTooltip>
                </>,

                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'


                        },

                    },
                ],
            },

            {
                name: 'MesaCob.',
                selector: 'AsignGestorMesaCobranzaDesc',
                sortable: false,
                center: true,
                width: '8%',
                cell: (props) => <>
                    <label data-tip data-for={`ME_${props.AsignGestorMesaCobranzaDesc}`} className="text-center" >
                        {props.AsignGestorMesaCobranzaDesc}
                    </label>

                    <ReactTooltip id={`ME_${props.AsignGestorMesaCobranzaDesc}`} type="info" effect="solid">
                        {props.AsignGestorMesaCobranzaDesc}
                    </ReactTooltip>
                </>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'DiasAtr',
                selector: 'DiasAtraso',
                sortable: false,
                width: '6%',
                center: true,
                cell: (props) => <span>{props.DiasAtraso}</span>,

                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'TipoCob.',
                selector: 'TipoCobranzaDescCorto',
                sortable: false,
                width: '6%',
                center: true,
                //cell: (props) => <span>{props.TipoCobranza == 'MANUAL' ? 'M' : props.TipoCobranza == 'AUTOMATICO' ? 'A' : ''}</span>,
                cell: (props) => <span>{props.TipoCobranzaDescCorto}</span>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Dir.',
                selector: '',
                sortable: false,
                width: '7%',
                //center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`RT_${props.DistribuidorID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                FnDireccion(props.DistribuidorID, props.DistribuidorDesc, props.SucursalDesc, props.DiasAtraso, props.GestorId, props.GestorDesc, props.ColorAsignaGestor, props.ColorReferencias, props.Grupo, props.ClasificadorGrupoID, props.ColorReferenciasAvales, props.ProductoID, state.MesaCobranzaID)

                                // setState(s => ({
                                //     ...s, CFormDireccion: true,
                                //     Form: {
                                //         ...state.Form, Mostrar: false,
                                //         Datos: { DistribuidorID: props.DistribuidorID, DistribuidorDesc: props.DistribuidorDesc, SucursalDesc: props.SucursalDesc, DiasAtraso: props.DiasAtraso, GestorId: props.GestorId, GestorDesc: props.GestorDesc, ColorAsignaGestor: props.ColorAsignaGestor, ColorReferencias: props.ColorReferencias, Grupo: props.Grupo, ClasificadorGrupoID: props.ClasificadorGrupoID, ColorReferenciasAvales: props.ColorReferenciasAvales, ProductoID: props.ProductoID, idRelMesaCredProd },
                                //         Id: props.DistribuidorID,
                                //     }
                                // }))
                            }
                            } >
                                {/* <FaHouseDamage color={props.ColorReferencias} /> */}
                                <FaHouseDamage color='GREEN' size={17} />
                            </button>
                        </div>

                        <ReactTooltip id={`RT_${props.DistribuidorID}`} type="info" effect="solid">
                            Direccion de Socia: {props.DistribuidorDesc}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },


            {
                name: 'Expe.',
                selector: '',
                sortable: true,
                width: "7%",
                //center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`DT_${props.DistribuidorID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" onClick={() => {

                                FnExpedienteMonitoreo(props.DistribuidorID, props.DistribuidorDesc, props.SucursalDesc, props.DiasAtraso, props.GestorId, props.GestorDesc, props.ColorAsignaGestor, props.ColorReferencias, props.Grupo, props.ClasificadorGrupoID, props.ColorReferenciasAvales, props.ProductoID, state.MesaCobranzaID)

                                // setState(s => ({
                                //     ...s, CFormDocumentos: true,
                                //     Form: {
                                //         ...state.Form, Mostrar: false,
                                //         Datos: { DistribuidorID: props.DistribuidorID, DistribuidorDesc: props.DistribuidorDesc, SucursalDesc: props.SucursalDesc, DiasAtraso: props.DiasAtraso, GestorId: props.GestorId, GestorDesc: props.GestorDesc, ColorAsignaGestor: props.ColorAsignaGestor, ColorReferencias: props.ColorReferencias, Grupo: props.Grupo, ClasificadorGrupoID: props.ClasificadorGrupoID, ColorReferenciasAvales: props.ColorReferenciasAvales, ProductoID: props.ProductoID },
                                //         Id: props.DistribuidorID,
                                //     }
                                // }))
                            }
                            } >
                                <FaFile color="GREEN" size={17} /></button>
                        </div>
                        <ReactTooltip id={`DT_${props.DistribuidorID}`} type="info" effect="solid">
                            Expediente de Socia: {props.DistribuidorDesc}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Ref.',
                selector: '',
                sortable: true,
                width: '7%',
                // center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`RR_${props.DistribuidorID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                FnReferenciaMonitoreo(props.DistribuidorID, props.DistribuidorDesc, props.SucursalDesc, props.DiasAtraso, props.GestorId, props.GestorDesc, props.ColorAsignaGestor, props.ColorReferencias, props.Grupo, props.ClasificadorGrupoID, props.ColorReferenciasAvales, props.ProductoID, state.MesaCobranzaID)

                                // setState(s => ({
                                //     ...s, CFormReferencias: true,
                                //     Form: {
                                //         ...state.Form, Mostrar: false,
                                //         Datos: { DistribuidorID: props.DistribuidorID, DistribuidorDesc: props.DistribuidorDesc, SucursalDesc: props.SucursalDesc, DiasAtraso: props.DiasAtraso, GestorId: props.GestorId, GestorDesc: props.GestorDesc, ColorAsignaGestor: props.ColorAsignaGestor, ColorReferencias: props.ColorReferencias, Grupo: props.Grupo, ClasificadorGrupoID: props.ClasificadorGrupoID, ColorReferenciasAvales: props.ColorReferenciasAvales, ProductoID: props.ProductoID },
                                //         Id: props.DistribuidorID,
                                //     }
                                // }))
                            }
                            } >
                                <FaPhoneAlt color={props.ColorReferencias} size={17} />
                            </button>
                        </div>
                        <ReactTooltip id={`RR_${props.DistribuidorID}`} type="info" effect="solid">
                            Referencia de Socia: {props.DistribuidorDesc}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Avales',
                selector: '',
                sortable: true,
                width: '7%',
                //center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`AV_${props.DistribuidorID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                FnReferenciaAvalMonitoreo(props.DistribuidorID, props.DistribuidorDesc, props.SucursalDesc, props.DiasAtraso, props.GestorId, props.GestorDesc, props.ColorAsignaGestor, props.ColorReferencias, props.Grupo, props.ClasificadorGrupoID, props.ColorReferenciasAvales, props.ProductoID, state.MesaCobranzaID)


                                // setState(s => ({
                                //     ...s, CFormReferenciasAvales: true,
                                //     Form: {
                                //         ...state.Form, Mostrar: false,
                                //         Datos: { DistribuidorID: props.DistribuidorID, DistribuidorDesc: props.DistribuidorDesc, SucursalDesc: props.SucursalDesc, DiasAtraso: props.DiasAtraso, GestorId: props.GestorId, GestorDesc: props.GestorDesc, ColorAsignaGestor: props.ColorAsignaGestor, ColorReferencias: props.ColorReferencias, Grupo: props.Grupo, ClasificadorGrupoID: props.ClasificadorGrupoID, ColorReferenciasAvales: props.ColorReferenciasAvales, ProductoID: props.ProductoID },
                                //         Id: props.DistribuidorID,
                                //     }
                                // }))
                            }
                            } >
                                <FaPhoneAlt color={props.ColorReferenciasAvales} size={17} />
                            </button>
                        </div>

                        <ReactTooltip id={`AV_${props.DistribuidorID}`} type="info" effect="solid">
                            Referencia Aval de socia: {props.DistribuidorDesc}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [

                    {
                        when: row => row.AsignGestorMesaCobranzaID != state.MesaCobranzaID && row.AsignGestorMesaCobranzaID > 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f07865',
                        }
                    },

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },
                    },
                ],
            },
        ]


    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetDistribuidor()
        // FnGetGestores()
        // FnGetGestorFiltro(DatosDefecto)
        FnGetSucursales()
        FnGetGrupos()
        FnTipoCobranza()
        //FnConsolidadoDictamen()
        FNGetRelacionMesa()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        FnFiltrando()
        setState(s => ({ ...s, DatosMostrar: s.Datos }))
    }, [state.FiltroSucursal, state.FiltroGestor, state.FiltroGrupo, state.FiltroDistribuidor, state.FiltroTipoCobranza,startDate, endDate])

    // On use effect
    // React.useEffect(() => {
    //     setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    //     FnFiltrando()
    // }, [state.Datos])

    // React.useEffect(() => {
    //     setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    //     FnFiltrando()
    // }, [state.pruebas, state.Filtro])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: s.Datos }))
        // FnFiltrando()
    }, [state.Datos])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', SucursalDesc: '', DiasAtraso: 0, GestorId: 0, GestorDesc: '', ColorAsignaGestor: '', ColorReferencias: '', Grupo: '', ClasificadorGrupoID: 0, ColorReferenciasAvales: '', ProductoID: 0, idRelMesaCredProd: 0, Sucursal: '', MesaCobranzaID: 0, AsignGestorMesaCobranzaID: 0, AsignGestorMesaCobranzaDesc: '',FechaHoraAsignacion:new Date } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        let DistribuidorMora = state.Datos.find(Dato => Dato.DistribuidorID === item.DistribuidorID)
        console.log(DistribuidorMora, 'bbbbbbb')
        let itemAuxiliar = { ...item, SucursalDesc: DistribuidorMora.SucursalDesc }
        console.log(itemAuxiliar, 'cccccccccc')
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.DistribuidorID === itemAuxiliar.DistribuidorID ? itemAuxiliar : Dato), respuesta: state.respuesta.map(Dato => Dato.DistribuidorID === itemAuxiliar.DistribuidorID ? itemAuxiliar : Dato), Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', SucursalDesc: '', DiasAtraso: 0, GestorId: 0, GestorDesc: '', ColorAsignaGestor: '', ColorReferencias: '', Grupo: '', ClasificadorGrupoID: 0, ColorReferenciasAvales: '', ProductoID: 0, idRelMesaCredProd: 0, Sucursal: '', MesaCobranzaID: 0, AsignGestorMesaCobranzaID: 0, AsignGestorMesaCobranzaDesc: '' ,FechaHoraAsignacion:new Date} } })
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false }, CFormReferencias: false, CFormDocumentos: false, CFormReferenciasAvales: false, CFormDireccion: false })

    // AQUI EMPIEZAN LA PARTE DE LOS FILTROS
    const fnGetFiltrosGestor = (GestorCobranzaID: number) => {
        setState(s => ({ ...s, FiltroGestor: GestorCobranzaID }))
    }

    const fnGetFiltrosSucursal = (SucursalID: number) => {
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }

    const fnGetFiltrosGrupo = (ClasificadorGrupoID: number) => {
        setState(s => ({ ...s, FiltroGrupo: ClasificadorGrupoID }))
    }

    const fnGetFiltrosDistribuidor = (DistribuidorID: number) => {
        setState(s => ({ ...s, FiltroDistribuidor: DistribuidorID }))
    }

    const fnGetFiltroTipoCobranza = (TipoCobranza: number) => {
        setState(s => ({ ...s, FiltroTipoCobranza: TipoCobranza }))
    }

    const FnFiltrando = () => {
        let numFiltro = (state.FiltroGestor, state.FiltroSucursal, state.FiltroGrupo, state.FiltroDistribuidor, state.FiltroTipoCobranza)

        let datosFiltro = state.respuesta

        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))

        if (state.FiltroGestor > 0)
            datosFiltro = datosFiltro.filter(d => { return d.GestorId === state.FiltroGestor })

        if (state.FiltroSucursal > 0)
            datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })

        if (state.FiltroGrupo > 0)
            datosFiltro = datosFiltro.filter(d => { return d.ClasificadorGrupoID === state.FiltroGrupo })

        if (state.FiltroDistribuidor > 0)
            datosFiltro = datosFiltro.filter(d => { return d.DistribuidorID === state.FiltroDistribuidor })

        if (state.FiltroTipoCobranza > 0)
            datosFiltro = datosFiltro.filter(d => { return d.TipoCobranzaID === state.FiltroTipoCobranza })

            
        if (startDate != null && endDate != null) {
            startDate.setHours(0, 0, 0)
            endDate.setHours(23, 59, 59)

            datosFiltro = datosFiltro.filter(d => { return d.FechaFiltro >= startDate.toISOString() && d.FechaFiltro <= endDate.toISOString() || d.FechaFiltro === null })
        }
        // if (state.FiltroTipoCobranza == 1) {
        //     datosFiltro = datosFiltro.filter(d => { return d.TipoCobranza === 'AUTOMATICO' })
        // }
        // else {
        //     datosFiltro = datosFiltro.filter(d => { return d.TipoCobranza === 'MANUAL' })
        // }

        if (datosFiltro.length > 0) {
            FNGetDistri(datosFiltro)
        }

        else {
            setState(s => ({ ...s, Datos: datosFiltro }))
        }
    }

    const FNGetDistri = (respuesta: any) => {

        let tabla: any[] = []
        let SucursalID = 0;
        let ClasificadorGrupoID = 0;

        respuesta.forEach((element: any) => {

            if (SucursalID === element.SucursalID) {

                let detalleSaldos: any = {
                    Capital: element.Capital,
                    ClasificadorGrupoID: element.ClasificadorGrupoID,
                    ColorAsignaGestor: element.ColorAsignaGestor,
                    ColorReferencias: element.ColorReferencias,
                    ColorReferenciasAvales: element.ColorReferenciasAvales,
                    DiasAtraso: element.DiasAtraso,
                    DistribuidorDesc: element.DistribuidorDesc,
                    DistribuidorID: element.DistribuidorID,
                    GestorDesc: element.GestorDesc,
                    GestorId: element.GestorId,
                    Grupo: element.Grupo,
                    MesaCobranzaID: element.MesaCobranzaID,
                    Motivo: element.Motivo,
                    MotivoID: element.MotivoID,
                    ProductoID: element.ProductoID,
                    SaldoActual: element.SaldoActual,
                    SucursalDesc: "",
                    SucursalID: element.SucursalID,
                    TipoCobranza: element.TipoCobranza,
                    Sucursal: element.SucursalDesc,
                    AsignGestorMesaCobranzaDesc: element.AsignGestorMesaCobranzaDesc,
                    FechaHoraAsignacion:element.FechaHoraAsignacion,
                    FechaFiltro: element.FechaFiltro,
                    AsignGestorMesaCobranzaID: element.AsignGestorMesaCobranzaID,
                    TipoCobranzaDescCorto: element.TipoCobranzaDescCorto,
                    TipoCobranzaID: element.TipoCobranzaID
                }

                //Esta parte la pongo para clasificar por grupo en caso de que me lo digan
                //    if (detalleSaldos.ClasificadorGrupoID === ClasificadorGrupoID) {
                //         detalleSaldos.Grupo = "";
                //     }

                tabla.push(detalleSaldos)
                SucursalID = element.SucursalID
                ClasificadorGrupoID = element.ClasificadorGrupoID
                //state.SucursalDesc = element.SucursalDesc

            }
            else {

                let detalleTres: any = {
                    SucursalDesc: element.SucursalDesc,
                    SucursalID: -2,
                }
                tabla.push(detalleTres)

                let detalleSaldos: any = {
                    Capital: element.Capital,
                    ClasificadorGrupoID: element.ClasificadorGrupoID,
                    ColorAsignaGestor: element.ColorAsignaGestor,
                    ColorReferencias: element.ColorReferencias,
                    ColorReferenciasAvales: element.ColorReferenciasAvales,
                    DiasAtraso: element.DiasAtraso,
                    DistribuidorDesc: element.DistribuidorDesc,
                    DistribuidorID: element.DistribuidorID,
                    GestorDesc: element.GestorDesc,
                    GestorId: element.GestorId,
                    Grupo: element.Grupo,
                    MesaCobranzaID: element.MesaCobranzaID,
                    Motivo: element.Motivo,
                    MotivoID: element.MotivoID,
                    ProductoID: element.ProductoID,
                    SaldoActual: element.SaldoActual,
                    SucursalDesc: '',
                    SucursalID: element.SucursalID,
                    TipoCobranza: element.TipoCobranza,
                    Sucursal: element.SucursalDesc,
                    AsignGestorMesaCobranzaDesc: element.AsignGestorMesaCobranzaDesc,
                    FechaHoraAsignacion: element.FechaHoraAsignacion,
                    FechaFiltro: element.FechaFiltro,
                    AsignGestorMesaCobranzaID: element.AsignGestorMesaCobranzaID,
                    TipoCobranzaDescCorto: element.TipoCobranzaDescCorto,
                    TipoCobranzaID: element.TipoCobranzaID
                }
                tabla.push(detalleSaldos)
                SucursalID = element.SucursalID
                ClasificadorGrupoID = element.ClasificadorGrupoID
            }

        });

        setState(s => ({ ...s, Cargando: false, Error: false, Datos: tabla }))
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title={"SOCIAS ATRASOS"} >
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
                                                <div className="d-flex justify-content-end" >
                                                    <div style={{ width: '10%' }}>
                                                        <Link className="btn btn-danger" style={{ width: '3%', height: '3%' }} to={`/app/${id_int}/cobranza/RelacionMesaCobranza`}>Regresar</Link>
                                                    </div>
                                                </div>
                                                <span style={{ width: '300%', color: 'black', height: '200%' }}>  MESA COBRANZA: {state.MesaCobranzaDesc} <br /> ENCARGADO: {state.NombreDirector} <br /> RANGO DE DIAS: {state.limInferiorDias} - {state.limSuperiorDias} </span>
                                                <p></p>
                                                <div className="col-sm-12">
                                                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                        <div>
                                                            <div style={{ float: 'right' }}>
                                                                {/* <button className="btn btn-outline-secondary" type="button"
                                                                    onClick={() => fnValidacion(0, 0, '', 0, '', 0, 0, '', '', 0, 0, false, false, false, false, 2)}
                                                                ><FaPlus /></button>*/}
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                                                                    label="SociaID"
                                                                                    name="DistribuidorDesc"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optDistribuidor}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroDistribuidor}
                                                                                    accion={fnGetFiltrosDistribuidor}
                                                                                />
                                                                            </div>

                                                                            <div style={{ height: '67px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="SucursalID"
                                                                                    name="SucursalID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optSucursal}
                                                                                    addDefault={false}
                                                                                    valor={state.FiltroSucursal}
                                                                                    accion={fnGetFiltrosSucursal}
                                                                                />
                                                                            </div>

                                                                            <div style={{ height: '67px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="GestorCobranzaID"
                                                                                    name={"GestorCobranzaID"}
                                                                                    placeholder="TODOS"
                                                                                     options={state.optGestor}
                                                                                    // options={optGestor.map((item)=>{
                                                                                    //     return(value:{},
                                                                                    //        label:{} )
                                                                                    // })}
                                                                                    
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroGestor}
                                                                                    accion={fnGetFiltrosGestor}
                                                                                />
                                                                            </div>

                                                                            <div style={{ height: '67px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="ClasificadorGrupoID"
                                                                                    name="ClasificadorGrupoID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optGrupo}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroGrupo}
                                                                                    accion={fnGetFiltrosGrupo}
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
                                                                            <div style={{ height: '67px', width: '140px' }}>
                                                                                <DatePickeStart
                                                                                    name={'FechaInicio'}
                                                                                    label={'FH Inicial Asign.'}
                                                                                    disabled={loading}
                                                                                    placeholder={'Inicio'}
                                                                                    isClearable startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    setStartDate={setStartDate}
                                                                                />
                                                                            </div>

                                                                            <div style={{ height: '67px', width: '140px' }}>
                                                                                <DatePickeEnd
                                                                                    name={'FechaFinal'}
                                                                                    label={'FH Final Asign.'}
                                                                                    disabled={loading}
                                                                                    placeholder={'Final'}
                                                                                    isClearable startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    setEndDate={setEndDate} />
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
                                        // paginationServer={true}
                                        // paginationTotalRows={state.DatosMostrar.length}
                                        responsive
                                        //keyField={"DistribuidorID"}
                                        // defaultSortField={"SucursalID"}
                                        columns={Columns}
                                    />
                                    {state.Form.Mostrar && <ModalWin open={state.Form.Mostrar} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>ASIGNAR GESTOR <br /> SOCIA: {state.Form.Datos.DistribuidorID} &nbsp; {state.Form.Datos.DistribuidorDesc}</h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAsignaGestor
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                optGestor={state.optGestor}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

                                    {state.CFormReferencias && <ModalWin open={state.CFormReferencias} large center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>REFRENCIAS <br /> SOCIA: {state.Form.Datos.DistribuidorID} &nbsp; {state.Form.Datos.DistribuidorDesc} </h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormReferencias
                                                oidc={props.oidc}
                                                //initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                DistribuidorID={state.Form.Datos.DistribuidorID}
                                            // optGestor={state.optGestor}
                                            // Prueba={state.Prueba}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

                                    {state.CFormDocumentos && <ModalWin open={state.CFormDocumentos} large center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}> DOCUMENTOS <br /> SOCIA: {state.Form.Datos.DistribuidorID} &nbsp; {state.Form.Datos.DistribuidorDesc} </h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormDocumentos
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                optGestor={state.optGestor}
                                                Prueba={state.Prueba}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

                                    {state.CFormReferenciasAvales && <ModalWin open={state.CFormReferenciasAvales} large center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>REFRENCIAS AVALES <br /> SOCIA: {state.Form.Datos.DistribuidorID} &nbsp; {state.Form.Datos.DistribuidorDesc} </h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormReferenciasAvales
                                                oidc={props.oidc}
                                                //initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                DistribuidorID={state.Form.Datos.DistribuidorID}
                                            //optGestor={state.optGestor}
                                            //Prueba={state.Prueba}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

                                    {state.CFormDireccion && <ModalWin open={state.CFormDireccion} large center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>DIRECCION <br /> SOCIA: {state.Form.Datos.DistribuidorID} &nbsp; {state.Form.Datos.DistribuidorDesc} </h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormDireccion
                                                oidc={props.oidc}
                                                DistribuidorID={state.Form.Datos.DistribuidorID}
                                                GestorID={0}
                                                idRelMesaCredProd={idRelMesaCredProd}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

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
export default connect(mapStateToProps, mapDispatchToProps)(Distribuidores);
