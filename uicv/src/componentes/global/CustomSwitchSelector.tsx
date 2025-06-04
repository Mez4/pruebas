import React, { useState, useEffect } from 'react'
import { Field, ErrorMessage, useFormikContext } from 'formik'
import SwitchSelector from "react-switch-selector";

type CustomFieldType = {
    name: string,
    valor: number,
    options: any[],
    disabled?: boolean,
}

const CustomSwitchSelector = (props: CustomFieldType) => {

    // console.log('props: ', props)

    const formikProps = useFormikContext()

    useEffect(() => {
        formikProps.setFieldValue(props.name, props.valor);
    }, [props.valor])

    useEffect(() => {
        if (props.options.length > 0) {
            formikProps.setFieldValue(props.name, props.options[0].value);
        }
    }, [props.options])

    return (
        <div>
            <Field type="input" hidden name={props.name} id={props.name} />
            <SwitchSelector
                onChange={(v) => (
                    formikProps.setFieldValue(props.name, v)
                )}
                options={props.options}
                backgroundColor={"#FFFFFF"}
                fontColor={"#f5f6fa"}
                selectionIndicatorMargin={2}
                disabled={props.disabled}
            />
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}

export default CustomSwitchSelector