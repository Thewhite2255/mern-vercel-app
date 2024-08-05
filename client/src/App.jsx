function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100">
      <div className="flex gap-4 rounded-lg bg-white p-8 shadow-md max-md:flex-col">
        <div className="w-1/4">
          <img
            src="/images/avatar.png"
            className="h-24 rounded-full object-cover p-1 ring-2 ring-blue-500"
          />
        </div>
        <div className="flex-grow">
          <h1 className="mb-2 text-xl font-bold text-blue-600">
            Hi, i'm Thewhite2255
          </h1>
          <h1 className="mb-4 text-xl font-bold text-blue-600">
            Welcome to My Awesome React App!
          </h1>
          <p className="text-gray-600">
            Built with Vite and styled with TailwindCSS. Isn't it beautiful?
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
