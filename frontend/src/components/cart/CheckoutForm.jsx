import { CreditCard, Truck } from 'lucide-react';

const CheckoutForm = ({
  fullName, setFullName,
  phone, setPhone,
  address, setAddress,
  city, setCity,
  postalCode, setPostalCode,
  country, setCountry,
  paymentMethod, setPaymentMethod,
  isLoading,
  checkoutItems,
  itemsPrice,
  shippingPrice,
  totalPrice,
}) => {
  return (
    <>
      {/* Shipping Address */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-50/50">
        <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
          <Truck className="text-blue-600 w-5 h-5" /> Shipping Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Street Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="address">
              Street Address
            </label>
            <input
              id="address"
              type="text"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="city">
              City
            </label>
            <input
              id="city"
              type="text"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="postalCode">
              Postal Code / ZIP
            </label>
            <input
              id="postalCode"
              type="text"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          {/* Hidden country */}
          <input
            type="hidden"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-50/50">
        <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
          <CreditCard className="text-blue-600 w-5 h-5" /> Payment Method
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['Cash on Delivery', 'Card (Stripe)'].map((method) => (
            <label
              key={method}
              className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === method
                  ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-semibold shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Place Order Button */}
      <button
        disabled={isLoading}
        type="submit"
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Processing Order...' : 'Place Order'}
      </button>
    </>
  );
};

export default CheckoutForm;
