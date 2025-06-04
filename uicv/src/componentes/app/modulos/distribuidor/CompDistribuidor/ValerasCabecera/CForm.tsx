import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  CustomFieldText,
  Spinner,
  CustomFieldDatePicker,
  ActionSelect,
} from "../../../../../global";
import * as Funciones from "./Funciones";
import Select from "react-select";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";

type CFormType = {
  oidc: IOidc;
  Id?: number;
  optProductos: { value: number; label: string }[];
  optSeries: { value: number; label: string }[];
  optFracciones: { value: number; label: string }[];
  evento: string;
  FnGetSeries(id: any, ValerasFraccionID: number, isUpdate: boolean): any;
  FNGetFolioSiguiente(
    serieId: number,
    ProductId: number,
    FolioFinal: number,
    ValerasFraccionID: number
  ): any;
  initialValues: {
    ProductoID: number;
    serieId: number;
    FolioInicial: number;
    FolioFinal: number;
    Estatus: string;
    RegistroFecha?: Date;
    RegistroUsuarioId: string;
    RegistroPersonaID: number;
    ValerasFraccionID: number;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
};

export const CForm = (props: CFormType) => {
  // Loading
  const [loading, setLoading] = React.useState(false);
  const [isMounted, setisMounted] = React.useState(false);
  const [ProductId, setProductID] = React.useState(
    props.initialValues.ProductoID
  );
  const [FolioFinal, setFolioFinial] = React.useState(
    props.initialValues.FolioFinal
  );
  const [ValerasFraccionID, setValerasFraccionID] = React.useState(
    props.initialValues.ValerasFraccionID
  );

  const getSerie = (value: any) => {
    console.log("???", props.Id != undefined);
    setProductID(value);
    props.FnGetSeries(value, ValerasFraccionID, false);
    //props.initialValues.ValerasFraccionID = 0
  };

  const getNextFolio = (value: any) => {
    props.FNGetFolioSiguiente(
      value,
      props.Id === undefined ? ProductId : props.initialValues.ProductoID,
      FolioFinal,
      ValerasFraccionID
    );
  };

  const getFraccion = (value: any) => {
    setValerasFraccionID(value);
  };

  useEffect(() => {
    // return () => {
    if (props.Id != undefined) {
      console.log("Update");
    } else {
      console.log("Add");
      setisMounted(true);
    }
    // }
  }, []);

  let validationShape = {
    ProductoID: Yup.number()
      .required("Campo obligatorio")
      .moreThan(0, "Seleccione el producto"),
    serieId: Yup.number()
      .required("Seleccione la serie")
      .moreThan(0, "Seleccione la serie"),
    FolioInicial: Yup.number()
      .required("Campo obligatorio")
      .moreThan(0, "indique el folio inicial"),
    FolioFinal: Yup.number()
      .required("Campo obligatorio")
      .moreThan(0, "indique el folio final"),
    ValerasFraccionID: Yup.number()
      .required("Campo obligatorio")
      .moreThan(0, "Indique los vales que hay en cada valera"),
  };

  // Return the component
  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape(validationShape)}
      onSubmit={(values: any) => {
        // Set our form to a loading state
        setLoading(true);
        console.log(`values`, values);
        console.log(`evento`, props.evento);
        console.log(`Id`, props.Id);
        // Finish the callback
        if (props.Id === undefined)
          //console.log("1", "AGREGAR")
          Funciones.FNAdd(props.oidc, values)
            .then((respuesta: any) => {
              setLoading(false);
              props.cbGuardar(respuesta);
              toast.success("Lote de Valeras agregado correctamente");
            })
            .catch((error: any) => {
              toast.error("Error al agregar lote de valera");
              setLoading(false);
            });
        else if (props.evento === "Ver Valera") {
          setLoading(false);
          props.fnCancelar();
        } else if (props.evento === "Pedir Valera")
          Funciones.FNAccion(props.oidc, {
            ValeraCabeceraID: props.Id,
            Evento: 1,
          })
            .then((respuesta: any) => {
              setLoading(false);
              props.cbActualizar(respuesta);
              toast.success("Lote de Valeras actualizado a PEDIDO a Proveedor");
            })
            .catch((error: any) => {
              toast.error("Error al actualizar lote de valera");
              setLoading(false);
            });
        else if (props.evento === "Surtir Valera")
          Funciones.FNAccion(props.oidc, {
            ValeraCabeceraID: props.Id,
            Evento: 2,
          })
            .then((respuesta: any) => {
              setLoading(false);
              props.cbActualizar(respuesta);
              toast.success(
                "Lote de Valeras actualizado a SURTIDO por el proveedor y DISPONIBLE en alamcén"
              );
            })
            .catch((error: any) => {
              toast.error("Error al actualizar lote de valera");
              setLoading(false);
            });
        else if (props.evento === "Cancelar Valera")
          Funciones.FNAccion(props.oidc, {
            ValeraCabeceraID: props.Id,
            Evento: 4,
          })
            .then((respuesta: any) => {
              setLoading(false);
              props.cbActualizar(respuesta);
              toast.success("Lote de Valeras CANCELADO correctamente");
            })
            .catch((error: any) => {
              toast.error("Error al actualizar lote de valera");
              setLoading(false);
            });
        else if (props.evento === "Descargar PDF") {
          toast.info("Generando Documento PDF de Valeras, por favor espere...");
          Funciones.FNGetFileM(props.oidc, { ValeraCabeceraID: props.Id })
            .then((pdf: any) => {
              const file = new Blob([pdf], { type: "application/pdf" });
              // const fileURL = URL.createObjectURL(file);

              // window.open(fileURL);
              const fileURL = URL.createObjectURL(file);
              const enlaceTemporal = document.createElement("a");
              enlaceTemporal.href = fileURL;
              enlaceTemporal.target = "_blank";
              enlaceTemporal.style.display = "none";

              document.body.appendChild(enlaceTemporal);

              enlaceTemporal.click();

              setTimeout(() => {
                // Imprimir el documento
                // window.print();
              }, 1000);

              setLoading(false);
              toast.success("Descargar PDF de Valeras generado correctamente");
            })
            .catch((error: any) => {
              toast.error("Error al Descargar PDF de lote de valera");
              setLoading(false);
            });
        }
      }}
    >
      <Form>
        <div className="row">
          <div className="col">
            <CustomFieldText
              disabled={true}
              label="Estatus"
              name="Estatus"
              placeholder="Estatus"
            />
          </div>
          <div className="col"></div>
          <div className="col">
            <CustomFieldDatePicker
              disabled={true}
              label="RegistroFecha"
              name="RegistroFecha"
              placeholder="RegistroFecha"
            />
          </div>
        </div>
        {isMounted && (
          <ActionSelect
            disabled={
              props.evento != "Editar Valera" && props.evento != "Crear Valera"
            }
            label="Producto"
            name="ProductoID"
            placeholder="Seleccione el producto"
            options={props.optProductos}
            addDefault={true}
            valor={props.initialValues.ProductoID}
            accion={getSerie}
          />
        )}
        {isMounted && (
          <ActionSelect
            disabled={
              props.evento != "Editar Valera" && props.evento != "Crear Valera"
            }
            label="Serie"
            name="serieId"
            placeholder="Seleccione la serie"
            options={props.optSeries}
            addDefault={false}
            valor={props.initialValues.serieId}
            accion={getNextFolio}
          />
        )}
        <div className="row">
          <div className="col">
            <CustomFieldText
              disabled={
                props.evento != "Editar Valera" &&
                props.evento != "Crear Valera"
              }
              label="FolioInicial"
              name="FolioInicial"
              placeholder="FolioInicial"
            />
          </div>
          <div className="col">
            <CustomFieldText
              disabled={
                props.evento != "Editar Valera" &&
                props.evento != "Crear Valera"
              }
              label="FolioFinal"
              name="FolioFinal"
              placeholder="FolioFinal"
            />
          </div>
          <div className="col">
            {isMounted && (
              <ActionSelect
                disabled={
                  props.evento != "Editar Valera" &&
                  props.evento != "Crear Valera"
                }
                label="Vales x Valera"
                name="ValerasFraccionID"
                placeholder="0"
                options={props.optFracciones}
                addDefault={false}
                valor={props.initialValues.ValerasFraccionID}
                accion={getFraccion}
              />
            )}
          </div>
        </div>

        {loading && <Spinner />}
        {!loading && (
          <div className="text-end">
            {props.evento != "Ver Valera" && (
              <button
                type="button"
                className="btn btn-danger waves-effect waves-light"
                onClick={props.fnCancelar}
              >
                {props.evento === "Cancelar Valera" ? "Volver" : "Cancelar"}
              </button>
            )}
            <button
              type="submit"
              className="ms-2 btn btn-success waves-effect waves-light"
            >
              {props.evento === "Asignar Sucursal" ||
              props.evento === "Asignar Socia"
                ? "Asignar"
                : props.evento === "Cancelar Valera"
                ? "Cancelar Valera"
                : props.evento === "Recibir Sucursal"
                ? "Valera Recibida"
                : "Ok"}
            </button>
          </div>
        )}
      </Form>
    </Formik>
  );
};
