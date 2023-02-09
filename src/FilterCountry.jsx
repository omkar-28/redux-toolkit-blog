import { Form } from "react-bootstrap";

const FilterCountry = ({ brandLists, data, value, onChangeValue }) => {
  const updateValue = (newValue) => {
    onChangeValue({ filter: data, values: newValue });
  };

  const handleCheckBox = (event) => {
    if (event.target.checked) {
      updateValue(event.target.value);
    }
    if (!event.target.checked) {
      updateValue("");
    }
  };

  return (
    <div className="d-flex">
      <div className="me-auto py-2">
        <div className=" d-inline card-title h5">Country of Origin: US</div>
      </div>
      <div className="py-2">
        <Form.Check
          type="switch"
          id="custom-switch"
          name="country"
          value={"US"}
          onChange={handleCheckBox}
          checked={value}
          // disabled={isProductLoading}
        />
      </div>
    </div>
  );
};

export default FilterCountry;
