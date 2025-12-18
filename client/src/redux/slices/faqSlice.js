// src/store/faqSlice.js
import { createSlice } from '@reduxjs/toolkit';

const faqSlice = createSlice({
  name: 'faq',
  initialState: {
    items: [
      {
        question: "Where are your products made?",
        answer: "All our garments are crafted in ethical workshops in Portugal and Italy."
      },
      {
        question: "What materials do you use?",
        answer: "We use organic cotton, linen, and recycled fabrics exclusively."
      }
    ]
  },
  reducers: {}
});

export default faqSlice.reducer;