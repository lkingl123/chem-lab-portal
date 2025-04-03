"use client";

const SmallLoadingSpinner = () => {
  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600" />
    </div>
  );
};

export default SmallLoadingSpinner;
