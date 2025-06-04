import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner } from '../../../../../global'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../../global/variables'


type CFormType = {
    DatosSaldos: any[]
}

export const CFormSaldos = (props: CFormType) => {

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
                name: 'Cuenta Bancaria',
                selector: 'CtaBancaria',
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
            },
            {
                center: true,
                name: 'Cuenta Contable',
                selector: 'CtaContable',
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
                name: 'Saldo Sistema',
                selector: 'SaldoSistema',
                sortable: true,
                cell: props => <div> {FormateoDinero.format(props.SaldoSistema)} </div>,
                conditionalCellStyles: [
                    {
                        when: row => row.SaldoSistema <= 0 && row.BalanceResumenID == -1,
                        style: {
                            textAlign: 'center',
                            //color: 'rgba(80, 203, 147, 1)',
                            color: 'green',
                            borderTop: '1px solid black',
                            fontWeight: 'bold'

                            //color: 'white',
                        },

                    },
                ],

            },
            {
                center: true,
                name: 'Saldo Edo. Cuenta',
                selector: 'SaldoEdoCuenta',
                sortable: true,
                cell: props => <div> {FormateoDinero.format(props.SaldoEdoCuenta)} </div>,
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

            }, {
                center: true,

                name: 'Diferencia',
                selector: 'Diferencia',
                sortable: true,
                cell: props => <div> {FormateoDinero.format(props.Diferencia)} </div>,
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

            </Form>
        </Formik >
    )
}