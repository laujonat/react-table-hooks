import React from "react";
import JsonTree from "react-json-tree";

import {
  Table,
  Row,
  HeaderRow,
  Header,
  Cell,
  Button,
  Select,
  Input,
  Emoji,
  Pagination
} from "./Styles";

export default function MyTable({ instance, loading }) {
  const {
    getTableProps,
    headerGroups,
    rows,
    getRowProps,
    pageOptions,
    page,
    state: [{ pageIndex, pageSize }],
    gotoPage,
    prepareRow,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage
  } = instance;

  return (
    <div>
      <Table {...getTableProps()}>
        {headerGroups.map(headerGroup => (
          <HeaderRow {...headerGroup.getRowProps()}>
            {headerGroup.headers.map(column => (
              <Header
                {...column.getHeaderProps()}
                sorted={column.sorted}
                sortedDesc={column.sortedDesc}
                sortedIndex={column.sortedIndex}
              >
                <div>
                  <span {...column.getSortByToggleProps()}>
                    {column.render("Header")}
                  </span>{" "}
                  {column.canGroupBy ? (
                    <Emoji {...column.getGroupByToggleProps()}>
                      {column.grouped ? "🛑" : "👊"}
                    </Emoji>
                  ) : null}
                </div>
                {column.canFilter ? <div>{column.render("Filter")}</div> : null}
              </Header>
            ))}
          </HeaderRow>
        ))}
        {page && page.length
          ? page.map((row, i) => {
              prepareRow(row);
              return (
                <Row {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    const isPivot = row.groupByID === cell.column.id;
                    const showAggregate = row.subRows && !isPivot;
                    return (
                      <Cell {...cell.getCellProps()}>
                        {showAggregate ? (
                          cell.column.aggregate ? (
                            cell.render("Aggregated")
                          ) : null
                        ) : (
                          <span>
                            {isPivot ? (
                              <span
                                style={{
                                  cursor: "pointer",
                                  paddingLeft: `${row.depth * 2}rem`,
                                  paddingRight: "1rem",
                                  whiteSpace: "nowrap"
                                }}
                                onClick={() => row.toggleExpanded()}
                              >
                                <Emoji style={{}}>
                                  {row.isExpanded ? "👇" : "👉"}
                                </Emoji>
                              </span>
                            ) : null}
                            {cell.render("Cell")}
                            {isPivot ? (
                              <span> ({row.subRows.length})</span>
                            ) : null}
                          </span>
                        )}
                      </Cell>
                    );
                  })}
                </Row>
              );
            })
          : null}
        <Row {...getRowProps()}>
          {loading ? (
            <Cell>
              <strong>Loading...</strong>
            </Cell>
          ) : (
            <Cell>{rows.length} Total Records</Cell>
          )}
        </Row>
        {pageOptions.length ? (
          <Pagination {...getRowProps()}>
            <Cell>
              <Button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Previous
              </Button>{" "}
              <Button onClick={() => nextPage()} disabled={!canNextPage}>
                Next
              </Button>{" "}
              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </span>
              <span>
                | Go to page:{" "}
                <Input
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(page);
                  }}
                  style={{ width: "100px" }}
                />
              </span>{" "}
              <Select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Select>
            </Cell>
          </Pagination>
        ) : null}
      </Table>
      <br />
      <br />
      <JsonTree data={instance} />
    </div>
  );
}
