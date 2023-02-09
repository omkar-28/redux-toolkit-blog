// react
import React, { useContext, useEffect, useMemo, useReducer } from "react";
// third-party
import queryString from "query-string";
// application
import WidgetFilters from "./WidgetFilters";

// data stubs
import { CategoryContext } from "../../contexts/CategoryContext";
import { filterDataItems } from "../../utils/filters";
import { useRef } from "react";
import "./ShopPage.modules.css";
import BlockLoader from "../blockloader/BlockLoader";
import { ProductContext } from "../../contexts/ProductContext";
import { Breadcrumb, Card, Placeholder } from "react-bootstrap";
import "./ShopPage.modules.css";
import { useParams } from "react-router-dom";
import ShopProductView from "./ShopProductView";
import ErrorBoundary from "../../utils/ErrorBoundary";
import isEqual from "lodash.isequal";
import { getCategoryParents } from "../../utils/utils";
import PageTitle from "../page-header/PageTitle";

const BreadcrumbPlaceHolder = () => {
  return (
    <>
      <Placeholder as={"h2"} className="mb-1" animation="glow">
        <Placeholder xs={6} style={{ width: "8rem" }} />
      </Placeholder>
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <Placeholder animation="glow">
            <Placeholder xs={6} style={{ width: "5rem" }} />
          </Placeholder>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Placeholder animation="glow">
            <Placeholder xs={6} style={{ width: "5rem" }} />
          </Placeholder>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Placeholder animation="glow">
            <Placeholder xs={6} style={{ width: "5rem" }} />
          </Placeholder>
        </Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
};
function parseQueryOptions(location) {
  const query = queryString.parse(location);
  const optionValues = {};

  if (typeof query.page === "string") {
    optionValues.page = parseFloat(query.page);
  }
  if (typeof query.limit === "string") {
    optionValues.limit = parseFloat(query.limit);
  }
  if (typeof query.sort === "string") {
    optionValues.sort = query.sort;
  }

  return optionValues;
}

function parseQueryFilters(location) {
  const query = queryString.parse(location);
  const filterValues = {};

  Object.keys(query).forEach((param) => {
    const mr = param.match(/^filterBy_([-_A-Za-z0-9]+)$/);

    if (!mr) {
      return;
    }

    const filterSlug = mr[1];

    filterValues[filterSlug] = query[param];
  });

  return filterValues;
}

function parseQuery(location) {
  return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
  const params = {};
  if (options.limit !== 10) {
    params.limit = options.limit;
  }

  if (options.sort !== "default") {
    params.sort = options.sort;
  }

  Object.keys(filters)
    .filter((x) => !!filters[x])
    .forEach((filterSlug) => {
      if (filterSlug === "category") {
        localStorage.setItem("categoryFilter", JSON.stringify(filters[filterSlug]));
        let queryResult = filters[filterSlug].map((item) => item.catName);

        params[`filterBy_${filterSlug}`] = queryResult.join(",");
      } else {
        params[`filterBy_${filterSlug}`] = filters[filterSlug];
      }
    });
  return queryString.stringify(params, { encode: false });
}

const initialState = {
  init: false,
  productIsLoading: false,
  productLists: [],
  categories: [],
  brandListsIsLoading: true,
  categoryListsIsLoading: true,
  brandLists: null,
  prodFilters: null,
  options: { page: 0 },
  filters: { brand: "", category: "", price: "", country: "", search: "" },
  noProductsFound: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_BRANDS_LIST":
      return { ...state, brandListsIsLoading: true };
    case "FETCH_BRANDS_LIST_SUCCESS":
      return { ...state, brandListsIsLoading: false, brandLists: action.payload };
    case "FETCH_CATEGORY_LIST_SUCCESS":
      return { ...state, categoryListsIsLoading: false, categories: action.payload };
    case "FETCH_PRODUCT_LIST":
      return { ...state, productIsLoading: true };
    case "FETCH_PRODUCT_LIST_SUCCESS":
      return { ...state, noProductsFound: false, productIsLoading: false, productLists: action.payload };
    case "FETCH_PRODUCT_LIST_FAILED":
      return {
        ...state,
        productIsLoading: false,
        productLists: [],
        noProductsFound: true,
      };
    case "FETCH_FILTER_LIST_SUCCESS":
      return { ...state, prodFilters: action.payload };
    case "SET_OPTION_VALUE":
      return {
        ...state,
        options: { ...state.options, page: 0, [action.option]: action.value },
      };
    case "SET_FILTER_VALUE":
      return {
        ...state,
        options: { ...state.options, page: 0 },
        filters: { ...state.filters, [action.filter]: action.value },
      };
    case "RESET_NESTED_FILTERS":
      return { ...state, options: { ...state.options, page: 0 }, filters: { brand: "", category: "", price: "", country: "" } };
    case "RESET_FILTERS":
      return { ...state, options: { ...state.options, page: 0 }, filters: { brand: "", category: "", price: "", country: "" } };
    case "RESET":
      return state.init ? initialState : state;
    default:
      throw new Error();
  }
}

