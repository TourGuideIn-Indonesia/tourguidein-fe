// Mock data for Home Page

// Category/service icons - using local assets
import mapLocationIcon from "../../assets/categories/map-location.png";
import boardingPassIcon from "../../assets/categories/boarding-pass.png";
import compassIcon from "../../assets/categories/compass.png";
import umrahIcon from "../../assets/categories/umrah.png";
import surfingBoardIcon from "../../assets/categories/surfing-board.png";
import carIcon from "../../assets/categories/car.png";

// Banner images
import banner1 from "../../assets/banner/image-1.png";
import banner2 from "../../assets/banner/image-2.png";

// Profile images
import profile1 from "../../assets/profile/image-1.png";
import profile2 from "../../assets/profile/image-2.png";
import profile3 from "../../assets/profile/image-3.png";
import profile4 from "../../assets/profile/image-4.png";
import profile5 from "../../assets/profile/image-5.png";

// Tour images
import tourEdinburgh from "../../assets/tour/edinburgh.png";
import tourSilverstone from "../../assets/tour/silverstone.png";

export const categories = [
  {
    id: 1,
    title: "Tour Guide",
    icon: mapLocationIcon,
    bgColor: "bg-green-50",
    link: "/guides",
  },
  {
    id: 2,
    title: "Package Tours",
    icon: boardingPassIcon,
    bgColor: "bg-cyan-50",
    link: null,
  },
  {
    id: 3,
    title: "Open Trip",
    icon: compassIcon,
    bgColor: "bg-blue-50",
    link: null,
  },
  {
    id: 4,
    title: "Umrah",
    icon: umrahIcon,
    bgColor: "bg-purple-50",
    link: null,
  },
  {
    id: 5,
    title: "Atraksi",
    icon: surfingBoardIcon,
    bgColor: "bg-indigo-50",
    link: null,
  },
  {
    id: 6,
    title: "Rental Mobil",
    icon: carIcon,
    bgColor: "bg-red-50",
    link: null,
  },
];

export const banners = [
  {
    id: 1,
    image: banner1,
    alt: "Promo TourGuideIn",
  },
  {
    id: 2,
    image: banner2,
    alt: "Promo Spesial",
  },
];

export const cityFilters = [
  {
    id: 1,
    name: "London",
    flag: "https://flagcdn.com/16x12/gb.png",
    countryCode: "gb",
  },
  {
    id: 2,
    name: "Paris",
    flag: "https://flagcdn.com/16x12/fr.png",
    countryCode: "fr",
  },
  {
    id: 3,
    name: "Sydney",
    flag: "https://flagcdn.com/16x12/au.png",
    countryCode: "au",
  },
  {
    id: 4,
    name: "Istanbul",
    flag: "https://flagcdn.com/16x12/tr.png",
    countryCode: "tr",
  },
];

export const popularGuides = [
  {
    id: 1,
    name: "Nera Leiya Maisuri",
    image: profile1,
    price: 299700,
    originalPrice: 700000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.85,
    bookings: "500+",
    isVerified: false,
    badge: { label: "Popular Guide", color: "bg-red-500" },
  },
  {
    id: 2,
    name: "Visi Puspita",
    image: profile2,
    price: 299700,
    originalPrice: 600000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: null,
    bookings: null,
    isVerified: true,
    verifiedLabel: "PPI UK",
    badge: { label: "New Guide", color: "bg-purple-500" },
  },
  {
    id: 3,
    name: "Alex Tan",
    image: profile3,
    price: 250000,
    originalPrice: 500000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.75,
    bookings: "30",
    isVerified: false,
  },
  {
    id: 4,
    name: "Dewi Anggraini",
    image: profile4,
    price: 320000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.9,
    bookings: "120",
    isVerified: true,
    verifiedLabel: "PPI France",
  },
  {
    id: 5,
    name: "Rizky Pratama",
    image: profile5,
    price: 275000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: null,
    bookings: null,
    isVerified: false,
    badge: { label: "New Guide", color: "bg-purple-500" },
  },
  {
    id: 6,
    name: "Sarah Wijaya",
    image: profile1,
    price: 310000,
    originalPrice: 650000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.88,
    bookings: "200+",
    isVerified: true,
    verifiedLabel: "PPI Australia",
    badge: { label: "Popular Guide", color: "bg-red-500" },
  },
  {
    id: 7,
    name: "Adi Nugroho",
    image: profile3,
    price: 260000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.65,
    bookings: "45",
    isVerified: false,
  },
  {
    id: 8,
    name: "Lina Hartono",
    image: profile2,
    price: 285000,
    originalPrice: 570000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: null,
    bookings: null,
    isVerified: false,
  },
  {
    id: 9,
    name: "Farhan Malik",
    image: profile5,
    price: 350000,
    originalPrice: 750000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.92,
    bookings: "300+",
    isVerified: true,
    verifiedLabel: "PPI Turkey",
    badge: { label: "Popular Guide", color: "bg-red-500" },
  },
  {
    id: 10,
    name: "Maya Sari",
    image: profile4,
    price: 290000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.78,
    bookings: "60",
    isVerified: false,
  },
  {
    id: 11,
    name: "Bimo Ardiansyah",
    image: profile3,
    price: 240000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.6,
    bookings: "22",
    isVerified: false,
  },
  {
    id: 12,
    name: "Putri Ramadhani",
    image: profile1,
    price: 305000,
    priceLabel: "per jam",
    currency: "Rp",
    rating: 4.82,
    bookings: "150+",
    isVerified: true,
    verifiedLabel: "PPI Netherlands",
  },
];

