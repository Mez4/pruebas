import { Form, Formik } from "formik";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import { FaFileExcel } from "react-icons/fa";

import XLSX from "xlsx";
import { toast } from "react-toastify";
import {
  CustomFieldDatePicker,
  Spinner,
} from "../../../../../global";
import { Sucursales } from "../../../../../selectores";
import { permisoExportar } from "../../../../../hooks/ExoportarExcelBtnPermisos";

type CFormProps = {
  oidc: IOidc;
  ui: iUI;
  setSucursal?: (value: any) => void;
  onSubmit: (value?: any) => void;
  PrintExcel?: (item?: any) => any;
  initialValues: {
    SucursalID: number;
  };
  loading?: boolean;
  PrintExcelObj?: {
    data: any[];
    title: string;
    nameDoc: string;
  };
  children?: JSX.Element;
};

export default function CForm(props: CFormProps) {
  const ExpPermisos = permisoExportar(2834);
  const nombreClase = `column is-12-mobile is-12-tablet is-4-desktop`;

  const GenerarXLSX = (data: any[], title: string, nameDoc: string) => {
    if (data.length == 0) {
      toast.warning("No se encontro informacion para exportar");
      return;
    }
    const XLSX = require("xlsx-js-style");

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${nameDoc}.xlsx`);
  };

  return (
    <>
      {props.loading && <Spinner />}
      {!props.loading && (
        <Formik initialValues={props.initialValues} onSubmit={props.onSubmit}>
          {({ values }) => (
            <Form>
              <div
                style={{
                  backgroundColor: "#F0F0F0",
                  padding: "1em",
                  borderRadius: "15px",
                }}
              >
                <div>
                  <div>
                    <label> FILTROS </label>
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
                    <div className={`${nombreClase} text-start`}>
                      <Sucursales valor={values.SucursalID} IsAction/>
                    </div>
                    <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                      <button
                        disabled={false}
                        className="btn btn-primary btn-lg"
                        type="submit"
                      >
                        Buscar
                      </button>

                      {!props.loading && (
                        <button
                          disabled={!ExpPermisos}
                          type="button"
                          className="btn btn-success btn-lg waves-effect waves-light mx-2"
                          style={{
                            padding: 8,
                            textAlign: "center",
                            paddingInline: 15,
                          }}
                          onClick={() => {
                            if (props.PrintExcel) {
                              props.PrintExcel(values);
                              return;
                            }
                            GenerarXLSX(
                              props.PrintExcelObj
                                ? props.PrintExcelObj.data
                                : [],
                              props.PrintExcelObj
                                ? props.PrintExcelObj.title
                                : "",
                              props.PrintExcelObj
                                ? props.PrintExcelObj.nameDoc
                                : "Doc"
                            );
                          }}
                        >
                          Exportar&nbsp;
                          <FaFileExcel size="20px" style={{ marginTop: -2 }} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
