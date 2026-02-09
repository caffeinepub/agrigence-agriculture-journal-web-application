import { Product, ProductCategory } from '../backend';

// Placeholder types for features not in current backend
type News = { id: string; title: string; content: string; summary: string; createdAt: bigint };
type BlogPost = { id: bigint; title: string; content: string; authorName: string; publicationDate: bigint; imageUrl?: string; blob?: any; shortSummary: string };
type HomePageMagazine = { id: bigint; title: string; issue: string; imageUrl: string; description: string; publishedDate: bigint };
type ArticlePreview = { id: bigint; title: string; description: string; author: string };
type UserReview = { id: bigint; name: string; photoUrl?: string; rating: bigint; feedback: string };

// Sample news items
export const sampleNews: News[] = [
  {
    id: 'sample-news-1',
    title: 'Breakthrough in Sustainable Farming Techniques',
    content: 'Researchers have developed innovative methods for sustainable agriculture that reduce water usage by 40% while maintaining crop yields.',
    summary: 'New sustainable farming methods reduce water usage by 40%',
    createdAt: BigInt(Date.now() * 1000000),
  },
  {
    id: 'sample-news-2',
    title: 'Climate-Resilient Crop Varieties Released',
    content: 'Agricultural scientists announce the release of new crop varieties designed to withstand extreme weather conditions and climate change impacts.',
    summary: 'New climate-resilient crop varieties now available for farmers',
    createdAt: BigInt(Date.now() * 1000000 - 86400000000000),
  },
  {
    id: 'sample-news-3',
    title: 'Digital Agriculture Platform Launches',
    content: 'A comprehensive digital platform connecting farmers with experts and resources has been launched to support modern agricultural practices.',
    summary: 'New digital platform connects farmers with agricultural experts',
    createdAt: BigInt(Date.now() * 1000000 - 172800000000000),
  },
  {
    id: 'sample-news-4',
    title: 'Organic Farming Certification Program Expanded',
    content: 'The organic farming certification program has been expanded to include more regions and provide better support for transitioning farmers.',
    summary: 'Organic certification program reaches more farmers nationwide',
    createdAt: BigInt(Date.now() * 1000000 - 259200000000000),
  },
  {
    id: 'sample-news-5',
    title: 'Agricultural Research Funding Increased',
    content: 'Government announces significant increase in funding for agricultural research and development to support innovation in the sector.',
    summary: 'Research funding boost aims to accelerate agricultural innovation',
    createdAt: BigInt(Date.now() * 1000000 - 345600000000000),
  },
];

// Sample blog posts
export const sampleBlogPosts: BlogPost[] = [
  {
    id: BigInt(1001),
    title: 'The Future of Precision Agriculture',
    content: 'Exploring how technology is transforming farming practices through data-driven decision making and automated systems.',
    authorName: 'Dr. Sarah Johnson',
    publicationDate: BigInt(Date.now() * 1000000),
    imageUrl: undefined,
    blob: undefined,
    shortSummary: 'Discover how precision agriculture is revolutionizing modern farming with cutting-edge technology and data analytics.',
  },
  {
    id: BigInt(1002),
    title: 'Soil Health: The Foundation of Sustainable Agriculture',
    content: 'Understanding the critical role of soil health in maintaining productive and sustainable agricultural systems.',
    authorName: 'Prof. Michael Chen',
    publicationDate: BigInt(Date.now() * 1000000 - 86400000000000),
    imageUrl: undefined,
    blob: undefined,
    shortSummary: 'Learn about the importance of soil health and practical strategies for improving soil quality on your farm.',
  },
  {
    id: BigInt(1003),
    title: 'Integrated Pest Management Strategies',
    content: 'Comprehensive guide to implementing effective pest management while minimizing environmental impact.',
    authorName: 'Dr. Priya Sharma',
    publicationDate: BigInt(Date.now() * 1000000 - 172800000000000),
    imageUrl: undefined,
    blob: undefined,
    shortSummary: 'Explore sustainable pest management techniques that protect crops while preserving beneficial insects.',
  },
  {
    id: BigInt(1004),
    title: 'Water Conservation in Agriculture',
    content: 'Innovative approaches to water management and conservation in agricultural production systems.',
    authorName: 'Dr. James Wilson',
    publicationDate: BigInt(Date.now() * 1000000 - 259200000000000),
    imageUrl: undefined,
    blob: undefined,
    shortSummary: 'Practical water conservation methods that help farmers reduce costs and environmental impact.',
  },
  {
    id: BigInt(1005),
    title: 'Crop Rotation Benefits and Best Practices',
    content: 'How strategic crop rotation improves soil fertility, reduces pests, and increases overall farm productivity.',
    authorName: 'Dr. Emily Rodriguez',
    publicationDate: BigInt(Date.now() * 1000000 - 345600000000000),
    imageUrl: undefined,
    blob: undefined,
    shortSummary: 'Maximize your farm productivity with proven crop rotation strategies and planning techniques.',
  },
];

