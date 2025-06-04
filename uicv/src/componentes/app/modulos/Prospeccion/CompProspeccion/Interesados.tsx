import React, { useEffect, useState } from 'react'

// Tabla
import DataTable, { IDataTableColumn } from 'react-data-table-component'

// Formas
import { Form, Formik } from 'formik'

// Componentes personalizados
import { Card, CustomFieldText2, ModalWin, Spinner } from '../../../../global'
import { Escolaridad, EstadoCivil, Ocupaciones, Sexos, StatusProceso } from '../../../../selectores'
import { FiltrarDatos } from '../../../../../global/functions'

// Estado
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as RAcciones from '../../../../../redux/cache/acciones'

// Iconos
import { BiSearchAlt, BiUserPlus } from 'react-icons/bi'
import { FaFilter, FaUser, FaCircle, FaCheck, FaPlus, FaSearch } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

// Sub-Componentes
//import * as Funciones from './CompPersonas/Funciones'

// Notificaciones
import { toast } from 'react-toastify'
import moment from 'moment'
// Router
import { Link, Redirect, useHistory, useParams } from 'react-router-dom'
import { DBConfia_Prospeccion } from '../../../../../interfaces_db/DBConfia/Prospeccion'

//Form
import * as Funciones from './Interesados/Funciones'
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { FiRefreshCcw } from 'react-icons/fi'
import ReactTooltip from 'react-tooltip'
import { AgregarConPersona } from './Interesados/AgregarConPersona'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { AgregarPosPros } from './AgregarProsPos'
import { AgregarIntPros } from './AgregarInteeresadoProspeccion'
import { PerfilProspecto } from './Prospectos/PerfilProspecto'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos'
import { DBConfia_General } from '../../../../../interfaces_db/DBConfia/General'
import { iUI } from '../../../../../interfaces/ui/iUI'
// Cache property
type ProspectosType = {

    oidc: IOidc,
    ui: iUI
}

type EstadoTipo = {
    Datos: {
        DatosEdit?: DBConfia_Prospeccion.IProspectosDatosGenereles_VW,
        DatosPerfil?: DBConfia_Prospeccion.IProspectosDatosGenereles_VW,
        DatosSocioeconomicos?: DBConfia_Prospeccion.IProspectosDatosSocioeconomicos_VW,
    }
}



