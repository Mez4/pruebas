import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, DatePickeStart, DatePickeEnd, CustomFieldText, CustomFieldText2 } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { Productos, Sucursales, Zonas, EstatusCredito, Distribuidores, Coordinadores, Clientes, Cajas } from '../../../../../selectores'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'
import moment from 'moment'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

// Icons
import { FiRefreshCcw } from 'react-icons/fi'
import { FaFilter } from 'react-icons/fa'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import Select from 'react-select'

registerLocale("es", es)

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    initialValues: {
        DiaID: number,
        MesID: number,
        DistribuidorID: number,
        AID: number,
    },
    cbRespuesta(item: any): any,
}

export const BuscarDetallesRelacion = (props: CFormType) => {
    const optDia: any[] = [{
        value: 8,
        label: "Día 8"
    }, {
        value: 23,
        label: "Día 23"

    }]
    const optMes: any[] = [{
        value: 1,
        label: "ENERO"
    }, {
        value: 2,
        label: "FEBRERO"

    }, {
        value: 3,
        label: "MARZO"
    }, {
        value: 4,
        label: "ABRIL"
    }, {
        value: 5,
        label: "MAYO"
    }, {
        value: 6,
        label: "JUNIO"
    }, {
        value: 7,
        label: "JULIO"
    }, {
        value: 8,
        label: "AGOSTO"
    }, {
        value: 9,
        label: "SEPTIEMBRE"
    }, {
        value:10,
        label: "OCTUBRE"
    }, {
        value: 11,
        label: "NOVIEMBRE"
    }, {
        value: 12,
        label: "DICIEMBRE"
    }

    ]
    const optA: any[] = [{
        value: 2020,
        label: "2020"
    }, {
        value: 2021,
        label: "2021"

    }, {
        value: 2022,
        label: "2022"
    }

    ]

    let isMounted = React.useRef(true)
    const [loading, setLoading] = useState(false)
    React.useEffect(() => {

        return () => {
            isMounted.current = false
        }
    }, [])
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                DistribuidorID: Yup.number().required('Seleccione un Distribuidor').moreThan(0, 'Seleccione un Distribuidor'),
                DiaID: Yup.number().required('Seleccione un Dia').moreThan(0, 'Seleccione un Dia'),
                MesID: Yup.number().required('Seleccione un Mes').moreThan(0, 'Seleccione un Mes'),
                AID: Yup.number().required("Campo obligatorio").min(1000, "Ingrese 4 carácteres").max(9999, "Ingrese 4 carácteres").typeError("El valor tiene que ser numérico")
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                let Datos = {
                    DiaID: isNaN(values.DiaID) ? 0 : values.DiaID,
                    MesID: isNaN(values.MesID) ? 0 : values.MesID,
                    AID: isNaN(values.AID) ? 0 : values.AID,
                    DistribuidorID: isNaN(values.DistribuidorID) ? 0 : values.DistribuidorID,
                }
                console.log("Valores", values)
                Funciones.FNgetbyfiltros(props.oidc, Datos)
                    .then((respuesta: any) => {
                        console.log("Filtro", respuesta)

                        props.cbRespuesta(respuesta)
                        setLoading(false)
                    })
                    .catch(() => {
                        setLoading(false)
                        toast.error("Error al consultar, vuelva a intentarlo")
                    })
            }}>
            <Form>
                <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                    <div>
                        <div style={{ float: 'left' }}><FaFilter /></div>
                        <div ><label> FILTROS</label></div>
                    </div>
                    <div className="columns is-centered is-mobile is-multiline">
                        <div className="column is-align-items-center  is-one-quarter-desktop is-half-tablet is-full-mobile">
                            <Distribuidores disabled={loading} WithProducto name={'DistribuidorID'} label={`${DescripcionDistribuidor(1)}`} />
                        </div>
                        <div className="column is-align-items-center  is-one-quarter-desktop is-half-tablet is-full-mobile">
                            <CustomSelect
                                disabled={loading}
                                label="Corte"
                                name="DiaID"
                                placeholder="Seleccione la Fecha de Corte"
                                options={optDia}
                                addDefault={false}
                            />
                        </div>
                        <div className="column is-align-items-center  is-one-quarter-desktop is-half-tablet is-full-mobile">
                            <CustomSelect
                                disabled={loading}
                                label="Mes"
                                name="MesID"
                                placeholder="Seleccione el mes"
                                options={optMes}
                                addDefault={false}
                            />
                        </div>
                        <div className="column is-align-items-center  is-one-quarter-desktop is-half-tablet is-full-mobile">

                        <CustomFieldText 
                        disabled={loading} 
                        label="Año" name="AID" 
                        placeholder={"Ingrese Año"}
                        
                        />
                   
                            {/*<CustomSelect
                                disabled={loading}
                                label="Año"
                                name="AID"
                                placeholder="Seleccione el año"
                                options={optA}
                                addDefault={false}
                            />*/}
                        </div>
                    </div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <br />
                        <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light">
                            <span className="is-hidden-touch">Buscar</span>&nbsp;<FiRefreshCcw />
                        </button>
                    </div>
                }
            </Form>

        </Formik>
    )
}