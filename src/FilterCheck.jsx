import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Form, ListGroup } from "react-bootstrap";
import SimpleScroll from "../simpleScroll/SimpleScroll";

const FilterCheck = ({ brandLists, data, value, onChangeValue }) => {
  const updateValue = (newValue) => {
    onChangeValue({ filter: data, values: newValue });
  };

  const [searchBrand, setSearchBrand] = useState("");
  const handleChange = (event) => {
    if (event.target.checked && !value.includes(event.target.value)) {
      updateValue([...value, event.target.value]);
    }
    if (!event.target.checked && value.includes(event.target.value)) {
      updateValue(value.filter((x) => x !== event.target.value));
    }
  };

  return (
    <>
      <div className="position-relative mb-2">
        <Form.Control placeholder="Search for brand" type="search" name="searchBrand" value={searchBrand} onChange={(e) => setSearchBrand(e.target.value)}></Form.Control>
        <FontAwesomeIcon icon={faSearch} className="position-absolute top-50 end-0 translate-middle-y fs-sm me-3" />
      </div>
      {!brandLists?.length && <h6 style={{ textAlign: "center", paddingTop: "3rem" }}>No brand Found</h6>}
      <SimpleScroll data-simplebar-auto-hide="false" style={{ minHeight: "8rem", maxHeight: "11rem" }}>
        {brandLists
          ?.filter((val) => {
            return searchBrand === "" ? val : val.brand_name.toLowerCase().includes(searchBrand.toLowerCase());
          })
          .map((brand, index) => {
            return (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center p-0 border-0 mb-1">
                <div className="form-check d-flex align-items-center">
                  <input className="form-check-input mb-1 me-2" id={brand.brand_name.replace(/ /g, "_")} name="brand" type="checkbox" onChange={handleChange} value={brand.brand_name} checked={value.includes(brand.brand_name)} />
                  <label className="form-check-label" htmlFor={brand.brand_name.replace(/ /g, "_")}>
                    {brand.brand_name} {`(${brand.count})`}
                  </label>
                </div>
              </ListGroup.Item>
            );
          })}
      </SimpleScroll>
    </>
  );
};

export default FilterCheck;
