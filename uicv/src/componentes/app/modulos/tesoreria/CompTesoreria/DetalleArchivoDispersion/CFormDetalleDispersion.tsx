import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { Field, ErrorMessage } from 'formik'
import DatePicker, { registerLocale } from "react-datepicker"
import { FaSearch, FaTimes, FaTrashAlt, FaCheckCircle } from 'react-icons/fa'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FaPencilAlt, FaPlus, FaCircle, FaTrash, FaPrint } from 'react-icons/fa'
import moment from 'moment'
import { FormateoDinero } from '../../../../../../global/variables'


type CFormType = {
    DatosSaldos: any[]



}

export const CFormDetalleDispersion = (props: CFormType) => {

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
    // Loading
    const [loading, setLoading] = React.useState(false)
    const [habilitar, setHabilitar] = React.useState(true)

    const ObtenerEstatus = (Estatus: number) => {
        if (Estatus == 3) {
            return <span style={{ color: 'orange' }}>Pendiente</span>
        }
        else if (Estatus == 2) {
            return <span style={{ color: 'green' }}>Aplicado</span>
        }
        else if (Estatus == 4) {
            return <span style={{ color: 'red' }}>Cancelado</span>
        }
        else if (Estatus == 5) {
            return <span style={{ color: 'orange' }}>Reasignada</span>
        }
        else if (Estatus == 6) {
            return <span style={{ color: 'red' }}>Devuelto</span>
        }
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
                name: 'Clave Rastreo',
                selector: 'Clave_Rastreo',
                center: true,
                wrap: true,
                cell: (propss) => <span className='text-center'>{propss.Clave_Rastreo}</span>

            },
            {
                name: 'Nombre Ben.',
                selector: 'Nombre_Beneficiario',
                sortable: false,
                center: true,
                cell: (propss) => <span className='text-center'> {propss.Nombre_Beneficiario}</span>
            },
            {
                name: 'Cuenta Ben.',
                selector: 'Cuenta_Beneficiario',
                sortable: false,
                center: true,
                cell: (propss) => <span className='text-center'> {propss.Cuenta_Beneficiario}</span>


            },
            {
                name: 'Empresa',
                selector: 'Empresa',
                sortable: false,
                center: true,

            },
            {
                name: 'Estatus',
                selector: 'Estatus',
                sortable: false,
                center: true,
                cell: (propss) =>
                    propss.Estatus == 6 ? <span className="text-center" style={{ color: 'red' }}>{ObtenerEstatus(propss.Estatus)}<br />Motivo: {propss.ObservacionesDevuelta}</span> : <span>{ObtenerEstatus(propss.Estatus)}</span>

            },
            {
                name: 'Monto',
                selector: 'Monto',
                sortable: false,
                center: true,
                cell: (propss) => <span>{FormateoDinero.format(propss.Monto)}</span>
            },
            {
                name: 'Dispersada en efectivo',
                selector: 'Reasignado',
                sortable: false,
                center: true,
                cell: (propss) => <span>{propss.Reasignado ? 'Si' : 'No'}</span>
            },

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
                            <span style={{ color: 'red' }}>Créditos en ésta dispersión</span>
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