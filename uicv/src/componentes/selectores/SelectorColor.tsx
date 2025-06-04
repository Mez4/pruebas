import React from 'react'
import { ChromePicker } from 'react-color'
import { Field, FieldProps } from 'formik'

type SelectorColorTipo = {
    name: string,
    label: string
}
const SelectorColor = ({ name, label }: SelectorColorTipo) => {
    const [mostrar, setMostrar] = React.useState(false)
    return (
        <div>
            <Field name={name}>
                {({ field, form }: FieldProps) => (
                    <div className={'mb-2'}>
                        <button className={'btn btn-outline-secondary'} type={'button'} onClick={() => setMostrar(!mostrar)}>
                            {label}
                            <span className={'ms-2'} style={{ backgroundColor: field.value }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </button>
                        {mostrar ? <div style={{ position: 'absolute', zIndex: 2, }}>
                            <div style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px', }} onClick={() => setMostrar(false)} />
                            <ChromePicker
                                disableAlpha={true}
                                color={field.value}
                                onChange={(color) => { form.setFieldValue(field.name, color.hex) }}
                                onChangeComplete={color => form.setFieldValue(field.name, color.hex)}
                            />
                        </div> : null}
                    </div>
                )}
            </Field>
        </div>
    )
}

export default SelectorColor