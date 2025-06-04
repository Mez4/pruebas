import { useState } from "react";
import { Formik, Form } from "formik";
import { Clientes } from "../../../../../selectores";
import { ActionFieldNumberText, ActionFieldText } from "../../../../../global";
import { toast } from "react-toastify";
import yup from "../../../../../../global/yupLocale";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import * as Funciones from "./Funciones";
import { Log } from "oidc-client";

type CFormType = {
  oidc: IOidc;
  ProductoID: number;
  SucursalID: number;
  CajaID: number;
  CuentaID: number;
  initialValues: {
    Dif_Pago: number;
    ClienteID: number;
    Referencia: string;
  };
  FNShowModal: () => void;
};

export default function CForm(props: CFormType) {
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize={true}
      validationSchema={yup.object().shape({
        Dif_Pago: yup
          .number()
          .required("Ingresa un importe")
          .moreThan(0, "Ingresa un importe mayor a 0"),
        ClienteID: yup
          .number()
          .required(`Seleccione cliente`)
          .moreThan(0, `Seleccione cliente`),
      })}
      onSubmit={(values, { setValues }) => {
        console.log(values);

        setLoading(true);
        const { Dif_Pago, Referencia, ClienteID } = values;
        const datos = {
          SucursalId: props.SucursalID,
          FechaAfectacion: new Date(),
          FechaCaptura: new Date(),
          Importe: Dif_Pago,
          Observaciones: `DNI Manual - Cliente ID ${ClienteID}`,
          ProductoId: props.ProductoID,
          refAPL: ClienteID,
          TipoMovimientoID: 19,
          cancelacionObservacion: null,
          Estatus: "A",
          ObservacionesUsuario: Referencia ?? null,
          CatEstatusMovID: 1,
          MovimientoBoveda: false,
          CajaId: props.CajaID,
          CuentaID: props.CuentaID,
        };

        Funciones.FNAddMov(props.oidc, datos)
          .then((respuesta: any) => {
            toast.success(
              `Se creó el Movimiento DNI con el N° ${respuesta.MovimientoID}`
            );
            toast.info("Se está generando el comprobante, por favor espere...");

            Funciones.FNGetDetalleDNI(props.oidc, {
              MovimientoID: respuesta.MovimientoID,
            })
              .then((pdf: any) => {
                const file = new Blob([pdf], { type: "application/pdf" });
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
                  "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                );
              });
            setValues({ Dif_Pago: 0, ClienteID: 0, Referencia: "" });
            props.FNShowModal();
          })
          .catch((err) => toast.error("Error al agregar DNI de manera manual"))
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      {({ values }) => (
        <Form>
          <Clientes
            disabled={false}
            DistribuidorID={0}
            name={"ClienteID"}
            ClienteId={values.ClienteID}
          />
          <ActionFieldNumberText
            disabled={false}
            placeholder="Ingrese importe"
            label="Importe DNI"
            name="Dif_Pago"
          />
          <ActionFieldText
            disabled={false}
            placeholder="Ingrese referencia"
            label="Referencia"
            name="Referencia"
          />
          <div className="text-end">
            <button
              type="button"
              className="btn btn-danger waves-effect waves-light mr-2"
              onClick={props.FNShowModal}
            >
              Cerrar
            </button>
            <button
              disabled={loading}
              type="submit"
              className="btn btn-success waves-effect waves-light"
            >
              Aplicar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
