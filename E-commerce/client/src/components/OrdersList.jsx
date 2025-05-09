import { useLoaderData } from 'react-router-dom';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
import { customFetchwithCred, formatPrice } from '../utils';
const OrdersList = () => {
  const { orders, meta } = useLoaderData();

  return (
    <div className='mt-8'>
      <h4 className='mb-4 capitalize'>
        total orders : {meta}
      </h4>
      <div className='overflow-x-auto'>
        <table className='table table-zebra'>
          {/* head */}
          <thead>
            <tr>
              <th>Holder Name</th>
              <th>Status</th>
              <th>Products</th>
              <th>Cost</th>
              <th className='hidden sm:block'>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.orders?.map((order) => {
              const id = order?.id;
              // const { name, address, numItemsInCart, orderTotal, createdAt } =
              //   order.attributes;
              const date = day(order?.createdAt).format('hh:mm a - MMM Do, YYYY');
              return (
                <tr key={id}>
                  <td>{order?.holder}</td>
                  <td> <span className={` p-1 rounded-lg ${order?.status ==='pending'? 'bg-pending bg-opacity-20 text-pending':'bg-delivred bg-opacity-20 text-delivred'}`}>{order?.status}</span></td>
                  <td>{order?.orderItems?.length}</td>
                  <td>{formatPrice(order?.total)}</td>
                  <td className='hidden sm:block'>{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OrdersList;
