import { Formik, Form } from "formik";
import { Distribuidores } from "../../../../../selectores";
import {
  ActionFieldNumberText,
  ActionFieldText,
  ActionSelect,
} from "../../../../../global";
import { toast } from "react-toastify";
import yup from "../../../../../../global/yupLocale";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import * as Funciones from "./Funciones";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import { useState } from "react";

type CFormType = {
  oidc: IOidc;
  ProductoID: number;
  SucursalID: number;
  CajaID: number;
  CuentaID: number;
  initialValues: {
    Dif_Pago: number;
    DistribuidorId: number;
    Referencia: string;
  };
  optCuentasBancarias: { value: number; label: string }[];
  FNShowModal: () => void;
};

export default function CForm(props: CFormType) {
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize={true}
      validationSchema={yup.object().shape({
        Dif_Pago: yup.number().moreThan(0, "Ingresa un importe mayor a 0"),
        DistribuidorId: yup
          .number()
          .required(`Seleccione la ${DescripcionDistribuidor(1)}`)
          .moreThan(0, `Seleccione la ${DescripcionDistribuidor(1)}`),
      })}
      onSubmit={(values: any, { setValues }) => {
        const { Dif_Pago, Referencia, DistribuidorId, CuentaBancoID } = values;
        const datos = {
          SucursalId: props.SucursalID,
          FechaAfectacion: new Date(),
          FechaCaptura: new Date(),
          Importe: Dif_Pago,
          Observaciones: `DNI Manual - Socia ID ${DistribuidorId}`,
          ProductoId: props.ProductoID,
          refAPL: DistribuidorId,
          TipoMovimientoID: 19,
          cancelacionObservacion: null,
          Estatus: "A",
          ObservacionesUsuario: Referencia ?? null,
          CatEstatusMovID: 1,
          MovimientoBoveda: false,
          CajaId: props.CajaID,
          CuentaID: CuentaBancoID ?? 0,
        };
        setLoading(true);
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
            setValues({ Dif_Pago: 0, DistribuidorId: 0, Referencia: "" });
            props.FNShowModal();
          })
          .catch((err) => toast.error("Error al agregar DNI de manera manual"))
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <Form>
        <Distribuidores
          disabled={false}
          valor={props.initialValues.DistribuidorId}
          name={"DistribuidorId"}
          SucursalID={props.SucursalID}
          WithProducto
          RequiereSuc
        />
        {!!props.optCuentasBancarias.length && (
          <ActionSelect
            disabled={false}
            label="Cuenta Bancaria"
            name="CuentaBancoID"
            placeholder="Seleccione la cuenta"
            options={props.optCuentasBancarias}
            addDefault={true}
            valor={0}
            // accion={props.cbSucursal}
            // ref={refSucursal}
          />
        )}
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
    </Formik>
  );
}
