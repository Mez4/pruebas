import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { Field, ErrorMessage } from 'formik'
import DatePicker, { registerLocale } from "react-datepicker"
import { FaSearch, FaTimes, FaTrashAlt, FaCheckCircle, FaCheckSquare } from 'react-icons/fa'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FaPencilAlt, FaPlus, FaCircle, FaTrash, FaPrint } from 'react-icons/fa'
import moment from 'moment'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaFileExcel, FaEye } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type CFormType = {
    DatosSaldos: any[]
    Seguridad: IOidc,



}

export const CFormReasignar = (props: CFormType) => {

    const DatosDefecto = { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCuentas: any[] = []
    const opPolizasTipo: any[] = []
    const DatosTabla: any[] = []

    const [state, setState] = React.useState({
        Datos: {
            fechaInicial: "",
            fechaFinal: "",
            usuario: "",
            arqueoId: 0
        },
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        optCuentas,
        opPolizasTipo,
        startDate: null,
        endDate: null,
        DatosTabla

    })

    const [estado, setEstado] = React.useState({
        numeroP: {
            id: "",
        }
    })
    const [loading, setLoading] = React.useState(false)

    const FNReasignar = (CreditoID: number) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: '<strong>Desembolsar Crédito</strong>',
            icon: 'question',
            html:
                <div className="text-center">
                    Se desembolsará el crédito en efectivo, ¿desea continuar?
                </div>,
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            focusConfirm: false,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
            allowOutsideClick: false,
            cancelButtonAriaLabel: ''
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire(
                    {
                        icon: 'info',
                        html: <div><br />
                            <h3 className="text-center">Aviso</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Generando crédito en efectivo.</h5>
                            </div>
                        </div>,
                        confirmButtonText: `Ok`,
                        allowOutsideClick: false,
                        //timer: 500,
                        didOpen: () => {
                            MySwal.showLoading()
                        },
                    }
                );

                let datos = {
                    CreditoID: CreditoID
                }

                Funciones.FNGenerarDispersionEfectivo(props.Seguridad, datos)
                    .then((respuesta: any) => {
                        setLoading(false)
                        if (respuesta.regresa === 1) {
                            MySwal.fire(
                                {
                                    icon: 'success',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Se creó el crédito con el N° {respuesta.CreditoId}`</h5>
                                        </div>
                                    </div>,
                                    //timerProgressBar: true,
                                    confirmButtonText: `Ok`,
                                    allowOutsideClick: false,
                                    //timer: 500,
                                    /*  didOpen: () => {
                                         MySwal.showLoading()
                                     }, */
                                }
                            );
                        }
                        else {
                            MySwal.fire(
                                {
                                    icon: 'error',
                                    html: <div><br />
                                        <h3 className="text-center">Error</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">{respuesta.msj}</h5>
                                        </div>
                                    </div>,
                                    //timerProgressBar: true,
                                    confirmButtonText: `Ok`,
                                    //timer: 500,

                                }
                            );
                            setLoading(false)
                            toast.error(respuesta.msj)
                        }

                    })
                    .catch((error: any) => {
                        MySwal.fire(
                            {
                                icon: 'error',
                                html: <div><br />
                                    <h3 className="text-center">Error</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">Ocurrió un problema al crear el crédito.</h5>
                                    </div>
                                </div>,
                                confirmButtonText: `Ok`,
                                allowOutsideClick: false,
                            }
                        );
                        console.log(error)
                        setLoading(false)
                    })
            } else {
                MySwal.fire(
                    {
                        icon: 'error',
                        html: <div><br />
                            <h3 className="text-center">Error</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Operación cancelada por el usuario.</h5>
                            </div>
                        </div>,
                        //timerProgressBar: true,
                        confirmButtonText: `Ok`,
                        allowOutsideClick: false,
                        //timer: 500,

                    }
                );
            }
        })

    }



    // Define the columns
    const Columns: IDataTableColumn[] =
        [
            {
                name: 'CreditoID',
                selector: 'CreditoID',
                sortable: false,
                center: true
            },
            {
                name: 'C. Rastreo',
                selector: 'Clave_Rastreo',
                center: true,
                wrap: true,
                cell: (propss) => <span className='text-center'>{propss.Clave_Rastreo}</span>
            },
            {
                name: 'Beneficiario',
                selector: 'Nombre_Beneficiario',
                sortable: false,
                center: true,
                cell: (propss) => <span className='text-center'> {propss.Nombre_Beneficiario}</span>
            },
            {
                name: 'Estatus',
                selector: 'Estatus',
                sortable: false,
                center: true,
                cell: (propss) => <span className="text-center" style={{ color: 'red' }}>Devuelta</span>
            },
            {
                name: 'Monto',
                selector: 'Monto',
                sortable: false,
                center: true,
                cell: (propss) => <span className="text-center">{FormateoDinero.format(propss.Monto)}</span>
            },
            {
                name: 'Motivo',
                selector: 'ObservacionesDevuelta',
                sortable: false,
                center: true,
                cell: (propss) => <span style={{ color: 'red' }} className="text-center">{propss.ObservacionesDevuelta}</span>
            },
            {
                name: 'Acciones', sortable: false, center: true,
                cell: (propss) =>
                    <div>
                        <button data-tip="true" data-for={`ID${propss.DetalleDispersionID}`} className="asstext" type={"button"} onClick={() => {
                            FNReasignar(propss.CreditoID)
                        }} >
                            <FaCheckCircle />
                            <ReactTooltip id={`ID${propss.DetalleDispersionID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Re-intentar dispersión en efectivo
                            </ReactTooltip>
                        </button>
                    </div >

            }

        ]
    console.log(props.DatosSaldos)
    // Return the component
    return (
        <Formik
            initialValues={state.Datos}
            enableReinitialize
            validationSchema={
                Yup.object().shape({
                    fechaInicial: Yup.date().required("Debes de seleccionar una fecha inicial"),
                    fechaFinal: Yup.date().required("Debes de seleccionar una fecha Final"),
                })}
            onSubmit={(values: any) => {
                // Set our form to a loading state


            }}>

            <Form>
                <div>
                    <div style={{ padding: '3%' }}>
                        <div className="row">
                            <span style={{ color: 'red' }}>Dispersiones devueltas</span>
                        </div>
                        <br />
                        <div className="row">
                            {props.DatosSaldos.length <= 0 && <Spinner />}
                            {!loading && <DataTable
                                data={props.DatosSaldos}
                                striped
                                dense
                                noHeader
                                responsive
                                keyField={"ArqueoID"}
                                defaultSortField={"ArqueoID"}
                                columns={Columns}
                            />
                            }
                        </div>
                    </div>

                </div>

            </Form>
        </Formik >
    )
}