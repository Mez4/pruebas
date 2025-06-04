import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaCheck, FaCircle, FaLock, FaLockOpen, FaMoneyCheckAlt, FaWindowClose } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CustomFieldImgUpload } from '../../../../../global'
import VerDocumento from '../SolicitudesGastosCajera/VerDocumento'
import VerDocumento2 from '../SolicitudesGastosCajera/VerDocumento2'


type CFormType = {
    oidc: IOidc
    Id?: number,
    Solicitante?: string,
    DocumentosConfirmados: boolean,
    Revisado: boolean,
    datosRubros: any[],
    EstatusDescripcion?: string,
    EstatusClave?: string,
    SolicitudGastoID: number,
    initialValues: {
        SolicitudGastoID: number,
        FechaSolicitud: string,
        Autorizada: boolean,
        CajaID: number,
        NombreCaja: string,
        NombreSucursal: string,
        CuentaBancoID: number,
        NumeroCuenta: string,
        MontoSolicitado: number,
        MontoAutorizado: number,
        Solicitante: string,
        Observaciones: string,
        DetalleSaldos: any[],

    },
    fnCancelar(): any
    fnVerDoc(): any
    fnverEvidenvia(): any
    fnMostrarImagenesEvidencia(cotizacion: any): any
    fnMostrarCargaDeDocumento(): any
    fnMostrarCargaDeDocumento2(): any
    activador(value?: number): any
    desactivador(value?: number): any
    setDocumentoID(item: any): any,
    setSolicitudGastoID(item: any): any,
    setSolicitudDetalleID(item: any): any,
    fnActualizarConfirmarDocumentos(item: any): any

}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)

    console.log("RECIBIDOS DATOS", props.datosRubros)

    const deshabilitarBoton = (revisado: boolean) => {
        if (props.EstatusClave == "DOCS") {
            return true
        }

    }

    const deshabilitarBoton2 = (item?: any) => {
        if (item.EstatusClave == "PEND") {
            return true
        }

    }
    const deshabilitarBoton3 = (revisado: boolean) => {
        if (props.EstatusClave == "PEND") {
            return true
        }

    }
    const Columns: IDataTableColumn[] =
        [
            {
                name: 'DetalleID',
                selector: 'SolicitudDetalleID',
                sortable: false,
                center: true,

            },
            {
                center: true,
                name: 'Clave',
                selector: 'Clave',
                sortable: false,
            },
            {
                center: true,
                name: 'Descripción',
                selector: 'Descripcion',
                sortable: false,
                cell: row => <div className='text-center'>{row.Descripcion}</div>
            },
            {
                center: true,
                name: 'Total',
                selector: 'Total',
                sortable: false,
                cell: props => <div className='text-center'> {FormateoDinero.format(props.Total)} </div>,

            },
            {
                center: true,
                name: 'Estatus',
                selector: 'Cancelado',
                sortable: false,
                cell: (propsss) => {
                    if (!propsss.Revisado) {
                        return <FaCircle color="light-gray" title="Sin revisar" />
                    } else if (propsss.Revisado && propsss.Aceptado) {
                        return <FaCircle color="green" title="Aceptado" />
                    } else if (propsss.Revisado && !propsss.Aceptado) {
                        return <FaCircle color="red" title="Rechazado" />
                    }


                }

            },

            {
                center: true,
                name: 'Cargar Cotización',
                selector: 'Documento',
                sortable: false,
                cell: propss =>
                    <div className='text-center'>  <button disabled={props.EstatusClave == "PEND" ? false : true} data-tip data-for={`btnSD_${propss.Solicitud}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-primary" type={"button"}
                        onClick={() => {
                            console.log("PROPS ,", propss.EstatusClave)
                            props.fnMostrarCargaDeDocumento2()
                            propss.DocumentoID != null ? props.setDocumentoID(propss.DocumentoID) : props.setDocumentoID(0)
                            props.setSolicitudGastoID(propss.SolicitudGastoID)
                            props.setSolicitudDetalleID(propss.SolicitudDetalleID)
                        }
                        }>SUBIR</button> </div >,
            },
            {
                name: 'Ver Cotizaciones',
                sortable: false,
                center: true,
                cell: (propss) =>
                    <><button disabled={false} data-tip data-for={`btnCV_${propss.SolicitudDetalleID}`}
                        style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }}
                        className="btn btn-secondary" type={"button"}
                        onClick={() => {
                            props.fnMostrarImagenesEvidencia(true)
                            props.setSolicitudDetalleID(propss.SolicitudDetalleID)
                        }}>
                        VER
                    </button>
                        <ReactTooltip type="info" effect="solid">
                            VER COMPROBANTE
                        </ReactTooltip></>
            },
            {

                center: true,
                name: 'Cargar Evidencia',
                selector: 'Documento',
                sortable: false,
                cell: propss => <div className='text-center'> {(props.EstatusClave == "AUTZ" || props.EstatusClave == "DOCS") && propss.Aceptado == true ?
                    <button disabled={deshabilitarBoton(propss.Revisado)} data-tip data-for={`btnSD_${propss.Solicitud}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-primary" type={"button"}
                        onClick={() => {
                            props.fnMostrarCargaDeDocumento()
                            propss.DocumentoID != null ? props.setDocumentoID(propss.DocumentoID) : props.setDocumentoID(0)
                            props.setSolicitudGastoID(propss.SolicitudGastoID)
                            props.setSolicitudDetalleID(propss.SolicitudDetalleID)
                        }
                        }>SUBIR</button>
                    : <span>No autorizado</span>} </div >,
            },

            {
                name: 'Ver Evidencias',
                sortable: false,
                center: true,
                cell: (propss) =>
                    <><button disabled={false} data-tip data-for={`btnCV_${propss.SolicitudDetalleID}`}
                        style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }}
                        className="btn btn-secondary" type={"button"}
                        onClick={() => {
                            props.fnMostrarImagenesEvidencia(false)
                            props.setSolicitudDetalleID(propss.SolicitudDetalleID)
                        }}>
                        VER
                    </button>
                        <ReactTooltip type="info" effect="solid">
                            VER COMPROBANTE
                        </ReactTooltip></>
            },



        ]


    const colorEstatus = (estatus?: string) => {
        switch (estatus) {
            case 'PEND':
                return 'light-gray'
            case 'AUTZ':
                return 'green'
            case 'RECH':
                return 'red'
            case 'APLI':
                return 'green'
            case 'CANC':
                return 'red'
            default:
                return 'black'
        }
    }


    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
            })}
            onSubmit={(values: any) => {
                var sgID = props.SolicitudGastoID
                if (props.EstatusClave == "AUTZ") {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Al confirmar la carga de documentos, estos no podrán ser modificados, ni se podrán añadir más.</h5>
                                </div>
                            </div>,
                            //timerProgressBar: true,
                            confirmButtonText: `Continuar`,
                            confirmButtonColor: '#3085d6',
                            showCancelButton: true,
                            cancelButtonText: `Cancelar`,
                            cancelButtonColor: '#d33',
                            focusCancel: true,

                        }
                    ).then((result) => {
                        if (result.isConfirmed) {
                            setLoading(true)
                            let a = {
                                SolicitudGastoID: sgID
                            }
                            Funciones.FNConfirmarDocs(props.oidc, a)
                                .then((respuesta: any) => {
                                    props.fnActualizarConfirmarDocumentos(respuesta)
                                    setLoading(false)
                                    props.fnCancelar()
                                })
                                .catch(() => {
                                    toast.error("Ocurrió un problema al replicar cuenta")
                                    setLoading(false)
                                })
                        } else {
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                        </div>
                                    </div>,
                                    confirmButtonText: `Ok`,
                                    confirmButtonColor: '#3085d6',
                                    showCancelButton: false,

                                }
                            );
                        }
                    })

                } else {
                    props.fnCancelar()
                }

            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Solicitud Número:</strong> <span >{props.Id}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Solicita:</strong> <span >{props.Solicitante}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span ><strong>Estatus:</strong> <span style={{ color: colorEstatus(props.EstatusClave) }} >{props.EstatusDescripcion}</span></span>
                        </div>
                    </div>



                    {/* <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                        <span> <h4 style={{ color: "black" }}>Detalle de la Solicitud de Gastos Nro: {props.Id} de {props.Solicitante}</h4></span>
                    </div> */}

                    <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">

                        <DataTable
                            data={props.datosRubros}
                            striped
                            dense
                            noHeader
                            responsive
                            keyField={"SolicitudDetalleID"}
                            defaultSortField={"SolicitudDetalleID"}
                            columns={Columns}
                        />
                    </div>

                </div>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button> */}
                        <button disabled={false} type="submit" className="ms-2 btn btn-success waves-effect waves-light" >Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}