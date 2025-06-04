import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect } from '../../../../../global'
//import * as Funciones from './Funciones'
import * as Funciones from '.././ReasignarProspectoInteresado/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Promotores, Sucursales, Grupos } from '../../../../../selectores'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

// Icons
import { FaExchangeAlt } from 'react-icons/fa'
import Vales from '../../../distribuidor/CompDistribuidor/Vales'


type CFormType = {
    oidc: IOidc
    initialValues: {
        PromotorID: number,
        PromotorDestinoID: number,
        SucursalID: number
    },
    Prospectos: number[],
    cbActualizar(item: any): any,
    fnTraspasando(loading: boolean): any
}


export const CForm = (props: CFormType) => {

    const [loading, setLoading] = useState(false)

    const [Prospectos, setProspectos] = useState([] as number[])

    const clearFormByLevel = (level: number) => {
        if (level === 0 || level === 1 || level === 2) {
            setProspectos([])
        }
    }

    useEffect(() => {
        console.log("Prospectos", props.Prospectos)
        setProspectos(props.Prospectos)
    }, [props.Prospectos])

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                PromotorID: Yup.number().required("Seleccione el grupo origen").moreThan(0, 'Seleccione el grupo origen'),
                PromotorDestinoID: Yup.number().required("Seleccione el Promotor Destino").moreThan(0, 'Seleccione el Promotor Destino')
            })}
            onSubmit={(values: any) => {
                if (Prospectos.length > 0) {
                    setLoading(true)
                    props.fnTraspasando(true)

                    Funciones.FNTraspasar(props.oidc,
                        {
                            ...values,
                            Prospectos
                        }
                    )
                        .then((respuesta: any) => {

                            setLoading(false)
                            props.fnTraspasando(false)

                            if (respuesta.res == 1) {
                                props.cbActualizar(respuesta.Data)
                                toast.success('Se traspasó correctamente')
                            }
                            else {
                                toast.error(respuesta.msj)
                            }

                        })
                        .catch((error: any) => {
                            console.log(error)
                            setLoading(false)
                            props.fnTraspasando(false)
                            toast.error('Ocurrió un error al traspasar')
                        })
                }
                else
                    toast.error('No ha seleccionado ningún prospecto')

            }}>
            {({ values }) => (
                <Form>
                    <div className="columns is-desktop is-tablet">
                        <div className="column is-4">
                        <Promotores  name='PromotorID' disabled SucursalID={values.SucursalID} valor={values.PromotorID} label='Promotor Origen' />
                        </div>
                        <div className="column is-4">
                            <Sucursales disabled name="SucursalID" valor={values.SucursalID} />
                        </div>
                        <div className="column is-4">
                            <Promotores name='PromotorDestinoID' SucursalID={values.SucursalID} valor={values.PromotorID} label='Promotor Destino' />
                        </div>
                    </div>
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <div className="control">
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light" >
                                    <span className="is-hidden-touch">Traspasar <FaExchangeAlt /></span>
                                </button>
                            </div>
                        </div>
                    }
                    {(Prospectos.length === 0) &&
                        <div className="text-danger">Seleccione al menos un Prospecto</div>
                    }
                </Form>
            )}
        </Formik>
    )
}
