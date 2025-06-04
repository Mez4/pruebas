import { useState } from "react";
import { Form, Formik } from "formik";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import { FaFileExcel } from "react-icons/fa";

import XLSX from "xlsx";
import { toast } from "react-toastify";
import { DatePickeEnd, DatePickeStart, Spinner } from "../../../../../global";

type CFormProps = {
  oidc: IOidc;
  ui: iUI;
  onSubmit: (value?: any) => void;
  PrintExcel?: (item?: any) => any;
  initialValues: {
    FechaInicio: Date;
    FechaFin: Date;
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
  const [startDate, setStartDate] = useState(props.initialValues.FechaInicio);
  const [endDate, setEndDate] = useState(props.initialValues.FechaFin);

  const fijarFechaInicio = (date: any) => {
    setStartDate(date);
  };

  const fijarFechaFinal = (date: any) => {
    setEndDate(date);
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
                    <div className="column is-12-mobile is-12-tablet is-4-desktop">
                      <DatePickeStart
                        name={"FechaInicio"}
                        label={"Fecha Inicial"}
                        disabled={!!props.loading}
                        placeholder={"Inicio"}
                        isClearable
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={fijarFechaInicio}
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-4-desktop">
                      <DatePickeEnd
                        name={"FechaFin"}
                        label={"Fecha Final"}
                        disabled={!!props.loading}
                        placeholder={"Final"}
                        isClearable
                        startDate={startDate}
                        endDate={endDate}
                        setEndDate={fijarFechaFinal}
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-12-desktop mt-3 text-end">
                      {!props.loading && (
                        <button
                          type="button"
                          className="btn btn-success btn-lg waves-effect waves-light"
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
                          Exportar
                          <FaFileExcel
                            className="ml-1"
                            style={{ marginTop: -4 }}
                          />
                        </button>
                      )}
                      <button
                        disabled={false}
                        className="btn btn-primary btn-lg ml-3"
                        type="submit"
                      >
                        Buscar
                      </button>
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
