import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldText, CustomSelect, Spinner } from '../../../../../global'
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
import DatePicker, { registerLocale } from "react-datepicker"

type CFormType = {
    initialValues: {
        fechaInicial: string,
        fechaFinal: string,
        SucursalID: number,
        EstatusClave: string,

    },
    OptionsSucursales: { value: number, label: string }[],
    Options: { value: number, label: string }[],
    fnSetRespuesta(FechaInicial: string, FechaFinal: string, CajaID: number, EstatusClave: string): any
    fnCancelar(): any
}


export const CFormFiltros = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)
    return (
        <Formik
            validationSchema={Yup.object().shape({
                SucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, "Seleccione el producto"),
                fechaInicial: Yup.date().required("Debes de seleccionar una fecha Inicial"),
                fechaFinal: Yup.date().required("Debes de seleccionar una fecha Final"),
            })}
            initialValues={props.initialValues}
            enableReinitialize
            onSubmit={(values: any) => {
                let mesInicio = values.fechaInicial.getMonth() + 1
                if (mesInicio < 10)
                    mesInicio = '0' + mesInicio

                let diaInicial = values.fechaInicial.getDate()
                if (diaInicial < 10)
                    diaInicial = '0' + diaInicial

                let mesFinal = values.fechaFinal.getMonth() + 1
                if (mesFinal < 10)
                    mesFinal = '0' + mesFinal

                let diaFinal = values.fechaFinal.getDate()
                if (diaFinal < 10)
                    diaFinal = '0' + diaFinal

                let fechaInicialD = "" + values.fechaInicial.getFullYear() + "-" + mesInicio + "-" + diaInicial
                let fechaFinalD = "" + values.fechaFinal.getFullYear() + "-" + mesFinal + "-" + diaFinal

                setLoading(true)

                props.fnSetRespuesta(fechaInicialD, fechaFinalD, values.SucursalID, values.EstatusClave)

            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-one-third-desktop is-full-tablet is-full-mobile">
                        <div className="mb-2" >
                            <label className="form-label mb-0" htmlFor={"fechaInicial"}>Fecha Inicial:</label>
                            <br />
                            <Field disabled={true} id={"fechaInicial"} name={"fechaInicial"}  >
                                {
                                    (control: any) => (
                                        <DatePicker
                                            className="form-control"
                                            selected={control.field.value}
                                            disabled={false}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("fechaInicial", value)
                                            }}
                                            placeholderText="Fecha Inicial"
                                            locale="es"
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    )
                                }
                            </Field>
                            <ErrorMessage component="div" name={"fechaInicial"} className="text-danger" />
                        </div>
                    </div>

                    <div className="column is-one-third-desktop is-full-tablet is-full-mobile">
                        <label className="form-label mb-0" htmlFor={"fechaFinal"}>Fecha Final:</label>
                        <br />
                        <Field disabled={true} id={"fechaFinal"} name={"fechaFinal"}  >
                            {
                                (control: any) => (
                                    <DatePicker
                                        className="form-control"
                                        selected={control.field.value}
                                        disabled={false}
                                        onChange={(value: any) => {
                                            control.form.setFieldValue("fechaFinal", value)
                                        }}
                                        minDate={new Date(control.form.getFieldProps("fechaInicial").value)}
                                        placeholderText="Fecha Final"
                                        locale="es"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                )
                            }
                        </Field>
                        <ErrorMessage component="div" name={"fechaFinal"} className="text-danger" />
                    </div>
                    <div className="column is-one-third-desktop is-full-tablet is-full-mobile">
                        <CustomSelect
                            disabled={false}
                            label="Sucursal:"
                            name="SucursalID"
                            placeholder="Seleccione una sucursales"
                            options={props.OptionsSucursales}
                            addDefault={false}
                            isMulti={false}
                        />
                        <br />
                    </div>

                    <div className="column is-half-desktop is-full-tablet is-full-mobile text-center">
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor={"EstatusClave"}>Estatus solicitud:</label>
                            <Field name={"EstatusClave"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        value={control.field.value}
                                        onChange={(value: any) => {
                                            console.log("VALOR SELECCIONADO ES ,", value.target.value)
                                            control.form.setFieldValue("EstatusClave", value.target.value)

                                        }}
                                        disabled={false}
                                        id={"EstatusClave"}
                                        name={"EstatusClave"}
                                    >
                                        <option value="0">{"Selecciona el estatus"}</option>
                                        {props.Options.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>

                                )}
                            </Field>
                            <ErrorMessage component="div" name={"EstatusClave"} className="text-danger" />
                        </div>

                        <br />
                    </div>
                    <div className="column is-half-desktop is-full-tablet is-full-mobile text-center">
                        <br />
                        <button className="btn btn-secondary active" type="submit">Actualizar resultados</button>
                    </div>
                </div>
            </Form>
        </Formik>
    )
}