// Sample magazines
export const sampleMagazines: HomePageMagazine[] = [
  {
    id: BigInt(2001),
    title: 'Modern Agriculture Quarterly',
    issue: 'Spring 2026 Edition',
    imageUrl: '/assets/generated/magazine-cover-template.dim_300x400.png',
    description: 'Featuring the latest research in sustainable farming practices, crop management, and agricultural technology innovations.',
    publishedDate: BigInt(Date.now() * 1000000),
  },
  {
    id: BigInt(2002),
    title: 'Agricultural Science Today',
    issue: 'Volume 12, Issue 1',
    imageUrl: '/assets/generated/magazine-cover-template.dim_300x400.png',
    description: 'In-depth analysis of climate-smart agriculture and adaptive farming strategies for changing environmental conditions.',
    publishedDate: BigInt(Date.now() * 1000000 - 2592000000000000),
  },
  {
    id: BigInt(2003),
    title: 'Crop Innovation Journal',
    issue: 'February 2026',
    imageUrl: '/assets/generated/magazine-cover-template.dim_300x400.png',
    description: 'Exploring breakthrough developments in crop genetics, pest resistance, and yield optimization techniques.',
    publishedDate: BigInt(Date.now() * 1000000 - 5184000000000000),
  },
  {
    id: BigInt(2004),
    title: 'Sustainable Farming Review',
    issue: 'Winter 2025-26',
    imageUrl: '/assets/generated/magazine-cover-template.dim_300x400.png',
    description: 'Comprehensive coverage of organic farming methods, soil conservation, and ecosystem-friendly agriculture.',
    publishedDate: BigInt(Date.now() * 1000000 - 7776000000000000),
  },
  {
    id: BigInt(2005),
    title: 'Agricultural Technology Digest',
    issue: 'January 2026',
    imageUrl: '/assets/generated/magazine-cover-template.dim_300x400.png',
    description: 'Latest advancements in farm automation, IoT sensors, and AI-driven agricultural decision support systems.',
    publishedDate: BigInt(Date.now() * 1000000 - 10368000000000000),
  },
];

// Sample article previews
export const sampleArticlePreviews: ArticlePreview[] = [
  {
    id: BigInt(3001),
    title: 'Impact of Climate Change on Rice Production in South Asia',
    description: 'A comprehensive study examining the effects of rising temperatures and changing rainfall patterns on rice cultivation across major growing regions.',
    author: 'Dr. Rajesh Kumar',
  },
  {
    id: BigInt(3002),
    title: 'Biofortification Strategies for Nutritional Enhancement',
    description: 'Research on developing nutrient-enriched crop varieties to address micronutrient deficiencies in vulnerable populations.',
    author: 'Prof. Anita Desai',
  },
  {
    id: BigInt(3003),
    title: 'Precision Irrigation Systems for Water-Scarce Regions',
    description: 'Evaluation of advanced irrigation technologies and their effectiveness in optimizing water use efficiency in arid agricultural zones.',
    author: 'Dr. Mohammed Hassan',
  },
  {
    id: BigInt(3004),
    title: 'Organic Pest Control Methods in Vegetable Farming',
    description: 'Field trials demonstrating the efficacy of biological control agents and natural pesticides in commercial vegetable production.',
    author: 'Dr. Lisa Thompson',
  },
  {
    id: BigInt(3005),
    title: 'Soil Microbiome and Crop Health Relationships',
    description: 'Investigation of beneficial soil microorganisms and their role in promoting plant growth and disease resistance.',
    author: 'Prof. David Martinez',
  },
];

