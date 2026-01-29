import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const MarketTrends = () => {
  const trends = [
    {
      category: "Dairy Cows",
      price: "₹78,500",
      change: "+12.5%",
      trend: "up",
      volume: "1,247"
    },
    {
      category: "Bulls",
      price: "₹92,000",
      change: "+8.2%",
      trend: "up",
      volume: "832"
    },
    {
      category: "Buffaloes",
      price: "₹65,800",
      change: "-3.1%",
      trend: "down",
      volume: "654"
    }
  ];

  const recentAuctions = [
    {
      title: "Premium Holstein Auction",
      time: "2h remaining",
      currentBid: "₹1,25,000",
      bidders: 15
    },
    {
      title: "Gir Cattle Batch Sale",
      time: "5h remaining",
      currentBid: "₹95,000",
      bidders: 8
    }
  ];

  return (
    <section className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Market Insights</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Price Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">{item.volume} listings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.price}</p>
                      <div className="flex items-center gap-1">
                        {item.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          item.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Auctions */}
          <Card>
            <CardHeader>
              <CardTitle>Live Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAuctions.map((auction, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{auction.title}</h4>
                      <span className="text-sm text-accent font-medium">{auction.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-primary">{auction.currentBid}</p>
                        <p className="text-sm text-muted-foreground">{auction.bidders} bidders</p>
                      </div>
                      <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MarketTrends;