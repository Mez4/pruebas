import React from 'react'
import { Field, ErrorMessage } from 'formik'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean
}
registerLocale("es", es)
const CustomFieldDatePicker = (props: CustomFieldType) => {
    return (
        <div className="mb-2">
            <div className="input-group">
                <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={props.name}>{props.label}</label>
                <Field className="form-control" disabled={props.disabled} id={props.name} name={props.name}>
                    {
                        (control: any) => (
                            <DatePicker
                                className="form-control flex-fill input_left_text react-datepicker-popper"
                                placeholderText={props.placeholder ? props.placeholder : ''}
                                selected={control.field.value}
                                onChange={value => {
                                    control.form.setFieldValue(props.name, value)
                                }}
                                disabled={props.disabled}
                                locale="es"
                                dateFormat="dd/MM/yyyy"
                            />
                        )
                    }
                </Field>
            </div>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}

export default CustomFieldDatePicker