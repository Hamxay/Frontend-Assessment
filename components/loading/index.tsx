const Loader = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-foreground">Loading venue...</p>
      </div>
    </main>
  );
};

export default Loader;
