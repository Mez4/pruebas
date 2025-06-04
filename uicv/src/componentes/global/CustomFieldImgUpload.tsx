import React, { useState, useEffect, useRef } from 'react'
import { Field, ErrorMessage } from 'formik'
import { ImgViewer } from '.'
import PDFViewer from './PDFViewer'
import PDFViewer2 from './PDFViewer2'
// import { FaFileUpload } from 'react-icons/fa'

const defaultImgSrc = "/noimage.png"

type CustomFieldType = {
    name: string,
    label: string,
    disabled: boolean,
    imageSrc: string | null
}

const imgValues = {
    imageName: '',
    imageSrc: defaultImgSrc,
    imageFile: null
}


const CustomFieldImgUpload = (props: CustomFieldType) => {

    const [values, setValues] = useState(imgValues)

    const hiddenFileInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        hiddenFileInput.current!.value = '';
        if (props.imageSrc !== null) {
            setValues(s => ({
                ...s,
                imageName: '',
                imageSrc: props.imageSrc as string,
                imageFile: null
            }))
        } else {
            setValues(s => ({
                ...s,
                imageName: '',
                imageSrc: defaultImgSrc,
                imageFile: null
            }))
        }
    }, [props.imageSrc])

    const showPreview = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues(s => ({
                    ...s,
                    imageName: e.target.files[0].name,
                    imageFile,
                    imageSrc: x.target?.result! as string
                }))
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues(s => ({
                ...s,
                imageName: '',
                imageFile: null,
                imageSrc: defaultImgSrc
            }))
        }
    }

    return (
        <div className="mb-3 text-center">
            <label className="form-label mb-0" htmlFor={props.name}>{props.label}</label>
            <button className="form-control" type={"button"} onClick={() => {
                hiddenFileInput.current?.click()
            }}>
                <i className={values.imageName ? "fas fa-check" : "fas fa-upload"} style={{ color: values.imageName ? "green" : "grey" }}></i>
                {' '}
                {values.imageName ? values.imageName : "Seleccionar Imagen"}
            </button>
            <br />
            {/* <img src={values.imageSrc} style={{ maxWidth: 250, maxHeight: 150 }} alt="" /> */}
            {values.imageName === '' && <div className="text-danger">Seleccione la imagen a subir</div>}
            {values.imageName && <ImgViewer imgSrc={values.imageSrc} noToolbar={false} zIndex={1500} maxWidth={250} maxHeight={200} /> &&  <div style={{ width: '250px', height: '200px', backgroundColor: 'white', textAlign: 'center' }}> <PDFViewer2 file={values.imageSrc} /></div> }
            <Field disabled={props.disabled} id={props.name} name={props.name}  >
                {
                    (control: any) => (
                        <input
                            id={props.name}
                            type="file"
                            accept="image/*"
                            // className="form-control"
                            style={{ display: 'none' }}
                            ref={hiddenFileInput}
                            onChange={(event) => {
                                control.form.setFieldValue(props.name/*"file"*/, event.target.files?.[0]);
                                showPreview(event);
                            }}
                        />
                    )
                }
            </Field>
            <ErrorMessage component="div" name={props.name} className="text-danger" />
        </div>
    )
}

export default CustomFieldImgUpload