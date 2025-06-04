import { Form, Formik } from "formik"
import { FaFilter, FaPlus, FaSave } from "react-icons/fa"
import * as Yup from 'yup';
import { Creditos, Productos } from "../../../../../selectores";
import { FiRefreshCcw } from "react-icons/fi";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";

type DistPlanFormType = {
    getPlanPagosCredito(reqData: any): void,
    FnAñadirAbono(): void,
    FnGuardarPlanPagos(): void,
    state: any,
    isMounted: boolean
    oidc: IOidc
}

const CForm = ({ state, getPlanPagosCredito, FnAñadirAbono, FnGuardarPlanPagos, ...props }: DistPlanFormType) => {
    return (<>
        <Formik
            initialValues={{
                CreditoID: 0,
                ProductoID: 0,
                ClienteID: 0,
                SucursalID: 0,
                CajaID: 0,
                ZonaID: 0,
                EmpresaID: 0,
                DistribuidorID: 0,
                CoordinadorID: 0,
                ContratoID: 0,
                EstatusID: "P",
                DistribuidorNivelID: 0,
                FechaInicio: state.FechaInicio,
                FechaFin: state.FechaFin,
            }}
            enableReinitialize
            validationSchema={
                Yup.object().shape({ CreditoID: Yup.object().required() })}
            onSubmit={getPlanPagosCredito}>
            {({ values, setValues }) => (
                <Form>
                    <div className="columns is-centered is-mobile is-multiline">
                        <div className="column is-full-desktop is-full-mobile is-full-tablet" style={{ backgroundColor: '#F7F7F7', padding: '2em', borderRadius: '15px' }}>
                            <div className="row" style={{ textAlign: 'center' }}>
                                <div className="column is-one-third-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                    <Creditos
                                        oidc={props.oidc}
                                        name="CreditoID"
                                        valor={values.CreditoID}
                                        Datos={{ ...values, CreditoID: 0 }}
                                        disabled={state.Cargando}
                                        cargar={props.isMounted}
                                    />
                                </div>
                            </div>

                            <div className="column is-12-mobile is-12-tablet is-12-desktop mt-3">
                                <div className="text-end is-flex gap-2 is-justify-content-end">

                                    <button disabled={false} type="submit" className="btn btn-primary waves-effect waves-light">
                                        <span className="">Buscar</span>&nbsp;<FiRefreshCcw />
                                    </button>
                                    <button disabled={false} onClick={(e) => {
                                        e.preventDefault()
                                        FnAñadirAbono()
                                    }} className="btn btn-success waves-effect waves-light">
                                        <span className="">Añadir abono</span>&nbsp;<FaPlus />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </Form>
            )}
        </Formik>
    </>)
}

export default CForm