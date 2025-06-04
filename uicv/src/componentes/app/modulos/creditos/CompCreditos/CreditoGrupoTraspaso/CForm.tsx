import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, ModalWin, CustomFieldText } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Grupos, Sucursales } from '../../../../../selectores'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

// Icons
import { FaExchangeAlt } from 'react-icons/fa'
import Vales from '../../../distribuidor/CompDistribuidor/Vales'

type CFormType = {
    oidc: IOidc
    initialValues: {
        GrupoID: number,
        GrupoDestinoID: number,
        SucursalID: number
        // Distribuidores: number[]
    },
    Distribuidores: number[],
    cbActualizar(item: any): any,
    fnGetDistribuidor(GrupoID: number): any,
    fnTraspasando(loading: boolean): any
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = useState(false)

    const [showModal, setShowModal] = useState(false)

    const [Distribuidores, setDistribuidores] = useState([] as number[])
    const [loader, setLoader] = useState(false)
    const [tiposTraspaso, setTiposTraspaso] = useState([] as any[])
    const [data, setData] = useState({
        GrupoID: 0,
        GrupoDestinoID: 0,
        SucursalID: 0,
    })
    const clearFormByLevel = (level: number) => {
        if (level === 0 || level === 1 || level === 2) {
            setDistribuidores([])
        }
    }
    const obtenerTiposTraspaso = () => {
        Funciones.FNTipoTraspaso(props.oidc).then((respuesta: any) => {
            setTiposTraspaso(respuesta)
            console.log('respuesta ', respuesta);

            var tiposdeTraspaso = respuesta.map((item: any) => {
                return {
                    value: item.tipoTraspasoID,
                    label: item.nombre
                }
            })
            setTiposTraspaso(tiposdeTraspaso)
        }).catch((error: any) => {
            toast.error(error.request.response.message)
        })
    }


    useEffect(() => {

        setDistribuidores(props.Distribuidores)
    }, [props.Distribuidores])


    useEffect(() => {
        obtenerTiposTraspaso()
    }, [])
    return (
        <>
            <Formik
                initialValues={props.initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    GrupoID: Yup.number().required("Seleccione el grupo origen").moreThan(0, 'Seleccione el grupo origen'),
                    GrupoDestinoID: Yup.number().required("Seleccione el grupo destino").moreThan(0, 'Seleccione el grupo destino').typeError('Seleccione el grupo destino'),
                    // Distribuidores: Yup.array()
                    //         .min(1, 'Seleccione al menos una SOCIA')
                })}
                onSubmit={(values: any) => {
                    setShowModal(true)
                    console.log('Valores del traspaso', values);
                    setData(s => ({ ...s, GrupoID: values.GrupoID, GrupoDestinoID: values.GrupoDestinoID, SucursalID: values.SucursalID }))

                    // if (Distribuidores.length > 0) {
                    //     setLoading(true)
                    //     props.fnTraspasando(true)

                    // Funciones.FNTraspasar(props.oidc,
                    //         {
                    //             ...values,
                    //             Distribuidores
                    //         }
                    //     )
                    //         .then((respuesta: any) => {

                    //             setLoading(false)
                    //             props.fnTraspasando(false)

                    //             if (respuesta.res == 1) {
                    //                 props.cbActualizar(respuesta.Data)
                    //             }
                    //             else {
                    //                 toast.error(respuesta.msj)
                    //             }

                    //         })
                    //         .catch((error: any) => {
                    //             console.log(error)
                    //             setLoading(false)
                    //             props.fnTraspasando(false)
                    //             toast.error(`Ocurrió un error al traspasar las ${DescripcionDistribuidor(2)}`)
                    //         })
                    // }
                    // else
                    //     toast.error(`No ha seleccionado ninguna ${DescripcionDistribuidor(1)}`)

                }}>
                {({ values }) => (
                    <Form>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-4">
                                <Grupos oidc={props.oidc} name="GrupoID" disabled label='Grupo Origen' cbAccion={props.fnGetDistribuidor} cargar Accion GrupoID={values.GrupoID} />
                            </div>
                            <div className="column is-4">
                                <Sucursales disabled name="SucursalID" valor={values.SucursalID} />
                            </div>
                            <div className="column is-4">
                                <Grupos oidc={props.oidc} name="GrupoDestinoID" SucursalID={values.SucursalID} disabled={loading} label='Grupo Destino' cargar />
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

                        {(Distribuidores.length === 0) &&
                            <div className="text-danger">Seleccione al menos una {`${DescripcionDistribuidor(1)}`}</div>
                        }
                    </Form>
                )}
            </Formik>
            {showModal &&
                <ModalWin open={showModal} center={true} scrollable zIndex={3000}>
                    <ModalWin.Header>
                        <h4> Motivo de traspaso </h4>
                        <button
                            title="Cerrar"
                            type="button"
                            className="delete"
                            onClick={() => {
                                setShowModal(false)
                            }}
                        />
                    </ModalWin.Header>
                    <ModalWin.Body>
                        <Formik
                            initialValues={{
                                tipoTraspaso: 0,
                                motivo: ''
                            }}
                            enableReinitialize
                            yupSchema={Yup.object().shape({
                                // tipo de traspaso sin poder seleccionar la primera opcion
                                tipoTraspaso: Yup.number().required('Tipo de traspaso requerido').moreThan(0, 'Seleccione el tipo de traspaso'),
                                motivo: Yup.string().required('Motivo requerido')

                            })}
                            onSubmit={(values: any) => {
                                setLoader(true)
                                // console.log(values)
                                let obj = {
                                    ...values,
                                    GrupoID: data.GrupoID,
                                    GrupoDestinoID: data.GrupoDestinoID,
                                    SucursalID: data.SucursalID,
                                    Distribuidores
                                }
                                Funciones.FNTraspasar(props.oidc, obj)
                                    .then((respuesta: any) => {
                                        setLoading(false)
                                        props.fnTraspasando(false)
                                        if (respuesta.res == 1) {
                                            props.cbActualizar(respuesta.Data)
                                            setShowModal(false)
                                            toast.success('Traspaso realizado con éxito')
                                        }
                                        else {
                                            setShowModal(false)
                                            toast.error(respuesta.msj)
                                        }
                                        setLoader(false)
                                    })
                                    .catch((error: any) => {
                                        console.log(error.response.data)
                                        setLoading(false)
                                        props.fnTraspasando(false)
                                        // toast.error(`Ocurrió un error al traspasar las ${DescripcionDistribuidor(2)}`)
                                        toast.error(error.response.data.msj ?? 'Ocurrió un error al traspasar las distribuidoras')
                                        setLoader(false)
                                    })

                                // console.log('objeto', obj);

                            }}>

                            {({ values }) => (
                                <Form>
                                    <div className="mb-3">
                                        <div className="row">
                                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                                <CustomSelect
                                                    disabled={false}
                                                    label="Tipo de traspaso"
                                                    name="tipoTraspaso"
                                                    placeholder="Selecciona el tipo de traspaso"
                                                    options={tiposTraspaso}
                                                    addDefault={false}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                                <CustomFieldText disabled={false} label="Observaciones adicionales" name="motivo" placeholder="Comentarios adicionales" />
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => { setShowModal(false) }}>
                                                Cancelar
                                            </button>
                                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                                {loader ? <Spinner /> : 'Aceptar'}
                                            </button>
                                        </div>




                                    </div>

                                </Form>

                            )}
                        </Formik>

                    </ModalWin.Body>
                </ModalWin>

            }
        </>
    )
}
