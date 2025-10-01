import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Wallet, Building2, ArrowLeft } from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderItems: OrderItem[] = location.state?.orderItems || [];
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to continue");
        navigate("/auth");
      }
    };
    checkAuth();

    // Redirect if no items
    if (orderItems.length === 0) {
      toast.error("No items in order");
      navigate("/");
    }
  }, [navigate, orderItems]);

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const price = parseInt(item.price.replace("₹", ""));
      return total + price * item.quantity;
    }, 0);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast.success("Payment successful!", {
        description: "Your order has been confirmed. Thank you!",
      });
      setProcessing(false);
      navigate("/");
    }, 2000);
  };

  const total = calculateTotal();
  const tax = Math.round(total * 0.05);
  const deliveryFee = 50;
  const grandTotal = total + tax + deliveryFee;

  return (
    <div className="min-h-screen bg-secondary py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-primary">
                    ₹{parseInt(item.price.replace("₹", "")) * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>
          </Card>

          {/* Payment Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <Label className="text-base mb-4 block">Select Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      UPI
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5" />
                      Net Banking
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="Name on card"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="username@upi"
                    required
                  />
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div>
                  <Label htmlFor="bank">Select Bank</Label>
                  <select
                    id="bank"
                    className="w-full p-2 border rounded-md bg-background"
                    required
                  >
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                  </select>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={processing}
              >
                {processing ? "Processing..." : `Pay ₹${grandTotal}`}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
