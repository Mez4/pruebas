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

export const CFormBalanzaDetalle = (props: CFormType) => {

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

    // Define the columns
    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Cuenta Contable',
                selector: 'CtaContable',
                center: true,
                conditionalCellStyles: [
                    {
                        when: row => row.BalanceResumenID < 0,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black'

                        },

                    },

                ],
            },
            {
                center: true,

                name: 'Observaciones',
                selector: 'Observaciones',
                cell: props => <div> {(props.Observaciones)} </div>,
                conditionalCellStyles: [
                    {
                        when: row => row.Diferencia <= 0 && row.BalanceResumenID == -1,
                        style: {
                            textAlign: 'center',
                            //color: 'rgba(213, 76, 76, 1)',
                            color: 'red',
                            borderTop: '1px solid black',
                            fontWeight: 'bold'


                            // color: 'white',
                        },

                    },
                ],
            },
            {
                center: true,
                name: 'Importe',
                selector: 'SaldoImporte',
                cell: props => <div> {FormateoDinero.format(props.SaldoImporte)} </div>,
                conditionalCellStyles: [
                    {
                        when: row => row.SaldoImporte <= 0 && row.SaldoImporte == -1,
                        style: {
                            textAlign: 'center',
                            //color: 'rgba(80, 203, 147, 1)',
                            color: 'green',
                            borderTop: '1px solid black',
                            fontWeight: 'bold'

                            //color: 'white',
                        },

                    },
                    {
                        when: row => row.Factor < 0,
                        style: {
                            background: '#FAA0A0'
                        },

                    },
                    {
                        when: row => row.Factor > 0,
                        style: {
                            background: '#C1E1C1'
                        },

                    },
                ],

            },
            {
                center: true,

                name: 'Cuenta Destino',
                selector: 'CuentaDestino',

                conditionalCellStyles: [
                    {
                        when: row => row.Diferencia <= 0 && row.BalanceResumenID == -1,
                        style: {
                            textAlign: 'center',
                            //color: 'rgba(213, 76, 76, 1)',
                            color: 'red',
                            borderTop: '1px solid black',
                            fontWeight: 'bold'


                            // color: 'white',
                        },

                    },
                ],
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

                    <div className="row">
                        {props.DatosSaldos.length <=0 && <Spinner />}
                        {!loading && <DataTable

                            data={props.DatosSaldos}
                            striped
                            dense
                            pagination
                            responsive
                            keyField={"ArqueoID"}
                            defaultSortField={"ArqueoID"}
                            columns={Columns}
                            paginationPerPage={15}
                            paginationComponentOptions={
                                {
                                    rangeSeparatorText: 'of',
                                    noRowsPerPage: true,

                                }


                            }
                        />


                        }


                    </div>
                </div>

            </Form>
        </Formik >
    )
}