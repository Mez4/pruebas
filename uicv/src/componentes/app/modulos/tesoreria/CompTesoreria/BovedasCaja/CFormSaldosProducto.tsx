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

export const CFormSaldosProducto = (props: CFormType) => {

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
            /*  {
                 name: 'ProductoID',
                 selector: 'ProductoID',
                 sortable: true,
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
             }, */
            {
                center: true,
                name: 'Producto',
                selector: 'Producto',
                sortable: true,
                conditionalCellStyles: [
                    {
                        when: row => row.BalanceResumenID < 0,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            fontWeight: 'bold'

                        },

                    },
                ],
            },
            {
                center: true,
                name: 'Tipo de movimiento',
                selector: 'TipoMovimiento',
                sortable: true,


            },
            {
                center: true,
                name: 'Número de cuenta',
                selector: 'NumeroCuenta',
                sortable: true,


            },
            {
                center: true,
                name: 'Saldo Edo. Cuenta',
                selector: 'SaldoActual',
                sortable: true,
                cell: props => <div> {FormateoDinero.format(props.SaldoActual)} </div>,
                conditionalCellStyles: [
                    {
                        when: row => row.Diferencia <= 0 && row.BalanceResumenID == -1,
                        style: {
                            textAlign: 'center',
                            color: 'orange',
                            borderTop: '1px solid black',
                            fontWeight: 'bold'


                            //color: 'white',
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
                            noHeader
                            responsive
                            keyField={"ArqueoID"}
                            defaultSortField={"ArqueoID"}
                            columns={Columns}
                        />


                        }


                    </div>
                </div>

            </Form>
        </Formik >
    )
}