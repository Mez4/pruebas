import React, { useState, useEffect, forwardRef } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik'

type ActionAsyncCreatableSelectType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    loadOptions(inputText: string, callback: any): any,
    options: { value: string, label: string }[],
    addDefault: boolean,
    valor?: number,
    accion?(val: any): any,
    blur?(): any,
    noOptionsMessage?: string,
    dscText?: string
}

const ActionAsyncCreatableSelect = forwardRef((props: ActionAsyncCreatableSelectType, ref) => {

    const formikProps = useFormikContext()
    const value = { value: '', label: '' }
    const options: { value: string, label: string }[] = []
    const [state, setState] = useState({
        value,
        options,
        isLoading: false,
        optSource: ''
    })

    const createOption = (label: string) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

    const handleChange = (newValue: any, actionMeta: any) => {
        setState(s => ({ ...s, value: newValue }))
    };

    const handleCreate = (inputValue: any) => {
        const newOption = createOption(inputValue);

        setState(s => ({
            ...s,
            isLoading: false,
            value: newOption,
            options: [...state.options, newOption],
            optSource: 'create'
        }))
    };

    // const Values = {
    //     selected: 0
    // }

    // const [values, setValues] = useState(Values)

    useEffect(() => {
        if (state.options.length > 0 && state.optSource === 'create') {
            let val = state.options[state.options.length - 1]
            formikProps.setFieldValue(props.name, val);
            if (props.accion) {
                let valor = parseInt(val.value)
                props.accion(valor)
            }
        }
    }, [state.options])

    useEffect(() => {
        setState(s => ({ ...s, options: props.options, optSource: 'props' }))
    }, [props.options])


    // useEffect(() => {
    //     if (props.valor !== undefined) {
    //         setValues(s => ({
    //             ...s,
    //             selected: props.valor as number
    //         }))
    //     } else {
    //         setValues(s => ({
    //             ...s,
    //             selected: 0
    //         }))
    //     }
    // }, [props.valor])

    const defaultValue = (options: any, value: any) => {

        if (value === 0)
            return { value: 0, label: props.placeholder }

        let opt = options.find((option: any) => option.value === value)

        return opt ? opt : { value: 0, label: props.placeholder }
    }

    return (
        <div className="mb-3" >

            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <Field id={props.name} name={props.name} disabled={props.disabled}>
                {
                    // (control: any) => (
                    ({ field, form }: FieldProps) => (
                        <React.Fragment>
                            <AsyncCreatableSelect
                                loadOptions={props.loadOptions}
                                component={AsyncCreatableSelect}
                                // options={ props.addDefault ? [ { value: 0, label: props.placeholder }, ...props.options] : props.options} 
                                options={state.options}
                                value={state.value}
                                // value={defaultValue(props.options, state.value)}
                                onCreateOption={(event) => {
                                    handleCreate(event)
                                }}
                                onChange={(event, action) => {
                                    form.setFieldValue(props.name, event);
                                    handleChange(event, action)
                                    if (props.accion)
                                        props.accion(event ? parseInt(event!.value) : 0)
                                }}
                                onBlur={() => {
                                    form.setFieldTouched(props.name)
                                    if (props.blur)
                                        props.blur()
                                }}
                                id={props.name}
                                name={props.name}
                                maxMenuHeight={500}
                                placeholder={props.placeholder ? props.placeholder : ''}
                                isDisabled={state.isLoading || props.disabled}
                                isLoading={state.isLoading}
                                isClearable
                                formatCreateLabel={(inputText) => `${props.dscText ? props.dscText + ' ' : 'Ingresar'}: ${inputText}`}
                                noOptionsMessage={() => props.noOptionsMessage ? props.noOptionsMessage : 'Sin opciones'}
                                // ref={ref as React.RefObject<AsyncCreatableSelect <[], false>>}
                                ref={ref as React.RefObject<AsyncCreatableSelect<{ value: string; label: string; }, false>>}
                            />
                        </React.Fragment>
                    )
                }
            </Field>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
})

export default ActionAsyncCreatableSelect
