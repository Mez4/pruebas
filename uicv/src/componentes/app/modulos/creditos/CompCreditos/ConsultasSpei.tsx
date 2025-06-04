
import * as Funciones from "./ConsultasSpei/Funciones";
import { Card, CustomFieldDatePicker, Spinner } from "../../../../global";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataGridComp from "../../../../global/DataGrid";
import { Sucursales } from "../../../../selectores";
import { FaDownload, FaFilter, FaList } from "react-icons/fa";
import { useMemo, useState } from "react";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Form, Formik } from "formik";
import moment from "moment";
import ModalConsultasSpei from "./ConsultasSpei/ModalConsultasSpei";
import { getErrorParsed } from "../../../../../global/functions";

type CatalogosType = {
    oidc: IOidc
}

type SpeiCreditos = {
    SucursalID: number,
    FechaInicio: Date,
    FechaFin: Date,
}

type SpeiCreditosState = {
    SpeiList: any[]
    CreditosList: any[]
    Error: boolean,
    Cargando: boolean,
    Descargando: boolean,
    OpenCreditos: boolean,
    LoadingOpen: boolean,
}

const initialFormValues: SpeiCreditos = {
    SucursalID: 0,
    FechaInicio: moment().subtract(1, 'day').parseZone().toDate(),
    FechaFin: moment().parseZone().toDate(),
}

const ConsultasSpei = (props: CatalogosType) => {
    const [state, setState] = useState<SpeiCreditosState>({
        SpeiList: [],
        CreditosList: [],
        Error: false,
        Cargando: false,
        Descargando: false,
        OpenCreditos: false,
        LoadingOpen: false
    })

    const FnHandleCreditosModal = (open = false) => setState(prev => ({ ...prev, OpenCreditos: open, CreditosList: open ? prev.CreditosList : [] }))

    const FnGetSpei = (FormData: SpeiCreditos) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetSpei(props.oidc, FormData).then((respuesta: any) => {
            setState(s => ({ ...s, SpeiList: respuesta, Error: false }))
        }).catch((error) => {
            toast.error(error.response.data)
            setState(s => ({ ...s, SpeiList: [], Error: true }))
        }).finally(() =>
            setState(s => ({ ...s, Cargando: false, LoadingOpen: false }))
        )
    }

    const FnGetCreditosSPEI = ({ EnvioSTPID }) => {
        setState(s => ({ ...s, LoadingOpen: true }))
        Funciones.FnGetCreditosBySpei(props.oidc, EnvioSTPID).then((respuesta: any) => {
            setState(s => ({ ...s, CreditosList: respuesta }))
            FnHandleCreditosModal(true)
        }).catch((error) => {
            toast.error(getErrorParsed(error))
            setState(s => ({ ...s, CreditosList: [] }))
        }).finally(() =>
            setState(s => ({ ...s, LoadingOpen: false }))
        )
    }

    const FnDownloadFile = ({ EnvioSTPID }) => {
        setState(s => ({ ...s, LoadingOpen: true }))
        Funciones.FnGetSpeiFile(props.oidc, EnvioSTPID)
            .then((res: any) => {
                const stringRes = new String(res.CsvString)
                const newStr = stringRes.slice(0, -1)

                const blob = new Blob([newStr], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = res.NameFile;
                link.click();
            }).catch((error: any) => {
                toast.error(getErrorParsed(error))
            }).finally(() =>
                setState(s => ({ ...s, LoadingOpen: false }))
            )

    }

    const Columns = useMemo(() => {
        if (state.SpeiList.length == 0)
            return []

        return [...Object.keys(state.SpeiList[0]).map((v, i) => ({
            selector: v,
            name: v,
            center: true,
            flex: 1,
            minWidth: 120,
        })),
        {
            selector: 'actions',
            type: 'actions',
            width: 80,
            getActions: ({ row }) => [
                <>
                    <Tooltip title={state.LoadingOpen ? '' : "Ver creditos"}>
                        <button
                            data-tip
                            className="asstext"
                            style={{
                                margin: ".15em",
                                width: "15%",
                                height: "40px",
                                padding: "0px",
                                tableLayout: "fixed",
                                borderCollapse: "collapse",
                                color: state.LoadingOpen ? 'grey' : ''
                            }}
                            type="button"
                            disabled={state.LoadingOpen}
                            onClick={() => FnGetCreditosSPEI(row)}
                        ><FaList /></button>
                    </Tooltip>
                </>,
                <>
                    <Tooltip title={state.LoadingOpen ? '' : "Descargar archivo SPEI"}>
                        <button
                            data-tip
                            className="asstext"
                            style={{
                                margin: ".15em",
                                marginLeft: "10px",
                                width: "15%",
                                height: "40px",
                                padding: "0px",
                                tableLayout: "fixed",
                                borderCollapse: "collapse",
                                color: state.LoadingOpen ? 'grey' : ''
                            }}
                            onClick={() => FnDownloadFile(row)}
                            disabled={state.LoadingOpen}
                            type="button"><FaDownload /></button>
                    </Tooltip>
                </>
            ],
        }]
    }, [state.SpeiList])

    return (<>

        <div className="row ">
            <div className="col-12">
                <Card>
                    <TituloConSelector Titulo={'CONSULTAS SPEI'} />
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={initialFormValues}
                                onSubmit={FnGetSpei}
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
                                    data={state.SpeiList}
                                    // rowId={'EnvioSTPID'}
                                    // selectedRows={[]}
                                    columns={Columns}
                                // onRowSelected={() => { }}
                                />
                            </>}
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <ModalConsultasSpei
                open={state.OpenCreditos}
                handleOpen={FnHandleCreditosModal}
                oidc={props.oidc}
                CreditosList={state.CreditosList}
            />
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
        <div style={{
            backgroundColor: "#F0F0F0",
            padding: "1em",
            borderRadius: "15px",
        }}>
            <div>
                <label><FaFilter /> FILTROS</label>
            </div>

            <div style={{
                width: "100%",
                textAlign: "center",
                display: "inline-block",
            }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConsultasSpei);