function init(state) {
  //   const [options, filters] = parseQuery("filter_brand=brandix,zosch&filter_price=356-3200");
  const [options, filterSearch] = parseQuery(window.location.search);
  let categoryFilter = filterSearch.category === "" ? "" : JSON.parse(localStorage.getItem("categoryFilter"));
  let filterResult = { ...state.filters };

  Object.keys(filterSearch).forEach((item) => {
    if (item === "category") {
      filterResult[item] = categoryFilter;
    } else {
      filterResult[item] = filterSearch[item];
    }
  });

  return {
    ...state,
    options,
    filters: { ...filterResult },
  };
}

const ProductPlaceHolder = () => {
  const prodArr = new Array(6).fill("");
  return prodArr.map((item, i) => (
    <div className="card__placeholder--list" key={i}>
      <Card>
        <Placeholder as="p" animation="glow" className="placeholder--image">
          <Placeholder xs={12} style={{ height: "8.5rem" }} />
        </Placeholder>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} /> <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button variant="primary" xs={6} />
        </Card.Body>
      </Card>
    </div>
  ));
};

const getFilterData = (filterValues = {}, filterData) => {
  const productFilters = filterData.map((item) => (item.slug in filterValues ? { ...item, value: filterValues[item.slug] } : item));

  return productFilters;
};

function useDeepEffect(fn, deps) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isFirstEffect = isFirst.current;
    const isSame = prevDeps.current.every((obj, index) => isEqual(obj, deps[index]));
    isFirst.current = false;
    prevDeps.current = deps;
    if (isFirstEffect || !isSame) {
      return fn();
    }
    //eslint-disable-next-line
  }, [deps]);
}

