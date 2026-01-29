// import { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import PriceOfferDialog from "@/components/messaging/PriceOfferDialog";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";
// import holsteinImage1 from "@/assets/cattle-holstein-1.jpg";
// import holsteinImage2 from "@/assets/cattle-holstein-2.jpg";
// import jerseyImage1 from "@/assets/cattle-jersey-1.jpg";
// import girImage2 from "@/assets/cattle-gir-2.jpg";
// import farmerAvatar1 from "@/assets/farmer-avatar-1.jpg";
// import { 
//   ArrowLeft, 
//   Heart, 
//   Share2, 
//   MapPin, 
//   Calendar, 
//   Weight, 
//   Milk, 
//   Star,
//   Shield,
//   FileText,
//   Syringe,
//   Phone,
//   MessageCircle,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";

// // Mock data - in real app this would come from API
// const mockCattleData = {
//   1: {
//     id: 1,
//     name: "Holstein Dairy Cow",
//     breed: "Holstein",
//     age: 3.5,
//     weight: 550,
//     milkYield: 25,
//     price: 85000,
//     location: "Punjab, India",
//     images: [holsteinImage1, holsteinImage2, jerseyImage1, girImage2],
//     videos: [holsteinImage1],
//     seller: {
//       name: "Ram Singh Farm",
//       rating: 4.8,
//       totalReviews: 156,
//       verified: true,
//       joinedDate: "2019",
//       phone: "+91 98765 43210",
//       avatar: farmerAvatar1,
//       location: "Punjab, India",
//       totalSales: 45
//     },
//     description: "Healthy Holstein dairy cow with excellent milk production. Well-maintained and regularly vaccinated. Perfect for commercial dairy operations.",
//     verified: true,
//     featured: true,
//     listedDays: 2,
//     healthRecords: {
//       lastVetVisit: "2024-01-15",
//       vaccinations: [
//         { name: "FMD Vaccine", date: "2024-01-10", nextDue: "2024-07-10" },
//         { name: "Anthrax Vaccine", date: "2023-12-15", nextDue: "2024-12-15" },
//         { name: "HS Vaccine", date: "2024-01-05", nextDue: "2024-07-05" }
//       ],
//       certificates: [
//         { name: "Health Certificate", issueDate: "2024-01-15", validUntil: "2024-07-15" },
//         { name: "Breed Certificate", issueDate: "2021-03-10", validUntil: "Lifetime" }
//       ]
//     },
//     specifications: {
//       birthDate: "2020-07-15",
//       pregnancyStatus: "Not Pregnant",
//       milkFat: "4.2%",
//       milkProtein: "3.4%",
//       lactationPeriod: "10 months",
//       breedingHistory: "2 successful calvings"
//     }
//   }
// };

// const CattleDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [cattle, setCattle] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
  
