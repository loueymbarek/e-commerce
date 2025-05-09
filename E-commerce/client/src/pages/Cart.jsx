import { useSelector } from 'react-redux';
import { CartItemsList, SectionTitle, CartTotals } from '../components';
import { Link } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import { customFetchwithCred,customFetch, formatPrice } from '../utils';
import { toast } from 'react-toastify';
const Cart = () => {
  const user = useSelector((state) => state.userState.user);
  const { cartItems, orderTotal, numItemsInCart,tax ,shipping} =useSelector((state) => state.cartState);
 


  if (numItemsInCart === 0) {
    return <SectionTitle text='Your cart is empty' />;
  }
const handleCheckout = async () => {
 
 
 

  const info = {
    chargeTotal: orderTotal,
    orderTotal: orderTotal,
    cartItems,
    numItemsInCart,
    tax:tax,
    shippingFee:shipping
  };

  try {

    const stripe= await loadStripe('pk_test_51OwWYBRsiFIKHguGS1q6xqCeWQrUwY2wgMs9YvbMleLudyMd4aSTV4CFagbVWJ9J4fj15DjiCYY8JKKuLpjlf9zf00YYBS1kBl');

    const body={
      products:cartItems
    }
    const headers={
      "Content-Type":"application"
    }
    
    const responseStripe = await customFetch.post('/orders/create-checkout-session', info);

    
    const session =responseStripe.data.id
    console.log(session);
    const result = stripe.redirectToCheckout({
      sessionId:session
    })
  if(result.error){
    const errorMessage =
    error?.response?.data?.msg  ||
      'stripe error';
    toast.error(errorMessage);
  }
    // const response = await customFetchwithCred.post(
    //   '/orders',
    //   { data: info }
    // );
    // queryClient.removeQueries(['orders']);
    // store.dispatch(clearCart());
    // toast.success('order placed successfully');
    // return redirect('/orders');
  } catch (error) {
    console.log(error);
    const errorMessage =
    error?.response?.data?.msg  ||
      'there was an error placing your order';
    toast.error(errorMessage);
    //if (error?.response?.status === 401 || 403) return redirect('/login');
    return null;
  }
};
  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-8 grid gap-8 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList />
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <CartTotals />
          {user ? (
            
            <Link  className='btn btn-primary btn-block mt-8' onClick={handleCheckout}>
              proceed to checkout
            </Link>
          ) : (
            <Link to='/login' className='btn btn-primary btn-block mt-8'>
              please login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
export default Cart;