function ShopPage(props) {
  const { queryStr, category } = useParams();
  const prevQry = useRef(queryStr);
  const [state, dispatch] = useReducer(reducer, initialState, init);

  const { getBrandList, getBreadCrumbs, breadCrumbs } = useContext(CategoryContext);
  const { getFilteredProduct, getProductCategory } = useContext(ProductContext);
  const filterList = useRef(null);

  const filterParams = useMemo(() => {
    const [minPrice, maxPrice] = state.filters && state.filters.price ? state.filters.price.split("-") : [0, 363996];

    return {
      search: queryStr,
      min: Number(minPrice),
      max: Number(maxPrice),
      coo: state.filters.country ?? "",
      category: category ?? "",
      filterSearch: state.filters.search ? state.filters.search.split("|") : [],
    };
    //eslint-disable-next-line
  }, [queryStr, state.options, state.filters, category]);

  // Replace current url.
  useEffect(() => {
    if (!state.filters.category) localStorage.removeItem("categoryFilter");
    const filterQuery = { ...state.filters, category: state.filters.category === "" ? "" : Array.isArray(state.filters.category) ? state.filters.category : JSON.parse(localStorage.getItem("categoryFilter")) };

    const query = buildQuery(state.options, filterQuery);
    const location = `${window.location.pathname}${query ? "?" : ""}${query}`;

    window.history.replaceState(null, "", location);
  }, [state.options, state.filters]);

  // Load Brands.
  useEffect(() => {
    if (prevQry.current && prevQry.current !== queryStr) {
      dispatch({ type: "RESET_FILTERS" });
    }
    if(category) getBreadCrumbs(category);
  }, [queryStr]);

  // Load Brands.
  // useEffect(() => {
  //   filterList.current = filterDataItems;
  //   if (filterList.current) {
  //     const getProdFilters = getFilterData({ ...state.filters }, filterList.current);
  //     dispatch({ type: "FETCH_FILTER_LIST_SUCCESS", payload: getProdFilters });
  //   }

  //   dispatch({ type: "FETCH_BRANDS_LIST" });
  //   const [minPrice, maxPrice] = state.filters && state.filters.price ? state.filters.price.split("-") : [0, 363996];

  //   const args = {
  //     search: queryStr,
  //     min: Number(minPrice),
  //     max: Number(maxPrice),
  //     coo: state.filters.country ?? "",
  //     category: category ?? "",
  //     filterSearch: state.filters.search ? state.filters.search.split("|") : [],
  //   };
  //   const fetchBrands = async () => {
  //     const data = await getBrandList(args);
  //     if (data) {
  //       dispatch({ type: "FETCH_BRANDS_LIST_SUCCESS", payload: data.brands });
  //     }
  //   };

  //   const fetchCategory = async () => {
  //     const catData = await getProductCategory(args);
  //     if (catData) {
  //       dispatch({ type: "FETCH_CATEGORY_LIST_SUCCESS", payload: catData });
  //     }
  //   };
  //   fetchBrands();
  //   if (!category) fetchCategory();

  //   //eslint-disable-next-line
  // }, [queryStr, state.options, state.filter, category]);

  useDeepEffect(() => {
    filterList.current = filterDataItems;
    if (filterList.current) {
      const getProdFilters = getFilterData({ ...state.filters }, filterList.current);
      dispatch({ type: "FETCH_FILTER_LIST_SUCCESS", payload: getProdFilters });
    }

    dispatch({ type: "FETCH_BRANDS_LIST" });
    fetchBrands(filterParams);
    if (!category) fetchCategory(filterParams);
  }, [queryStr, state.filters.search, state.filters.price, state.filters.country, category]);

  useEffect(() => {
    fetchProduct();
    //eslint-disable-next-line
  }, [queryStr, state.options, state.filters, category]);

  // Load Products, Brands and category function.
  const fetchBrands = async (args) => {
    const data = await getBrandList(args);
    if (data) {
      dispatch({ type: "FETCH_BRANDS_LIST_SUCCESS", payload: data });
    }
  };

  const fetchCategory = async (args) => {
    const catData = await getProductCategory(args);
    if (catData) {
      dispatch({ type: "FETCH_CATEGORY_LIST_SUCCESS", payload: catData });
    }
  };
  const fetchProduct = async () => {
    const [minPrice, maxPrice] = state.filters && state.filters.price ? state.filters.price.split("-") : [0, 363996];

    const args = {
      search: queryStr,
      page: state.options.page || 0,
      size: state.options.limit || 10,
      brand: state.filters?.brand ? state.filters?.brand.split(",") : [],
      min: Number(minPrice),
      max: Number(maxPrice),
      coo: state.filters.country ?? "",
      category: category ?? "",
      categories: state.filters.category ? state.filters?.category.map((categoryId) => categoryId.catId) : [],
      filterSearch: state.filters.search ? state.filters.search.split("|") : [],
    };
    dispatch({ type: "FETCH_PRODUCT_LIST" });
    const data = await getFilteredProduct(args);

    if (data && data !== "No Data Found") {
      dispatch({ type: "FETCH_PRODUCT_LIST_SUCCESS", payload: data });
    } else {
      dispatch({ type: "FETCH_PRODUCT_LIST_FAILED" });
    }
  };

  let content;
  if (!state.brandListsIsLoading) {
    content = <WidgetFilters title="Filters" categories={state.categories} brandLists={state.brandLists} filters={state.prodFilters} values={state.filters} dispatch={dispatch} isLoading={state.brandListsIsLoading} />;
  } else {
    content = (
      <>
        <Placeholder as="p" animation="glow" className="placeholder--image mt-4">
          <Placeholder xs={10} />
        </Placeholder>
        <Placeholder as="p" animation="glow" className="placeholder--image">
          <Placeholder xs={9} />
        </Placeholder>
        <Placeholder as="p" animation="glow" className="placeholder--image">
          <Placeholder xs={8} />
        </Placeholder>

        <Placeholder as="p" animation="glow" className="placeholder--image mt-4">
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
  }

  let productContent;
  if (state.productIsLoading) {
    productContent = (
      <div className="card__placeholder d-flex flex-wrap" style={{ margin: "-6px" }}>
        <ProductPlaceHolder />
      </div>
    );
  }
  //  else if (state.noProductsFound || state.productLists?.products?.length === 0) {
  //   productContent = <h4 style={{ textAlign: "center", paddingTop: "5rem" }}>No Products Found</h4>;
  // }
  else {
    productContent = <ShopProductView isLoading={state.productsListIsLoading} productsLists={state.productLists} options={state.options} filters={state.filters} dispatch={dispatch} widgetFilter={content} />;
  }

  let pageTitle = "Shop";
  const breadcrumb = [{ title: "Home", url: "/" }];
  
  if (!category) {
    breadcrumb.push({ title: queryStr?.toUpperCase(), url: "" });
  }else if (breadCrumbs) {
    breadcrumb.push({ title: breadCrumbs.name, url: `/category/segment/${breadCrumbs.gid}` });
    const result = getCategoryParents(breadCrumbs);
    result.reverse().forEach((crumbs) => {
      pageTitle = crumbs.name;
      breadcrumb.push({ title: crumbs.name, url: `/category/family/${crumbs.gid}` });
    });
  }

  return (
    <div className="container-fluid">
      {state.productIsLoading && <BlockLoader position={"fixed"} />}
      {state.productIsLoading ? <BreadcrumbPlaceHolder /> : <PageTitle title={pageTitle} breadcrumb={breadcrumb} />}

      <div className="product-layout d-flex">
        <div className="widget-filter__sidebar widget-desktop d-none d-lg-block">
          <div className="filter-sidebar filter-sidebar--offcanvas--mobile">
            <ErrorBoundary>
              <Card className="card-block shadow border-0 widget-filter">
                <Card.Body className="p-4">
                  <>{content}</>
                </Card.Body>
              </Card>
            </ErrorBoundary>
          </div>
        </div>
        <div className="product__layout--content" style={{ minHeight: "60vh" }}>
          <ErrorBoundary>{productContent}</ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