export const signatureTours = [
  {
    id: 1,
    title: "Harry Potter Tour - Edinburgh",
    image: tourEdinburgh,
    tag: "Half Day Trip",
    duration: "± 3 hours",
    location: "United Kingdom, Edinburgh",
  },
  {
    id: 2,
    title: "Formula 1 Silverstone Museum",
    image: tourSilverstone,
    tag: "Half Day Trip",
    duration: "± 3 hours",
    location: "United Kingdom",
  },
  {
    id: 3,
    title: "Eiffel Tower & Seine River Cruise",
    image: tourEdinburgh,
    tag: "Full Day Trip",
    duration: "± 6 hours",
    location: "France, Paris",
  },
  {
    id: 4,
    title: "Sydney Opera House & Harbour",
    image: tourSilverstone,
    tag: "Half Day Trip",
    duration: "± 4 hours",
    location: "Australia, Sydney",
  },
  {
    id: 5,
    title: "Hagia Sophia & Grand Bazaar",
    image: tourEdinburgh,
    tag: "Full Day Trip",
    duration: "± 5 hours",
    location: "Turkey, Istanbul",
  },
  {
    id: 6,
    title: "Colosseum & Roman Forum Walk",
    image: tourSilverstone,
    tag: "Half Day Trip",
    duration: "± 3 hours",
    location: "Italy, Rome",
  },
  {
    id: 7,
    title: "Mount Fuji & Lake Kawaguchi",
    image: tourEdinburgh,
    tag: "Full Day Trip",
    duration: "± 8 hours",
    location: "Japan, Tokyo",
  },
  {
    id: 8,
    title: "Santorini Sunset Sailing",
    image: tourSilverstone,
    tag: "Half Day Trip",
    duration: "± 4 hours",
    location: "Greece, Santorini",
  },
  {
    id: 9,
    title: "Sagrada Familia & Park Güell",
    image: tourEdinburgh,
    tag: "Full Day Trip",
    duration: "± 6 hours",
    location: "Spain, Barcelona",
  },
  {
    id: 10,
    title: "Amsterdam Canal & Anne Frank",
    image: tourSilverstone,
    tag: "Half Day Trip",
    duration: "± 3 hours",
    location: "Netherlands, Amsterdam",
  },
];

export const popularDestinations = [
  {
    id: 1,
    name: "London",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/gb.png",
  },
  {
    id: 2,
    name: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/fr.png",
  },
  {
    id: 3,
    name: "Sydney",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/au.png",
  },
  {
    id: 4,
    name: "Al Madinah",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/sa.png",
  },
  {
    id: 5,
    name: "Amsterdam",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/nl.png",
  },
  {
    id: 6,
    name: "Istanbul",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/tr.png",
  },
  {
    id: 7,
    name: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/jp.png",
  },
  {
    id: 8,
    name: "Barcelona",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/es.png",
  },
  {
    id: 9,
    name: "Rome",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/it.png",
  },
  {
    id: 10,
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/ae.png",
  },
  {
    id: 11,
    name: "Seoul",
    image:
      "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/kr.png",
  },
  {
    id: 12,
    name: "Santorini",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/gr.png",
  },
  {
    id: 13,
    name: "Prague",
    image:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/cz.png",
  },
  {
    id: 14,
    name: "Bali",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/id.png",
  },
  {
    id: 15,
    name: "Cairo",
    image:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=300&h=300&fit=crop",
    flag: "https://flagcdn.com/16x12/eg.png",
  },
];

export const reviews = [
  {
    id: 1,
    name: "Janet Witanto",
    rating: 5,
    text: '"The guide was amazing! Very helpful and made the trip enjoyable. Thank you for the great experience..."',
  },
  {
    id: 2,
    name: "Budi Santoso",
    rating: 5,
    text: '"Sangat informatif dan ramah. Saya sangat merekomendasikan aplikasi ini untuk perjalanan solo."',
  },
  {
    id: 3,
    name: "Siti Nurhaliza",
    rating: 5,
    text: '"Pengalaman yang luar biasa! Guide-nya sangat profesional dan menguasai rute dengan baik."',
  },
  {
    id: 4,
    name: "Ahmad Fauzi",
    rating: 5,
    text: '"Perjalanan ke Istanbul jadi sangat berkesan. Guide-nya tahu tempat-tempat tersembunyi yang indah!"',
  },
  {
    id: 5,
    name: "Linda Permata",
    rating: 5,
    text: '"First time using TourGuideIn and I was so impressed. The guide spoke fluent English and was very knowledgeable."',
  },
];
