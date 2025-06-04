import React from 'react'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import { Spinner } from '../global'
import { Formik, Form, Field } from 'formik'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { Bancos, DatosBancariosTipo, PersonaDatosBancarios } from '.'

type BuscarDatosBancariosType = {
    oidc: IOidc
    // Id?: number,
    initialValues: {
        personaID: number,
        cveBancoRef: number,
        datoTipoID: number,
        datoBancario: string,
        personasDatosBancariosID: number
    },
    // cbActualizar(item: any): any,
    cbAceptar(item: any): any,
    fnCancelar(): any,
}

const BuscarDatosBancarios = (props: BuscarDatosBancariosType) => {

    const [loading, setLoading] = React.useState(false)

    // React.useEffect(() => {
    //     console.log('props: ', props)
    // }, [])

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // personaID: Yup.number().required('Seleccione el Estado').moreThan(0, 'Seleccione el Estado'),
                cveBancoRef: Yup.number().required('Seleccione un Banco').moreThan(0, 'Seleccione un Banco'),
                datoTipoID: Yup.number().required('Seleccione el Dato Bancario').moreThan(0, 'Seleccione el Dato Bancario')
            })}
            onSubmit={(values: any) => {

                setLoading(true)

                // console.log('values: ', values)

                props.cbAceptar(values.personasDatosBancariosID)

            }}>
            {({ values }) => (
                <Form>
                    <Bancos oidc={props.oidc} disabled={loading} name={'cveBancoRef'} unaLinea />
                    <DatosBancariosTipo oidc={props.oidc} disabled={loading} name={'datoTipoID'} unaLinea />
                    <PersonaDatosBancarios oidc={props.oidc} personaID={values.personaID} datoTipoID={values.datoTipoID} cveBancoRef={values.cveBancoRef} disabled={loading} name={'personasDatosBancariosID'} unaLinea />
                    {/* <Field type="hidden" className="form-control" name={'datoBancario'} id={'datoBancario'} /> */}
                    <hr className={"mt-1 mb-3"} />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            {/* <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light">
                            Buscar&nbps;<BiSearchAlt/>
                        </button> */}
                            <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={(e: any) => props.cbAceptar(values.personasDatosBancariosID)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(BuscarDatosBancarios)