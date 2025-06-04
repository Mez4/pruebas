import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, DatePickeStart, DatePickeEnd } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { Sucursales, Productos, Grupos, Coordinadores } from '../../../../../selectores'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'
import moment from 'moment'

// Icons
import { FiRefreshCcw } from 'react-icons/fi'
import { FaFilter } from 'react-icons/fa'
import { iUI } from '../../../../../../interfaces/ui/iUI'

registerLocale("es", es)

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    initialValues: {
        ProductoID: number,
        SucursalID: number,
        CoordinadorID: number,
        GrupoID: number,
    },
    cbRespuesta(item: any): any
}

export const BuscarGrupos = (props: CFormType) => {
    const [loading, setLoading] = useState(false)

    const [startDate, setStartDate] = useState(moment().add(-30, 'd').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());

    return (
        <Formik
            initialValues={props.initialValues}
            // enableReinitialize
            validationSchema={Yup.object().shape({
                // SucursalID: Yup.array().min(1, 'Seleccione al menos una Sucursal'),
                // CoordinadorID: Yup.number().required("Seleccione el Coordinador").moreThan(0, 'Seleccione el Coordinador'),
                // ProductoID: Yup.number().required("Seleccione el Producto").moreThan(0, 'Seleccione el Producto'),
            })}
            onSubmit={(values: any) => {
                // console.log('values: ', values )
                setLoading(true)
                Funciones.FNGet(props.oidc, values.ProductoID, values.SucursalID, values.CoordinadorID, values.GrupoID)
                    .then((respuesta: any) => {
                        props.cbRespuesta(respuesta)
                        setLoading(false)
                    })
                    .catch(() => {
                        setLoading(false)
                        toast.error("Error al consultar, vuelva a intentarlo")
                    })
            }}>
            {({ values }) => (
                <Form>
                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                        <div>
                            <div style={{ float: 'left' }}><FaFilter /></div>
                            <div ><label> FILTROS</label></div>
                        </div>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <div style={{ display: 'inline-block' }}>
                                <div className="columns is-desktop is-tablet">
                                    <div className="column is-3">
                                        <Productos oidc={props.oidc} ui={props.ui} name="ProductoID" isSingle valor={values.ProductoID} disabled={loading} />
                                    </div>
                                    <div className="column is-3">
                                        <Sucursales disabled={loading} name={'SucursalID'} valor={values.SucursalID} />
                                    </div>
                                    <div className="column is-3">
                                        <Coordinadores disabled={loading} SucursalID={values.SucursalID} name={'CoordinadorID'} valor={values.CoordinadorID} />
                                    </div>
                                    <div className="column is-3">
                                        <Grupos oidc={props.oidc} name="GrupoID" SucursalID={values.SucursalID} disabled={loading} label='Grupo' cargar />
                                    </div>
                                </div>
                                <div className="columns is-desktop is-tablet">
                                    <div className="column is-12">
                                        {loading && <Spinner />}
                                        {!loading &&
                                            <div className="text-start">
                                                <br />
                                                <button disabled={loading} type="submit" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => { }}>
                                                    <span className="is-hidden-touch">Buscar</span>&nbsp;<FiRefreshCcw />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}