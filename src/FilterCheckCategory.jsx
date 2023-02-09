import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Form, ListGroup } from "react-bootstrap";
import SimpleScroll from "../simpleScroll/SimpleScroll";

const FilterCheckCategory = ({ categories, data, value, onChangeValue }) => {
  const updateValue = (newValue) => {
    onChangeValue({ filter: data, values: newValue });
  };

  const filteredValues = value && value?.map((val) => val.catId);
  const [searchCategory, setSearchCategory] = useState("");
  const handleChange = (event) => {
    if (event.target.checked && !value.includes(event.target.value)) {
      const categoryFilter = { catName: event.target.value, catId: event.target.id };
      updateValue([...value, categoryFilter]);
    }

    if (!event.target.checked && filteredValues.includes(event.target.id)) {
      updateValue(value.filter((x) => x.catId !== event.target.id));
    }
  };

  return (
    <>
      <div className="position-relative mb-2">
        <Form.Control placeholder="Search for category" type="search" name="searchCategory" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}></Form.Control>
        <FontAwesomeIcon icon={faSearch} className="position-absolute top-50 end-0 translate-middle-y fs-sm me-3" />
      </div>
      <SimpleScroll data-simplebar-auto-hide="false" style={{ minHeight: "8rem", maxHeight: "11rem" }}>
        {categories
          ?.filter((val) => {
            return searchCategory === "" ? val : val.name.toLowerCase().includes(searchCategory.toLowerCase());
          })
          .map((category, index) => {
            return (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center p-0 border-0 mb-1">
                <div className="form-check d-flex align-items-center">
                  <input className="form-check-input mb-1 me-2" id={category.gid} name="category" type="checkbox" onChange={handleChange} value={category.name} checked={filteredValues.includes(category.gid)} />
                  <label className="form-check-label" htmlFor={category.gid}>
                    {category.name} {`(${category.NumOfproduct})`}
                  </label>
                </div>
              </ListGroup.Item>
            );
          })}
      </SimpleScroll>
    </>
  );
};

export default FilterCheckCategory;
