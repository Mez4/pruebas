import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { DatePickeEnd, DatePickeStart, Spinner } from "../../../../../global";
import moment from "moment";

type CFormProps = {
  onSubmit: (value?: any) => void;
  loading?: boolean;
  storageKey: string;
};

const initialValues = {
  FechaInicio: moment().add(-10, "d").toDate(),
  FechaFin: moment().toDate(),
};

export default function CForm(props: CFormProps) {
  const { storageKey } = props;

  const getSavedDate = (key: string, fallbackValue: Date) => {
    const saved = localStorage.getItem(key);
    return saved ? new Date(saved) : fallbackValue;
  };

  const [startDate, setStartDate] = useState(() =>
    getSavedDate(`${storageKey}_startDate`, initialValues.FechaInicio)
  );
  const [endDate, setEndDate] = useState(() =>
    getSavedDate(`${storageKey}_endDate`, initialValues.FechaFin)
  );

  useEffect(() => {
    localStorage.setItem(`${storageKey}_startDate`, startDate.toISOString());
  }, [startDate, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}_endDate`, endDate.toISOString());
  }, [endDate, storageKey]);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  return (
    <>
      {props.loading && <Spinner />}
      {!props.loading && (
        <Formik
          initialValues={{
            FechaInicio: startDate,
            FechaFin: endDate,
          }}
          onSubmit={props.onSubmit}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <Form>
              <div
                style={{
                  backgroundColor: "#F0F0F0",
                  padding: "1em",
                  borderRadius: "15px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  <div className="columns is-left is-mobile is-multiline">
                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                      <DatePickeStart
                        name={"FechaInicio"}
                        label={"Fecha Inicial"}
                        disabled={!!props.loading}
                        placeholder={"Inicio"}
                        isClearable
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={(date) => {
                          handleStartDateChange(date);
                          setFieldValue("FechaInicio", date);
                        }}
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                      <DatePickeEnd
                        name={"FechaFin"}
                        label={"Fecha Final"}
                        disabled={!!props.loading}
                        placeholder={"Final"}
                        isClearable
                        startDate={startDate}
                        endDate={endDate}
                        setEndDate={(date) => {
                          handleEndDateChange(date);
                          setFieldValue("FechaFin", date);
                        }}
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-3-desktop mt-3 text-start">
                      <button
                        disabled={!!props.loading}
                        className="btn btn-primary btn-lg"
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
