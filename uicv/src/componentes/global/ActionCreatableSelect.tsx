import React, { useState, useEffect, forwardRef } from 'react'
import CreatableSelect from 'react-select/creatable';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik'

type CustomFieldType = {
    options: { value: string, label: string }[],
    value: number,
    name: string,
    label: string,
    disabled: boolean,
    placeholder: string,
    accion?(val: any): any
}

// interface interfaz {
//     value: string, 
//     label: string
// }

const ActionCreatableSelect = forwardRef((props: CustomFieldType, ref) => {

    // const value: interfaz = {}
    const formikProps = useFormikContext()
    // const value = {} as interfaz;   
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
        // setState(s => ({ ...s, isLoading: true }))
        // const { options } = state;
        const newOption = createOption(inputValue);

        setState(s => ({
            ...s,
            isLoading: false,
            value: newOption,
            options: [...state.options, newOption],
            optSource: 'create'
        }))
    };

    useEffect(() => {
        if (state.options.length > 0 && state.optSource === 'create') {
            let val = state.options[state.options.length - 1]
            formikProps.setFieldValue(props.name, val);
            if (props.accion) {
                // let valor = (val.value as unknown) as number
                let valor = parseInt(val.value)
                props.accion(valor)
            }
        }
    }, [state.options])

    useEffect(() => {
        setState(s => ({ ...s, options: props.options, optSource: 'props' }))
    }, [props.options])

    // Renderear el componente
    return (
        <div className="mb-3" >
            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <Field id={props.name} name={props.name} disabled={props.disabled}>
                {({ field, form }: FieldProps) => (
                    <React.Fragment>
                        <CreatableSelect
                            id={props.name}
                            name={props.name}
                            component={CreatableSelect}
                            isClearable
                            isDisabled={state.isLoading || props.disabled}
                            isLoading={state.isLoading}
                            onChange={(event, action) => {
                                form.setFieldValue(props.name, event);
                                handleChange(event, action)
                                if (props.accion)
                                    props.accion(event ? parseInt(event!.value) : 0)
                            }}
                            formatCreateLabel={(inputText) => `Ingresar: ${inputText}`}
                            // onInputChange={(event) => {
                            //     console.log('onInputChange: ', event)
                            // let val = event!.value
                            // form.setFieldValue(props.name, val);
                            // setValues(s => ({
                            //     ...s,
                            //     selected : val
                            // })) 
                            // if(props.accion)
                            //     props.accion(val) 
                            // }}
                            onCreateOption={(event) => {
                                // console.log('onCreateOption: ', event)
                                // form.setFieldValue(props.name, event);
                                handleCreate(event)
                            }}
                            options={state.options}
                            value={state.value}
                            onBlur={() => {
                                form.setFieldTouched(props.name)
                                // if(props.blur)
                                //     props.blur()
                            }}
                            ref={ref as React.RefObject<CreatableSelect<{ value: string; label: string; }, false>>}
                            placeholder={props.placeholder ? props.placeholder : ''}
                        />
                    </React.Fragment>
                )}
            </Field>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
})

export default ActionCreatableSelect