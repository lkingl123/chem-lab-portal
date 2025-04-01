export default function LoggedOut() {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👋 You’ve been signed out</h1>
          <p className="text-gray-600 mt-2">Thank you for using the Chem Lab Portal.</p>
          <a
            href="/"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Return to login
          </a>
        </div>
      </div>
    );
  }
  