import React from 'react'
import { Field, ErrorMessage } from 'formik'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    isClearable: boolean,
    startDate: Date,
    endDate: Date,
    setStartDate(val: any): any
}
registerLocale("es", es)
const DatePickeStart = (props: CustomFieldType) => {
    return (
        <div className="mb-3">
            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <br />
            <Field disabled={props.disabled} id={props.name} name={props.name}  >
                {
                    (control: any) => (
                        <DatePicker
                            autoComplete='off'
                            className="form-control"
                            // selected={control.field.value} 
                            selected={props.startDate}
                            name={props.name}
                            selectsStart
                            startDate={props.startDate}
                            maxDate={props.endDate}
                            // endDate={props.endDate} 
                            onChange={(date: any) => {
                                control.form.setFieldValue(props.name, date);
                                props.setStartDate(date)
                            }}
                            isClearable={props.isClearable}
                            placeholderText={props.placeholder ? props.placeholder : ''}
                            disabled={props.disabled}
                            locale="es"
                            dateFormat="dd/MM/yyyy"
                        />
                    )
                }
            </Field>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}

export default DatePickeStart