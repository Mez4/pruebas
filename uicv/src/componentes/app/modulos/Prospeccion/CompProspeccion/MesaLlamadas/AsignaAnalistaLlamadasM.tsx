import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, ActionSelect, ModalWin } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

type CFormType = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    IdAnalista?: number,
    initialValues: {
        PersonaAnalistaID: number, ProspectoID: number
    },
    optAnalista: { value: number, label: string }[],
    selectedRows: any[]
    cbActualizar(): any,
    fnCancelar(): any
}

export const AsignaAnalistaLlamadasM = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (

        <ModalWin open={props.mostrar} center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    Asignar Analista
                </h5>
                <button type="button" className="delete" onClick={() => {
                    props.fnCancelar()
                }} />
            </ModalWin.Header>
            <ModalWin.Body>

                <Formik
                    initialValues={props.initialValues}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        PersonaAnalistaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
                    })}

                    onSubmit={(values: any) => {
                        // Set our form to a loading state
                        setLoading(true)
                        let a = {
                            Asignacion: props.selectedRows,
                            PersonaAnalistaID: values.PersonaAnalistaID
                        }
                        Funciones.FNAsignaAnalistaLlamadasM(props.oidc, a)
                            .then((respuesta: any) => {
                                setLoading(false)
                                props.cbActualizar()
                                toast.success("ANALISTA DE LLAMADAS ASIGNADO CORRECTAMENTE")
                                props.fnCancelar()
                            })
                            .catch((error: any) => {
                                toast.error(`ERROR AL ASIGNAR ${error}`)
                                props.cbActualizar()
                                setLoading(false)
                            })
                    }
                    }>
                    <Form>

                        <ActionSelect
                            disabled={false}
                            label="Seleccione un Analista"
                            name="PersonaAnalistaID"
                            placeholder="Seleccione un analista"
                            options={props.optAnalista}
                            addDefault={false}
                            valor={props.initialValues.PersonaAnalistaID}

                        />
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Asignar</button>
                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>


    )
}