//   if (!cattle) {
//     return (
//       <div className="min-h-screen bg-background p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center py-12">
//             <h1 className="text-2xl font-bold mb-4">Cattle not found</h1>
//             <Link to="/search">
//               <Button>Back to Search</Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const handleContactSeller = () => {
//     // Create or find existing conversation and navigate to messages
//     navigate(`/messages?conversation=conv-${cattle.id}&seller=${cattle.seller.name}`);
//   };

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => 
//       prev === cattle.images.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => 
//       prev === 0 ? cattle.images.length - 1 : prev - 1
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b bg-card">
//         <div className="max-w-6xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link to="/search">
//                 <Button variant="ghost" size="icon">
//                   <ArrowLeft className="h-4 w-4" />
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-bold">{cattle.name}</h1>
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <MapPin className="h-4 w-4" />
//                   <span>{cattle.location}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button 
//                 variant="outline" 
//                 size="icon"
//                 onClick={() => setIsFavorite(!isFavorite)}
//               >
//                 <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
//               </Button>
//               <Button variant="outline" size="icon">
//                 <Share2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Images & Info */}
//           <div className="lg:col-span-2">
//             {/* Image Gallery */}
//             <Card className="mb-6">
//               <CardContent className="p-0">
//                 <div className="relative">
//                   <img
//                     src={cattle.images[currentImageIndex]}
//                     alt={cattle.name}
//                     className="w-full h-96 object-cover rounded-t-lg"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-between p-4">
//                     <Button 
//                       variant="outline" 
//                       size="icon"
//                       onClick={prevImage}
//                       className="bg-background/80 hover:bg-background"
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                     <Button 
//                       variant="outline" 
//                       size="icon"
//                       onClick={nextImage}
//                       className="bg-background/80 hover:bg-background"
//                     >
//                       <ChevronRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <div className="absolute bottom-4 left-4 flex gap-2">
//                     {cattle.featured && (
//                       <Badge className="bg-primary">Featured</Badge>
//                     )}
//                     {cattle.verified && (
//                       <Badge className="bg-green-600">Verified</Badge>
//                     )}
//                   </div>
//                   <div className="absolute bottom-4 right-4">
//                     <Badge variant="secondary">
//                       {currentImageIndex + 1} / {cattle.images.length}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 {/* Thumbnail Strip */}
//                 <div className="p-4 border-t">
//                   <div className="flex gap-2 overflow-x-auto">
//                     {cattle.images.map((image, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setCurrentImageIndex(index)}
//                         className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
//                           index === currentImageIndex ? 'border-primary' : 'border-transparent'
//                         }`}
//                       >
//                         <img
//                           src={image}
//                           alt={`${cattle.name} ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Detailed Information Tabs */}
//             <Tabs defaultValue="details" className="w-full">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="details">Details</TabsTrigger>
//                 <TabsTrigger value="health">Health Records</TabsTrigger>
//                 <TabsTrigger value="seller">Seller Info</TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="details" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Cattle Specifications</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm">
//                           <strong>Age:</strong> {cattle.age} years
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Weight className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm">
//                           <strong>Weight:</strong> {cattle.weight} kg
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Milk className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm">
//                           <strong>Milk Yield:</strong> {cattle.milkYield}L/day
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm">
//                           <strong>Breed:</strong> {cattle.breed}
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="border-t pt-4">
//                       <h4 className="font-semibold mb-2">Additional Information</h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
//                         <div><strong>Birth Date:</strong> {cattle.specifications.birthDate}</div>
//                         <div><strong>Pregnancy Status:</strong> {cattle.specifications.pregnancyStatus}</div>
//                         <div><strong>Milk Fat:</strong> {cattle.specifications.milkFat}</div>
//                         <div><strong>Milk Protein:</strong> {cattle.specifications.milkProtein}</div>
//                         <div><strong>Lactation Period:</strong> {cattle.specifications.lactationPeriod}</div>
//                         <div><strong>Breeding History:</strong> {cattle.specifications.breedingHistory}</div>
//                       </div>
//                     </div>
                    
//                     <div className="border-t pt-4">
//                       <h4 className="font-semibold mb-2">Description</h4>
//                       <p className="text-muted-foreground">{cattle.description}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
              
//               <TabsContent value="health" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Shield className="h-5 w-5" />
//                       Health Records
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold mb-2 flex items-center gap-2">
//                         <Syringe className="h-4 w-4" />
//                         Vaccinations
//                       </h4>
//                       <div className="space-y-2">
//                         {cattle.healthRecords.vaccinations.map((vaccination, index) => (
//                           <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
//                             <div>
//                               <p className="font-medium">{vaccination.name}</p>
//                               <p className="text-sm text-muted-foreground">Given: {vaccination.date}</p>
//                             </div>
//                             <Badge variant="outline">
//                               Next: {vaccination.nextDue}
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h4 className="font-semibold mb-2 flex items-center gap-2">
//                         <FileText className="h-4 w-4" />
//                         Certificates
//                       </h4>
//                       <div className="space-y-2">
//                         {cattle.healthRecords.certificates.map((cert, index) => (
//                           <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
//                             <div>
//                               <p className="font-medium">{cert.name}</p>
//                               <p className="text-sm text-muted-foreground">Issued: {cert.issueDate}</p>
//                             </div>
//                             <Badge variant="outline">
//                               Valid until: {cert.validUntil}
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
                    
//                     <div className="border-t pt-4">
//                       <p className="text-sm text-muted-foreground">
//                         <strong>Last Vet Visit:</strong> {cattle.healthRecords.lastVetVisit}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
              
//               <TabsContent value="seller" className="space-y-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Seller Information</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-start gap-4">
//                       <Avatar className="h-16 w-16">
//                         <AvatarImage src={cattle.seller.avatar} />
//                         <AvatarFallback>{cattle.seller.name.substring(0, 2)}</AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2">
//                           <h3 className="text-lg font-semibold">{cattle.seller.name}</h3>
//                           {cattle.seller.verified && (
//                             <Badge className="bg-green-600">Verified</Badge>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-1 mb-2">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span className="font-medium">{cattle.seller.rating}</span>
//                           <span className="text-muted-foreground">({cattle.seller.totalReviews} reviews)</span>
//                         </div>
//                         <div className="space-y-1 text-sm text-muted-foreground">
//                           <div className="flex items-center gap-2">
//                             <MapPin className="h-4 w-4" />
//                             <span>{cattle.seller.location}</span>
//                           </div>
//                           <p>Member since {cattle.seller.joinedDate}</p>
//                           <p>{cattle.seller.totalSales} successful sales</p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>

