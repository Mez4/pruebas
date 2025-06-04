import React, { forwardRef } from 'react'
import { Field, ErrorMessage } from 'formik'
// import { handleInputChange } from 'react-select/src/utils'
// import { InputType } from 'node:zlib'
import { FcOk } from "react-icons/fc";
import ReactTooltip from 'react-tooltip';

type CustomFieldType = {
    name: string,
    label: string,
    placeholder?: string,
    disabled: boolean,
    password?: boolean,
    valor?: string | number,
    onBlur?(): any,
    onChange?(): any,
    class?: string,
    hidden?: boolean,
    typeNumber?: boolean,
    id?: string,
    withButton?: boolean,
}
const ActionFieldNumberText = forwardRef((props: CustomFieldType, ref) => {

    var inputProps = {
        step: '0.00',
        min: '0.00',
        pattern: "[0.00-9.99]*",
        onKeyPress: (event: any) => {
            if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
            }
        }
    }

    // if (props.typeNumber) {
    //     inputProps.step = '0'
    //     inputProps.min = '0'
    //     inputProps.pattern = "[0-9]*"
    //     inputProps.onKeyPress = (event: any) => {
    //         if (!/[0-9]/.test(event.key)) {
    //             event.preventDefault();
    //         }
    //     }
    // }

    return (
        <>
            <div className="mb-3 input-group">
                {props.label.length > 1 &&
                    <label className="form-label mb-0 input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={props.name}>{props.label}</label>
                }
                <Field id={props.name} name={props.name}>
                    {({ field, form, meta }: any) => (
                        <input
                            className={`form-control ${props.class ? props.class : ''}`}
                            disabled={props.disabled}
                            type={!props.password ? "text" : "password"}
                            placeholder={props.placeholder ? props.placeholder : ''}
                            value={field.value}
                            onChange={(event) => {
                                form.setFieldValue(props.name, event.target.value);
                                if (props.onChange)
                                    props.onChange()
                            }}
                            onBlur={() => {
                                form.setFieldTouched(props.name)
                                if (props.onBlur)
                                    props.onBlur()
                            }}
                            id={props.id}
                            name={props.name}
                            ref={ref as React.RefObject<HTMLInputElement>}
                            hidden={props.hidden}
                            // {props.typeNumber && {...inputProps}}          
                            {...inputProps}
                        />
                    )}
                </Field>
                {props.withButton && <>
                    <button disabled={false} type="submit" className="button is-text " data-tip data-for={props.id}>
                        <FcOk />
                    </button>
                    <ReactTooltip id={props.id}
                        type="info"
                        effect="solid"
                        clickable
                        globalEventOff="click"
                    >
                        Aceptar
                    </ReactTooltip>
                </>
                }
            </div>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </>
    )
})

export default ActionFieldNumberText