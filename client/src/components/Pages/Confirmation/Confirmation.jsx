// src/components/Pages/Confirmation/Confirmation.jsx
import React from 'react'
import styles from './Confirmation.module.css'  // you can style it however you like
import { useDispatch } from 'react-redux';
import { setPage } from '../../../redux/slices/pageSlice';



export default function Confirmation() {
  const dispatch = useDispatch();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Thank you for your purchase!</h1>
      <p className={styles.message}>
        Your order has been placed successfully. We’ll send shipment details to your email shortly.
      </p>
      <button 
        className={styles.homeButton}
        onClick={() => dispatch(setPage('home'))}
      >
        Back to Home
      </button>
    </main>
  );
}