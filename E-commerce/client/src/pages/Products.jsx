import axios from "axios";
import { Filters, PaginationContainer, ProductsContainer } from "../components";
import { customFetch, customFetch2 } from "../utils";
const url = "/products";

const allProductsQuery = (queryParams) => {
    const { search, category, company, sort, price, shipping, page, elastic } = queryParams;
    console.log("sqdqdqsq5555555555555");
    return {
        queryKey: [
            "products",
            search ?? "",
            category ?? "all",
            company ?? "all",
            sort ?? "a-z",
            price ?? 10000000,
            shipping ?? false,
            page ?? 1,
        ],

        queryFn: () =>
            customFetch(url, {
                params: queryParams,
            }),
    };
};

const allProductsElastic = (queryParams) => {
    const { elastic } = queryParams;    // elastic holds the search text
    return {
        queryKey: [
            "products",
            elastic ?? "",
        ],
        queryFn: async () => {
            const response = await customFetch('/api/v1/semantic-search', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ queryText: elastic }),
            });
            if (!response.ok) {
                throw new Error("Semantic search failed");
            }
            const data = await response.json();
            // data.products is expected from your Flask API
            return data.products || [];
        }
    };
}
export const loader =
    (queryClient) =>
    async ({ request }) => {
        const params = Object.fromEntries([...new URL(request.url).searchParams.entries()]);
        console.log("sqdqsd///", params);
        let response;

        {
            params.elastic && params.elastic !== ""
                ? (response = await queryClient.ensureQueryData(allProductsElastic(params)))
                : (response = await queryClient.ensureQueryData(allProductsQuery(params)));
        }

        console.log(response);
        const products = response.data;
        const meta = response.data;
        return { products, meta, params };
    };

const Products = () => {
    return (
        <>
            <Filters />
            <ProductsContainer />
            <PaginationContainer />
        </>
    );
};
export default Products;
