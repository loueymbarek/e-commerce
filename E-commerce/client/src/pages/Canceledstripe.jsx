import React, { useState, useEffect } from 'react';

import { BsBagCheckFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { MdOutlineError } from "react-icons/md";


const Canceledstripe = () => {
//   const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext();
  
//   useEffect(() => {
//     localStorage.clear();
//     setCartItems([]);
//     setTotalPrice(0);
//     setTotalQuantities(0);
//     runFireworks();
//   }, []);

  return (
    <div className="Canceledstripe-wrapper">
      <div className="Canceledstripe">
        <p className="icon">
        <MdOutlineError />
        </p>
        <h2>The payment was not successful!</h2>
        <p className="email-msg">Unfortunately,There was an error processing your payment  </p>
        <p className="description">
          If you have any questions, please email
          <a className="email" href="mailto:saz@gmail.com">
          saz@gmail.com
          </a>
        </p>
        <Link to="/products">
          <button type="button" width="300px" className="btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Canceledstripe