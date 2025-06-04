import React from 'react'

// Tabla
import DataTable, { IDataTableColumn } from 'react-data-table-component'

// Componentes personalizados
import { Card, Spinner } from '../../../../global'
import { FiltrarDatos } from '../../../../../global/functions'

// Estado
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

// Iconos
import { FaCheck } from 'react-icons/fa'

import { toast } from 'react-toastify'
import moment from 'moment'

//Form
import * as Funciones from './CreditoSolicitudCreditosPersonales/Funciones'
import { FiRefreshCcw } from 'react-icons/fi'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { MdClose } from 'react-icons/md'
import { FormateoDinero } from '../../../../../global/variables';
// Cache property
type ProspectosType = {

    oidc: IOidc,
}

const CreditosSolicitudCreditosPersonales = (props: ProspectosType) => {
    const MySwal = withReactContent(Swal)
    let isMounted = React.useRef(true)

    const Datos: any[] = [];
    const DatosMostrar: any[] = [];

    const [state, setState] = React.useState({
        Datos,
        Filtro: '',
        DatosMostrar,
        Cargando: true,
        Error: false,
        FormaAgregar: false,
        Item: undefined,
        SolicitudCreditosPersonalesID: 0,
        NombreInteresado: '',
        Forma: false,
        Mostrar: false,
    })

    const FNGetLocal = () => {
        setState((s) => ({ ...s, Cargando: true }));
        Funciones.FNGetInteresados(props.oidc)
          .then((respuesta: any) => {

              setState((s) => ({
                ...s,
                Cargando: false,
                Error: false,
                Datos: respuesta,
              }));
            
          })
          .catch(() => {
                
              setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
            
          });
      };

      const FnEstAceptar = (SolicitudCreditosPersonalesID: number) => {
        Funciones.FNAceptar(props.oidc, { SolicitudCreditosPersonalesID })
            .then((respuesta: any) => {
                console.log(respuesta)
                if (respuesta.regresa === 1) {
                    toast.success(`Se creó el crédito con el N° ${respuesta.CreditoId}`)
                    cbActualizarDetalle(respuesta)
                    FNGetLocal()
                }
                else
                {
                    toast.error('Error: ' + respuesta.msj)
                }
            })
            .catch(() => {
                toast.error("Ocurrio un Error, vuelva a intentarlo.")
            })
    }

    const FnEstRechazar = (SolicitudCreditosPersonalesID: number) => {
        Funciones.FNRechazar(props.oidc, { SolicitudCreditosPersonalesID })
            .then((respuesta: any) => {
                toast.success('Se Rechazo Crédito')
                cbActualizarDetalle2(respuesta)
                FNGetLocal()
            })
            .catch(() => {
                toast.error("Ocurrio un Error, vuelva a intentarlo.")
            })
    }

    const cbActualizarDetalle = (item: any) => {
        setState({ ...state, Datos: state.DatosMostrar.map(Dato => Dato.SolicitudCreditosPersonalesID === item.SolicitudCreditosPersonalesID ? item : Dato) })
    }

    const cbActualizarDetalle2 = (item: any) => {
        setState({ ...state, Datos: state.DatosMostrar.map(Dato => Dato.SolicitudCreditosPersonalesID === item.SolicitudCreditosPersonalesID ? item : Dato) })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID', selector: 'SolicitudCreditosPersonalesID', center: true, width: '4%',
                    cell: (props) => <span className="text-center" style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '20px'}}>{props.SolicitudCreditosPersonalesID}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Nombre Socia', selector: 'PersonaNombre', center: true, width: '14%',
                    cell: (props) => <span className="text-center" >{props.PersonaNombre}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Sucursal', selector: 'NombreSucursal', center: true, width: '10%',
                    cell: (props) => <span className="text-center">{props.NombreSucursal}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Caja', selector: 'NombreCaja', center: true, width: '11%',
                    cell: (props) => <span className="text-center">{props.NombreCaja}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Capital', selector: 'Capital', center: true, width: '10%',
                    cell: (props) => <span className="text-center">{FormateoDinero.format(props.Capital)}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Plazos', selector: 'Plazos', center: true, width: '5%',
                    cell: (props) => <span className="text-center">{props.Plazos}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Tipo Desembolso', selector: 'TipoDesembolso', center: true, width: '10%',
                    cell: (props) => <span className="text-center">{props.TipoDesembolso}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Fecha de Solicitud', selector: 'FechaSolicita',  center: true, width: '11%',
                    cell: (cprops) =>
                    <span className="text-center">
                            {moment(cprops.FechaSolicita).utc().format("DD-MM-YYYY hh:mm:ss A")}
                        </span>,
                        conditionalCellStyles: [
                            {
                                when: row => row.Estatus == 0,
                                style: {
                                    textAlign: 'center',
                                    backgroundColor: '#f0f5ee',
                                    color: '#cbcdca'
                                },
                            },
                            {
                                when: row => row.Estatus == 1,
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
                    name: 'Nombre Solicitó', selector: 'UsuarioSolicita', center: true, width: '13%',
                    cell: (props) => <span className="text-center">{props.UsuarioSolicita}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Aceptar Solicitud', selector: 'Estatus', center: true, width: '6%',
                    cell: (props) => 
                    <button className="asstext" type={"button"} 
                    disabled={props.Estatus == 1 || props.Estatus == 0}
                    onClick={() => {
                        MySwal.fire({
                            title: '<strong>Aceptar Solicitud</strong>',
                            icon: 'question',
                            html:
                                <div className="text-center">
                                    {`Se Aceptará Solicitud de Socia: ${props.PersonaNombre} por la cantidad de: $${props.Capital} ¿Desea continuar?`}
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
                                FnEstAceptar(props.SolicitudCreditosPersonalesID)
                            }
                        })
                    }}>
                        {props.Estatus == 0 ? <FaCheck color="#cbcdca" size='14px'/> : ((props.Estatus == 1) ? <FaCheck color="green" size='14px'/> : <FaCheck color="green" size='14px' title='Aceptar'/>)}
                           
                    </button>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 0,
                            style: {
                                textAlign: 'center',
                                backgroundColor: '#f0f5ee',
                                color: '#cbcdca'
                            },
                        },
                        {
                            when: row => row.Estatus == 1,
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
                    name: 'Rechazar Solicitud', selector: 'Estatus', center: true, width: '6%',
                    cell: (props) => 
                    <button className="asstext" type={"button"} 
                    disabled={props.Estatus == 1 || props.Estatus == 0}
                    onClick={() => {
                        MySwal.fire({
                            title: '<strong>Rechazar Solicitud</strong>',
                            icon: 'question',
                            html:
                                <div className="text-center">
                                    {`Se Rechazará Solicitud de Socia: ${props.PersonaNombre} por la cantidad de: $${props.Capital} ¿Desea continuar?`}
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
                                FnEstRechazar(props.SolicitudCreditosPersonalesID)
                            }
                        })
                    }}>
                        {(props.Estatus == 0 ? <MdClose size='20px' color="#cbcdca" /> :(props.Estatus == 1 ? <MdClose size='20px' color="#cbcdca" /> : <MdClose size='20px' color="red" title='Rechazar' />))
                        }
                           
                    </button>,
                   conditionalCellStyles: [
                    {
                        when: row => row.Estatus == 0,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#f0f5ee',
                            color: '#cbcdca'
                        },
                    },
                    {
                        when: row => row.Estatus == 1,
                        style: {
                            textAlign: 'center',
                            backgroundColor: '#d2f8d2',
                            fontWeight: 'bold',
                            color: 'green',
                        },
                    },
                ],
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }, [state.Datos, state.Filtro])

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title="SOLICITUDES CRÉDITOS PERSONALES">
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
                                                            <input style={{borderTopLeftRadius: '5px', borderBottomLeftRadius:'5px'}} type="text" className="form-control" placeholder="Buscar Personas" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                            <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                            keyField={"SolicitudCreditosPersonalesID"}
                                            columns={Columns}
                                           paginationPerPage={30}
                                        />}

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
export default connect(mapStateToProps, mapDispatchToProps)(CreditosSolicitudCreditosPersonales)
