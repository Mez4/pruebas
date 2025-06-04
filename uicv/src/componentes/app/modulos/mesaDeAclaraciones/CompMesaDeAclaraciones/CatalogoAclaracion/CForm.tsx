import React, { useRef } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, CustomFieldImgUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../../../../global'
import { setDefaultLocale } from 'react-datepicker'
import { CFormAgregarEvidencia } from './CFormAgregarEvidencia'
import { Field, ErrorMessage } from 'formik'
type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        AclaracionID: number,
        SucursalID: number,
        Nommbre: string,
        DistribuidorID: number,
        DescripcionAclaracion: string,
        CreditoID: number,
        ConceptoID: number,
        EstatusID: number,
        NotasTesoreria: string,
        Observaciones: string,
        DocumentoID: number,
        Ruta: string,
        MesaAclaracionID: number,
        BonificacionID: number,
        SolicitaID: number,
        AnalistaID: number,
        GerenteID: number,
        AutorizaID: number,
        PersonaID: number,
        ProductoID: number,
        Producto: string
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optMesaAclaracion: { value: number, label: string }[],
    optBonificacion: { value: number, label: string }[],
    optEstatus: { value: number, label: string }[],
    optConceptos: { value: number, label: string }[],
    fnGetClientes(Nombre: string, callback: any): any,
    fnGetSucursales(Nombre: string, callback: any): any,
}
// let isMounted = React.useRef(true)
export const CForm = (props: CFormType) => {
    const loadOptionsClientes = (inputText: string, callback: any) => {
        props.fnGetClientes(inputText, callback);
    }
    const loadOptionsSucursales = (inputText: string, callback: any) => {
        props.fnGetSucursales(inputText, callback);
    }
    // Loading
    const [loading, setLoading] = React.useState(false)
    const [sucursal, setSucursal] = React.useState("")
    const [distribuidor, setDistribuidor] = React.useState("")
    const [encargado, setEncargado] = React.useState("") //gerente
    const [solicita, setSolicita] = React.useState("")
    const [autoriza, setAutoriza] = React.useState("")
    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // GerenteID: Yup.number().required("Campo Obligatorio").moreThan(0, 'Campo Obligatorio'),
                // DistribuidorID: Yup.number().required("Campo Obligatorio").moreThan(0, 'Campo Obligatorio'),
                // SucursalID: Yup.number().required("Campo Obligatorio").moreThan(0, 'Campo Obligatorio'),
                // SolicitaID: Yup.number().required("Campo Obligatorio").moreThan(0, 'Campo Obligatorio'),
                // AutorizaID: Yup.number().required("Campo Obligatorio").moreThan(0, 'Campo Obligatorio'),
                // NombreMesaAclaracion: Yup.string().required("Campo Obligatorio"),
                // PorcentajeBonificacion: Yup.string().required("Campo Obligatorio"),
                // Descripcion: Yup.string().required("Campo Obligatorio"),
                // DescripcionConcepto: Yup.number().required("Campo Obligatorio"),
            })}  //cuando le das al boton de guardar manda llamar este metodo
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        AclaracionID: 0,
                        SucursalID: values.SucursalID,
                        DistribuidorID: values.DistribuidorID,
                        CreditoID: values.CreditoID,
                        DescripcionAclaracion: values.DescripcionAclaracion,
                        EsatusID: values.EstatusID,
                        ConceptoID: values.ConceptoID,
                        NotasTesoreria: values.NotasTesoreria,
                        Observaciones: values.Observaciones,
                        DocumentoID: values.DocumentoID,
                        MesaAclaracionID: values.MesaAclaracionID,
                        BonificacionID: values.BonificacionID,
                        GerenteID: values.GerenteID,
                        SolicitaID: values.SolicitaID,
                        AutorizaID: values.AutorizaID,
                    }
                    console.log("antes de guardar", a)
                    Funciones.FNAdd(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm()
                        })
                        .catch((error: any) => {
                            alert("Error al guardar la Aclaración" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let a = {
                        ...values,
                        AclaracionID: 0,
                        SucursalID: values.SucursalID,
                        DistribuidorID: values.DistribuidorID,
                        CreditoID: values.CreditoID,
                        DescripcionAclaracion: values.DescripcionAclaracion,
                        EsatusID: values.EstatusID,
                        ConceptoID: values.ConceptoID,
                        NotasTesoreria: values.NotasTesoreria,
                        Observaciones: values.Observaciones,
                        DocumentoID: values.DocumentoID,
                        MesaAclaracionID: values.MesaAclaracionID,
                        BonificacionID: values.BonificacionID,
                        GerenteID: values.GerenteID,
                        SolicitaID: values.SolicitaID,
                        AutorizaID: values.AutorizaID,
                    }
                    Funciones.FNUpdate(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el Aclaración" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                {!props.Id &&
                    <div>
                        <div className="columns is-centered is-mobile is-multiline">
                            <div className="column is-half-desktop is-full-mobile">
                                <label className="form-label mb-0">Sucursal</label>
                                <input
                                    type="text"
                                    disabled={true}
                                    className="form-control"
                                    placeholder={sucursal == '' ? "No seleccionado" : ""}
                                    value={sucursal} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <ActionAsyncSelect
                                    loadOptions={loadOptionsSucursales}
                                    disabled={props.Id === undefined ? false : true}
                                    label="Sucursal:"
                                    name="SucursalID"
                                    placeholder="Buscar sucursal...."
                                    options={[]}
                                    addDefault={false}
                                    valor={props.initialValues.SucursalID}
                                    noOptionsMessage={'No encontrado'}
                                    accion2={(val) => setSucursal(val)} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <label className="form-label mb-0">Gerente</label>
                                <input
                                    type="text"
                                    disabled={true}
                                    className="form-control"
                                    placeholder={encargado == '' ? "No seleccionado" : ""}
                                    value={encargado} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <ActionAsyncSelect
                                    loadOptions={loadOptionsClientes}
                                    disabled={props.Id === undefined ? false : true}
                                    label="Gerente:"
                                    name="GerenteID"
                                    placeholder="Buscar gerente...."
                                    options={[]}
                                    addDefault={false}
                                    valor={props.initialValues.GerenteID}
                                    noOptionsMessage={'No encontrado'}
                                    accion2={(val) => setEncargado(val)} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <label className="form-label mb-0">Solicita</label>
                                <input
                                    type="text"
                                    disabled={true}
                                    className="form-control"
                                    placeholder={solicita == '' ? "No seleccionado" : ""}
                                    value={solicita} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <ActionAsyncSelect
                                    loadOptions={loadOptionsClientes}
                                    disabled={props.Id === undefined ? false : true}
                                    label="Solicita:"
                                    name="SolicitaID"
                                    placeholder="Buscar persona...."
                                    options={[]}
                                    addDefault={false}
                                    valor={props.initialValues.SolicitaID}
                                    noOptionsMessage={'No encontrado'}
                                    accion2={(val) => setSolicita(val)} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <label className="form-label mb-0">Autoriza</label>
                                <input
                                    type="text"
                                    disabled={true}
                                    className="form-control"
                                    placeholder={autoriza == '' ? "No seleccionado" : ""}
                                    value={autoriza} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <ActionAsyncSelect
                                    loadOptions={loadOptionsClientes}
                                    disabled={props.Id === undefined ? false : true}
                                    label="Autoriza:"
                                    name="AutorizaID"
                                    placeholder="Buscar persona...."
                                    options={[]}
                                    addDefault={false}
                                    valor={props.initialValues.AutorizaID}
                                    noOptionsMessage={'No encontrado'}
                                    accion2={(val) => setAutoriza(val)} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <label className="form-label mb-0">Socia</label>
                                <input
                                    type="text"
                                    disabled={true}
                                    className="form-control"
                                    placeholder={distribuidor == '' ? "No seleccionado" : ""}
                                    value={distribuidor} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <ActionAsyncSelect
                                    loadOptions={loadOptionsClientes}
                                    disabled={props.Id === undefined ? false : true}
                                    label="Socia:"
                                    name="DistribuidorID"
                                    placeholder="Buscar socia...."
                                    options={[]}
                                    addDefault={false}
                                    valor={props.initialValues.DistribuidorID}
                                    noOptionsMessage={'No encontrado'}
                                    accion2={(val) => setDistribuidor(val)} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <CustomSelect
                                    disabled={loading}
                                    label="Mesa Aclaracion"
                                    name="MesaAclaracionID"
                                    placeholder="Seleccione una opcion"
                                    options={props.optMesaAclaracion}
                                    addDefault={false}
                                    isMulti={false} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <CustomSelect
                                    disabled={loading}
                                    label="Concepto"
                                    name="ConceptoID"
                                    placeholder="Seleccione una opcion"
                                    options={props.optConceptos}
                                    addDefault={false}
                                    isMulti={false} />
                            </div>
                        </div>
                        <div className="row center">
                            <div className="col-4" >
                                <CustomSelect
                                    disabled={loading}
                                    label="Estatus"
                                    name="EstatusID"
                                    placeholder="Seleccione una opcion"
                                    options={props.optEstatus}
                                    addDefault={false}
                                    isMulti={false} />
                            </div>
                            <div className="col-4">
                                <CustomSelect
                                    disabled={loading}
                                    label="Bonifiación"
                                    name="BonificacionID"
                                    placeholder="Seleccione una opcion"
                                    options={props.optBonificacion}
                                    addDefault={false}
                                    isMulti={false} />
                            </div>
                            <div className="col-4">
                                <CustomFieldText
                                    disabled={loading}
                                    label="Credito"
                                    name="CreditoID"
                                    placeholder="Credito" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <CustomFieldText
                                disabled={loading}
                                label="Descripcion Aclaración"
                                name="DescripcionAclaracion"
                                placeholder="Descripcion Aclaración" />
                        </div>
                        <div className="mb-3">
                            <CustomFieldText
                                disabled={loading}
                                label="Observaciones"
                                name="Observaciones"
                                placeholder="Observaciones" />
                        </div>
                        <hr></hr>
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                            </div>
                        }
                    </div>
                }
                {props.Id &&
                    <div>
                        <div className="columns is-centered is-mobile is-multiline">
                            <div className="column is-half-desktop is-full-mobile">
                                <CustomSelect
                                    disabled={loading}
                                    label="Mesa Aclaracion"
                                    name="MesaAclaracionID"
                                    placeholder="Seleccione una opcion"
                                    options={props.optMesaAclaracion}
                                    addDefault={false}
                                    isMulti={false} />
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <CustomSelect
                                    disabled={loading}
                                    label="Concepto"
                                    name="ConceptoID"
                                    placeholder="Seleccione una opcion"
                                    options={props.optConceptos}
                                    addDefault={false}
                                    isMulti={false} />
                            </div>
                        </div>
                        <div className="row center">
                            <div className="col-4" >
                                <CustomSelect
                                    disabled={loading}
                                    label="Estatus"
                                    name="EstatusID"
                                    placeholder="Seleccione una opcion"
                                    options={props.optEstatus}
                                    addDefault={false}
                                    isMulti={false} />
                            </div>
                            <div className="col-4">
                                <CustomSelect
                                    disabled={loading}
                                    label="Bonifiación"
                                    name="BonificacionID"
                                    placeholder="Seleccione una opcion"
                                    options={props.optBonificacion}
                                    addDefault={false}
                                    isMulti={false} />
                            </div>
                            <div className="col-4">
                                <CustomFieldText
                                    disabled={loading}
                                    label="Credito"
                                    name="CreditoID"
                                    placeholder="Credito" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <CustomFieldText
                                disabled={loading}
                                label="Descripcion Aclaración"
                                name="DescripcionAclaracion"
                                placeholder="Descripcion Aclaración" />
                        </div>
                        <div className="mb-3">
                            <CustomFieldText
                                disabled={loading}
                                label="Observaciones"
                                name="Observaciones"
                                placeholder="Observaciones" />
                        </div>
                        <hr></hr>
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                            </div>
                        }
                    </div>
                }
            </Form>
        </Formik>
    )
}