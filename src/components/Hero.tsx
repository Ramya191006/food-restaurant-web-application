import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOut, User, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroBiryani from "@/assets/hero-biryani.jpg";
import heroCurry from "@/assets/hero-curry.jpg";
import heroTikka from "@/assets/hero-tikka.jpg";
import heroAppetizers from "@/assets/hero-appetizers.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [orderCount, setOrderCount] = useState(0);
  
  const slides = [
    { image: heroBiryani, alt: "Authentic Indian Biryani" },
    { image: heroCurry, alt: "Traditional Curry" },
    { image: heroTikka, alt: "Spicy Chicken Tikka" },
    { image: heroAppetizers, alt: "Delicious Appetizers" },
  ];

  useEffect(() => {
    // Check authentication
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    };
    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    // Carousel timer
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    // Check for order count in localStorage
    const checkOrderCount = () => {
      const storedOrders = localStorage.getItem('orderItems');
      if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        const totalItems = orders.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setOrderCount(totalItems);
      }
    };
    checkOrderCount();

    // Listen for storage changes
    window.addEventListener('storage', checkOrderCount);
    const storageInterval = setInterval(checkOrderCount, 500);

    return () => {
      clearInterval(interval);
      clearInterval(storageInterval);
      window.removeEventListener('storage', checkOrderCount);
      subscription.unsubscribe();
    };
  }, [navigate]);

  const scrollToMenu = () => {
    const element = document.getElementById("menu");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Carousel Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Surya Authentic Spices</h2>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={scrollToMenu} className="text-white hover:text-white/80 transition-colors">
              Menu
            </button>
            <button onClick={() => scrollToSection("about")} className="text-white hover:text-white/80 transition-colors">
              About Us
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-white hover:text-white/80 transition-colors">
              Contact
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToMenu}
              className="text-white hover:text-white/80 hover:bg-white/10 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {orderCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {orderCount}
                </span>
              )}
            </Button>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-white" />
              <span className="text-white text-sm">{user?.user_metadata?.name || user?.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:text-white/80 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Surya Authentic Spices
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
            Experience the True Taste of Traditional Indian Cuisine
          </p>
          <Button
            size="lg"
            onClick={scrollToMenu}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
          >
            View Menu
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary-foreground w-8"
                : "bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
