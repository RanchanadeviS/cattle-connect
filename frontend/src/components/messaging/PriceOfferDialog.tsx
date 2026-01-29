import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IndianRupee } from "lucide-react";

interface PriceOfferDialogProps {
  originalPrice: number;
  onSendOffer: (amount: number, message?: string) => void;
  trigger?: React.ReactNode;
}

const PriceOfferDialog = ({ originalPrice, onSendOffer, trigger }: PriceOfferDialogProps) => {
  const [offerAmount, setOfferAmount] = useState(originalPrice.toString());
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleSendOffer = () => {
    const amount = parseInt(offerAmount);
    if (amount > 0) {
      onSendOffer(amount, message);
      setOpen(false);
      setMessage("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <IndianRupee className="h-4 w-4 mr-1" />
            Make Offer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Price Offer</DialogTitle>
          <DialogDescription>
            Current asking price: ₹{originalPrice.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="offer-amount">Your Offer Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="offer-amount"
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="pl-10"
                placeholder="Enter your offer"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="offer-message">Message (Optional)</Label>
            <Textarea
              id="offer-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to your offer..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendOffer} disabled={!offerAmount || parseInt(offerAmount) <= 0}>
            Send Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceOfferDialog;