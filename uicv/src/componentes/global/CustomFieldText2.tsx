import React from 'react'
import { Field, ErrorMessage } from 'formik'

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    password?: boolean,
    datoType?: string,
    fnOnchange?(val: any): any
    dataType?: string
}
const CustomFieldText2 = (props: CustomFieldType) => {
    return (
        <div className="mb-2">
            <div className="input-group">
                <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={props.name}>{props.label}</label>
                <Field disabled={props.disabled} type={!props.password ? props.datoType : "password"} className="form-control" id={props.name} name={props.name} placeholder={props.placeholder ? props.placeholder : ''} onblur={props.fnOnchange} />
            </div>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}
export default CustomFieldText2