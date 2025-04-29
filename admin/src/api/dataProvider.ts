import simpleRestProvider from "ra-data-simple-rest";
import { UpdateParams } from "react-admin";
import { Warranty } from "../types/warranty.types";
import { tokenService } from "../services/tokenService";
import { BASE_URL } from "./api";

const httpClient = async (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  }

  const token = tokenService.getToken();

  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, options).then(async (response) => {
    const body = await response.text();

    const json = body ? JSON.parse(body) : {};

    return {
      status: response.status,
      headers: response.headers,
      body,
      json,
    };
  });
};

const baseDataProvider = simpleRestProvider(BASE_URL as string, httpClient);

export const dataProvider = {
  ...baseDataProvider,

  getList: async (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const query: any = {
      page,
      limit: perPage,
      sortBy: field,
      sortOrder: order.toLowerCase(),
    };

    if (params.filter?.q) {
      query.search = params.filter.q;
    }

    const url = `${BASE_URL}/${resource}?${new URLSearchParams(query).toString()}`;

    return await httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  update: async (resource: string, params: UpdateParams<Warranty>) => {
    const { clientName, productInfo, installationDate, status } = params.data;

    const filteredData = {
      clientName,
      productInfo,
      installationDate,
      status,
    };

    return httpClient(`${BASE_URL}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(filteredData),
    }).then(({ json }) => ({ data: json }));
  },
};
