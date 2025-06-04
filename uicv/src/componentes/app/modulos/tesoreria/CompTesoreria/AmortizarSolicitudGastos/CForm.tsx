import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, Card, CustomFieldText, ModalWin, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaCheck, FaCircle, FaLock, FaLockOpen, FaMoneyCheckAlt, FaPencilAlt, FaWindowClose } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { CFormTotal } from './CFormTotal'
import { Console } from 'console'
import { Modal } from 'react-native'
import { CFormProrrateo } from './CFormProrrateo'


type CFormType = {
    oidc: IOidc
    Id?: number,
    Solicitante?: string,
    Revisado: boolean,
    datosRubros: any[],
    EstatusDescripcion?: string,
    EstatusClave?: string,
    initialValues2: {
        Total: number
    }
    initialValues3: { Total: number },
    initialValues: {
        Observaciones: string,
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
        ObservacionesTesoreria: string,
        DetalleSaldos: any[],

        ProrratearGasto: boolean,
        Meses: number,
    },
    fnCancelar(): any,

    setDocumentoID(item: any): any,
    activador(value?: number): any
    desactivador(value?: number): any
    cbActualizar(item: any): any
    cbGuardar(item: any): any
    cbAgregar(item: any): any
    fnVerDoc(): any
    fnModificarTotal(item: any): any,
    fnMostrarImagenesEvidencia(cotizacion: any): any
    setSolicitudDetalleID(item: any): any,
    fnCancelar(): any


}


