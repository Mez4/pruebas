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
    onChange?(val): any
    startDate?: Date,
    endDate?: Date,
}
registerLocale("es", es)
const CustomFieldDatePicker = (props: CustomFieldType) => {
    return (
        <div className="mb-3">
            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <br />
            <Field disabled={props.disabled} id={props.name} name={props.name}  >
                {
                    (control: any) => (
                        <DatePicker
                            className="form-control"
                            placeholderText={props.placeholder ? props.placeholder : ''}
                            selected={control.field.value}
                            onChange={value => {
                                control.form.setFieldValue(props.name, value)
                                if (props.onChange)
                                    props.onChange(value)
                            }}
                            disabled={props.disabled}
                            minDate={props.startDate} 
                            endDate={props.endDate} 
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

export default CustomFieldDatePicker