import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Drumstick, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import tomatoSoup from "@/assets/menu-tomato-soup.jpg";
import paneerCurry from "@/assets/menu-paneer-curry.jpg";
import vegBiryani from "@/assets/menu-veg-biryani.jpg";
import vegKorma from "@/assets/menu-veg-korma.jpg";
import dalSoup from "@/assets/menu-dal-soup.jpg";
import hotSourSoup from "@/assets/menu-hot-sour-soup.jpg";
import palakPaneer from "@/assets/menu-palak-paneer.jpg";
import dalMakhani from "@/assets/menu-dal-makhani.jpg";
import mushroomMasala from "@/assets/menu-mushroom-masala.jpg";
import malaiKofta from "@/assets/menu-malai-kofta.jpg";
import chickenBiryani from "@/assets/menu-chicken-biryani.jpg";
import dumBiryani from "@/assets/menu-dum-biryani.jpg";
import chickenCurry from "@/assets/menu-chicken-curry.jpg";
import chickenSoup from "@/assets/menu-chicken-soup.jpg";
import muttonBiryani from "@/assets/menu-mutton-biryani.jpg";
import butterChicken from "@/assets/menu-butter-chicken.jpg";
import fishCurry from "@/assets/menu-fish-curry.jpg";
import tandooriChicken from "@/assets/menu-tandoori-chicken.jpg";

type MenuCategory = "all" | "veg" | "nonveg";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: "veg" | "nonveg";
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  // Vegetarian Soups
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
    name: "Hot & Sour Soup",
    description: "Spicy and tangy vegetable soup",
    price: "₹160",
    image: hotSourSoup,
    category: "veg",
  },
  // Vegetarian Curries
  {
    id: 4,
    name: "Paneer Butter Masala",
    description: "Rich and creamy cottage cheese curry",
    price: "₹280",
    image: paneerCurry,
    category: "veg",
  },
  {
    id: 5,
    name: "Palak Paneer",
    description: "Cottage cheese in fresh spinach gravy",
    price: "₹270",
    image: palakPaneer,
    category: "veg",
  },
  {
    id: 6,
    name: "Vegetable Korma",
    description: "Mixed vegetables in cashew cream sauce",
    price: "₹250",
    image: vegKorma,
    category: "veg",
  },
  {
    id: 7,
    name: "Dal Makhani",
    description: "Black lentils in creamy butter sauce",
    price: "₹240",
    image: dalMakhani,
    category: "veg",
  },
  {
    id: 8,
    name: "Mushroom Masala",
    description: "Button mushrooms in spicy masala gravy",
    price: "₹260",
    image: mushroomMasala,
    category: "veg",
  },
  {
    id: 9,
    name: "Malai Kofta",
    description: "Vegetable dumplings in creamy gravy",
    price: "₹290",
    image: malaiKofta,
    category: "veg",
  },
  // Vegetarian Biryani
  {
    id: 10,
    name: "Vegetable Biryani",
    description: "Aromatic basmati rice with mixed vegetables",
    price: "₹220",
    image: vegBiryani,
    category: "veg",
  },
  // Non-Vegetarian Soups
  {
    id: 11,
    name: "Chicken Soup",
    description: "Clear chicken broth with vegetables",
    price: "₹180",
    image: chickenSoup,
    category: "nonveg",
  },
  // Non-Vegetarian Curries
  {
    id: 12,
    name: "Butter Chicken",
    description: "Tandoori chicken in creamy tomato gravy",
    price: "₹340",
    image: butterChicken,
    category: "nonveg",
  },
  {
    id: 13,
    name: "Spicy Chicken Curry",
    description: "Authentic spicy chicken curry with bone",
    price: "₹300",
    image: chickenCurry,
    category: "nonveg",
  },
  {
    id: 14,
    name: "Fish Curry",
    description: "Kerala style fish in coconut curry",
    price: "₹360",
    image: fishCurry,
    category: "nonveg",
  },
  {
    id: 15,
    name: "Tandoori Chicken",
    description: "Charcoal grilled chicken with spices",
    price: "₹320",
    image: tandooriChicken,
    category: "nonveg",
  },
  // Non-Vegetarian Biryani
  {
    id: 16,
    name: "Chicken Biryani",
    description: "Tender chicken with fragrant basmati rice",
    price: "₹320",
    image: chickenBiryani,
    category: "nonveg",
  },
  {
    id: 17,
    name: "Dum Biryani",
    description: "Slow-cooked biryani sealed with dough",
    price: "₹380",
    image: dumBiryani,
    category: "nonveg",
  },
  {
    id: 18,
    name: "Mutton Biryani",
    description: "Tender lamb with aromatic spices and rice",
    price: "₹420",
    image: muttonBiryani,
    category: "nonveg",
  },
];

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("all");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const filteredItems = menuItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const handleOrder = (item: MenuItem) => {
    setOrderItems((prevOrders) => {
      const existingItem = prevOrders.find((order) => order.id === item.id);
      const newOrders = existingItem
        ? prevOrders.map((order) =>
            order.id === item.id
              ? { ...order, quantity: order.quantity + 1 }
              : order
          )
        : [...prevOrders, { ...item, quantity: 1 }];
      
      localStorage.setItem('orderItems', JSON.stringify(newOrders));
      return newOrders;
    });
    toast.success(`${item.name} added to your order!`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setOrderItems((prevOrders) => {
      const newOrders = prevOrders
        .map((order) =>
          order.id === id
            ? { ...order, quantity: Math.max(0, order.quantity + delta) }
            : order
        )
        .filter((order) => order.quantity > 0);
      
      localStorage.setItem('orderItems', JSON.stringify(newOrders));
      return newOrders;
    });
  };

  const removeItem = (id: number) => {
    setOrderItems((prevOrders) => {
      const newOrders = prevOrders.filter((order) => order.id !== id);
      localStorage.setItem('orderItems', JSON.stringify(newOrders));
      return newOrders;
    });
    toast.success("Item removed from order");
  };

  const clearOrder = () => {
    setOrderItems([]);
    localStorage.removeItem('orderItems');
    toast.success("Order cleared");
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const price = parseInt(item.price.replace("₹", ""));
      return total + price * item.quantity;
    }, 0);
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
                    onClick={() => handleOrder(item)}
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

        {/* Order Details Section */}
        {orderItems.length > 0 && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom">
            <Card className="p-6 bg-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  Order Details
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearOrder}
                  className="text-destructive hover:bg-destructive/10"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{item.name}</h4>
                        {item.category === "veg" ? (
                          <Leaf className="h-4 w-4 text-veg" />
                        ) : (
                          <Drumstick className="h-4 w-4 text-nonveg" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.price} × {item.quantity}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary mb-2">
                        ₹{parseInt(item.price.replace("₹", "")) * item.quantity}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-3xl font-bold text-primary">
                    ₹{calculateTotal()}
                  </span>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    navigate("/payment", { state: { orderItems } });
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