export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)

    const colorRevisado = (item: any) => {
        if (item.Revisado && item.Aceptado) {
            return 'green'
        } else if (item.Revisado && !item.Aceptado) {
            return 'red'
        } else {
            return 'gray'
        }
    }
    const DatosDefecto = { Total: 0 }
    const DatosDefecto3 = { Meses: 0 }
    const Datos: any[] = []
    const DatosDefecto2 = {
        SolicitudGastoID: 0,
        FechaSolicitud: '',
        Autorizada: false,
        CajaID: 0,
        NombreCaja: '',
        NombreSucursal: '',
        CuentaBancoID: 0,
        NumeroCuenta: '',
        MontoSolicitado: 0,
        MontoAutorizado: 0,
        Solicitante: '',
        Observaciones: '',
        ObservacionesTesoreria: '',
        DetalleSaldos: [{
            Clave: '',
            Descripcion: '',
            SolicitudDetalleID: 0,
            SolicitudGastoID: 0,
            Total: 0,
            RubroGastosID: 0,
            Cancelado: false,
        }]

    }

    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,


        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            Datos2: DatosDefecto2,
            Datos3: DatosDefecto3,


        }
    })
    const [showModal, setShowModal] = React.useState(false)
    const cbAgregar = (item: any) => {
        toast.success('La cuenta se agrego correctamente')
    }

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    const fnCancelarProrrateo = () => setShowModal(false)


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
                selector: 'Revisado',
                sortable: false,
                cell: (propsss) => <span>{<FaCircle color={colorRevisado(propsss)} title="Estatus" />}</span>

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
            {
                center: true,
                name: 'Acciones',
                selector: 'Acciones',
                sortable: false,
                width: '15%',
                style: { display: 'block;' },
                cell: (propss) =>
                    <div className='text-center' style={{ overflowY: 'auto', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {<>
                            <button disabled={(props.EstatusClave == "RECH" || props.EstatusClave == "CANC" || props.EstatusClave == "AUTZ" || props.EstatusClave == "APLI") ? true : false} data-tip data-for="btnVer_1" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                props.activador(propss)
                            }}>
                                <FaCheck />
                                {props.Revisado && <ReactTooltip id="btnVer_1" type="info" effect="solid">
                                    Aceptar gasto
                                </ReactTooltip>}
                            </button>
                        </>}
                        {<>
                            <button disabled={(props.EstatusClave == "RECH" || props.EstatusClave == "CANC" || props.EstatusClave == "AUTZ" || props.EstatusClave == "APLI") ? true : false} data-tip data-for="btnVer_2" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                props.desactivador(propss)
                                console.log("Estatus:", props.EstatusClave)
                            }}>
                                <FaWindowClose />
                                {props.Revisado && <ReactTooltip id="btnVer_2" type="info" effect="solid">
                                    Rechazar gasto
                                </ReactTooltip>}
                            </button>
                        </>}
                        {/*  {<>
                            <button disabled={(props.EstatusClave == "RECH" || props.EstatusClave == "CANC" || props.EstatusClave == "AUTZ" || props.EstatusClave == "APLI") ? true : false} data-tip data-for="btnVer_2" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}
                                onClick={() => {
                                    console.log('DaClick')

                                    props.fnModificarTotal(true)
                                    props.fnCancelar
                                }}>
                                <FaPencilAlt />
                                {props.Revisado && <ReactTooltip id="btnVer_2" type="info" effect="solid">
                                    Modificar Monto
                                </ReactTooltip>}
                            </button>
                        </>} */}
                    </div>

            },
            {
                center: true,
                name: 'Editar Solicitud',
                selector: 'Modificar Total',
                sortable: false,
                width: '15%',
                style: { display: 'block;' },
                cell: (propss) =>
                    <div className='text-center' style={{ overflowY: 'auto', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {<>
                            <button disabled={(props.EstatusClave == "RECH" || props.EstatusClave == "CANC" || props.EstatusClave == "AUTZ" || props.EstatusClave == "APLI" || props.EstatusClave == "DOCS") ? true : false} data-tip data-for="btnVer_2" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}
                                onClick={() => {
                                    props.fnModificarTotal(propss)

                                }}>
                                <FaPencilAlt />
                                {props.Revisado && <ReactTooltip id="btnVer_2" type="info" effect="solid">
                                    Modificar Monto
                                </ReactTooltip>}
                            </button>
                        </>}
                    </div>

            }


        ]
    const colorEstatus = (estatus?: string) => {
        console.log("PROPS RECIBIDOS CFORM , ", props)
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
                ObservacionesTesoreria: Yup.string().required('Ingrese las observaciones o NA para').min(2, 'Ingresa mínimo 2 carácteres').max(500, 'Máximo 500 carácteres'),
            })}



            onSubmit={(values: any) => {
                if (props.Id != undefined) {
                    if (props.EstatusClave == "DOCS") {
                        let isCancelado = false
                        let regCancelados = 0;
                        //Validate if a specific row is checked for all objects in the array
                        props.datosRubros.forEach(element => {
                            if (!element.Aceptado) {
                                regCancelados++
                            }
                        });
                        regCancelados == props.datosRubros.length ? isCancelado = true : isCancelado = false
                        if (isCancelado) {
                            MySwal.fire({
                                title: '<strong>Solicitud sin gastos</strong>',
                                icon: 'warning',
                                html:
                                    <div className="text-center">
                                        <br />La solicitud no cuenta con gastos aceptados, por lo que la solicitud pasará al estatus de rechazada.
                                        <br /><strong> Esta acción no se puede revertir.</strong>
                                    </div>,
                                showCloseButton: false,
                                showCancelButton: true,
                                showConfirmButton: true,
                                focusConfirm: false,
                                cancelButtonText: 'Cancelar',
                                confirmButtonText: 'Aceptar',
                                confirmButtonAriaLabel: 'Thumbs up, great!',
                                confirmButtonColor: '#037BFF',
                                cancelButtonAriaLabel: 'Thumbs down',
                                cancelButtonColor: '#d33',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    setLoading(true)
                                    let datos = {
                                        SolicitudGastoID: values.SolicitudGastoID,
                                        DetalleSolicitud: props.datosRubros,
                                        ObservacionesTesoreria: values.ObservacionesTesoreria,
                                    }

                                    Funciones.FNRechazarSolicitud(props.oidc, datos)
                                        .then((respuesta: any) => {
                                            props.fnCancelar()
                                            setLoading(false)
                                            toast.success("Solicitud aplicada correctamente")
                                            props.cbActualizar(respuesta)
                                        }).catch((error: any) => {
                                            toast.error("Error al aplicar la solicitud")
                                            setLoading(false)
                                            props.fnCancelar()
                                        })

                                }
                            })
                        }

                        // Prorrateo de Gastos
                        else {

                            let datos = {
                                SolicitudGastoID: values.SolicitudGastoID,
                                DetalleSolicitud: props.datosRubros,
                                ObservacionesTesoreria: values.ObservacionesTesoreria,
                                ProrratearGasto: 1,
                                Meses: values.Meses,
                            }

                            MySwal.fire({
                                title: '<strong>¡Prorrateo De Gastos!</strong>',
                                icon: 'warning',
                                html:
                                    <div className="text-center">
                                        <br />¿Desea Prorratear Gastos?
                                    </div>,
                                showCloseButton: false,
                                showCancelButton: true,
                                showConfirmButton: true,
                                focusConfirm: false,
                                cancelButtonText: 'No',
                                confirmButtonText: 'Si',
                                confirmButtonAriaLabel: 'Thumbs up, great!',
                                confirmButtonColor: '#037BFF',
                                cancelButtonAriaLabel: 'Thumbs down',
                                cancelButtonColor: '#d33',
                            }).then((result) => {

                                if (result.isConfirmed) {
                                    let datos = {
                                        SolicitudGastoID: values.SolicitudGastoID,
                                        DetalleSolicitud: props.datosRubros,
                                        ObservacionesTesoreria: values.ObservacionesTesoreria,
                                    }
                                    MySwal.fire({
                                        title: '<strong>¿Aceptar Solicitud Con Prorrateo?</strong>',
                                        icon: 'question',
                                        html:
                                            <div className="text-center">
                                                <br />Una vez confirmada, <strong>no se podrá revertir la acción.</strong>
                                            </div>,
                                        showCloseButton: false,
                                        showCancelButton: true,
                                        showConfirmButton: true,
                                        focusConfirm: false,
                                        cancelButtonText: 'Cancelar',
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonAriaLabel: 'Thumbs up, great!',
                                        confirmButtonColor: '#037BFF',
                                        cancelButtonAriaLabel: 'Thumbs down',
                                        cancelButtonColor: '#d33',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            setShowModal(true)
                                            setLoading(true)
                                            Funciones.FNAceptarSolicitud(props.oidc, datos)
                                                .then((respuesta: any) => {
                                                    props.fnCancelar()
                                                    setLoading(false)
                                                    props.cbActualizar(respuesta)
                                                }).catch((error: any) => {
                                                    toast.error("Error al aceptar la solicitud")
                                                    setLoading(false)
                                                    props.fnCancelar()
                                                })
                                        }
                                    })

                                }
                                else {

                                    let datos = {
                                        SolicitudGastoID: values.SolicitudGastoID,
                                        DetalleSolicitud: props.datosRubros,
                                        ObservacionesTesoreria: values.ObservacionesTesoreria,
                                    }
                                    MySwal.fire({
                                        title: '<strong>¿Aceptar Solicitud Sin Prorrateo?</strong>',
                                        icon: 'question',
                                        html:
                                            <div className="text-center">
                                                <br />Una vez confirmada, <strong>no se podrá revertir la acción.</strong>
                                            </div>,
                                        showCloseButton: false,
                                        showCancelButton: true,
                                        showConfirmButton: true,
                                        focusConfirm: false,
                                        cancelButtonText: 'Cancelar',
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonAriaLabel: 'Thumbs up, great!',
                                        confirmButtonColor: '#037BFF',
                                        cancelButtonAriaLabel: 'Thumbs down',
                                        cancelButtonColor: '#d33',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            setLoading(true)
                                            Funciones.FNAceptarSolicitud(props.oidc, datos)
                                                .then((respuesta: any) => {
                                                    props.fnCancelar()
                                                    setLoading(false)
                                                    toast.success("Solicitud actualizada correctamente")
                                                    props.cbActualizar(respuesta)
                                                }).catch((error: any) => {
                                                    toast.error("Error al aceptar la solicitud")
                                                    setLoading(false)
                                                    props.fnCancelar()
                                                })
                                        }
                                    })
                                }
                            })
                        }


                    }
                    else if (props.EstatusClave == "PEND") {
                        let validar = true
                        props.datosRubros.forEach(element => {
                            if (!element.Revisado) {
                                validar = false
                            }
                        });
                        if (!validar) {
                            MySwal.fire({
                                title: '<strong>Validar desglose</strong>',
                                icon: 'info',
                                html:
                                    <div className="text-center">
                                        <br />Uno o más cargos no han sido validados, favor de verificar e intentar nuevamente.
                                    </div>,
                                showCloseButton: false,
                                showCancelButton: false,
                                showConfirmButton: true,
                                confirmButtonText: 'Aceptar',
                                confirmButtonAriaLabel: 'Thumbs up, great!',
                                confirmButtonColor: '#037BFF',
                                focusConfirm: false,
                                cancelButtonText: 'Cancelar',
                                cancelButtonAriaLabel: ''


                            });
                        } else {
                            let datos = {
                                SolicitudGastoID: values.SolicitudGastoID,
                                DetalleSolicitud: props.datosRubros,
                                ObservacionesTesoreria: values.ObservacionesTesoreria,
                            }
                            MySwal.fire({
                                title: '<strong>Autorizar Solicitud</strong>',
                                icon: 'warning',
                                html:
                                    <div className="text-center">
                                        <br />¿Seguro desea autorizar la solicitud?, esto permitirá  al usuario la carga de evidencias.
                                    </div>,
                                showCloseButton: false,
                                showCancelButton: true,
                                showConfirmButton: true,
                                focusConfirm: false,
                                cancelButtonText: 'Cancelar',
                                confirmButtonText: 'Aceptar',
                                confirmButtonAriaLabel: 'Thumbs up, great!',
                                confirmButtonColor: '#037BFF',
                                cancelButtonAriaLabel: 'Thumbs down',
                                cancelButtonColor: '#d33',
                                reverseButtons: false,

                            }).then((result) => {
                                if (result.isConfirmed) {
                                    setLoading(true)
                                    Funciones.FNAutorizarSolicitud(props.oidc, datos)
                                        .then((respuesta: any) => {
                                            props.fnCancelar()
                                            setLoading(false)
                                            toast.success("Solicitud actualizada correctamente")
                                            props.cbActualizar(respuesta)
                                        }).catch((error: any) => {
                                            toast.error("Error al aceptar la solicitud")
                                            setLoading(false)
                                            props.fnCancelar()
                                        })
                                }
                            })

                        }



                    } else if (props.EstatusClave == "RECH" || props.EstatusClave == "CANC") {
                        props.fnCancelar()
                    } else {
                        props.fnCancelar()
                    }

                }
            }}>


            <Form>
                <CustomFieldText disabled={true} label='Observaciones Usuario' name='Observaciones'></CustomFieldText>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor='ObservacionesTesoreria'> Observaciones de la Solicitud</label>
                            <Field
                                type="textarea"
                                disabled={(props.EstatusClave == "PEND" || props.EstatusClave == "DOCS") ? false : true}
                                className="form-control"
                                rows={3}
                                id="ObservacionesTesoreria"
                                name="ObservacionesTesoreria"
                                placeholder="Observaciones Tesoreria"
                                multiple={true}
                            // onChangeCapture={e => (console.log(e))} 
                            />
                            <ErrorMessage component="div" name="ObservacionesTesoreria" className="text-danger" />
                        </div>
                    </div>
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
                        <ModalWin open={state.Form.Mostrar} center={true}>
                            <ModalWin.Header>
                                <h5 className={MODAL_TITLE_CLASS}>Saldo Autorizado</h5>
                            </ModalWin.Header>
                            <ModalWin.Body>
                                {/* {<CFormTotal
                                    oidc={props.oidc}
                                    initialValues2={state.Form.Datos}
                                    Id={state.Form.Id}
                                    cbGuardar={cbAgregar}
                                    fnCancelar={fnCancelar}
                                    initialValues={state.Form.Datos2}
                                    Revisado={false}
                                    datosRubros={[]}
                                    initialValues3={{ Total: 0 }}
                                />} */}
                            </ModalWin.Body>
                        </ModalWin>
                    </div>

                </div>

                <ModalWin open={showModal} center={true}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Prorrateo De Gastos</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {<CFormProrrateo
                            oidc={props.oidc}
                            // initialValues2={state.Form.Datos}
                            Id={props.Id}
                            // cbGuardar={cbAgregar}
                            // fnCancelar={fnCancelar}
                            initialValues={props.initialValues}
                            Revisado={false}
                            SolicitudGastoID={state.Form.Datos2.SolicitudGastoID}
                            fnCerrar={fnCancelarProrrateo}
                        />}
                    </ModalWin.Body>
                </ModalWin>


                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button disabled={(props.EstatusClave == "PEND" || props.EstatusClave == "DOCS") ? false : true} type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}