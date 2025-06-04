import React from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, Acordion } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DataTable from 'react-data-table-component'
import { FaArrowDown, FaHouseUser, FaMoneyCheck, FaPencilAlt } from 'react-icons/fa'
import Trigger from './Trigger'
import { Toast } from 'react-toastify/dist/components'
import { FormateoDinero } from '../../../../../../global/variables'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

//Style css scoped


type CFormType = {

    Seguridad: IOidc,
    Size: number,
    Id?: number,
    //Arreglo de objetos
    initialValues: {
        ValoresCaja: any[]
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optionsSucursal: { value: number, label: string }[]
    optionsCajas: { value: number, label: string }[]
    DatosTabla: any[]

    calcularTotal(item: any): any
    CargandoModal: any
    TotalGeneral: any
    CajaID: any,
}

export const CuentasArqueosDinamicas = (props: CFormType) => {
    //alert(props.CajaID)
    const MySwal = withReactContent(Swal)
    console.log("PROPS RECIBIIDOS EN CUENTAS ARQUEO DINAMICAS", props)

    const validationSchema = Yup.object().shape({
        numberOfTickets: Yup.string()
            .required('Number of tickets is required'),
        tickets: Yup.array().of(
            Yup.object().shape({
                name: Yup.string()
                    .required('Name is required'),
                email: Yup.string()
                    .email('Email is invalid')
                    .required('Email is required')
            })
        )
    });

    function onSubmit(fields) {
        // display form field values on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4));
    }


    const [loading, setLoading] = React.useState(false)
    return (
        <Formik initialValues={props.initialValues} /* validationSchema={validationSchema} */ onSubmit={onSubmit}>
            {({ errors, values, touched }) => (
                <Form>
                    <div >
                        <h5>Cuentas en operación de la caja $NOMBRECAJA</h5>
                        {props.CargandoModal && <Spinner />}
                        {!props.CargandoModal &&
                            <FieldArray name="tickets">
                                {() => (props.initialValues.ValoresCaja.map((element, i) => {
                                    return (
                                        <Acordion TabSelecionado={'Cuensstas' + element.CuentaBancoID}>
                                            <Acordion.Tab Identificador={'Cuentas' + element.CuentaBancoID} Titulo={<React.Fragment><FaMoneyCheck />&nbsp;ID {element.CuentaBancoID} - Número de cuenta: {element.NumeroCuenta} - Opera: {element.TipoMovimiento} {props.TotalGeneral}</React.Fragment>}>
                                                <>
                                                    <div className="text-start">
                                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                            <FieldArray name="Denominaciones">
                                                                {() => (element.Denominaciones.map((iteracion, i) => {
                                                                    /*             const ticketErrors = errors.tickets?.length && errors.tickets[i] || {};
                                                                                const ticketTouched = touched.tickets?.length && touched.tickets[i] || {}; */
                                                                    return (
                                                                        <div key={i} className="list-group list-group-flush">
                                                                            <div className="mb-3">
                                                                                <label className="form-label mb-0" htmlFor={iteracion.CatDenomEfectivoID + '_' + element.CuentaBancoID}>Cantidad</label>
                                                                                <Field disabled={false} id={iteracion.CatDenomEfectivoID + '_' + element.CuentaBancoID} name={iteracion.CatDenomEfectivoID + '_' + element.CuentaBancoID}
                                                                                >
                                                                                    {
                                                                                        (control: any) => (
                                                                                            <input
                                                                                                type="number"
                                                                                                step='0.01'
                                                                                                placeholder='0.00'
                                                                                                className="form-control"
                                                                                                value={control.field.value}
                                                                                                //pattern="\d{1,10}(.\d{1,2})?"
                                                                                                disabled={false}
                                                                                                onBlur={value => {
                                                                                                    console.log(value.target.value)
                                                                                                }}
                                                                                                onChange={value => {
                                                                                                    let dec = value.target.value.indexOf(".")
                                                                                                    let tooLong = value.target.value.length > dec + 3
                                                                                                    let invalidNum = isNaN(parseFloat(value.target.value))
                                                                                                    control.form.setFieldValue(iteracion.CatDenomEfectivoID + '_' + element.CuentaBancoID, value.target.value)
                                                                                                }}
                                                                                            />
                                                                                        )
                                                                                    }
                                                                                </Field>
                                                                                <ErrorMessage component="div" name={iteracion.CatDenomEfectivoID + '_' + element.CuentaBancoID} className="text-danger" />
                                                                            </div>

                                                                        </div>
                                                                    );
                                                                }))}
                                                            </FieldArray>

                                                        </table>
                                                    </div>

                                                </>
                                            </Acordion.Tab>
                                        </Acordion>

                                    );
                                }))}
                            </FieldArray>}
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end mt-4">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                    Ok
                                </button>
                            </div>
                        }
                    </div>
                </Form>
            )
            }
        </Formik >
    )
}

function setState(arg0: (s: any) => any) {
    throw new Error('Function not implemented.')
}