//           {/* Right Column - Price & Actions */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-4">
//               <CardContent className="p-6">
//                 <div className="mb-6">
//                   <p className="text-3xl font-bold text-primary mb-2">
//                     ₹{cattle.price.toLocaleString()}
//                   </p>
//                   <p className="text-muted-foreground">Listed {cattle.listedDays} days ago</p>
//                 </div>
                
//                 <div className="space-y-3 mb-6">
//                   <Button 
//                     className="w-full" 
//                     size="lg"
//                     onClick={handleContactSeller}
//                   >
//                     <MessageCircle className="h-4 w-4 mr-2" />
//                     Contact Seller
//                   </Button>
//                   <Button variant="outline" className="w-full" size="lg">
//                     <Phone className="h-4 w-4 mr-2" />
//                     Call Now
//                   </Button>
//                 </div>
                
//                 <div className="border-t pt-4 space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Seller:</span>
//                     <span className="font-medium">{cattle.seller.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Location:</span>
//                     <span className="font-medium">{cattle.location}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Phone:</span>
//                     <span className="font-medium">{cattle.seller.phone}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CattleDetail;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, MapPin } from "lucide-react";

import girImage from "@/assets/cattle-gir-1.jpg";
import holsteinImage from "@/assets/cattle-holstein-1.jpg";

const CattleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy dataset (same as Dashboard)
  const cattleList = [
    {
      id: 1,
      title: "Gir Cow",
      breed: "Gir",
      age: 3,
      milkCapacity: 12,
      weight: 420,
      price: 55000,
      image: girImage,
      location: "Chennai, Tamil Nadu",
      seller: {
        name: "Ranchana Devi",
        phone: "9876543210",
      },
      description: "Healthy Gir cow with high milk yield. Very calm temperament."
    },
    {
      id: 2,
      title: "Holstein Cow",
      breed: "Holstein",
      age: 4,
      milkCapacity: 18,
      weight: 500,
      price: 65000,
      image: holsteinImage,
      location: "Madurai, Tamil Nadu",
      seller: {
        name: "Ranchana Devi",
        phone: "9876543210",
      },
      description: "Strong Holstein breed, excellent for dairy farming."
    },
    {
      id: 3,
      title: "Gir Cow (Duplicate)",
      breed: "Gir",
      age: 5,
      milkCapacity: 10,
      weight: 430,
      price: 52000,
      image: girImage,
      location: "Coimbatore, Tamil Nadu",
      seller: {
        name: "Ranchana Devi",
        phone: "9876543210",
      },
      description: "Duplicate listing for demo purpose."
    },
    {
      id: 4,
      title: "Holstein Cow (Duplicate)",
      breed: "Holstein",
      age: 6,
      milkCapacity: 20,
      weight: 540,
      price: 72000,
      image: holsteinImage,
      location: "Chennai, Tamil Nadu",
      seller: {
        name: "Ranchana Devi",
        phone: "9876543210",
      },
      description: "Duplicate Holstein cow listing for display testing."
    }
  ];

  const [cattle, setCattle] = useState<any>(null);

  useEffect(() => {
    const selected = cattleList.find((c) => c.id === Number(id));
    setCattle(selected);
  }, [id]);

  if (!cattle) {
    return (
      <div className="p-6 text-center text-xl font-semibold">
        ❌ Cattle Not Found  
        <br />
        <Button className="mt-4" onClick={() => navigate("/dashboard")}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate("/dashboard")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{cattle.title}</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Image */}
          <img
            src={cattle.image}
            alt={cattle.title}
            className="w-full h-80 object-cover rounded-lg mb-4"
          />

          {/* Basic Info */}
          <div className="space-y-2 text-lg">
            <p><strong>Breed:</strong> {cattle.breed}</p>
            <p><strong>Age:</strong> {cattle.age} years</p>
            <p><strong>Milk Yield:</strong> {cattle.milkCapacity} L/day</p>
            <p><strong>Weight:</strong> {cattle.weight} kg</p>
          </div>

          <div className="mt-4 text-xl font-bold text-primary">
            Price: ₹{cattle.price.toLocaleString()}
          </div>

          {/* Description */}
          <div className="mt-4 text-muted-foreground">
            {cattle.description}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mt-6">
            <MapPin className="h-4 w-4" />
            <p className="text-sm">{cattle.location}</p>
          </div>

          {/* Seller Details */}
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Seller Information</h3>

            <p><strong>Name:</strong> {cattle.seller.name}</p>
            <p className="flex items-center gap-2 mt-2">
              <Phone className="h-4 w-4" />
              <span>{cattle.seller.phone}</span>
            </p>
          </div>

          {/* Contact Seller button removed */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleDetail;

