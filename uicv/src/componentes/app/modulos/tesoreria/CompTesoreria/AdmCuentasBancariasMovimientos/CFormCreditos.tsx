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
import { FiltrarDatos } from '../../../../../../global/functions'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        fecha: Date,
        estatus: number,
        tipo_poliza: string,
        numeroPoliza: number,
        cuenta: string,
        usuario: string,
        empresa: string,
        concepto: string
        fechaFinal: Date,
        fechaInicial: Date
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,
    opPolizasTipoModal: { value: number, label: string }[],
    explorar: boolean
    DatosDefectoModalDetalle: {},
    seleccionadoRenglon(item: any): any,

}

export const CFormCredito = (props: CFormType) => {

    const DatosDefecto = { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCuentas: any[] = []
    const opPolizasTipo: any[] = []
    const DatosTabla: any[] = []

    const [state, setState] = React.useState({
        Datos: [],
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

    })
    React.useEffect(() => {
        FNGetCreditos()
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    // Loading
    const [loading, setLoading] = React.useState(false)

    const FNGetCreditos = () => {
        Funciones.FNGetCreditos(props.Seguridad)
            .then((respuesta: any) => {

                console.log(respuesta)
                setState(s => ({ ...s, Datos: respuesta }))

            })
            .catch(error => {
                console.log("Error: ", error)
                setState(s => ({ ...s, DatosCredito: [] }))
            })
    }
    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Referencia',
                    selector: 'referenciaMigracion',
                    sortable: true,
                },

                {
                    name: 'No. Socio',
                    selector: 'personaID.personaID',
                    sortable: true,
                },
                {
                    name: 'Socio',
                    selector: 'personaID.nombreCompleto',
                    sortable: true,
                },
                {
                    name: 'F. Otorgamiento',
                    selector: 'fotorgamiento',
                    sortable: true,
                },
                {
                    name: 'Monto',
                    selector: 'importeTotal',
                    sortable: true,
                },
                {
                    name: 'Estado',
                    selector: 'estatusID',
                    sortable: true,
                }

            ]
        return colRet
    }, [])

    // Return the component
    return (
        <Formik
            initialValues={props.DatosDefectoModalDetalle}
            enableReinitialize
            onSubmit={(values: any) => {
                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.Seguridad, { ...values, MonedaSatID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
            }}>
            <Form>
                <div>
                    <div className="row">
                        <div className="col-12">
                            <input type="text" className="form-control" placeholder="Buscar crédito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                        </div>
                    </div>
                    <div className="row">
                        {loading && <Spinner />}
                        {!loading && <DataTable

                            data={state.DatosMostrar}
                            striped
                            pagination
                            dense
                            noHeader
                            responsive={true}
                            keyField={"id"}
                            defaultSortField={"id"}
                            columns={Columns}
                            highlightOnHover
                            selectableRowsHighlight
                            onRowDoubleClicked={(value: any) => { props.seleccionadoRenglon(value) }}

                        />}

                        <div className="text-end">
                            <button type="button" disabled={loading} className="btn btn-danger waves-effect waves-light" onClick={() => {
                                props.fnCancelar()
                            }}>
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                        </div>

                    </div>
                </div>
            </Form>
        </Formik>
    )
}