function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-lg">Something went wrong while loading the page.</p>
    </div>
  );
}
export default ErrorPage;