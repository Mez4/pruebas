import React from 'react'
import { Field, ErrorMessage } from 'formik'
import { off } from 'process'

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    password?: boolean
}
const CustomFieldText = (props: CustomFieldType) => {
    return (
        <div className="mb-3">
            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <Field autoComplete="off" disabled={props.disabled} className="form-control" type={!props.password ? "text" : "password"} id={props.name} name={props.name} placeholder={props.placeholder ? props.placeholder : ''} />
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}
export default CustomFieldText