const Interesados = (props: ProspectosType) => {

    const history = useHistory();
    const [gerenteId, setGerenteId] = useState(null)

    type paramType = { productoId: string }
    let { productoId } = useParams<paramType>()
    let id_int: number = parseInt(productoId as string)
    const [forma, setforma] = useState(false);
    const [modalPersona, setModalPersona] = useState(false);
    const [pInteresada, setInteresado] = useState(0);
    const [curp, setCurp] = useState(false);

    const MySwal = withReactContent(Swal)
    let isMounted = React.useRef(true)

    const Datos: any[] = [];
    const DatosMostrar: any[] = [];
    const [DatosPerfil, setDatosPerfil] = useState<EstadoTipo>({
        Datos: {
            DatosPerfil: undefined,
            DatosSocioeconomicos: undefined
        }
    })
    const [state, setState] = useState({
        Datos,
        Filtro: '',
        DatosGenerales: undefined,
        DatosMostrar,
        Cargando: true,
        Error: false,
        FormaAgregar: false,
        Item: undefined,
        InteresadosID: 0,
        NombreInteresado: '',
        Forma: false,
        Mostrar: false,
        defaultSortAsc: true,
        defaultSortField: undefined,
        paginationDefaultPage: 1
    })
    const [varGerente, setGerente] = useState(false);
    // const FNGetPerfilInteresado = () => {
    //    Funciones.FNGetInteresados()
    // }

    const verificarGerente = () => {
        setState((s) => ({ ...s, Cargando: true }));

        Funciones.VerficarGerente(props.oidc)
            .then((respuesta: any) => {
                setGerenteId(respuesta.GerenteID)
                if (respuesta == null || respuesta == '' || respuesta == undefined) {
                    setGerente(false)
                    FNGetLocal()
                    ConsultarPersona()
                }
                else {
                    Consultagerente(respuesta.GerenteID)
                    setState((s) => ({ ...s, Cargando: false }))

                }
            })
            .catch((error: any) => {
                setState((s) => ({ ...s, Cargando: false }))

            })
    }

    const FNGetInteresado = (interesado: number) => {
        verificarGerente();
        console.log(interesado)
        Funciones.FNGetInteresadosEdit(props.oidc, interesado)
            .then((respuesta: any) => {
                console.log(respuesta)
                setState((s) => ({
                    ...s,
                    Cargando: false,
                    Error: false,
                    DatosGenerales: respuesta,

                }));

                setforma(true);
                setModalPersona(true);


            })
            .catch(() => {
                console.log(state.Cargando)
                setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));

            });

    }

    // const FNGetInteresadoGerente = (interesado:number) => {
    // console.log(interesado)
    //     Funciones.FNGetInteresadosEditGerente(props.oidc, interesado)
    //     .then((respuesta: any) => {
    //         console.log(respuesta)
    //         setState((s) => ({
    //             ...s,
    //             Cargando: false,
    //             Error: false,
    //             DatosGenerales: respuesta,

    //             }));

    //         setforma(true);
    //         setModalPersona(true);

    //     })
    //     .catch(() => {
    //         if (isMounted.current === true) {
    //             setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
    //         }
    //         });

    //         }

    const Consultagerente = (GereneteId) => {
        Funciones.FNGetinteresadosgerente(props.oidc, GereneteId)
            .then((respuesta: any) => {
                console.log(respuesta)
                setState((s) => ({
                    ...s,
                    Cargando: false,
                    Error: false,
                    Datos: respuesta,
                    DatosGenerales: respuesta,
                }));

            })
            .catch((error: any) => {
                console.log(error)
            })
    }

    const ConsultarPersona = async () => {
        Funciones.FNObtenerPersona(props.oidc, 11118)
            .then((respuesta: any) => {
                console.log('00', respuesta)

                setDatosPerfil(e => ({
                    ...e,
                    Datos: {
                        ...e.Datos, DatosPerfil: respuesta.DatosGenerales,
                        DatosSocioeconomicos: respuesta.DatosSocioeconomicos
                    },
                }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
            })
    }

    const FNGetLocal = () => {
        setState((s) => ({ ...s, Cargando: true }));
        Funciones.FNGetInteresados(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta)

                setState((s) => ({
                    ...s,
                    Cargando: false,
                    Error: false,
                    Datos: respuesta,
                    DatosGenerales: respuesta,
                }));


            })
            .catch(() => {
                if (isMounted.current == true) {
                    setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));

                }
            });
        console.log(`datos get`)
        console.log(Datos)
    };

    const FnCambiarEstt = (InteresadosID: number, InicioProceso: boolean) => {
        Funciones.FNUpdate(props.oidc, { InteresadosID, InicioProceso })
            .then((respuesta: any) => {
                toast.success('Se Inicio Proceso')
                cbActualizarDetalle(respuesta)
                console.log("Validado correctamente")
                // FNGetLocal()
            })
            .catch(() => {
                toast.error("Ocurrio un Error, vuelva a intentarlo.")
                console.log("No se valido")
            })
    }

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        if (item.res == 1) {
            if (gerenteId !== null) {
                toast.success(item.msj)
                setState(s => ({ ...s, FormaAgregar: false }))
                verificarGerente();
            } else {
                toast.success(item.msj)
                setState(s => ({ ...s, FormaAgregar: false }))
                FNGetLocal()
            }
        }

        if (item.res == 2) {
            toast.warning(item.msj)
        }
    }
    const cbAgregar2 = (item: any) => {
        console.log('item: ', item, pInteresada)
        console.log(item)
        // console.log(item.data.PersonaID)

        if (item.res == 1) {
            console.log("Esta es la persona interesada: ", pInteresada, item.Data.PersonaID)
            FnCambiarEstt(pInteresada, true)
            toast.success(item.msj)
            setforma(false)
            history.push(`/app/${id_int}/promotor/Prospecto/${item.Data.PersonaID}`)

        }
        if (item.res == 2) {
            toast.warning(item.msj)
        }
    }

    const cbActualizarDetalle = (item: any) => {
        setState({ ...state, Datos: state.DatosMostrar.map(Dato => Dato.InteresadosID === item.InteresadosID ? item : Dato) })
    }

    /** funcion para cancelar */
    const fnCancelar = () => setState(s => ({ ...s, FormaAgregar: false, item: undefined }))
    const fnCancelarForma = () => { setforma(false) }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID', selector: 'InteresadosID', center: true, width: '5%',
                    cell: (props) => <span className="text-center" style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '20px' }}>{props.InteresadosID}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.InicioProceso == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green'
                            },

                        },
                    ],
                },
                {
                    name: 'Nombre del Interesado', selector: 'NombreInteresado', center: true, width: '18%',
                    cell: (props) => <span className="text-center" >{props.NombreInteresado}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.InicioProceso == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green',
                            },

                        },
                    ],
                },
                {
                    name: 'Teléfono Móvil', selector: 'TelefonoMovil', center: true, width: '11%',
                    cell: (props) => <span className="text-center">{props.TelefonoMovil}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.InicioProceso == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                color: 'green',
                                fontWeight: 'bold',
                            },

                        },
                    ],
                },
                {
                    name: 'Teléfono Domicilio', selector: 'TelefonoDomicilio', center: true, width: '11%',
                    cell: (props) => <span className="text-center">{props.TelefonoDomicilio > 0 ? props.TelefonoDomicilio : "SIN NÚMERO"}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.InicioProceso == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                color: 'green',
                                fontWeight: 'bold',
                            },

                        },
                    ],
                },
                {
                    name: 'Domicilio', center: true, width: '17%',
                    cell: (props) => <span className="text-center">{props.calle + ', #' + props.numeroExterior + ', ' + props.localidad}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.InicioProceso == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                color: 'green',
                                fontWeight: 'bold',
                            },

                        },
                    ],
                },
                {
                    name: 'Fecha de Captura', selector: 'CreacionFecha', center: true, width: '11%',
                    cell: (cprops) =>
                        <span className="text-center">
                            {moment(cprops.CreacionFecha).utc().format("DD-MM-YYYY hh:mm:ss A")}
                        </span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.InicioProceso == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                color: 'green',
                                fontWeight: 'bold',
                            },

                        },
                    ],
                },
                {
                    name: 'Nombre Captura', selector: 'NombreUsuario', center: true, width: '18%',
                    cell: (props) => <span className="text-center">{props.NombreUsuario}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.InicioProceso == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green'
                            },

                        },
                    ],
                },
                {
                    name: 'Validar prospecto',
                    selector: 'InteresadoID',
                    sortable: true,
                    // width: '7%',
                    cell: (props) =>
                        <div className='radiusSmallDiv'>
                            <div className={`divInDTable text-center ${props.InicioProceso == 1 ? ''
                                : 'pulsingButton'}`}>
                                <button data-tip data-for={`pa_${props.InteresadosID}`}
                                    className="btn btn-outline-default  buttonIconInDTable"
                                    type={"button"}
                                    disabled={props.InicioProceso == 1}
                                    onClick={() => {
                                        MySwal.fire({
                                            title: '<strong>Iniciar Proceso</strong>',
                                            icon: 'question',
                                            html:
                                                <div className="text-center">
                                                    {props.InicioProceso ? 'Se Cancelará Proceso ¿Desea continuar?' : 'Se Iniciará Proceso ¿Desea continuar?'}
                                                </div>,
                                            showCloseButton: false,
                                            showCancelButton: true,
                                            showConfirmButton: true,
                                            focusConfirm: false,
                                            cancelButtonText: 'Cancelar',
                                            confirmButtonText: 'Aceptar',
                                            confirmButtonAriaLabel: 'Aceptar',
                                            cancelButtonAriaLabel: ''
                                        }).then((result) => {
                                            if (result.isConfirmed) {

                                                console.log("Peticion interesado gerente", props.InteresadosID, gerenteId)

                                                FNGetInteresado(props.InteresadosID);
                                                setInteresado(props.InteresadosID);
                                            }

                                        })
                                    }} >
                                    <FaCheck color="green"
                                        size={10} />
                                </button>
                                <ReactTooltip id={`pa_${props.InteresadosID}`}
                                    type="info"
                                    effect="solid">
                                    {props.InicioProceso == 1 ? 'ACTIVADA COMO SOCIA' : `EN PROCESO DE ACTIVACIÓN`}
                                </ReactTooltip>
                            </div>
                        </div>,
                    conditionalCellStyles: [
                        {
                            when: row => row.InicioProceso == 1,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#d2f8d2',
                                fontWeight: 'bold',
                                color: 'green'
                            },

                        },
                    ],

                },

            ]
        return colRet
    }, [])

    const FNConsultarCURP_Habilitada = () => {
        Funciones.FNConsultarEstatusCURP(props.oidc)
            .then((res: any) => {
                let statusCurp = parseInt(res) === 1 ? true : false;
                setCurp(statusCurp);
            })
            .catch((error: any) => {
                if (!error.response.status) toast.error(`Error: ${error.response.msj}`);
                else if (error.request) toast.error(`Error 404`);
                else toast.error(`Error al consultar el estado de CURP`);
            });
    };

    useEffect(() => {
        verificarGerente();
        FNConsultarCURP_Habilitada();
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title="Interesados">
                        <Card.Body>
                            <Card.Body.Content>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error && (
                                    <div>
                                        {!state.Error && <DataTable
                                            subHeader
                                            subHeaderComponent=
                                            {

                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3" >

                                                            <button style={{ right: '10px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }} className="btn btn-success" type="button" onClick={() => setState(e => ({ ...e, FormaAgregar: true }))}><BiUserPlus size={22} /> AGREGAR NUEVO INTERESADO </button>

                                                            <input style={{ borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} type="text" className="form-control" placeholder="Buscar Personas" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                            <button className="btn btn-outline-secondary" type="button" onClick={() => Consultagerente(2)}><FiRefreshCcw /></button>

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
                                            keyField={"InteresadosID"}
                                            columns={Columns}


                                            paginationPerPage={30}
                                        />}

                                        {state.FormaAgregar &&
                                            <AgregarConPersona oidc={props.oidc} cbActualizar={() => { }} cbGuardar={cbAgregar} fnCancelar={fnCancelar} mostrar={state.FormaAgregar} ProductoID={productoId} />
                                        }

                                        {forma == true &&

                                            <AgregarIntPros
                                                oidc={props.oidc}
                                                cbActualizar={() => { }}
                                                cbGuardar={cbAgregar2}
                                                fnCancelar={fnCancelarForma}
                                                mostrar={forma == true}
                                                Item={state.DatosGenerales}
                                                statusCurp={curp}
                                            />
                                        }


                                        {/* <ModalWin open={false} xlarge={true} center scrollable >
                    {/* <ModalWin.Header>
                        <button type="button" className="delete" onClick={() => console} />
                    </ModalWin.Header> 
                    <ModalWin.Body>
                        
                            <Card Title="Detalles personales">
                                <Card.Body>
                                    <React.Fragment>
                                    {(DatosPerfil.Datos.DatosPerfil !== undefined ) && (DatosPerfil.Datos.DatosSocioeconomicos !== undefined ) && <PerfilProspecto  oidc={props.oidc} iu={props.ui}   DatosGenerales={DatosPerfil.Datos.DatosPerfil} DatosSocioeconomicos={DatosPerfil.Datos.DatosSocioeconomicos} Vehiculos={[]} Experiencia={[]} Referencias={[]} Documentos={[]} Avales={[]} Procesos={[]} Id={0} Editar={true} Validado={true} showDocumentos={function () {
                                                                    throw new Error('Function not implemented.')
                                                                } } showReferencias={function () {
                                                                    throw new Error('Function not implemented.')
                                                                } } showAvales={function (aval: number) {
                                                                    throw new Error('Function not implemented.')
                                                                } } showDatosEconomicos={function () {
                                                                    throw new Error('Function not implemented.')
                                                                } } showDatos={function () {
                                                                    throw new Error('Function not implemented.')
                                                                } }  />}
                                    </React.Fragment>
                                </Card.Body>
                            </Card>
                        
                    </ModalWin.Body>
                </ModalWin> */}

                                    </div>
                                )}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Interesados)
