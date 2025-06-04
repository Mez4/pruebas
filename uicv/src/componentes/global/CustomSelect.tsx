import React from 'react'
// import Select from 'react-select'
import { ErrorMessage, Field } from 'formik'

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    options: { value: any, label: string, group?: string, disabled?: boolean }[],
    isMulti?: boolean,
    addDefault: boolean,

}

const CustomSelect = (props: CustomFieldType) => {

    // Grupos
    const Grupos: string[] = []
    props.options.filter(o => o.group !== undefined).forEach(o => {
        if (o.group !== undefined && !Grupos.includes(o.group))
            Grupos.push(o.group)
    })

    // Renderear el componente
    return (
        <div className="mb-3">
            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <Field id={props.name} name={props.name} component="select" className="form-select" disabled={props.disabled}>

                {props.placeholder !== undefined && <option key='default'>{props.placeholder ? props.placeholder : ''}</option>}

                {props.options.filter(o => o.group === undefined).map((optn, index) =>
                    <option disabled={optn.disabled} key={'nogroup' + index} value={optn.value} label={optn.label} />)}

                {Grupos.map((g, gi) => (
                    <optgroup key={'g' + gi} label={g}>
                        {props.options.filter(o => o.group !== undefined && o.group === g).map((optn, index) => (<option key={'opt__' + index} value={optn.value} label={optn.label} />))}
                    </optgroup>
                ))}

            </Field>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}
export default CustomSelect
