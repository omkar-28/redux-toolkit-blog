// react
import React, { useCallback } from "react";

// third-party
import FilterCheck from "./FilterCheck";
import FilterRange from "./FilterRange";
import getFilterHandler from "../../utils/filters";
import { Accordion, Card, ListGroup, Placeholder } from "react-bootstrap";
import FilterCountry from "./FilterCountry";
import FilterInput from "./FilterInput";
import "./WidgetFilters.modules.css";
import FilterCheckCategory from "./FilterCheckCategory";

// application

const filterComponents = {
  // price: FilterRange,
  brand: FilterCheck,
  country: FilterCountry,
  search: FilterInput,
  category: FilterCheckCategory,
};
function WidgetFilters(props) {
  const { dispatch, filters, values, brandLists, isLoading, categories } = props;
  const handleValueChange = useCallback(
    ({ filter, values }) => {
      const handler = getFilterHandler(filter);
      const productFilters = filters.map((item) => (item.type === filter.type ? { ...item, value: values } : item));
      if (handler) {
        dispatch({
          type: "SET_FILTER_VALUE",
          filter: filter.slug,
          value: handler.isDefaultValue(filter, values) ? "" : handler.serialize(values),
          productFilters,
        });
      }
    },
    //eslint-disable-next-line
    [dispatch]
  );

  let filtersList;
  if (isLoading) {
    filtersList = (
      <>
        <Placeholder as="p" animation="glow" className="placeholder--image">
          <Placeholder xs={10} />
        </Placeholder>
        <Placeholder as="p" animation="glow" className="placeholder--image">
          <Placeholder xs={9} />
        </Placeholder>
        <Placeholder as="p" animation="glow" className="placeholder--image">
          <Placeholder xs={8} />
        </Placeholder>
      </>
    );
  } else {
    filtersList = filters?.map((filter, index) => {
      let filterView;
      let { value } = filter; //{type: 'check', slug: 'brand', name: 'Brand',}
      const handler = getFilterHandler(filter);

      if (handler && filter.slug in values) {
        value = handler.deserialize(values[filter.slug]) || handler.getDefaultValue(filter);
      }
      // if (filter.slug === "category") value = value?.map((val) => val.catId) || [];
      const FilterComponent = filterComponents[filter.slug];
      if (FilterComponent) {
        filterView = <FilterComponent data={filter} categories={categories} brandLists={brandLists} value={value} onChangeValue={handleValueChange} />;
      }

      return (
        <React.Fragment key={index}>
          {filter.name === "Search" ? (
            <React.Fragment>
              {filterView}
              <Card.Title className="filterTitle mb-1">Filters</Card.Title>
            </React.Fragment>
          ) : filter.name === "Category" && !categories.length > 0 ? null : (
            <Accordion.Item aria-label={index + ""} key={index} eventKey={index + ""} className="py-3">
              <Accordion.Header>{filter.name}</Accordion.Header>
              <Accordion.Body className="px-2">{filter.name === "Brand" || filter.name === "brand" ? <ListGroup variant="flush">{filterView}</ListGroup> : <ListGroup variant="flush">{filterView}</ListGroup>}</Accordion.Body>
            </Accordion.Item>
          )}
        </React.Fragment>

        // <React.Fragment key={index}>{filterView}</React.Fragment>
      );
    });
  }

  return (
    <>
      <Accordion alwaysOpen flush defaultActiveKey="1">
        {filtersList}
      </Accordion>
    </>
  );
}

export default WidgetFilters;
