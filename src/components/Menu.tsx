import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Drumstick } from "lucide-react";
import { toast } from "sonner";
import tomatoSoup from "@/assets/menu-tomato-soup.jpg";
import paneerCurry from "@/assets/menu-paneer-curry.jpg";
import vegBiryani from "@/assets/menu-veg-biryani.jpg";
import vegKorma from "@/assets/menu-veg-korma.jpg";
import dalSoup from "@/assets/menu-dal-soup.jpg";
import chickenBiryani from "@/assets/menu-chicken-biryani.jpg";
import dumBiryani from "@/assets/menu-dum-biryani.jpg";
import chickenCurry from "@/assets/menu-chicken-curry.jpg";

type MenuCategory = "all" | "veg" | "nonveg";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: "veg" | "nonveg";
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Tomato Soup",
    description: "Creamy tomato soup with herbs and spices",
    price: "₹150",
    image: tomatoSoup,
    category: "veg",
  },
  {
    id: 2,
    name: "Dal Soup",
    description: "Traditional lentil soup with cumin tempering",
    price: "₹130",
    image: dalSoup,
    category: "veg",
  },
  {
    id: 3,
    name: "Paneer Butter Masala",
    description: "Rich and creamy cottage cheese curry",
    price: "₹280",
    image: paneerCurry,
    category: "veg",
  },
  {
    id: 4,
    name: "Vegetable Korma",
    description: "Mixed vegetables in cashew cream sauce",
    price: "₹250",
    image: vegKorma,
    category: "veg",
  },
  {
    id: 5,
    name: "Vegetable Biryani",
    description: "Aromatic basmati rice with mixed vegetables",
    price: "₹220",
    image: vegBiryani,
    category: "veg",
  },
  {
    id: 6,
    name: "Chicken Biryani",
    description: "Tender chicken with fragrant basmati rice",
    price: "₹320",
    image: chickenBiryani,
    category: "nonveg",
  },
  {
    id: 7,
    name: "Dum Biryani",
    description: "Slow-cooked biryani sealed with dough",
    price: "₹380",
    image: dumBiryani,
    category: "nonveg",
  },
  {
    id: 8,
    name: "Spicy Chicken Curry",
    description: "Authentic spicy chicken curry with bone",
    price: "₹300",
    image: chickenCurry,
    category: "nonveg",
  },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("all");

  const filteredItems = menuItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const handleOrder = (itemName: string) => {
    toast.success(`${itemName} added to your order!`, {
      description: "Scroll to Contact section to complete your order.",
    });
  };

  return (
    <section id="menu" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our authentic Indian dishes prepared with traditional recipes
            and the finest spices
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveCategory("all")}
            className="min-w-[140px]"
          >
            All Items
          </Button>
          <Button
            variant={activeCategory === "veg" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveCategory("veg")}
            className={`min-w-[140px] ${
              activeCategory === "veg"
                ? "bg-veg hover:bg-veg/90 text-veg-foreground"
                : "border-veg text-veg hover:bg-veg/10"
            }`}
          >
            <Leaf className="mr-2 h-5 w-5" />
            Vegetarian
          </Button>
          <Button
            variant={activeCategory === "nonveg" ? "default" : "outline"}
            size="lg"
            onClick={() => setActiveCategory("nonveg")}
            className={`min-w-[140px] ${
              activeCategory === "nonveg"
                ? "bg-nonveg hover:bg-nonveg/90 text-nonveg-foreground"
                : "border-nonveg text-nonveg hover:bg-nonveg/10"
            }`}
          >
            <Drumstick className="mr-2 h-5 w-5" />
            Non-Vegetarian
          </Button>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${
                    item.category === "veg"
                      ? "bg-veg"
                      : "bg-nonveg"
                  }`}
                >
                  {item.category === "veg" ? (
                    <Leaf className="h-5 w-5 text-veg-foreground" />
                  ) : (
                    <Drumstick className="h-5 w-5 text-nonveg-foreground" />
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {item.price}
                  </span>
                  <Button
                    onClick={() => handleOrder(item.name)}
                    className={
                      item.category === "veg"
                        ? "bg-veg hover:bg-veg/90"
                        : "bg-nonveg hover:bg-nonveg/90"
                    }
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
