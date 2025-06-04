import React from 'react'
import { Field, ErrorMessage } from 'formik'

type CustomFieldType = {
    name: string,
    label: string,
    disabled: boolean,
    onChage?: () => void
}
export const CustomFieldCheckbox = (props: CustomFieldType) => {
    return (
        <div>
            <div className="form-check form-switch form-switch-md mb-3" onClick={props.onChage} dir="ltr">
                <Field disabled={props.disabled} type="checkbox" className="form-check-input" id={props.name} name={props.name} />
                <label className="form-check-label" htmlFor={props.name}>{props.label}</label>
            </div>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}
