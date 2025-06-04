import { useEffect, useState } from "react";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { ActionSelect, Card, Spinner } from "../../../../global";
import { connect } from "react-redux";
import * as Funciones from "./Multisaldos_General/Funciones";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { toast } from "react-toastify";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import DataGridComp from "../../../../global/DataGrid";
import { Formik } from "formik";
import { Form } from "usetheform";
import * as Yup from 'yup'
import XLSX from "xlsx";

type MultiSaldosGeneralType = {
  oidc: IOidc;
  ui: iUI;
};

const MultiSaldosGeneral = (props: MultiSaldosGeneralType) => {
  const optTipoCancelacion: any[] = []
  const [state, setState] = useState({
    loading: false,
    Error: false,
    optTipoCancelacion,
    Datos: [],
    DatosExcel: [],
  });


  const fnGet = (BalanceID: number) => {
    if(BalanceID != 0)
    {
      setState((s) => ({
        ...s,
        loading: true,
      }));
      Funciones.FNGet(props.oidc,BalanceID)
        .then((respuesta: any) => {
          var Excelit = respuesta.map((valor: any) => ({
              NOMBRE_BALANCE: valor.NombreBalance,
              CUENTAID: valor.CUENTAID,
              CUENTA: valor.CUENTA,
              CARGOS: valor.CARGOS,
              ABONOS: valor.ABONOS,
              SALDOENMOVS: valor.SALDOENMOVS,
              SALDOACTUAL: valor.SALDOACTUAL
          }));
          setState((s) => ({
            ...s,
            Datos: respuesta,
            loading: false,
            DatosExcel: Excelit, 
          }));
        })
        .catch(() => {
          setState((s) => ({
            ...s,
            Datos: [],
            loading: false,
            Error: true,
          }));
        });
    }
    else
    {
      toast.warning('Seleccione el balance que desea consultar')
    }
    
  };
  const fnGetPDF = (BalanceID: number) => {
    Funciones.FNPdf(props.oidc,BalanceID)
      .then((pdf: any) => {
        const file = new Blob([pdf], {
          type: "application/pdf",
        });
        const fileURL = URL.createObjectURL(file);
        const enlaceTemporal = document.createElement("a");
        enlaceTemporal.href = fileURL;
        enlaceTemporal.target = "_blank";
        enlaceTemporal.style.display = "none";
        document.body.appendChild(enlaceTemporal);
        enlaceTemporal.click();
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));

        toast.error(
          "Error al descargar el archivo, intente descargar nuevamente el archivo o reportarlo a sistemas"
        );
      });
  };

    const FnGetBalance = () => {
          Funciones.FNGetBalances(props.oidc)
              .then((respuesta: any) => {
                  var cancelacion = respuesta.map((valor: any) => {
                      var obj = { value: valor.BalanceID, label:`ProductoID: ${valor.ProductoID} - ${valor.NombreBalance} `};
                      return obj
                  });
  
                  setState(s => ({ ...s, optTipoCancelacion: cancelacion }))
              })
              .catch(() => {
                  setState(s => ({ ...s, optTipoCancelacion: [] }))
              })
      }

  const generarXLSX = async () => {
      const toastId = toast.warning("Excel Generándose...", { autoClose: false });
  
      await new Promise(resolve => setTimeout(resolve, 500)); // Espera 500ms
  
      const XLSX = require("xlsx-js-style");
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
      const colWidths: { wch: number }[] = [];
  
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let col = range.s.c; col <= range.e.c; col++) {
          let maxLength = 0;
          for (let row = range.s.r; row <= range.e.r; row++) {
              const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
              if (cell && cell.v) {
                  maxLength = Math.max(maxLength, cell.v.toString().length);
              }
          }
          colWidths.push({ wch: maxLength + 2 }); 
      }
  
      ws["!cols"] = colWidths;
  
      for (let i in ws) {
          if (typeof ws[i] != "object") continue;
          let cell = XLSX.utils.decode_cell(i);
  
          if (cell.r === 0) {
              ws[i].s = {
                  fill: {
                      patternType: "solid",
                      fgColor: { rgb: "5e5f5b" },
                      bgColor: { rgb: "5e5f5b" },
                  },
                  font: {
                      name: "Song Ti",
                      sz: 10,
                      bold: true,
                      color: { rgb: "FFFFFF" },
                  },
                  border: {
                      bottom: {
                          style: "thin",
                          color: "FF000000",
                      },
                  },
                  alignment: {
                      vertical: "center",
                      horizontal: "center",
                      wrapText: "1",
                  },
              };
          } else {
              ws[i].s = {
                  font: {
                      name: "Song Ti",
                      sz: 10,
                  },
                  alignment: {
                      vertical: "center",
                      horizontal: "center",
                      wrapText: "1",
                  },
                  border: {
                      right: {
                          style: "thin",
                      },
                      left: {
                          style: "thin",
                      },
                      bottom: {
                          style: "thin",
                      },
                  },
              };
              if (cell.r % 2 === 0) {
                  ws[i].s.fill = {
                      patternType: "solid",
                      fgColor: { rgb: "EEEEEE" },
                      bgColor: { rgb: "EEEEEE" },
                  };
              }
          }
      }
  
      XLSX.writeFile(wb, "Multisaldos.xlsx");
  
      toast.dismiss(toastId);
  
      toast.success("Excel Generado con éxito", { autoClose: 5000 });
  };
          
  // const columnsMUI: GridColDef[] = [
  //   {
  //     field: "CUENTAID",
  //     headerName: "CUENTA ID",
  //     align: "center",
  //     headerAlign: "center",
  //     flex: 1,
  //   },
  //   {
  //     field: "CUENTA",
  //     headerName: "CUENTA",
  //     align: "center",
  //     headerAlign: "center",
  //     flex: 1,
  //   },
  //   {
  //     field: "CARGOS",
  //     headerName: "CARGOS",
  //     align: "right",
  //     headerAlign: "center",
  //     flex: 1,
  //     renderCell: (cell: any) => (
  //       <span>
  //         {cell.row.CARGOS.toLocaleString("es-ES", {
  //           style: "currency",
  //           currency: "MXN",
  //         })}
  //       </span>
  //     ),
  //   },
  //   {
  //     field: "ABONOS",
  //     headerName: "ABONOS",
  //     align: "right",
  //     headerAlign: "center",
  //     flex: 1,
  //     renderCell: (cell: any) => (
  //       <span>
  //         {cell.row.ABONOS.toLocaleString("es-ES", {
  //           style: "currency",
  //           currency: "MXN",
  //         })}
  //       </span>
  //     ),
  //   },
  //   {
  //     field: "SALDOENMOVS",
  //     headerName: "SALDO EN MOVS",
  //     align: "right",
  //     headerAlign: "center",
  //     flex: 1,
  //     renderCell: (cell: any) => (
  //       <span>
  //         {cell.row.SALDOENMOVS.toLocaleString("es-ES", {
  //           style: "currency",
  //           currency: "MXN",
  //         })}
  //       </span>
  //     ),
  //   },
  //   {
  //     field: "SALDOACTUAL",
  //     headerName: "SALDO ACTUAL",
  //     align: "right",
  //     headerAlign: "center",
  //     flex: 1,
  //     renderCell: (cell: any) => (
  //       <span>
  //         {cell.row.SALDOACTUAL.toLocaleString("es-ES", {
  //           style: "currency",
  //           currency: "MXN",
  //         })}
  //       </span>
  //     ),
  //   },
  //   {
  //     field: "TOTAL",
  //     headerName: "TOTAL",
  //     align: "right",
  //     headerAlign: "center",
  //     flex: 1,
  //     renderCell: (cell: any) => (
  //       <span>
  //         {cell.row.TOTAL.toLocaleString("es-ES", {
  //           style: "currency",
  //           currency: "MXN",
  //         })}
  //       </span>
  //     ),
  //   },
  // ];

