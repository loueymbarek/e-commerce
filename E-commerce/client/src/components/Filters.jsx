import { Form, useLoaderData, Link } from "react-router-dom";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormRange from "./FormRange";
import FormCheckbox from "./FormCheckbox";
const Filters = () => {
    const { meta, params } = useLoaderData();
    const { search, company, category, shipping, order, price, elastic } = params;

    return (
        <>
            <div className="bg-base-200  items-center  rounded-md m-b-20 px-8 py-4 flex">
                {/* SEARCH */}
                <Form className="flex-1 mr-[10px]">
                    <FormInput
                        type="elastic"
                        label="semantic search "
                        name="elastic"
                        size="input-sm"
                        defaultValue={elastic}
                    />
                </Form>
                <button className="btn btn-primary   btn-sm mt-[35px] ">elastic search</button>
            </div>
            <Form className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4  gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
                {/* SEARCH */}
                <FormInput
                    type="search"
                    label="search product"
                    name="search"
                    size="input-sm"
                    defaultValue={search}
                />
                {/* CATEGORIES */}
                <FormSelect
                    label="select category"
                    name="category"
                    list={meta?.meta?.categories}
                    size="select-sm"
                    defaultValue={category}
                />
                {/* COMPANIES */}
                <FormSelect
                    label="select company"
                    name="company"
                    list={meta?.meta?.companies}
                    size="select-sm"
                    defaultValue={company}
                />
                {/* ORDER */}
                <FormSelect
                    label="sort by"
                    name="order"
                    list={["a-z", "z-a", "high", "low"]}
                    size="select-sm"
                    defaultValue={order}
                />
                {/* PRICE */}
                <FormRange name="price" label="select price" size="range-sm" price={price} />
                {/* SHIPPING */}
                <FormCheckbox
                    name="shipping"
                    label="free shipping"
                    size="checkbox-sm"
                    defaultValue={shipping}
                />
                {/* BUTTONS */}
                <button type="submit" className="btn btn-primary btn-sm">
                    search
                </button>
                <Link to="/products" className="btn btn-accent btn-sm">
                    reset
                </Link>
            </Form>
        </>
    );
};
export default Filters;
