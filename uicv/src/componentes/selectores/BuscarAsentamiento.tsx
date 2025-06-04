import React from 'react'

import * as Yup from 'yup'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import { Spinner } from '../global'
import { Formik, Form } from 'formik'
import { IOidc } from '../../interfaces/oidc/IOidc'

import { Asentamientos, Estados, Municipios, CodigosPostales, TiposAsentamientos } from '.'
import { FiRefreshCcw } from 'react-icons/fi'

type BuscarAsentamientoType = {
    oidc: IOidc
    // Id?: number,
    initialValues: {
        EstadoId: number,
        MunicipioId: number,
        TipoAsentamientoId: number,
        CodigoPostalID: number,
        AsentamientoID: number
    },
    // cbActualizar(item: any): any,
    cbAceptar(item: any): any,
    fnCancelar(): any,
}

const BuscarAsentamiento = (props: BuscarAsentamientoType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                EstadoId: Yup.number().required('Seleccione el Estado').moreThan(0, 'Seleccione el Estado'),
                MunicipioId: Yup.number().required('Seleccione el Municipio').moreThan(0, 'Seleccione el Municipio'),
                AsentamientoID: Yup.number().required('Seleccione el Asentamiento').moreThan(0, 'Seleccione el Asentamiento')
            })}
            onSubmit={(values: any) => {

                setLoading(true)

                // console.log('values: ', values)

                props.cbAceptar(values.AsentamientoID)

            }}>
            {({ values }) => (
                <Form>
                    {/* <div className={"row"}>
                    <div className={"col-sm-12 col-md-6"}> */}
                    <Estados oidc={props.oidc} disabled={loading} name={'EstadoId'} unaLinea />
                    {/* </div>
                    <div className={"col-sm-12 col-md-6"}> */}
                    <Municipios EstadoId={values.EstadoId} oidc={props.oidc} Cascada disabled={loading} name={'MunicipioId'} unaLinea />
                    {/* </div>
                </div>
                <div className={"row"}>
                    <div className={"col-sm-12 col-md-6"}> */}
                    <hr className={"mt-1 mb-3"} />
                    <CodigosPostales EstadoId={values.EstadoId} oidc={props.oidc} Cascada MunicipioId={values.MunicipioId} disabled={loading} name={'CodigoPostalID'} unaLinea />
                    {/* </div>
                    <div className={"col-sm-12 col-md-6"}> */}
                    {/* <TiposAsentamientos oidc={props.oidc} disabled={loading} name={'TipoAsentamientoId'} unaLinea /> */}
                    {/* </div>
                </div>  */}
                    <hr className={"mt-1 mb-3"} />
                    <label style={{fontSize: '.8em'}}><span style={{color: 'red'}}>*</span> Presiona <FiRefreshCcw /> para cargar los asentamientos (colonias, fraccionamientos, delegaciones, etc) que conicidan con los parametros seleccionados previamente</label>
                    <Asentamientos
                        Datos={{
                            EstadoId: values.EstadoId,
                            MunicipioId: values.MunicipioId,
                            TipoAsentamientoId: values.TipoAsentamientoId,
                            CodigoPostalID: values.CodigoPostalID
                        }}
                        oidc={props.oidc}
                        unaLinea
                        Cascada
                        disabled={loading}
                        name={'AsentamientoID'}
                    />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            {/* <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light">
                            Buscar&nbps;<BiSearchAlt/>
                        </button> */}
                            <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={(e: any) => props.cbAceptar(values.AsentamientoID)}>
                                Aceptar
                            </button>
                        </div>
                    }
                </Form>
            )}
        </Formik>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(BuscarAsentamiento)