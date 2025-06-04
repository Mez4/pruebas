import React, { useState, useEffect, forwardRef } from 'react'
import Select from 'react-select'
import { ErrorMessage, Field } from 'formik'

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    options: { value: number, label: string }[],
    addDefault: boolean,
    valor?: any,
    accion?(val: any): any,
    accion2?(val: any): any,
    accion3?(val: any): any,
    blur?(): any,
    noOptionsMessage?: string
    onChange?(val: any): any,
    // refInput?: any
}

const Values = {
    selected: 0
}

const ActionSelect = forwardRef((props: CustomFieldType, ref) => {

    const [values, setValues] = useState(Values)

    // selectRef: React.RefObject<Select<T>>

    // console.log(props.name, ref)

    useEffect(() => {
        // hiddenFileInput.current!.value = 0; 
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

        // if (options === []) 
        //     return { value: 0, label: props.placeholder }

        let opt = options.find((option: any) => option.value === value)

        return opt ? opt : { value: 0, label: props.placeholder }
    }

    return (
        <div className="mb-3" >

            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <Field id={props.name} name={props.name}  >
                {
                    (control: any) => (
                        <Select
                            options={props.addDefault ? [{ value: 0, label: props.placeholder }, ...props.options] : props.options}
                            value={defaultValue(props.options, values.selected)}
                            onChange={(event) => {


                                let val = event!.value
                                let val_label = event!.label
                                control.form.setFieldValue(props.name, val);
                                setValues(s => ({
                                    ...s,
                                    selected: val
                                }))
                                if (props.accion)
                                    props.accion(val)
                                let a = {
                                    SucursalID: val,
                                    NombreSucursal: val_label,
                                };
                                props.accion2 != null ? props.accion2(a) : "No seleccionado"
                                props.accion3 != null ? props.accion3(a) : "No seleccionado"
                            }}
                            onBlur={() => {
                                control.form.setFieldTouched(props.name)
                                if (props.blur)
                                    props.blur()
                            }}
                            id={props.name}
                            name={props.name}
                            placeholder={props.placeholder ? props.placeholder : ''}
                            isDisabled={props.disabled}
                            maxMenuHeight={250}
                            // ref={ref}
                            ref={ref as React.RefObject<Select>}
                            noOptionsMessage={() => props.noOptionsMessage ? props.noOptionsMessage : 'Sin opciones'}
                            styles={{
                                // Fixes the overlapping problem of the component
                                menu: provided => ({ ...provided, zIndex: 9999 })
                            }}
                        />
                        // <select 
                        //     id={props.name}
                        //     name={props.name} 
                        //     value={values.selected}
                        //     disabled={props.disabled}
                        //     className="form-select"
                        //     onChange={(event) => {
                        //         control.form.setFieldValue(props.name, parseInt(event.target.selectedOptions[0].value));
                        //         setValues(s => ({
                        //             ...s,
                        //             selected : parseInt(event.target.selectedOptions[0].value)
                        //         }))
                        //         if(props.accion)
                        //             props.accion(parseInt(event.target.selectedOptions[0].value)) 
                        //     }}
                        //     onBlur={ () => control.form.setFieldTouched(props.name)}
                        // >                               
                        //     <option value="0">{props.placeholder ? props.placeholder : ''}</option>
                        //     {props.options.map((optn, index) => <option key={index} value={optn.value} label={optn.label}/>)} 
                        // </select>
                    )
                }
            </Field>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
})

export default ActionSelect
