import React, { useState, useEffect, forwardRef } from 'react'
import AsyncSelect from 'react-select/async'
import { ErrorMessage, Field } from 'formik'

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    loadOptions(inputText: string, callback: any): any,
    options: { value: number, label: string }[],
    addDefault: boolean,
    valor?: number,
    accion?(val: any): any,
    blur?(): any,
    noOptionsMessage?: string
}

const ActionAsyncSelectDefault = forwardRef((props: CustomFieldType, ref) => {

    const Values = {
        selected: 0
    }

    const [values, setValues] = useState(Values)

    useEffect(() => {
        if (props.valor !== undefined) {
            setValues(s => ({
                ...s,
                selected: props.valor as number
            }))
        } else {
            setValues(s => ({
                ...s,
                selected: 0
            }))
        }
    }, [props.valor])

    const defaultValue = (options: any, value: any) => {

        if (value === 0)
            return { value: 0, label: props.placeholder }

        let opt = options.find((option: any) => option.value === value)

        return opt ? opt : { value: 0, label: props.placeholder }
    }

    return (
        <div className="mb-3" >

            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <Field id={props.name} name={props.name}  >
                {
                    (control: any) => (
                        <AsyncSelect
                            loadOptions={props.loadOptions}
                            options={props.addDefault ? [{ value: 0, label: props.placeholder }, ...props.options] : props.options}
                            value={defaultValue(props.options, values.selected)}
                            onChange={(event) => {
                                let val = event!.value
                                control.form.setFieldValue(props.name, val);
                                setValues(s => ({
                                    ...s,
                                    selected: val
                                }))
                                if (props.accion)
                                    props.accion(val)
                            }}
                            onBlur={() => {
                                control.form.setFieldTouched(props.name)
                                if (props.blur)
                                    props.blur()
                            }}
                            id={props.name}
                            name={props.name}
                            maxMenuHeight={500}
                            placeholder={props.placeholder ? props.placeholder : ''}
                            isDisabled={props.disabled}
                            noOptionsMessage={() => props.noOptionsMessage ? props.noOptionsMessage : 'Sin opciones'}
                            ref={ref as React.RefObject<AsyncSelect<[], false>>}
                        />
                    )
                }
            </Field>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
})

export default ActionAsyncSelectDefault
