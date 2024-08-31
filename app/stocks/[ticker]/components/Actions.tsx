'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import axios from 'axios';

export default async function Action({ ticker, amount }: { ticker: string, amount:number }) {
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasStock, setHasStock] = useState(false);
  const [sellPopup, setSellPopup] = useState(false);
  const router = useRouter();
 
  useEffect(() => {
    const token = Cookies.get('token');
   
    if (token) {
      // Fetch portfolio
      axios.get('https://stock-backend-new-qrfb.onrender.com/portfolio/getPortfolio', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(async response => {
        const stock = response.data.portfolio.find((item: any) => item.ticker === ticker);
        if(stock){
          setHasStock(true)
        }
      })
      .catch(error => console.error('Error fetching portfolio:', error));
    } else {
      router.push('/login');
    }
  }, [router, ticker]);

  const handleBuy = async () => {
    if (amount === null) {
      Swal.fire('Error', 'Failed to fetch stock price', 'error');
      return;
    }

    setIsSending(true);
    const token = Cookies.get('token');
    if(!token){
      router.push('/login');
      return;
    }
    axios.post('https://stock-backend-new-qrfb.onrender.com/portfolio/buy', {
      // stockPrice:parseInt(amount.toString()), 
      stockPrice:amount,      
      quantity: parseInt(quantity),
      ticker
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setIsSending(false);
      Swal.fire('Success', response.data.message, 'success');
      setQuantity(''); // Clear the input field
      setShowPopup(false); // Close the popup
    })
    .catch(error => {
      setIsSending(false);
      Swal.fire('Error', error.response?.data.message || 'An error occurred while buying stock', 'error');
      console.error('Error buying stock:', error);
    });
  };

  const handleSell = async () => {
    if (amount === null) {
      Swal.fire('Error', 'Failed to fetch stock price', 'error');
      return;
    }

    setIsSending(true);
    const token = Cookies.get('token');

    axios.post('https://stock-backend-new-qrfb.onrender.com/portfolio/sell', {
      stockPrice: amount,
      quantity: parseInt(quantity),
      ticker
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setIsSending(false);
      Swal.fire('Success', response.data.message, 'success');
      setQuantity(''); // Clear the input field
      setShowPopup(false); // Close the popup
    })
    .catch(error => {
      setIsSending(false);
      Swal.fire('Error', error.response?.data.message || 'An error occurred while selling stock', 'error');
      console.error('Error selling stock:', error);
    });
  };

  return (
    <>
      <button
        style={{ backgroundColor: "green", padding: "5px", width: "100px", borderRadius: "5px" }}
        onClick={() => setShowPopup(true)} // Open popup on click
      >
        Buy
      </button>

       {/* disbaled if hasStock is false*/}

      <button
        style={{ backgroundColor: "red", padding: "5px", width: "100px", borderRadius: "5px",marginLeft:"5px" }}
        onClick={() => setSellPopup(true)} // Open popup on click
        disabled={!hasStock}
      >
        Sell
      </button>
     

      {/* Modal Popup for Buy */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 w-2/3">
            <h2 className="text-xl mb-4">Buy {ticker}</h2>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 rounded w-full mb-4 text-black"
              placeholder="Enter quantity"
            />
            <div className="flex justify-end">
              <button
                onClick={handleBuy}
                className="bg-green-500 text-white p-2 rounded mr-2"
                style={{ backgroundColor: "green" }}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Buy'}
              </button>
              
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white p-2 rounded"
                style={{ backgroundColor: "gray" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Modal Popup for Sell */}
       {sellPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 w-2/3">
            <h2 className="text-xl mb-4">Sell {ticker}</h2>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 rounded w-full mb-4 text-black"
              placeholder="Enter quantity"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSell}
                className="bg-green-500 text-white p-2 rounded mr-2"
                style={{ backgroundColor: "red" }}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Sell'}
              </button>
              
              <button
                onClick={() => setSellPopup(false)}
                className="bg-gray-500 text-white p-2 rounded"
                style={{ backgroundColor: "gray" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
