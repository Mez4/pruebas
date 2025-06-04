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
    setEndDate(val: any): any
}
registerLocale("es", es)
const DatePickeEnd = (props: CustomFieldType) => {

    
    return (
        <div className="mb-3">
            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <br />
            <Field disabled={props.disabled} id={props.name} name={props.name}  >
                {
                    (control: any) => (
                        <DatePicker 
                            className="form-control" 
                            // selected={control.field.value} 
                            selected={props.endDate} 
                            name={props.name} 
                            selectsEnd 
                            minDate={props.startDate} 
                            endDate={props.endDate} 
                            onChange={(date: any) => {
                                control.form.setFieldValue(props.name, date); 
                                props.setEndDate(date)
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

export default DatePickeEnd