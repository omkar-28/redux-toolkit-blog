import { faPause, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
import { useMemo } from "react";
import { Button, Card, Form, Offcanvas } from "react-bootstrap";
import PaginationCount from "../../utils/PaginationCount";
import ProductCard from "../product-card/ProductCard";

import "./ShopPage.modules.css";

function useSetOption(option, filter, dispatch) {
  //eslint-disable-next-line
  const callback = useCallback(filter, []);

  return useCallback(
    (data) => {
      dispatch({
        type: "SET_OPTION_VALUE",
        option,
        value: callback(data),
      });
    },
    [option, callback, dispatch]
  );
}

const ShopProductView = ({ productsLists, options, filters, dispatch, widgetFilter }) => {
  const [switchView, setSwitchView] = useState("grid");
  const [showFilter, setShowFilter] = useState(false);

  const handlePageChange = useSetOption("page", parseFloat, dispatch);
  const handleLimitChange = useSetOption("limit", (event) => parseFloat(event.target.value), dispatch);

  const handleResetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, [dispatch]);

  const productResult = useMemo(() => {
    if (productsLists?.pagination) {
      const productPage = options.page || 0;
      const productLimit = options.limit || 10;
      const productTotal = productsLists?.pagination?.total;
      const productFrom = productPage * productLimit + 1;

      const productTo = Math.max(Math.min((productPage + 1) * productLimit, productTotal), productFrom);
      return { productFrom, productTo };
    }
  }, [productsLists, options]);
  return (
    <>
      <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement={"start"}>
        <div className="widget-filter__sidebar ">
          <div className="filter-sidebar filter-sidebar--offcanvas--mobile">
            <Card className="card-block shadow border-0 widget-filter">
              <Card.Body className="p-4" style={{ height: "100vh", overFlowY: "scroll" }}>
                {widgetFilter}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Offcanvas>
      <div className="products-view__options mb-3">
        <div className="view-options__layout d-flex align-items-center justify-content-betweenw-100">
          <div className="layout-switcher me-3">
            <div className="layout-switcher__list">
              <div title="Filter" role="button" aria-label="list" className={`filter-widget__button`} onClick={() => setShowFilter(!showFilter)}>
                <FontAwesomeIcon icon={faSliders} className={"me-2"} /> filter
              </div>
              <div
                title="Grid"
                role="button"
                aria-label="grid"
                className={`layout-switcher__button ${switchView === "grid" ? "layout-switcher__button--active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSwitchView(e.currentTarget.ariaLabel);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M15.2,16H9.8C9.4,16,9,15.6,9,15.2V9.8C9,9.4,9.4,9,9.8,9h5.4C15.6,9,16,9.4,16,9.8v5.4C16,15.6,15.6,16,15.2,16z M15.2,7 H9.8C9.4,7,9,6.6,9,6.2V0.8C9,0.4,9.4,0,9.8,0h5.4C15.6,0,16,0.4,16,0.8v5.4C16,6.6,15.6,7,15.2,7z M6.2,16H0.8 C0.4,16,0,15.6,0,15.2V9.8C0,9.4,0.4,9,0.8,9h5.4C6.6,9,7,9.4,7,9.8v5.4C7,15.6,6.6,16,6.2,16z M6.2,7H0.8C0.4,7,0,6.6,0,6.2V0.8 C0,0.4,0.4,0,0.8,0h5.4C6.6,0,7,0.4,7,0.8v5.4C7,6.6,6.6,7,6.2,7z"></path>
                </svg>
              </div>
              <div
                title="List"
                role="button"
                aria-label="list"
                className={`layout-switcher__button ${switchView === "list" ? "layout-switcher__button--active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSwitchView(e.currentTarget.ariaLabel);
                }}
              >
                <FontAwesomeIcon icon={faPause} />
              </div>
            </div>
          </div>
          <div className="view-options__control d-flex align-items-center">
            <label htmlFor="view-options-limit">Show</label>
            <div className="ms-2 position-relative">
              <Form.Select id="view-options-limit" value={options.limit} className="form-control form-control-sm" onChange={handleLimitChange}>
                <option value="10">10</option>
                {productsLists?.pagination?.total > 20 && <option value="20">20</option>}
                {productsLists?.pagination?.total > 50 && <option value="50">50</option>}
              </Form.Select>
            </div>
          </div>
          {Object.keys(filters).length > 0 && (
            <div className="reset_filters">
              <Button className="reset__filter_btn ms-2" variant="secondary" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          )}

          <div className="view-options__display_result ms-auto">{`Showing ${productResult?.productFrom ?? 0}-${productResult?.productTo ?? 0} of ${productsLists?.pagination?.total ?? 0} products`}</div>
        </div>
      </div>

      {productsLists?.data?.length > 0 ? (
        <div className="products-view__list" data-layout={switchView}>
          <div className="products-list__body d-flex flex-wrap">
            {productsLists?.data.map((product) => (
              <div className="products-list__item" key={product._id}>
                <ProductCard product={product} quickview={true} switchView={switchView} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h4 style={{ textAlign: "center", paddingTop: "5rem" }}>No Products Found</h4>
      )}

      {productsLists?.pagination?.total > 0 && <div className="products-view__pagination">{productsLists?.pagination && <PaginationCount current={options.page || productsLists?.pagination.pageNo} total={productsLists?.pagination.total} pageSize={productsLists?.pagination.pageSize} onPageChange={handlePageChange} align={"center"} />}</div>}
    </>
  );
};

export default ShopProductView;
