import { useDibujarModuloReporte } from "../../../../hooks/useDibujarModuloReporte";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { ActionSelect, Card, Spinner } from "../../../../global";
import FieldDrawer from "../../../../global/FieldDrawer";
import DataGridComp from "../../../../global/DataGrid";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Form, Formik } from "formik";
import XLSX from "xlsx";

type IntPantalla = {
    value: number,
    label: string,
    export: boolean
    permission: number,
}

const GeneradorReportes = () => {
    const [PantallaID, setPantallaID] = useState(0)
    const [isMounted, setIsMounted] = useState(false);
    const [PantallaList, setPantallaList] = useState<IntPantalla[]>([])
    const { IsMounted, Componentes, FnReportes, Modulo, ResponseData, SetInitialValues, FnReporteList, LoadingComps } = useDibujarModuloReporte({ PantallaID: PantallaID })
    const [TableData, setTableData] = useState([])
    const [InitValues, setInitValuies] = useState({})
    const [LoadingMod, setLoadingMod] = useState(true)

    const FnGetAllReportes = () => {
        setLoadingMod(true)
        FnReporteList()
            .then(res => {
                const pantallas = res.map(reg => ({ value: reg.PantallaID, label: reg.Nombre, export: reg.Exportar, permission: reg.PermisoID }))
                setPantallaList(pantallas)
                setIsMounted(true)
            })
            .catch(() => {
                toast.error('Ha habido un error obteniendo la lista de reportes')
            }).finally(() => setLoadingMod(prev => false))

    }

    const Exportar = useMemo(() => PantallaList.find((reg: { value }) => reg.value == PantallaID)?.export || false, [PantallaID])
    const PermisoID = useMemo(() => PantallaList.find((reg: { value }) => reg.value == PantallaID)?.permission, [PantallaID])

    useEffect(() => {
        setInitValuies(SetInitialValues())
    }, [Componentes]);

    useEffect(() => {
        setTableData(ResponseData)
    }, [ResponseData]);

    // Usamos un memo para nuestro productoId
    useEffect(() => {
        if (!isMounted) FnGetAllReportes()
    }, [])

    const FnExportarData = () => {
        if (TableData.length == 0) {
            toast.warning("No se encontro informacion para exportar");
            return;
        }
        const XLSX = require("xlsx-js-style");

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(TableData);

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${Modulo.Nombre}.xlsx`);
    }

    const submitData = (formData = {}) => {
        setLoadingMod(true)
        setTableData([])
        FnReportes(formData)
            .then(res => setLoadingMod(prev => false))
            .catch(res => setLoadingMod(prev => false))
    }

    return (<>
        <div className="row ">
            <div className="col-12">
                <Card>
                    <TituloConSelector
                        Titulo={Modulo.Nombre}
                        ReporteList={PantallaList}
                        LoadingMod={LoadingMod}
                        setPantallaID={(e) => setPantallaID(e)}                        
                    />

                    <Card.Body>
                        {LoadingComps && <Spinner />}
                        {!LoadingComps && <Card.Body.Content>
                            {IsMounted && <FieldDrawer
                                initialValues={InitValues}
                                onSubmit={submitData}
                                fields={Componentes}
                                LoadingMod={LoadingMod}
                                FnExportarData={FnExportarData}
                                Exportar={Exportar}
                            />}
                            {LoadingMod && <Spinner />}
                            {!LoadingMod && <DataGridComp
                                data={TableData}
                                PermisoID={PermisoID}
                            />}
                        </Card.Body.Content>}
                    </Card.Body>
                </Card>
            </div>
        </div >
    </>)
}

const TituloConSelector = ({ Titulo = '', ReporteList = [], setPantallaID = (e) => { }, LoadingMod = false }: { ReporteList: IntPantalla[] } & any) => {
    return (<div className="col-12 is-flex is-flex-direction-row is-justify-content-space-between card-header">
        <h4 className="font-16 mt-2">{Titulo}</h4>
        <div className="col-4 has-text-weight-bold">
            <Formik onSubmit={() => { }} initialValues={{ ReporteID: 0 }}>
                <Form>
                    {<ActionSelect
                        label="Reporte a consultar"
                        name="ReporteID"
                        options={ReporteList}
                        addDefault={false}
                        disabled={LoadingMod}
                        accion={setPantallaID}
                    />}
                </Form>
            </Formik>
        </div>
    </div>)
}


const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GeneradorReportes);
