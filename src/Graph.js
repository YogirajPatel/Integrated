import React, { useState, useEffect } from "react";
import { useTable } from "react-table";

const Graph = () => {
  const [respo, setRespo] = useState(null);
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Currencies",
        accessor: "currencies",
        Cell: ({ cell }) => (
          <div>{cell.value ? cell.value.join(", ") : ""}</div>
        ),
      },
      {
        Header: "Emoji Unicode",
        accessor: "emojiU",
        Cell: ({ cell }) => <div>{cell.value}</div>,
      },
      {
        Header: "AWS Region",
        accessor: "countries",
        Cell: ({ cell }) => {
          const awsRegions = cell.value.map((country) => country.awsRegion);
          return <div>{awsRegions.join(", ")}</div>;
        },
      },
    ],
    []
  );

  const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } =
    useTable({ columns, data: respo ? respo.continents : [] });

  useEffect(() => {
    fetch("https://countries.trevorblades.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            continents {
              name
              code  
              countries {
                awsRegion
                currencies
                emojiU
                languages {
                  native
                }
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRespo(data.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  if (!respo) {
    return <div>Loading...</div>;
  }

  console.log(respo);

  return (
    <>
      <table className="my-table" {...getTableProps()}>
        <thead>
          <tr>
            {headerGroups.map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td key={cell.id} {...cell.getCellProps()}>
                    <div>{cell.render("Cell")}</div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Graph;
