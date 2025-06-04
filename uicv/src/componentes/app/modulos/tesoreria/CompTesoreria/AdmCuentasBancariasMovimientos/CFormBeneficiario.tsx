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

}

export const CFormBeneficiario = (props: CFormType) => {

    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCuentas: any[] = []
    const opPolizasTipo: any[] = []
    const DatosTabla: any[] = []




    const handleRowClicked = (row: any) => {
        state.Datos.map(item => {
            if (item.toggleSelected === undefined) {
                if (row.personaID === item.personaID) {
                    item.toggleSelected = true
                }
            } else {
                delete item.toggleSelected
            }
        });
        setState(s => ({ ...s, Datos: state.Datos }))
    };


    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        optCuentas,
        opPolizasTipo,
        startDate: null,
        endDate: null,


    })
    // Loading
    const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        FnObtenerBeneficiario()

    }, [])

    React.useEffect(() => {

        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))

        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    const FnObtenerBeneficiario = () => {
        setLoading(true)
        Funciones.FNGetBeneficiarios(props.Seguridad)
            .then((respuesta: any) => {

                respuesta.forEach((element: any) => {

                    element.tipo = "Socio Mayor"
                    element.estatus = "Activa"
                    element.personaJuridica = "Fisica"


                });

                //respuesta.acumulaCuenta = respuesta.acumulaCuneta.nombre
                setLoading(false)
                setState(s => ({ ...s, Datos: respuesta }))

            })
            .catch(error => {
                setState(s => ({ ...s, Datos: [] }))
            })
    }
    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'No. Cliente',
                    selector: 'personaID',
                    sortable: true,
                },

                {
                    name: 'Nombre Completo',
                    selector: 'nombreCompleto',
                    sortable: true,
                    width: "35%",
                },
                {
                    name: 'Tipo',
                    selector: 'tipo',
                    sortable: true,
                },
                {
                    name: 'Estatus',
                    selector: 'estatus',
                    sortable: true,
                },
                {
                    name: 'Persona Juridica',
                    selector: 'personaJuridica',
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
                    <br />
                    <div className="row">
                        {loading && <Spinner />}
                        {!loading &&
                            <DataTable

                                data={state.DatosMostrar}
                                striped
                                dense
                                pagination
                                noHeader
                                responsive
                                keyField={"personaID"}
                                defaultSortField={"personaID"}
                                columns={Columns}
                                selectableRowsHighlight
                                onRowClicked={handleRowClicked}
                                conditionalRowStyles={
                                    [{
                                        when: row => {
                                            return row.toggleSelected === true
                                        },
                                        style: {
                                            backgroundColor: '#8E8E8E',
                                        },

                                    }
                                    ]
                                }

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