import { constants } from "perf_hooks";
import { useState, useEffect } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

export default function TablaDiasComparacionCoordinador(props: {
  date: string;
  backgroundColor: string;
  data: any[];
}) {
  const [dias, setDias]: any[] = useState([]);

  const llenarArreglo = () => {
    const array: Date[] = [];
    const date: Date = props.date ? new Date(props.date) : new Date();

    for (let i = 1; i <= 15; i++) {
      var dateAux;
      if (date.getDate() == 30) {
        date.getDay() + 1 == 31
          ? (dateAux = date.setDate(date.getDate() + 2))
          : (dateAux = date.setDate(date.getDate() + 1));
        array.push(new Date(dateAux));
      } else {
        dateAux = date.setDate(date.getDate() + 1);
        array.push(new Date(dateAux));
      }
      //dateAux == 31 ? date.setDate(date.getDate() -1) : date.setDate(date.getDate());
    }

    setDias(array);
  };

  useEffect(() => {
    llenarArreglo();
  }, [props.date]);

  return (
    <div className="columns">
      <div className="table-container column is-full-desktop is-full-tablet is-full-mobile">
        <table className="table is-bordered">
          <thead>
            <tr>
              {dias.map((day, index) => (
                <th
                  key={index}
                  style={{
                    backgroundColor: props.backgroundColor,
                    textAlign: "center",
                  }}
                >
                  {day.getDate() <= 29 ? day.getDate() : day.getDate() + "-31"}/
                  {day.getMonth() + 1 >= 10
                    ? day.getMonth() + 1
                    : `0${day.getMonth() + 1}`}
                  /{day.getFullYear()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia01 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia01 >= 0
                    ? props.data[0].Dia01 + "%"
                    : props.data[0].Dia01 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia02 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia02 >= 0
                    ? props.data[0].Dia02 + "%"
                    : props.data[0].Dia02 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia03 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia03 >= 0
                    ? props.data[0].Dia03 + "%"
                    : props.data[0].Dia03 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia04 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia04 >= 0
                    ? props.data[0].Dia04 + "%"
                    : props.data[0].Dia04 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia05 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia05 >= 0
                    ? props.data[0].Dia05 + "%"
                    : props.data[0].Dia05 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia06 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia06 >= 0
                    ? props.data[0].Dia06 + "%"
                    : props.data[0].Dia06 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia07 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia07 >= 0
                    ? props.data[0].Dia07 + "%"
                    : props.data[0].Dia07 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia08 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia08 >= 0
                    ? props.data[0].Dia08 + "%"
                    : props.data[0].Dia08 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia09 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia09 >= 0
                    ? props.data[0].Dia09 + "%"
                    : props.data[0].Dia09 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia10 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia10 >= 0
                    ? props.data[0].Dia10 + "%"
                    : props.data[0].Dia10 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia11 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia11 >= 0
                    ? props.data[0].Dia11 + "%"
                    : props.data[0].Dia11 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia12 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia12 >= 0
                    ? props.data[0].Dia12 + "%"
                    : props.data[0].Dia12 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia13 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia13 >= 0
                    ? props.data[0].Dia13 + "%"
                    : props.data[0].Dia13 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia14 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia14 >= 0
                    ? props.data[0].Dia14 + "%"
                    : props.data[0].Dia14 * -1 + "%"}
                </td>
              ))}
              {props.data.map((item, index) => (
                <td key={index} style={{ textAlign: "center" }}>
                  {/* {props.data[0].Dia15 >= 0 ? (
                    <AiOutlineArrowUp color="green" />
                  ) : (
                    <AiOutlineArrowDown color="red" />
                  )} */}
                  {props.data[0].Dia15 >= 0
                    ? props.data[0].Dia15 + "%"
                    : props.data[0].Dia15 * -1 + "%"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
