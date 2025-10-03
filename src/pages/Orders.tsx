import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Leaf, Drumstick } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  category: "veg" | "nonveg";
}

const Orders = () => {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = localStorage.getItem('orderItems');
      if (storedOrders) {
        setOrderItems(JSON.parse(storedOrders));
      }
    };
    loadOrders();

    const interval = setInterval(loadOrders, 500);
    return () => clearInterval(interval);
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const newOrders = orderItems
      .map((order) =>
        order.id === id
          ? { ...order, quantity: Math.max(0, order.quantity + delta) }
          : order
      )
      .filter((order) => order.quantity > 0);
    
    setOrderItems(newOrders);
    localStorage.setItem('orderItems', JSON.stringify(newOrders));
  };

  const removeItem = (id: number) => {
    const newOrders = orderItems.filter((order) => order.id !== id);
    setOrderItems(newOrders);
    localStorage.setItem('orderItems', JSON.stringify(newOrders));
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Menu
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCart className="h-8 w-8" />
                Your Orders
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {orderItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some delicious items from our menu to get started!
            </p>
            <Button size="lg" onClick={() => navigate("/")} className="mx-auto">
              Browse Menu
            </Button>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
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
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        {item.category === "veg" ? (
                          <Leaf className="h-5 w-5 text-veg" />
                        ) : (
                          <Drumstick className="h-5 w-5 text-nonveg" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {item.price} × {item.quantity}
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-9 w-9 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg w-10 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-9 w-9 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary mb-3">
                        ₹{parseInt(item.price.replace("₹", "")) * item.quantity}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold">Total Amount:</span>
                  <span className="text-4xl font-bold text-primary">
                    ₹{calculateTotal()}
                  </span>
                </div>
                <Button
                  size="lg"
                  className="w-full"
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
    </div>
  );
};

export default Orders;
