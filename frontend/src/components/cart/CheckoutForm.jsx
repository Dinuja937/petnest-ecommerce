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
      <div className="bg-brand-card-background p-6 sm:p-8 rounded-brand-lg shadow-brand-soft border border-brand-border">
        <h2 className="text-xl font-extrabold text-brand-text-primary mb-6 flex items-center gap-2 tracking-tight">
          <Truck className="text-brand-primary w-5 h-5" /> Shipping Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="John Doe"
              className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+94 77 123 4567"
              className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Street Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="address">
              Street Address
            </label>
            <input
              id="address"
              type="text"
              required
              placeholder="123, Main Street"
              className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="city">
              City
            </label>
            <input
              id="city"
              type="text"
              required
              placeholder="Colombo"
              className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary" htmlFor="postalCode">
              Postal Code / ZIP
            </label>
            <input
              id="postalCode"
              type="text"
              required
              placeholder="00100"
              className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-brand-text-primary rounded-brand-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm transition-all shadow-sm bg-gray-50/30 hover:bg-gray-50/60 focus:bg-white"
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
      <div className="bg-brand-card-background p-6 sm:p-8 rounded-brand-lg shadow-brand-soft border border-brand-border">
        <h2 className="text-xl font-extrabold text-brand-text-primary mb-6 flex items-center gap-2 tracking-tight">
          <CreditCard className="text-brand-primary w-5 h-5" /> Payment Method
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['Cash on Delivery', 'Card (Stripe)'].map((method) => (
            <label
              key={method}
              className={`flex flex-col items-center justify-center p-4 border rounded-brand-md cursor-pointer transition-all ${
                paymentMethod === method
                  ? 'border-brand-primary bg-brand-secondary text-brand-primary font-bold shadow-sm'
                  : 'border-brand-border text-brand-text-secondary hover:bg-gray-50'
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
        className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3.5 px-4 rounded-brand-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? 'Processing Order...' : 'Place Order'}
      </button>
    </>
  );
};

export default CheckoutForm;
