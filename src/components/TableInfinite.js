import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import JsonTree from "react-json-tree";
import { FixedSizeList as List } from "react-window";

import {
  Table,
  Row,
  HeaderRow,
  Header,
  Cell,
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
    prepareRow,
    state: [{ sortBy, groupBy, filters }]
  } = instance;

  const listRef = useRef();
  const [scrollToIndex, setScrollToIndex] = useState(0);
  const [height, setHeight] = useState(500);

  useEffect(
    () => {
      if (listRef.current) {
        listRef.current.scrollToItem(scrollToIndex, "start");
      }
    },
    [scrollToIndex]
  );

  useLayoutEffect(
    () => {
      if (listRef.current) {
        listRef.current.scrollToItem(0, "start");
      }
    },
    [sortBy, groupBy, filters]
  );

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
        <List
          ref={listRef}
          height={height}
          itemCount={rows.length}
          itemSize={40}
          overscanCount={10}
          scrollToAlignment="start"
          {...getRowProps()}
        >
          {({ index, style }) => {
            const row = rows[index];
            if (!row) {
              return null;
            }
            prepareRow(row);
            return (
              <Row {...row.getRowProps({ style, even: index % 2 })}>
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
          }}
        </List>
        <Row {...getRowProps()}>
          {loading ? (
            <Cell>
              <strong>Loading...</strong>
            </Cell>
          ) : (
            <Cell>{rows.length} Total Records</Cell>
          )}
        </Row>
        <Pagination {...getRowProps()}>
          <Cell>
            <span>
              Go to result:{" "}
              <Input
                type="number"
                defaultValue={scrollToIndex + 1}
                onChange={e => {
                  const start = e.target.value ? Number(e.target.value) - 1 : 0;
                  setScrollToIndex(start);
                }}
                style={{ width: "100px" }}
              />
            </span>{" "}
            Table Height:{" "}
            <Select
              value={height}
              onChange={e => {
                setHeight(Number(e.target.value));
              }}
            >
              {[100, 500, 1000].map(height => (
                <option key={height} value={height}>
                  {height}px
                </option>
              ))}
            </Select>
          </Cell>
        </Pagination>
      </Table>
      <br />
      <br />
      <JsonTree data={instance} />
    </div>
  );
}
