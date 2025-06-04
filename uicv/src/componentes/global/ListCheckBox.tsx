import React from 'react'
import { Field, ErrorMessage } from 'formik'

type CustomFieldType = {
    name: string,
    label: string,
    disabled: boolean,
    data: any,
}

export const ListCheckBox = (props: CustomFieldType) => {
    return (
        <div>
            <>
                {props.data.map((item, index) => (
                    <label key={item.label}>
                        <input
                            readOnly
                            type="checkbox"
                            checked={item.checked || false}
                        // onClick={() => toggle(index)}
                        />
                        {item.label}
                    </label>
                ))}
            </>

        </div>
    )
}
