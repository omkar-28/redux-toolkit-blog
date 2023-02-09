import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { Badge, Card, Form } from "react-bootstrap";

const FilterInput = (props) => {
  const { data, value, onChangeValue } = props;
  // const pageName = useRef(window.location.pathname.split("/")[1]);
  const filterError = useRef(null);
  // const [nestedSearch, setNestedSearch] = useState();
  let nestedSearch = useRef(null);

  const updateValue = (newValue) => {
    onChangeValue({ filter: data, values: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let nestedSearchVal = nestedSearch.current.value;
    if (nestedSearchVal) {
      if (nestedSearchVal && !value.includes(nestedSearchVal)) {
        updateValue([...value, nestedSearchVal]);
      } else {
        filterError.current = "Error";
      }
    }
  };

  const handleRemoveFilter = (searchVal) => {
    if (value.includes(searchVal)) {
      updateValue(value.filter((x) => x !== searchVal));
    }
  };

  let nestedFilterContent;

  if (Array.isArray(value) && value?.length > 0) {
    nestedFilterContent = (
      <div className="filtered_result">
        <Card.Title className="mb-2">Applied Filters</Card.Title>
        <div className="filtered_result--block">
          {value?.map((searchVal, i) => (
            <Badge key={i} pill bg="danger" onClick={() => handleRemoveFilter(searchVal)}>
              {searchVal} <FontAwesomeIcon icon={faCircleXmark} />
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {
        <div id="nestedFilters_block" className="mb-3 pb-3">
          <Form onSubmit={handleSubmit} className={"nestedSearchForm"}>
            <div className="position-relative">
              <Form.Control placeholder="Search within these results" ref={nestedSearch} type="search" name="searchBrand" style={{ minHeight: "2.75rem", fontSize: "1rem" }}></Form.Control>
              <button type="submit" className="bg-transparent border-0 p-0 position-absolute top-50 end-0 translate-middle-y fs-sm me-3">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </Form>

          {nestedFilterContent}
        </div>
      }
    </>
  );
};

export default FilterInput;
