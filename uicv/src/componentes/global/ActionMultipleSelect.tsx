import React, { useState, useEffect, forwardRef } from 'react'
import Select from 'react-select'
// import makeAnimated from 'react-select/animated';
import { ErrorMessage, Field } from 'formik'
import { filterArrayByValues } from '../../global/functions'

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    options: { value: number, label: string }[],
    addDefault: boolean,
    valor?: [] | number[],
    delete?: number,
    accion?(val: any): any,
    noOptionsMessage?: string,
    maxMenuHeight?: number,
    openMenuOnClick?: boolean
}

const Values = {
    selected: []
}

const ActionMultipleSelect = forwardRef((props: CustomFieldType, ref) => {

    const [values, setValues] = useState(Values)

    useEffect(() => {
        if (props.valor !== undefined) {
            setValues(s => ({
                ...s,
                selected: props.valor as []
            }))
        } else {
            setValues(s => ({
                ...s,
                selected: []
            }))
        }
        // eslint-disable-next-line
    }, [props.valor])

    useEffect(() => {
        if (values.selected && props.delete)
            setValues(s => ({
                ...s,
                selected: values.selected.filter((value: any) => value !== props.delete) as []
            }))
        // eslint-disable-next-line
    }, [props.delete])

    // const filterArrayByValues = (array: any, values: any, propertyName: any) => {
    //     return array.filter((arrayItem: any) => {
    //         return values.some((value: any) => {
    //             return value === arrayItem[propertyName];
    //         });
    //     });
    // }

    const defaultValue = (options: any, values: any) => {
        // if (value === [])
        //     return { value: 0, label: props.placeholder 

        return filterArrayByValues(options, values, "value")
    }

    return (
        <div className="mb-3">
            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <Field id={props.name} name={props.name}  >
                {
                    (control: any) => (
                        <Select
                            options={props.addDefault ? [{ value: 0, label: props.placeholder }, ...props.options] : props.options}
                            value={defaultValue(props.options, values.selected)}
                            onChange={(event, action) => {
                                let val = event.map((v: any) => parseInt(v.value))
                                control.form.setFieldValue(props.name, val);
                                setValues(s => ({
                                    ...s,
                                    selected: val as []
                                }))
                                if (props.accion)
                                    props.accion(val)
                            }}
                            onBlur={() => control.form.setFieldTouched(props.name)}
                            id={props.name}
                            name={props.name}
                            placeholder={props.placeholder ? props.placeholder : ''}
                            isDisabled={props.disabled}
                            isMulti
                            maxMenuHeight={props.maxMenuHeight}
                            backspaceRemovesValue={false}
                            openMenuOnClick={props.openMenuOnClick}
                            ref={ref as React.RefObject<Select>}
                            noOptionsMessage={() => props.noOptionsMessage ? props.noOptionsMessage : 'Sin opciones'}
                        // components={animatedComponents}
                        />
                    )
                }
            </Field>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
})
export default ActionMultipleSelect