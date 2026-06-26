const EmptyState = ({ icon, title, message, actionLabel, onAction }) => {
  return (
    <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-blue-50 max-w-lg mx-auto">
      {icon && (
        <div className="mx-auto h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 text-3xl">
          {icon}
        </div>
      )}
      {title && (
        <h2 className="text-2xl font-black text-blue-950 mb-2">{title}</h2>
      )}
      {message && (
        <p className="text-gray-500 mb-8">{message}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-6 py-3 text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
