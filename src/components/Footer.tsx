const Footer = () => {
  return (
    <footer className="bg-card border-t py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-nonveg bg-clip-text text-transparent mb-2">
            Surya Authentic Spices
          </p>
          <p className="text-muted-foreground mb-4">
            Experience the True Taste of Traditional Indian Cuisine
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Surya Authentic Spices. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