useEffect(() => {


          FnGetBalance()
       
        // eslint-disable-next-line
    }, [])

  return (
 
      <div className="row">
        <div className="col-12">
          <Card Title="Multisaldo General">
            <Card.Body>
              <Card.Body.Content>
                 <Formik
                  initialValues={
                      {
                        BalanceID: 0
                      }
                  }
                  enableReinitialize
                  validationSchema={
                    Yup.object().shape({
                        BalanceID: Yup.number().required("Selecciona Balance").moreThan(0, "Selecciona Balance")
                      })}
                  onSubmit={(values: any) => {
                      // setLoading(true)
                      // setState(s => ({ ...s, Cargando: true }))
                      // console.log("VALORES", values)
                      // if(values.BalanceID != 0)
                      // {
                      //   fnGet(values.BalanceID)
                      // }
                      // else
                      // {
                      //   toast.warning('Selecciona el balance que quieres consultar')
                      // }
                      
                  }}>
                    {({ values }) => (
                  <Form>
                      <div className="columns is-centered is-mobile is-multiline">
                          <div className="column is-one-two-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <ActionSelect
                              disabled={false}
                              label="Balance"
                              name="BalanceID"
                              placeholder="Selecciona Balance"
                              options={state.optTipoCancelacion}
                              addDefault={false}
                          />
                          </div>
                          <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                              {/* <br /> */}
                              <button
                            disabled={state.Datos.length > 0 ? false : true}
                            className="btn btn-danger btn-lg mr-2"
                            onClick={() => { fnGetPDF(values.BalanceID)}}
                            type="button"
                          >
                            PDF
                            <FaFilePdf size="20px" className="ml-2" />
                          </button>
                          <button
                            disabled={state.Datos.length > 0 ? false : true}
                            className="btn btn-success btn-lg mr-2"
                            onClick={() => { generarXLSX()}}
                            type="button"
                          >
                            Excel
                            <FaFileExcel size="20px" className="ml-2" />
                          </button>
                          <button
                            disabled={state.loading}
                            className="btn btn-primary btn-lg"
                            onClick={() => {fnGet(values.BalanceID)}}
                            type="button"
                          >
                            Generar Multisaldos
                          </button>
                          </div>
                      </div>
                      {/* <div className="columns is-centered is-mobile is-multiline"> */}
                      {state.loading ? (
                        <Spinner />
                      ) : state.Error ? (
                        <span>Error al cargar los datos...</span>
                      ) : (
                        <DataGridComp data={state.Datos} />
                      )}

                      {/* </div> */}
                  </Form>
                  )}
              </Formik>
               
              </Card.Body.Content>
            </Card.Body>
          </Card>
        </div>
      </div>
 
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MultiSaldosGeneral);
