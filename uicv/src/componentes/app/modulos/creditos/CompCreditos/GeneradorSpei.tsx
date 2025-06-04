
import { FNGetCreditos, GetSpeiFile } from "./GeneradorSpei/Funciones";
import { ActionAsyncCreatableSelect, Card, CustomFieldDatePicker, Spinner } from "../../../../global";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataGridComp from "../../../../global/DataGrid";
import { Sucursales } from "../../../../selectores";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Form, Formik } from "formik";
import { useState } from "react";
import moment from "moment";



type CatalogosType = {
    oidc: IOidc
}

type SpeiCreditos = {
    SucursalID: number,
    FechaInicio: Date,
    FechaFin: Date,
}

type SpeiCreditosState = {
    optCreditos: any[]
    Error: boolean,
    Cargando: boolean,
    Descargando: boolean,
    CreditosSeleccionados: any[]
}

const initialFormValues: SpeiCreditos = {
    SucursalID: 0,
    FechaInicio: moment().subtract(1, 'day').parseZone().toDate(),
    FechaFin: moment().parseZone().toDate(),
}

const GeneradorSpei = (props: CatalogosType) => {
    const [state, setState] = useState<SpeiCreditosState>({
        optCreditos: [],
        Error: false,
        Cargando: false,
        Descargando: false,
        CreditosSeleccionados: [],
    })

    const FnLoadOptionsCreditos = (FormData: SpeiCreditos) => {
        setState(s => ({ ...s, Cargando: true }))
        FNGetCreditos(props.oidc, FormData).then((respuesta: any) => {
            setState(s => ({ ...s, optCreditos: respuesta, Error: false }))
        }).catch((error) => {
            toast.error(error.response.data)
            setState(s => ({ ...s, optCreditos: [], Error: true }))
        }).finally(() =>
            setState(s => ({ ...s, CreditosSeleccionados: [], Cargando: false }))
        )
    }

    const FnDownloadFile = ({ }) => {
        setState({ ...state, Descargando: true })
        GetSpeiFile(props.oidc, state.CreditosSeleccionados.join(','))
            .then((res: any) => {

                setState(prev => ({
                    ...prev,
                    CreditosSeleccionados: [],
                    optCreditos: prev.optCreditos.filter(reg => !state.CreditosSeleccionados.includes(reg.CreditoID))
                }))
                const stringRes = new String(res.CsvString)
                const newStr = stringRes.slice(0, -1)

                const blob = new Blob([newStr], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = res.NameFile;
                link.click();
            }).catch((error: any) => {
                toast.error(error.response?.data)
            }).finally(() =>
                setState(s => ({ ...s, Descargando: false }))
            )

    }

    const handleRowSelected = (selectedRows) => setState(s => ({
        ...s,
        CreditosSeleccionados: selectedRows
    }));

    return (<>
        <div className="row ">
            <div className="col-12">
                <Card>
                    <TituloConSelector Titulo={'GENERADOR SPEI'} />
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={initialFormValues}
                                onSubmit={FnLoadOptionsCreditos}
                            >{({ values, setValues }) => (<>
                                <Form>
                                    <FilterTemplate>
                                        <div className='column is-12-mobile is-12-tablet is-4-desktop'>
                                            <Sucursales
                                                valor={values.SucursalID}
                                                name="SucursalID"
                                                Permiso
                                                IsAction
                                            />
                                        </div>
                                        <div className='column is-12-mobile is-12-tablet is-4-desktop'>
                                            <CustomFieldDatePicker
                                                name='FechaInicio'
                                                label={'Fecha inicial'}
                                                disabled={false}
                                            />
                                        </div>
                                        <div className='column is-12-mobile is-12-tablet is-4-desktop'>
                                            <CustomFieldDatePicker
                                                name='FechaFin'
                                                label={'Fecha final'}
                                                disabled={false}
                                            />
                                        </div>
                                        <div className="text-end column is-12-mobile is-12-tablet is-12-desktop">
                                            <button disabled={state.Cargando || state.Descargando} className="btn btn-primary btn-lg" type="submit" >
                                                Buscar
                                            </button>
                                            <button disabled={state.Cargando || state.Descargando} className="btn btn-success btn-lg ms-2" onClick={FnDownloadFile} >
                                                {state.Descargando ? 'Descargando' : 'Descargar'}
                                            </button>
                                        </div>
                                    </FilterTemplate>

                                </Form>
                            </>)}</Formik>
                        </Card.Body.Content>
                        <div>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {(!state.Cargando && !state.Error) && <>
                                <DataGridComp
                                    data={state.optCreditos}
                                    rowId={'CreditoID'}
                                    selectedRows={state.CreditosSeleccionados}
                                    onRowSelected={handleRowSelected}
                                />
                            </>}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div >
    </>)
}

const TituloConSelector = ({ Titulo = '' }) => {
    return (<div className="col-12 is-flex is-flex-direction-row is-justify-content-space-between card-header">
        <h4 className="font-16 mt-2">{Titulo}</h4>
    </div>)
}



export const FilterTemplate = ({ children }) => {
    return (
        <div
            style={{
                backgroundColor: "#F0F0F0",
                padding: "1em",
                borderRadius: "15px",
            }}
        >
            <div>
                <div>
                    <label><FaFilter /> FILTROS</label>
                </div>
            </div>

            <div
                style={{
                    width: "100%",
                    textAlign: "center",
                    display: "inline-block",
                }}
            >
                <div className="columns is-left is-mobile is-multiline">
                    {children}
                </div>
            </div>
        </div>)
}


const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GeneradorSpei);
