import { useDibujarModuloReporte } from "../../../../hooks/useDibujarModuloReporte";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import FormNotasRapidas from "./NotasRapidas/FormNotasRapidas";
import FormRefereciasCreditos from "./ReferenciasCreditos/FormReferenciasCreditos";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataGridComp from "../../../../global/DataGrid";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { Card, Spinner } from "../../../../global";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import React from "react";
import XLSX from "xlsx";
import FieldDrawer from "../../../../global/FieldDrawer";

type NotasRapidasType = {
    oidc: IOidc;
    ui: iUI;
};

function ReferenciasCreditos(props: NotasRapidasType) {
    const { Componentes, FnReportes, Modulo, ResponseData, SetInitialValues, FnReporteList, LoadingComps } = useDibujarModuloReporte({ PantallaID: 48 })
    const [LoadingMod, setLoadingMod] = React.useState(true)
    const [InitValues, setInitValuies] = React.useState({})
    const [TableData, setTableData] = React.useState([])


    React.useEffect(() => {
        console.log('INITIAl', SetInitialValues())
        setInitValuies(SetInitialValues())
    }, [Componentes]);

    React.useEffect(() => {
        setTableData(ResponseData)
    }, [ResponseData]);

    const submitData = (formData = {}) => {
        setLoadingMod(true)
        setTableData([])
        FnReportes(formData)
            .then(res => setLoadingMod(prev => false))
            .catch(res => setLoadingMod(prev => false))
    }

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

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title="Pagos Socias">
                        <Card.Body>
                            <Card.Body.Content>
                                {LoadingComps && <Spinner />}
                                {!LoadingComps && <FormRefereciasCreditos
                                    oidc={props.oidc} ui={props.ui}
                                    InitialValues={InitValues}
                                    onSubmit={submitData}
                                    Fields={Componentes}
                                    fnExportData={FnExportarData}
                                />}
                                {!LoadingMod && <DataGridComp
                                    data={TableData}
                                />}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReferenciasCreditos);
