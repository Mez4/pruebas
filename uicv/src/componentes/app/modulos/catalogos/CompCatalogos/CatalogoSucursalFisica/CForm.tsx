import React, { useState, useEffect } from 'react'

import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { CustomFieldText2, Spinner } from '../../../../../global'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { OrientacionVialidadesTipo, VialidadesTipo, ViviendasTipo, Asentamientos, ControlAsentamientos, BuscarAsentamiento } from '../../../../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        Nombre: string,
        Telefono: string,
        vialidadTipoId: number,
        orientacionVialidadTipoId: number,
        AsentamientoID: number,
        NombreVialidad: string,
        NumeroExterior: string,
        NumeroInterior: string,
        ReferenciasGeograficas: string,
        ViviendaTipoId: number
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = useState(false)

    const [showAsentamiento, setShowAsentamiento] = useState(false)

    const [AsentamientoID, setAsentamientoID] = useState(0)

    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false)
        setAsentamientoID(id);
    }

    useEffect(() => {
        setAsentamientoID(props.initialValues.AsentamientoID)
    }, [props.initialValues.AsentamientoID])

    return (
        <>
            <Formik
                initialValues={props.initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    Nombre: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(35, "Maximo 35 caracteres"),
                    NombreVialidad: Yup.string().required().min(3).max(120),
                    vialidadTipoId: Yup.number().typeError('Error').required().min(1),
                    orientacionVialidadTipoId: Yup.number().required().min(1),
                    NumeroExterior: Yup.string().min(1).max(120),
                    NumeroInterior: Yup.string().min(1).max(120),
                    ReferenciasGeograficas: Yup.string().required().min(10).max(120),
                    AsentamientoID: Yup.number().required('Seleccione un Asentamiento').moreThan(0, 'Seleccione un Asentamiento'),
                    ViviendaTipoId: Yup.number().required().min(1)
                })}
                onSubmit={(values: any) => {
                    console.log('VALUES',values)
                    // Set our form to a loading state
                    setLoading(true)

                    // Finish the callback
                    if (props.Id === undefined)
                        Funciones.FNAdd(props.oidc, values)
                            .then((respuesta: any) => {
                                setLoading(false)
                                props.cbGuardar(respuesta)
                                toast.success("Se guardó la sucursal fisica")
                            })
                            .catch((error: any) => {
                                console.log(JSON.stringify(error))
                                setLoading(false)
                                toast.error("Error al guardar la sucursal fisica")
                            })
                    else
                        Funciones.FNUpdate(props.oidc, { ...values, SucursalFisicaID: props.Id as number })
                            .then((respuesta: any) => {
                                setLoading(false)
                                props.cbActualizar(respuesta)
                                toast.success("Se actualizó la sucursal fisica")
                            })
                            .catch((error: any) => {
                                console.log(JSON.stringify(error))
                                setLoading(false)
                                toast.error("Error al actualizar la sucursal fisica")
                            })

                }}>
                <Form>
                    <CustomFieldText2 disabled={loading} label="Nombre" datoType='text' name="Nombre" placeholder="Nombre Sucursal Fisica" />
                    <CustomFieldText2 disabled={loading} label="Teléfono " datoType='text' name="Telefono" placeholder="Teléfono " />
                    <hr className={"mt-1 mb-3"} />
                    <ControlAsentamientos valor={AsentamientoID} fnOpen={fnOpen} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <VialidadesTipo disabled={loading} name={'vialidadTipoId'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <OrientacionVialidadesTipo disabled={loading} name={'orientacionVialidadTipoId'} />
                        </div>
                    </div>
                    <CustomFieldText2 disabled={loading} label={'Vialidad'} datoType='text' name={'NombreVialidad'} placeholder={'Vialidad'} />
                    <hr className={"mt-1 mb-3"} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={loading} datoType='text' label={'#Exterior'} name={'NumeroExterior'} placeholder={'Numero exterior'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={loading} datoType='text' label={'#Interior'} name={'NumeroInterior'} placeholder={'Numero interior'} />
                        </div>
                    </div>
                    <CustomFieldText2 disabled={loading} label={'Referencias'} datoType='text' name={'ReferenciasGeograficas'} placeholder={'Referencias'} />
                    {/* <Asentamientos oidc={props.oidc} unaLinea disabled={loading} name={'AsentamientoID'} />    */}
                    <ViviendasTipo disabled={loading} name={`ViviendaTipoId`} />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </Form>
            </Formik>
            <ModalWin open={showAsentamiento} zIndex={1500}>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        {"Buscar Asentamiento"}
                    </h5>
                </ModalWin.Header>
                <ModalWin.Body>
                    {showAsentamiento &&
                        <BuscarAsentamiento
                            initialValues={{
                                EstadoId: 0,
                                MunicipioId: 0,
                                TipoAsentamientoId: 0,
                                CodigoPostalID: 0,
                                AsentamientoID: 0
                            }}
                            cbAceptar={cbAceptar}
                            fnCancelar={fnCancelar}
                        />}
                </ModalWin.Body>
            </ModalWin>
        </>
    )
}