// Sample user reviews
export const sampleUserReviews: UserReview[] = [
  {
    id: BigInt(4001),
    name: 'Dr. Amit Patel',
    photoUrl: undefined,
    rating: BigInt(5),
    feedback: 'Agrigence has been instrumental in advancing my research. The platform provides excellent resources and a supportive community of agricultural scientists.',
  },
  {
    id: BigInt(4002),
    name: 'Prof. Sunita Reddy',
    photoUrl: undefined,
    rating: BigInt(5),
    feedback: 'Outstanding journal quality and professional editorial support. Publishing with Agrigence has significantly enhanced the visibility of our research work.',
  },
  {
    id: BigInt(4003),
    name: 'Dr. Vikram Singh',
    photoUrl: undefined,
    rating: BigInt(4),
    feedback: 'A valuable platform for agricultural researchers. The peer review process is thorough and the publication timeline is reasonable.',
  },
  {
    id: BigInt(4004),
    name: 'Dr. Meera Krishnan',
    photoUrl: undefined,
    rating: BigInt(5),
    feedback: 'Excellent platform for sharing agricultural research. The editorial team is responsive and provides constructive feedback throughout the publication process.',
  },
  {
    id: BigInt(4005),
    name: 'Prof. Arjun Verma',
    photoUrl: undefined,
    rating: BigInt(5),
    feedback: 'Agrigence offers a comprehensive solution for agricultural researchers. From submission to publication, the entire process is smooth and professional.',
  },
];

// Sample books
export const sampleBooks: Product[] = [
  {
    id: 'sample-book-1',
    category: ProductCategory.books,
    name: 'Introduction to Agriculture',
    buyLink: 'https://www.myonlinebookstore.com/book1',
  },
  {
    id: 'sample-book-2',
    category: ProductCategory.books,
    name: 'Principles of Crop Production',
    buyLink: 'https://www.myonlinebookstore.com/book2',
  },
  {
    id: 'sample-book-3',
    category: ProductCategory.books,
    name: 'Organic Farming Techniques',
    buyLink: 'https://www.myonlinebookstore.com/book3',
  },
  {
    id: 'sample-book-4',
    category: ProductCategory.books,
    name: 'The Soil and its Management',
    buyLink: 'https://www.myonlinebookstore.com/book4',
  },
  {
    id: 'sample-book-5',
    category: ProductCategory.books,
    name: 'Irrigation Methods Handbook',
    buyLink: 'https://www.myonlinebookstore.com/book5',
  },
];

// Sample agricultural products
export const sampleAgProducts: Product[] = [
  {
    id: 'sample-ag-1',
    category: ProductCategory.agriculturalStore,
    name: 'Organic Fertilizer',
    buyLink: 'https://www.agriculturesupply.com/fertilizer',
  },
  {
    id: 'sample-ag-2',
    category: ProductCategory.agriculturalStore,
    name: 'High Yield Seeds',
    buyLink: 'https://www.agriculturesupply.com/seeds',
  },
  {
    id: 'sample-ag-3',
    category: ProductCategory.agriculturalStore,
    name: 'Hand Tools Set',
    buyLink: 'https://www.agriculturesupply.com/tools',
  },
  {
    id: 'sample-ag-4',
    category: ProductCategory.agriculturalStore,
    name: 'Drip Irrigation Kit',
    buyLink: 'https://www.agriculturesupply.com/irrigation',
  },
  {
    id: 'sample-ag-5',
    category: ProductCategory.agriculturalStore,
    name: 'Protective Gloves',
    buyLink: 'https://www.agriculturesupply.com/gloves',
  },
];

/**
 * Fills an array to a minimum count by appending sample items.
 * Does not modify or override real items.
 */
export function fillToMinimum<T>(realItems: T[], sampleItems: T[], minCount: number): T[] {
  if (realItems.length >= minCount) {
    return realItems;
  }
  
  const needed = minCount - realItems.length;
  const samplesToAdd = sampleItems.slice(0, needed);
  return [...realItems, ...samplesToAdd];
}
