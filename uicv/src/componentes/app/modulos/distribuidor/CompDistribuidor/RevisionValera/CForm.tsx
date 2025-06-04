import React, { useRef, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker, ActionSelect, CustomFieldPdfUpload, CustomFieldImgUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { FaArrowAltCircleLeft } from 'react-icons/fa'
import { useBarcode } from 'react-barcodes'
import DocsEvidencias from '../Valeras/DocsEvidencias'

type CFormType = {
    oidc: IOidc
    Id?: number,
    optProductos: { value: number, label: string }[],
    optSeries: { value: number, label: string }[],
    optSucursales: { value: number, label: string }[],
    optDistribuidores: { value: number, label: string }[],
    evento: string,
    initialValues: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number, EnvioSucursalNota: string, ReciboSucursalNota: string, doc: string, doc2: string, productoName: string, serieName: string, CodigoBarras: string },
    fnGetDistribuidores(id: any): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}

export const CForm = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    const refSucursal = useRef<HTMLInputElement>(null)

    const { inputRef } = useBarcode({
        value: props.initialValues.CodigoBarras,
        options: {
            background: '#F7F7F7',
            height: 50
        }
    });

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    useEffect(() => {
        // return () => {
        setisMounted(true)
        // }
    }, [])

    let validationShape = {
        //ProductoID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el producto'),
        //serieId: Yup.string().required("Seleccione la serie"),
        //FolioInicial: Yup.number().required("Campo obligatorio").moreThan(0, 'indique el folio inicial'),
        //FolioFinal: Yup.number().required("Campo obligatorio").moreThan(0, 'indique el folio final'),
        AsignaSucursalId: Yup.number(),
        DistribuidorID: Yup.number(),
        file: Yup.string(),
        file2: Yup.string()
    }

    if (props.evento === 'Asignar Sucursal')
        validationShape.AsignaSucursalId = Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione la sucursal')

    if (props.evento === 'Asignar Socia')
        validationShape.DistribuidorID = Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una socia')

    if (props.evento === 'Subir Expediente') {
        validationShape.file = Yup.string().required("Campo obligatorio")
        validationShape.file2 = Yup.string().required("Campo obligatorio")
    }

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape(validationShape)}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                if (props.Id === undefined) {
                    // Funciones.FNAdd(props.oidc, values)
                    //     .then((respuesta: any) => {
                    //         setLoading(false)
                    //         props.cbGuardar(respuesta)
                    //         toast.success("Valera agregado correctamente")
                    //     })
                    //     .catch((error: any) => {
                    //         toast.error("Error al agregar valera")
                    //         setLoading(false)
                    //     })
                } else if (props.evento === 'Ver Valera') {
                    setLoading(false)
                    Funciones.FNValidaEvidenciaDocs(props.oidc, { ValeraID: props.Id as number })
                        .then((respuesta: any) => {
                            console.log('respuesta', respuesta)
                            if (respuesta.regresa == 1) {
                                setLoading(false)
                                props.cbActualizar(respuesta)
                                toast.success("Validado Correctamente")
                                toast.success(respuesta.msj)
                            }
                            else {
                                setLoading(false)
                                toast.error(respuesta.msj)
                            }

                        })
                        .catch((error: any) => {
                            console.log('error', error)
                            toast.error("Error al validar")
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <div className="row">
                    <div className="col-md-6">
                        <   CustomFieldText disabled={true} label="Valera" name="Id" placeholder={`${props.Id}`} />
                    </div>
                    <div className="col-md-3">
                        <CustomFieldText disabled={true} label="Estatus" name="Estatus" placeholder="Estatus" />
                    </div>
                    <div className="col-md-3">
                        <CustomFieldDatePicker
                            disabled={true}
                            label="RegistroFecha"
                            name="RegistroFecha"
                            placeholder="RegistroFecha"
                        />
                    </div>

                </div>
                <div className="row">
                    <div className="col">
                        {isMounted &&
                            <CustomFieldText disabled={true} label="Producto" name="productoName" placeholder="productoName" />
                    /*<ActionSelect
                        disabled={props.evento != 'Editar Valera' && props.evento != 'Crear Valera'}
                        label="Producto"
                        name="ProductoID"
                        placeholder="Seleccione el producto"
                        options={props.optProductos}
                        addDefault={false}
                        valor={props.initialValues.ProductoID}
                        
                    />*/}
                    </div>
                    <div className="col">
                        {isMounted &&
                            <CustomFieldText disabled={true} label="Serie" name="serieName" placeholder="serieName" />
                    /*<ActionSelect
                        disabled={props.evento != 'Editar Valera' && props.evento != 'Crear Valera'}
                        label="Serie"
                        name="serieId"
                        placeholder="Seleccione la serie"
                        options={props.optSeries}
                        addDefault={false}
                        valor={props.initialValues.serieId}
                        
                    />*/}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <CustomFieldText disabled={props.evento != 'Editar Valera' && props.evento != 'Crear Valera'} label="FolioInicial" name="FolioInicial" placeholder="FolioInicial" />
                    </div>
                    <div className="col">
                        <CustomFieldText disabled={props.evento != 'Editar Valera' && props.evento != 'Crear Valera'} label="FolioFinal" name="FolioFinal" placeholder="FolioFinal" />
                    </div>
                </div>
                {(props.evento != 'Editar Valera' && props.Id != undefined) && <><div className="row">
                    <div className="col-md-6" >
                        {isMounted &&
                            <div className="row">
                                <div className='col'>
                                    <ActionSelect
                                        disabled={props.evento != 'Asignar Sucursal'}
                                        label="Sucursal"
                                        name="AsignaSucursalId"
                                        placeholder={props.evento != 'Asignar Sucursal' ? 'SIN SUCURSAL ASIGNADA' : 'Seleccione una Sucursal'}
                                        options={props.optSucursales}
                                        addDefault={false}
                                        valor={props.initialValues.AsignaSucursalId}
                                        accion={props.fnGetDistribuidores}
                                    />
                                </div>
                                {props.evento == 'Asignar Sucursal' && <div className='col-md-2' style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaArrowAltCircleLeft size={30} color={'indigo'} />
                                </div>}
                            </div>}
                    </div>
                    <div className="col-md-6">
                        {isMounted && <>
                            <div className="row">
                                <div className='col'>
                                    <ActionSelect
                                        disabled={props.evento != 'Asignar Socia'}
                                        label="Socia"
                                        name="DistribuidorID"
                                        placeholder={props.evento != 'Asignar Socia' ? 'SIN SOCIA ASIGNADA' : 'Seleccione la Socia'}
                                        options={props.optDistribuidores}
                                        addDefault={true}
                                        valor={props.initialValues.DistribuidorID}
                                    />
                                </div>
                                {props.evento == 'Asignar Socia' && <div className='col-md-2' style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaArrowAltCircleLeft size={30} color={'grey'} />
                                </div>}
                            </div>
                        </>}
                    </div>
                </div></>}
                <DocsEvidencias ValeraID={props.Id ?? 0} />

                {props.evento === 'Subir Expediente' && <div className="row">
                    <div className="col-6">
                        <CustomFieldPdfUpload
                            disabled={loading}
                            label="Documento Firmado"
                            name="file"
                            imageSrc={'data:image/png;base64,' + props.initialValues.doc}
                        />
                    </div>
                    <div className="col-6">
                        <CustomFieldImgUpload
                            disabled={loading}
                            label="Foto de Evidencia de Entrega"
                            name="file2"
                            imageSrc={'data:image/png;base64,' + props.initialValues.doc2}
                        />
                    </div>
                </div>}
                <div style={{ textAlign: 'center' }}>
                    <svg ref={inputRef} />
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {<button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            {'Cancelar'}
                        </button>}
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            {'Validar'}
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}