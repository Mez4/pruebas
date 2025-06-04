import React from 'react'
// import Select from 'react-select'
import { ErrorMessage, Field, FieldProps } from 'formik'
import { FiRefreshCcw } from 'react-icons/fi'

type CustomFieldType = {
    name: string,
    label?: string,
    placeholder?: string,
    disabled: boolean,
    options: { value: any, label: string, group?: string }[],
    isMulti?: boolean,
    addDefault: boolean,
    accion?(val: any): any,
    valor?: any

    // Funciones
    mostrarBoton?: boolean,
    funcionActualizacion?(): any
}

const CustomSelect2 = (props: CustomFieldType) => {
    // Grupos
    const Grupos: string[] = []
    props.options.filter(o => o.group !== undefined).forEach(o => {
        // console.log(o)
        if (o.group !== undefined && !Grupos.includes(o.group))
            Grupos.push(o.group)
    })

    const [valueSelected, setvalueSelected] = React.useState(props.valor)
    React.useEffect(() => {
        if (props.valor) {
            setvalueSelected(props.valor)
        } else {
            setvalueSelected(0)
        }
    }, [props.valor])

    // Renderear el componente
    return (
        <div className={"mb-2"}>
            <div className="input-group">
                {props.label !== undefined &&
                    <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={props.name}>{props.label}</label>
                }
                <Field id={props.name} name={props.name} disabled={props.disabled}>
                    {({ field, form }: FieldProps) => (
                        <React.Fragment>
                            <select

                                {...field} value={valueSelected} className="form-select" disabled={props.disabled} onChange={e => {
                                    setvalueSelected(e.target.value);
                                    form.setFieldValue(props.name, e.target.value)
                                    if (props.accion)
                                        props.accion(e.target.value)
                                }}>

                                {props.placeholder !== undefined && <option key='default'>{props.placeholder ? props.placeholder : ''}</option>}

                                {props.options.filter(o => o.group === undefined).map((optn, index) => <option key={'nogroup' + index} value={optn.value} label={optn.label} />)}

                                {Grupos.map(g => (
                                    <optgroup label={g}>
                                        {props.options.filter(o => o.group !== undefined && o.group === g).map((optn, index) => (<option key={'opt__' + index} value={optn.value} label={optn.label} />))}
                                    </optgroup>
                                ))}

                            </select>
                            {props.funcionActualizacion !== undefined && props.mostrarBoton !== false &&
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => {
                                        form.setFieldValue(props.name, "0")
                                        if (props.funcionActualizacion !== undefined)
                                            props.funcionActualizacion()
                                    }}>
                                    <FiRefreshCcw />
                                </button>
                            }
                        </React.Fragment>
                    )}
                </Field>
            </div>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}
export default CustomSelect2
